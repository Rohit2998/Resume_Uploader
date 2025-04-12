from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)
    pdf = models.FileField(upload_to='resumes/')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    skills = models.TextField()
    education = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)