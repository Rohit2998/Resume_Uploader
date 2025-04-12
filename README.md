# 📝 Resume Uploader – Full Stack Project

A web app where users can upload resumes (PDF format), and the system will automatically extract key information like **name, email, phone number, and skills** using AI-assisted parsing.

Built with **Django (backend)** and **React (frontend)**.

---

## 🚀 Features

- 🔐 User login/logout with Django's built-in authentication
- 📤 Resume PDF upload
- 🧠 Automatic extraction of:
  - Name
  - Email
  - Phone number
  - Skills
- 📊 Dashboard to view uploaded resumes
- 🌐 Session-based auth with CSRF token handling
- 📁 Admin access via Django admin panel

---

## 🧱 Tech Stack

- **Backend**: Django, Django REST Framework, PyMuPDF
- **Frontend**: React, Axios
- **Authentication**: Session-based with CSRF
- **Parsing**: Regex + PyMuPDF

---

## 📁 Folder Structure
resume-uploader
resume-uploader_backend

---

## 🛠️ Backend Setup

```bash
cd resume-uploader_backend
python -m venv myenv
myenv\Scripts\activate        # On Windows
# source myenv/bin/activate  # On Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


cd resume-uploader
npm install
npm start

