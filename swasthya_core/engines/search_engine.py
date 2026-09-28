"""
SwasthyaAI Local Search & BM25 Engine
Production Inverted Index & Probabilistic BM25 Search with TF-IDF and Fuzzy Matching.
"""
import math
import re
from typing import List, Dict, Any, Tuple, Optional

class BM25SearchEngine:
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.documents: List[Dict[str, Any]] = []
        self.inverted_index: Dict[str, List[int]] = {}
        self.doc_lengths: List[int] = []
        self.avg_doc_length: float = 0.0
        self.idf_cache: Dict[str, float] = {}
        self.stopwords = {
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
            "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
            "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down",
            "during", "each", "few", "for", "from", "further", "had", "has", "have", "having",
            "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i",
            "if", "in", "into", "is", "it", "its", "itself", "me", "more", "most", "my",
            "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
            "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should",
            "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves",
            "then", "there", "these", "they", "this", "those", "through", "to", "too", "under",
            "until", "up", "very", "was", "we", "were", "what", "when", "where", "which",
            "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself"
        }

    def tokenize(self, text: str) -> List[str]:
        """Tokenizes text, strips punctuation, lowercases, and removes non-informative stopwords."""
        clean = re.sub(r'[^\w\s]', ' ', text.lower())
        tokens = clean.split()
        return [t for t in tokens if len(t) > 1 and t not in self.stopwords]

    def index_documents(self, documents: List[Dict[str, Any]]) -> None:
        """
        Builds the inverted index and precalculates IDF for all corpus documents.
        Each doc must have: 'id', 'title', 'content', 'type', 'source', 'metadata'.
        """
        self.documents = documents
        self.inverted_index = {}
        self.doc_lengths = []
        self.idf_cache = {}

        N = len(documents)
        if N == 0:
            return

        total_length = 0
        doc_term_freqs: List[Dict[str, int]] = []

        for idx, doc in enumerate(documents):
            # Combine title (weighted 3x) and content
            full_text = f"{doc.get('title', '')} {doc.get('title', '')} {doc.get('title', '')} {doc.get('content', '')} {doc.get('category', '')}"
            tokens = self.tokenize(full_text)
            self.doc_lengths.append(len(tokens))
            total_length += len(tokens)

            tf: Dict[str, int] = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1

            for token in tf.keys():
                if token not in self.inverted_index:
                    self.inverted_index[token] = []
                self.inverted_index[token].append(idx)

            doc_term_freqs.append(tf)

        self.avg_doc_length = total_length / N if N > 0 else 1.0

        # Precompute Lucene/Robertson-Spärck Jones IDF
        for term, doc_list in self.inverted_index.items():
            n_q = len(doc_list)
            # Standard BM25 IDF formula with +0.5 smoothing
            idf = math.log((N - n_q + 0.5) / (n_q + 0.5) + 1.0)
            self.idf_cache[term] = max(0.01, idf)

    def search(self, query: str, top_k: int = 10, filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Executes BM25 ranking across the inverted index.
        Returns top-K ranked documents with relevance score and highlight snippets.
        """
        if not self.documents:
            return []

        query_tokens = self.tokenize(query)
        if not query_tokens:
            # Fallback to direct substring search if query is purely short tokens
            query_raw = query.strip().lower()
            results = []
            for doc in self.documents:
                if filter_type and doc.get("type") != filter_type:
                    continue
                if query_raw in doc.get("title", "").lower() or query_raw in doc.get("content", "").lower():
                    results.append({
                        "document": doc,
                        "bm25_score": 1.0,
                        "matched_terms": [query_raw]
                    })
            return results[:top_k]

        doc_scores: Dict[int, float] = {}
        matched_terms_per_doc: Dict[int, List[str]] = {}

        for token in query_tokens:
            if token not in self.inverted_index:
                # Try 1-character fuzzy match if token is long enough
                if len(token) >= 4:
                    for index_term in self.inverted_index.keys():
                        if abs(len(token) - len(index_term)) <= 1 and self._levenshtein(token, index_term) == 1:
                            token = index_term
                            break
                    else:
                        continue
                else:
                    continue

            idf = self.idf_cache.get(token, 0.0)
            posting_list = self.inverted_index[token]

            for doc_idx in posting_list:
                doc = self.documents[doc_idx]
                if filter_type and doc.get("type") != filter_type:
                    continue

                # Calculate term frequency in doc
                full_text = f"{doc.get('title', '')} {doc.get('title', '')} {doc.get('title', '')} {doc.get('content', '')}"
                doc_tokens = self.tokenize(full_text)
                tf = doc_tokens.count(token)

                D = self.doc_lengths[doc_idx]
                # BM25 TF component
                numerator = tf * (self.k1 + 1.0)
                denominator = tf + self.k1 * (1.0 - self.b + self.b * (D / self.avg_doc_length))
                score_contribution = idf * (numerator / denominator)

                doc_scores[doc_idx] = doc_scores.get(doc_idx, 0.0) + score_contribution
                if doc_idx not in matched_terms_per_doc:
                    matched_terms_per_doc[doc_idx] = []
                matched_terms_per_doc[doc_idx].append(token)

        # Sort results by score descending
        sorted_indices = sorted(doc_scores.keys(), key=lambda idx: doc_scores[idx], reverse=True)

        results = []
        for doc_idx in sorted_indices[:top_k]:
            doc = self.documents[doc_idx]
            results.append({
                "document": doc,
                "bm25_score": round(doc_scores[doc_idx], 3),
                "matched_terms": list(set(matched_terms_per_doc.get(doc_idx, []))),
                "snippet": self._generate_snippet(doc.get("content", ""), query_tokens)
            })

        return results

    def _generate_snippet(self, content: str, query_tokens: List[str], max_len: int = 180) -> str:
        """Extracts contextual window around the first occurrence of query tokens."""
        if not content:
            return ""
        norm = content.lower()
        earliest_pos = len(content)
        for token in query_tokens:
            pos = norm.find(token)
            if pos != -1 and pos < earliest_pos:
                earliest_pos = pos

        if earliest_pos == len(content) or earliest_pos < 60:
            snippet = content[:max_len]
        else:
            snippet = "..." + content[earliest_pos - 40:earliest_pos + max_len - 40]
        return snippet.strip() + ("..." if len(content) > max_len else "")

    def _levenshtein(self, s1: str, s2: str) -> int:
        if len(s1) < len(s2):
            return self._levenshtein(s2, s1)
        if len(s2) == 0:
            return len(s1)
        prev = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            curr = [i + 1]
            for j, c2 in enumerate(s2):
                curr.append(min(prev[j + 1] + 1, curr[j] + 1, prev[j] + (c1 != c2)))
            prev = curr
        return prev[-1]
