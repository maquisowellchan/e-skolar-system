from rest_framework import serializers
from .models import UserRole, Form, AdminUserRole

class UserCreationForm(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = '__all__'

class AdminCreationForm(serializers.ModelSerializer):
    class Meta:
        model = AdminUserRole
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True}}

