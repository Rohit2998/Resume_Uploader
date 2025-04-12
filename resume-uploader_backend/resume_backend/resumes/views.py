# # from rest_framework.decorators import api_view, permission_classes

import re
import tempfile

import fitz  # PyMuPDF
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Resume
from .serializers import ResumeSerializer


@api_view(["POST"])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({"message": "Login successful"})
    return Response({"error": "Invalid credentials"}, status=400)


@api_view(["POST"])
def user_logout(request):
    logout(request)
    return Response({"message": "Logged out successfully"})


@api_view(["POST"])
def user_register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({"authenticated": True})


@csrf_exempt
@api_view(["POST"])
def user_logout(request):
    logout(request)  # Django's logout function clears the session
    return Response({"message": "Logout successful"})


@csrf_exempt
@api_view(["POST"])
def upload_resume(request):
    file = request.FILES["pdf"]

    # Save the file to a temporary location

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        for chunk in file.chunks():
            tmp.write(chunk)
        tmp_path = tmp.name  # path to use with fitz

    # Now open and read the file with PyMuPDF

    doc = fitz.open(tmp_path)
    text = "".join(page.get_text() for page in doc)
    doc.close()

    # Extract info (you can improve this later)

    def extract_info(text):
        email = re.search(r"\S+@\S+", text)
        phone = re.search(r"\+?\d[\d -]{8,}\d", text)
        skills = "Python, Django" if "Python" in text else ""
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        name = lines[0] if lines else "Unknown"
        experience_section = []
        education_keywords = [
            "B.Tech",
            "Bachelor",
            "Master",
            "BSc",
            "MSc",
            "PhD",
            "University",
            "College",
        ]
        education = "\n".join(
            [
                line
                for line in lines
                if any(kw.lower() in line.lower() for kw in education_keywords)
            ]
        )

        is_exp = False
        for line in lines:
            if re.search(r"(experience|projects)", line, re.IGNORECASE):
                is_exp = True
            elif is_exp and line.strip() == "":
                break  # end of section
            elif is_exp:
                experience_section.append(line)

        experience = "\n".join(experience_section)

        return {
            "name": name,
            "email": email.group() if email else "",
            "phone": phone.group() if phone else "",
            "skills": skills,
            "education": education,
            "experience": experience,
        }


    extracted = extract_info(text)


    resume = Resume.objects.create(
        # user=request.user if request.user.is_authenticated else None,
        pdf=file,
        name=extracted["name"],
        email=extracted["email"],
        phone=extracted["phone"],
        skills=extracted["skills"],
        education=extracted["education"],
        experience=extracted["experience"],
    )
    res = ResumeSerializer(resume).data
    return Response(status=200)


def extract_name(text):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    candidates = lines[:10]  # look at the first 10 lines

    for line in candidates:
        # Skip if line has keywords that don't belong to a name

        if any(
            word.lower() in line.lower()
            for word in ["resume", "curriculum", "vitae", "cv"]
        ):
            continue
        # Check if it's a likely full name

        if re.match(r"^[A-Z][a-z]+(\s[A-Z][a-z]+)+$", line):  # e.g., "John Doe"
            return line
    # fallback

    return lines[0] if lines else "Unknown"


@csrf_exempt
@api_view(["GET"])
def list_resumes(request):
    resumes = Resume.objects.all().order_by("-uploaded_at")
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data)
