from rest_framework import serializers
from .models import UserRole

class UserCreationForm(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}
