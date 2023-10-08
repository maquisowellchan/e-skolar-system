from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import UserRole, Form, AdminUserRole
from .serializers import UserCreationForm, FormSerializer, AdminCreationForm
from django.core.mail import send_mail
from django.utils import timezone
import uuid
from rest_framework import generics
from django.utils.html import format_html

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

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    try:
        user = UserRole.objects.get(verification_token=token)
        if user.verification_token_created_at + timezone.timedelta(days=1) >= timezone.now():
            user.is_active = True
            user.verification_token = None
            user.verification_token_created_at = None
            user.save()
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
    subject = 'Email Verification'
    html_message = format_html(
        'Click the following button to verify your email: '
        '<br>'
        '<a href="http://localhost:3000/dashboard">'
        '<button style="background-color: #FEBC4A; color: white; padding: 10px 20px; border: none; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verify Email Address</button>'
        '</a>'
    )
    from_email = 'noreply@example.com'
    recipient_list = [email]

    send_mail(subject, '', from_email, recipient_list, fail_silently=False, html_message=html_message)

class FormListCreateView(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class FormRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer