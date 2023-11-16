from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import UserRole, Form, AdminUserRole
from .serializers import UserCreationForm, FormSerializer, AdminCreationForm, UserProfileSerializer
from django.core.mail import send_mail
from django.utils import timezone
import uuid
from rest_framework import generics
from django.utils.html import format_html
from urllib.parse import urlencode
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponseBadRequest
from django.contrib.auth.models import AnonymousUser 
from django.contrib.auth import login

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    email = request.data.get('email')
    # Check if a user with the provided email already exists
    if UserRole.objects.filter(email=email).exists():
        return Response({'message': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserCreationForm(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data.get('password'))  # Set the password
        user.save()  # Save the user with the hashed password
        # Generate a verification token
        verification_token = str(uuid.uuid4())
        user.verification_token = verification_token
        user.verification_token_created_at = timezone.now()
        user.save()
        # Send an email with the verification link
        send_verification_email(user.email, verification_token)
        return Response({'message': 'Registration successful. Please check your email for verification.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = UserRole.objects.get(email=email)
    except UserRole.DoesNotExist:
        return Response({'message': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

    if user.check_password(password):
        # Log in the user
        login(request, user)

        # Use the user's primary key to create a token
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        # Return the token and user details
        return Response({'token': token, 'user': {
            'pk': user.pk,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'profile_picture': str(user.profile_picture.url) if user.profile_picture else None,
        }}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Login failed. Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    try:
        user = UserRole.objects.get(verification_token=token)

        # Check if the verification token is still valid (within a certain time limit)
        if user.verification_token_created_at + timezone.timedelta(days=1) >= timezone.now():
            # Set the user as verified
            user.is_verified = True
            user.verification_token = None
            user.verification_token_created_at = None
            user.save()

            # Log in the user
            login(request, user)

            return Response({'message': 'Email verified successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Verification token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    except UserRole.DoesNotExist:
        return Response({'message': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_register(request):
    email = request.data.get('email')
    
    # Check if a user with the provided email already exists
    if AdminUserRole.objects.filter(email=email).exists():
        return Response({'message': 'Admin user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = AdminCreationForm(data=request.data)
    if serializer.is_valid():
        admin_user = serializer.save()
        admin_user.set_password(request.data.get('password'))  # Set the password
        admin_user.is_active = False  # Admin needs email verification
        admin_user.save()  # Save the admin user with the hashed password

        # Generate a verification token for admin
        verification_token = str(uuid.uuid4())
        admin_user.verification_token = verification_token
        admin_user.verification_token_created_at = timezone.now()
        admin_user.save()

        # Send an email with the verification link for admin
        send_verification_email(admin_user, verification_token)

        return Response({'message': 'Admin registration successful. Please check your email for verification.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_verify_email(request, token):
    try:
        admin_user = AdminUserRole.objects.get(verification_token=token)
        if admin_user.verification_token_created_at + timezone.timedelta(days=1) >= timezone.now():
            admin_user.is_active = True
            admin_user.verification_token = None
            admin_user.verification_token_created_at = None
            admin_user.save()
            return Response({'message': 'Admin email verified successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Verification token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    except AdminUserRole.DoesNotExist:
        return Response({'message': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

# Sending email function (configure email settings in settings.py)
def send_verification_email(email, token):
    verification_url = "http://localhost:8000/verify-email"
    query_params = urlencode({'token': token})
    full_verification_url = f"{verification_url}/{token}"

    subject = 'Email Verification'
    html_message = format_html('''
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
        </head>
        <body>
            <div style="text-align: center; font-family: Lexend; padding:20px; color: black">
                <img src="https://drive.google.com/uc?export=download&id=1leneuWFji9tOKlHzSo8IMIUuBiIwq1Cc" alt="Your Image" style="max-width: 30%;">
                <br>
                <br>
                <br>
                <p style="font-size:15px;">Hi name</p>
                <p style="font-size:15px;">Thank you for signing up for our scholarship system. Let's get you across the finish line!</p>
                Click the following button to verify your email:
                <br>
                <div style="display: inline-block;">
                    <a href="{}">
                        <button style="background-color: #FEBC4A; color: white; padding: 10px 20px; border: none; text-align: center; text-decoration: none; font-size: 16px; cursor: pointer;">Verify Email Address</button>
                    </a>
                    <br>
                    <p>Have questions about the verification process? <a>Get help</a></p>
                    <p>Best Regards,</p>
                    <p>eSkolar</p>
                </div>
            </div>
        </body>
        </html>
    ''', full_verification_url)

    from_email = 'noreply@example.com'
    recipient_list = [email]

    send_mail(subject, '', from_email, recipient_list, fail_silently=False, html_message=html_message)

class FormListCreateView(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class FormRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class RolesListCreateView(generics.ListCreateAPIView):
    queryset = AdminUserRole.objects.all()
    serializer_class = AdminCreationForm

class RolesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AdminUserRole.objects.all()
    serializer_class = AdminCreationForm

class UserListCreateView(generics.ListCreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserCreationForm

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserCreationForm


class FormList(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class FormDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = FormSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Check if the user is authenticated
        if request.user.is_authenticated:
            user = request.user
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
