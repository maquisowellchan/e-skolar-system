from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import Group, Permission
from django.utils import timezone
import uuid


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class UserRole(AbstractBaseUser, PermissionsMixin):

    COURSE_CHOICES = (
        ('BSIT', 'BSIT'),
        ('CEA', 'CEA'),
        ('CS', 'CS'),
        ('WK', 'WK'),
    )
    YEARLEVEL_CHOICES = (
        ('1st Year', '1st Year'),
        ('2nd Year', '2nd Year'),
        ('3rd Year', '3rd Year'),
        ('4th Year', '4th Year'),
    )
    ROLES_CHOICES = (
        ('admin', 'admin'),
        ('director', 'director'),
        ('head', 'head'),
        ('staff', 'staff'),
    )


    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(unique=True, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=30, default='student', choices=ROLES_CHOICES)
    course = models.CharField(max_length=30, default='BSIT', choices=COURSE_CHOICES)
    year_level = models.CharField(max_length=30, default='1st Year', choices=YEARLEVEL_CHOICES)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    status = models.CharField(max_length=30, default="Pending")
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, null=True, blank=True)
    verification_token_created_at = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    groups = models.ManyToManyField(Group, related_name='user_roles')
    user_permissions = models.ManyToManyField(Permission, related_name='user_roles')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email


class ScholarshipSponsor(models.Model):
    sponsor_id = models.AutoField(primary_key=True)
    sponsor_name = models.CharField(max_length=50)
    contact_person = models.CharField(max_length=100)
    contact_email = models.EmailField(max_length=50)
    contact_number = models.IntegerField(null=True)

    def __str__(self):
        return self.contact_email

class ScholarshipProgram(models.Model):

    SCHOLARSHIPTYPE_CHOICES = (
        ('Merit-Based', 'Merit-Based'),
        ('Need-Based', 'Need-Based'),
        ('STEM Scholarship', 'STEM Scholarship'),
    )
    SCHOLARSHIPSTATUS_CHOICES = (
        ('Open', 'Open'),
        ('Closed', 'Closed'),
        ('Pending Approval', 'Pending Approval')
    )
    scholarship_id = models.AutoField(primary_key=True)
    scholarship_type = models.CharField(max_length=50, choices=SCHOLARSHIPTYPE_CHOICES)
    scholarship_status = models.CharField(max_length=50, choices=SCHOLARSHIPSTATUS_CHOICES)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    eligibility = models.TextField()
    application_deadline = models.DateField(null=True)
    funding_amount = models.IntegerField(null=True)
    sponsor_id = models.ForeignKey(ScholarshipSponsor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class AdminUserRole(AbstractBaseUser, PermissionsMixin):

    ROLES_CHOICES = (
        ('admin', 'admin'),
        ('director', 'director'),
        ('head', 'head'),
        ('staff', 'staff'),
    )
    id = models.AutoField(primary_key=True)
    employee_id = models.IntegerField(unique=True, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=30, default='staff', choices=ROLES_CHOICES)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, null=True, blank=True)
    verification_token_created_at = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    groups = models.ManyToManyField(Group, related_name='admin_user_roles')
    user_permissions = models.ManyToManyField(Permission, related_name='admin_user_roles')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    

class Form(models.Model):
    STATUS_CHOICES = [
        ('active', 'active'),
        ('inactive', 'inactive'),
    ]

    
    formname = models.CharField(max_length=50)
    effectivitydate = models.DateTimeField()
    form_status = models.CharField(max_length=8, choices=STATUS_CHOICES)
    fields = models.JSONField(default=list)
    

    def __str__(self):
        return self.formname
    
class Application(models.Model):
    dynamic_form = models.ForeignKey(Form, on_delete=models.CASCADE)
    applicant_id = models.ForeignKey(UserRole, on_delete=models.CASCADE)
    applicant_name = models.CharField(max_length=255)
    submission_application = models.JSONField(null=True)

    def __str__(self):
        return f"{self.applicant_name}'s Application for {self.dynamic_form.formname}"
