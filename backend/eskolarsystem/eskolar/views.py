from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import UserRole
from .serializers import UserCreationForm
from django.core.mail import send_mail
import uuid

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserCreationForm(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
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

# Sending email function (configure email settings in settings.py)
def send_verification_email(email, token):
    subject = 'Email Verification'
    message = f'Click the following link to verify your email: http://localhost:3000/verify/{token}/'
    from_email = 'noreply@example.com'
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)
