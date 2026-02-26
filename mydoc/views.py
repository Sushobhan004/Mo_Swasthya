from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib import messages


def login_view(request):
    if request.method == "POST":

        action = request.POST.get("action")

        # SIGNUP LOGIC
        if action == "signup":
            username = request.POST.get("username")
            password = request.POST.get("password")

            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists")
            else:
                User.objects.create_user(username=username, password=password)
                messages.success(request, "Account created successfully")

            return redirect("login")

        # LOGIN LOGIC
        elif action == "login":
            username = request.POST.get("username")
            password = request.POST.get("password")

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect("welcome")
            else:
                messages.error(request, "Invalid username or password")

    return render(request, "index.html")


def welcome_view(request):
    if not request.user.is_authenticated:
        return redirect("login")
    return render(request, "welcome.html")