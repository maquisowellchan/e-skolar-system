from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import UserRole, Form, AdminUserRole, ScholarshipSponsor, ScholarshipProgram, Application
from .serializers import UserCreationForm, FormSerializer, AdminCreationForm, UserProfileSerializer, UserFetchData, ScholarshipSponsorSerializer, ScholarshipProgramSerializer, ApplicationSerializer
from django.core.mail import send_mail
from django.utils import timezone
import uuid
from rest_framework import generics
from django.utils.html import format_html
from urllib.parse import urlencode
from django.utils.crypto import get_random_string
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
import jwt, datetime
from rest_framework.exceptions import AuthenticationFailed
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth import get_user_model

class UserRegistration(APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if UserRole.objects.filter(email=email).exists() or AdminUserRole.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserCreationForm(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # Generate a verification token
            verification_token = get_random_string(length=32)
            user.verification_token = verification_token
            user.verification_token_created_at = timezone.now()
            user.save()

            # Call the send_verification_email function with the user instance
            send_verification_email(user, verification_token)

            return Response({'message': 'User registered successfully. Please check your email to verify your account.'})
    
class AdminRegistration(APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if UserRole.objects.filter(email=email).exists() or AdminUserRole.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = AdminCreationForm(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # Generate a verification token
            verification_token = get_random_string(length=32)
            user.verification_token = verification_token
            user.verification_token_created_at = timezone.now()
            user.save()

            # Call the send_verification_email function with the user instance
            send_verification_adminemail(user, verification_token)

            print('Admin user created:', user)

            return Response({'message': 'Admin registered successfully. Please check your email to verify your account.'})


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check both UserRole and AdminUserRole for the provided email
        user_model = get_user_model()
        user = user_model.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        # Check if the user is verified and active
        if not user.is_verified or not user.is_active:
            raise AuthenticationFailed('User is not verified or is inactive.')

        # Generate access token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Set JWT cookie
        response = Response()
        response.set_cookie(key='jwt', value=access_token, httponly=True, samesite='None', secure=True)
        response.data = {'jwt': access_token}
        return response



class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = AdminUserRole.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('Personnel not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        # Check if the user is verified
        if not user.is_verified or not user.is_active:
            raise AuthenticationFailed('Personnel is not verified or is inactive.')

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Print or log the created access token
        print('Access Token:', access_token)

        response = Response()

        response.set_cookie(key='jwt', value=access_token, httponly=True, samesite='None', secure=True)
        response.data = {
            'jwt': access_token
        }
        return response

class UserView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        print('Received Token:', token)
        print('Request Headers:', request.headers)

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decode the access token
            access_token = AccessToken(token)
            user_id = access_token.payload.get('user_id')

            # Additional debug prints
            print('Decoded Payload:', access_token.payload)
            print('Token is valid.')

        except AuthenticationFailed as e:
            raise e

        user = UserRole.objects.filter(id=user_id).first()
        print('Fetched User:', user)

        if not user:
            raise AuthenticationFailed('User not found!')

        serializer = UserCreationForm(user)
        print('Serialized Data:', serializer.data)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

    

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
            # Check if the user is not already verified
            if not user.is_verified:
      
                user.is_verified = True
                user.is_active = True
                user.verification_token = None
                user.verification_token_created_at = None
                user.save()

    
                login(request, user)

                return Response({'message': 'Email verified successfully.'}, status=status.HTTP_200_OK)
            else:
                # If the user is already verified, return an appropriate response
                return Response({'message': 'Email already verified.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Verification token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    except UserRole.DoesNotExist:
        return Response({'message': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_verify_email(request, token):
    try:
        admin_user = AdminUserRole.objects.get(verification_token=token)
        if admin_user.verification_token_created_at + timezone.timedelta(days=1) >= timezone.now():
            admin_user.is_verified = True
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
def send_verification_email(user, token):
    verification_url = "http://localhost:8000/verify-email"
    query_params = urlencode({'token': token})
    full_verification_url = f"{verification_url}/{token}/"

    subject = 'Email Verification'
    html_message = format_html(f'''
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
                <p style="font-size:15px;">Hi {user.first_name}</p>
                <p style="font-size:15px;">Thank you for signing up for our scholarship system. Let's get you across the finish line!</p>
                Click the following button to verify your email:
                <br>
                <div style="display: inline-block;">
                    <a href="{full_verification_url}">
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
    recipient_list = [user.email]

    send_mail(subject, '', from_email, recipient_list, fail_silently=False, html_message=html_message)


def send_verification_adminemail(user, token):
    verification_url = "http://localhost:8000/verify-adminemail"
    query_params = urlencode({'token': token})
    full_verification_url = f"{verification_url}/{token}/"

    subject = 'Email Verification'
    html_message = format_html(f'''
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
                <p style="font-size:15px;">Hi {user.first_name}</p>
                <p style="font-size:15px;">Thank you for signing up for our scholarship system. Let's get you across the finish line!</p>
                Click the following button to verify your email:
                <br>
                <div style="display: inline-block;">
                    <a href="{full_verification_url}">
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
    recipient_list = [user.email]

    send_mail(subject, '', from_email, recipient_list, fail_silently=False, html_message=html_message)

class FormListCreateView(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class FormRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class RolesListCreateView(generics.ListCreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserCreationForm

class RolesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserCreationForm

class UserListCreateView(generics.ListCreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserCreationForm

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserCreationForm

class SponsorListCreateView(generics.ListCreateAPIView):
    queryset = ScholarshipSponsor.objects.all()
    serializer_class = ScholarshipSponsorSerializer

class SponsorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScholarshipSponsor.objects.all()
    serializer_class = ScholarshipSponsorSerializer


class ProgramListCreateView(generics.ListCreateAPIView):
    queryset = ScholarshipProgram.objects.all()
    serializer_class = ScholarshipProgramSerializer

class ProgramRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScholarshipProgram.objects.all()
    serializer_class = ScholarshipProgramSerializer


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
    

class ApplicationListCreateView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationDetailView(generics.RetrieveAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

def create_application(request):
    if request.method == 'POST':
        # Ensure CSRF token is present and valid
        csrf_middleware = CsrfViewMiddleware()
        if not csrf_middleware.process_view(request, None, (), {}):
            return Response({'error': 'CSRF verification failed.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Extract user information from JWT token
            user = request.user

            # Get the form_id from the request data
            form_id = request.data.get('dynamic_form')

            # Get the form instance
            form = get_object_or_404(Form, pk=form_id)

            # Create a new application with applicant_id, applicant_name, and submission_application
            application = Application.objects.create(
                dynamic_form=form,
                applicant_id=user,
                applicant_name=f"{user.first_name} {user.last_name}",
                submission_application=request.data.get('submission_application')
            )

            return Response({'message': 'Application submitted successfully'}, status=status.HTTP_201_CREATED)

        except Http404:
            return Response({'error': 'Form not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

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
