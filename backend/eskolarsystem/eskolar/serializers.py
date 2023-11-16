from rest_framework import serializers
from .models import UserRole, Form, AdminUserRole


class UserCreationForm(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('id', 'email','student_id','first_name', 'last_name','course','year_level','password')

class FormSerializer(serializers.ModelSerializer):

    class Meta:
        model = Form
        fields = '__all__'

   

class AdminCreationForm(serializers.ModelSerializer):
    class Meta:
        model = AdminUserRole
        fields = ('employee_id', 'email', 'first_name', 'last_name', 'roles', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'profile_picture')

