from django.urls import path
from .views import upload_resume, list_resumes

from .views import user_login, user_logout, user_register, check_auth


urlpatterns = [
    path("upload/", upload_resume),
    path("list/", list_resumes),  # ← this is the new one
    path("login/", user_login),
    path("logout/", user_logout),
    path("register/", user_register),
    path("check-auth/", check_auth),
    path("logout/", user_logout),
]
