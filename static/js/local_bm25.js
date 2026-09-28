/**
 * SwasthyaAI Client-Side Inverted Index & BM25 Search Engine
 * Full probabilistic BM25 search without server or network requirement.
 */
class LocalBM25Engine {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.documents = [];
    this.invertedIndex = {};
    this.docLengths = [];
    this.avgDocLength = 0;
    this.idfCache = {};
    this.stopwords = new Set([
      "a", "about", "all", "an", "and", "any", "are", "as", "at", "be", "been", "but", "by",
      "can", "do", "for", "from", "has", "have", "he", "her", "his", "how", "i", "if", "in",
      "into", "is", "it", "its", "me", "my", "no", "not", "of", "on", "or", "our", "she",
      "so", "that", "the", "their", "them", "then", "there", "these", "they", "this", "to",
      "was", "we", "were", "what", "when", "where", "which", "who", "will", "with", "you", "your"
    ]);
  }

  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !this.stopwords.has(t));
  }

  indexDocuments(docs) {
    this.documents = docs;
    this.invertedIndex = {};
    this.docLengths = [];
    this.idfCache = {};

    const N = docs.length;
    if (N === 0) return;

    let totalLength = 0;

    docs.forEach((doc, idx) => {
      const fullText = `${doc.title || ''} ${doc.title || ''} ${doc.title || ''} ${doc.content || ''} ${doc.category || ''}`;
      const tokens = this.tokenize(fullText);
      this.docLengths.push(tokens.length);
      totalLength += tokens.length;

      const tf = {};
      tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });

      Object.keys(tf).forEach(token => {
        if (!this.invertedIndex[token]) this.invertedIndex[token] = [];
        this.invertedIndex[token].push(idx);
      });
    });

    this.avgDocLength = totalLength / N;

    // Calculate Robertson-Spärck Jones BM25 IDF
    Object.keys(this.invertedIndex).forEach(term => {
      const n_q = this.invertedIndex[term].length;
      const idf = Math.log((N - n_q + 0.5) / (n_q + 0.5) + 1.0);
      this.idfCache[term] = Math.max(0.01, idf);
    });
  }

  search(query, topK = 15, filterType = null) {
    if (!this.documents.length) return [];
    
    // Clean up common question words for high-accuracy medical keyword matching
    const cleanQuery = (query || '')
      .toLowerCase()
      .replace(/\b(what|is|are|the|how|to|treat|treatment|cure|symptoms|symptom|signs|causes|cause|can|i|take|for|of|with|in|and|meaning|definition|protocol|management)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const queryTokens = this.tokenize(cleanQuery || query);

    if (!queryTokens.length) {
      const raw = (query || '').trim().toLowerCase();
      return this.documents
        .filter(d => (!filterType || d.type === filterType) &&
                     ((d.title || '').toLowerCase().includes(raw) || (d.content || '').toLowerCase().includes(raw) || (d.category || '').toLowerCase().includes(raw)))
        .slice(0, topK)
        .map(d => ({
          ...d,
          document: d,
          bm25_score: 1.0,
          matched_terms: [raw],
          snippet: this._snippet(d.content || '', [raw])
        }));
    }

    const docScores = {};
    const matchedTermsPerDoc = {};

    queryTokens.forEach(token => {
      let postingList = this.invertedIndex[token];
      // Fuzzy fallback
      if (!postingList && token.length >= 4) {
        for (const candidate of Object.keys(this.invertedIndex)) {
          if (Math.abs(candidate.length - token.length) <= 1 && this._levenshtein(token, candidate) === 1) {
            postingList = this.invertedIndex[candidate];
            token = candidate;
            break;
          }
        }
      }

      if (!postingList) return;
      const idf = this.idfCache[token] || 0.1;

      postingList.forEach(docIdx => {
        const doc = this.documents[docIdx];
        if (filterType && doc.type !== filterType) return;

        const fullText = `${doc.title || ''} ${doc.title || ''} ${doc.title || ''} ${doc.content || ''}`;
        const docTokens = this.tokenize(fullText);
        const tf = docTokens.filter(t => t === token).length;

        const D = this.docLengths[docIdx];
        const numerator = tf * (this.k1 + 1.0);
        const denominator = tf + this.k1 * (1.0 - this.b + this.b * (D / this.avgDocLength));
        const contribution = idf * (numerator / denominator);

        docScores[docIdx] = (docScores[docIdx] || 0) + contribution;
        if (!matchedTermsPerDoc[docIdx]) matchedTermsPerDoc[docIdx] = [];
        matchedTermsPerDoc[docIdx].push(token);
      });
    });

    const sortedIndices = Object.keys(docScores)
      .map(Number)
      .sort((a, b) => docScores[b] - docScores[a]);

    return sortedIndices.slice(0, topK).map(idx => {
      const doc = this.documents[idx];
      return {
        ...doc,
        document: doc,
        bm25_score: Math.round(docScores[idx] * 100) / 100,
        matched_terms: Array.from(new Set(matchedTermsPerDoc[idx] || [])),
        snippet: this._snippet(doc.content || '', queryTokens)
      };
    });
  }

  _snippet(content, tokens, maxLen = 140) {
    if (!content) return "";
    const lower = content.toLowerCase();
    let earliest = content.length;
    tokens.forEach(t => {
      const pos = lower.indexOf(t);
      if (pos !== -1 && pos < earliest) earliest = pos;
    });
    if (earliest === content.length || earliest < 40) {
      return content.substring(0, maxLen) + (content.length > maxLen ? "..." : "");
    }
    return "..." + content.substring(earliest - 20, earliest + maxLen - 20) + "...";
  }

  _levenshtein(s1, s2) {
    if (s1.length < s2.length) return this._levenshtein(s2, s1);
    if (s2.length === 0) return s1.length;
    let prev = Array.from({ length: s2.length + 1 }, (_, i) => i);
    for (let i = 0; i < s1.length; i++) {
      let curr = [i + 1];
      for (let j = 0; j < s2.length; j++) {
        curr.push(Math.min(prev[j + 1] + 1, curr[j] + 1, prev[j] + (s1[i] !== s2[j] ? 1 : 0)));
      }
      prev = curr;
    }
    return prev[prev.length - 1];
  }
}

window.localBM25 = new LocalBM25Engine();
