from rest_framework import serializers
import os
import base64
from django.conf import settings
from .models import UserRole, Form, AdminUserRole,ScholarshipSponsor,ScholarshipProgram, Application


class UserCreationForm(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ["id","user_id","first_name","last_name","course","year_level","email","password", "role"]

    def create(self, validated_data):

        user_id = validated_data.pop('user_id', None)

        user = UserRole.objects.create(email=validated_data['email'],
                                       first_name=validated_data['first_name'],
                                       last_name=validated_data['last_name'],
                                       user_id=user_id,
                                       course=validated_data['course'],
                                       year_level=validated_data['year_level'],
                                       role=validated_data['role'],
                                         )
        user.set_password(validated_data['password'])
        user.save()
        return user

class FormSerializer(serializers.ModelSerializer):

    class Meta:
        model = Form
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        transformed_fields = []
        for field in representation['fields']:
            transformed_field = {
                'name': field['name'],
                'type': field['type'],
                # Add other relevant information based on your needs
            }
            transformed_fields.append(transformed_field)
        representation['transformed_fields'] = transformed_fields
        return representation

   

class AdminCreationForm(serializers.ModelSerializer):
    class Meta:
        model = AdminUserRole
        fields = ('employee_id', 'email', 'first_name', 'last_name', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        admin = AdminUserRole.objects.create(employee_id=validated_data['employee_id'],
                                       email=validated_data['email'],
                                       first_name=validated_data['first_name'],
                                       last_name=validated_data['last_name'],
                                         )
        admin.set_password(validated_data['password'])
        admin.save()
        return admin
    

    
class UserFetchData(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('id', 'user_id', 'email', 'first_name', 'last_name', 'status', 'role')
        extra_kwargs = {
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'status': {'required': False},
        }

class ScholarshipSponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipSponsor
        fields = ('sponsor_id', 'sponsor_name', 'contact_email', 'contact_person', 'contact_number')
        extra_kwargs = {
            'sponsor_name': {'required': False},
            'contact_email': {'required': False},
            'contact_person': {'required': False},
            'contact_number': {'required': False},
        }

class ScholarshipProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipProgram
        fields = ('scholarship_id', 'scholarship_type', 'scholarship_status', 'name', 'application_deadline', 'funding_amount', 'sponsor_id')
        extra_kwargs = {
            'scholarship_type': {'required': False},
            'scholarship_status': {'required': False},
            'name': {'required': False},
            'application_deadline': {'required': False},
            'funding_amount': {'required': False},
            'sponsor_id': {'required': False},
        }
        # Add this line to handle application_deadline as a date field
        date_format = "%Y-%m-%d"
        converters = {
            'application_deadline': serializers.DateField(format=date_format),
        }


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'profile_picture')


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'dynamic_form', 'applicant_id', 'submission_application']
        extra_kwargs = {
            'applicant_id': {'required': False},
        }

    def create(self, validated_data):
        # Extract applicant_id from validated data
        applicant_id = validated_data.pop('applicant_id', None)

        # Check if applicant_id is provided, otherwise raise an error
        if not applicant_id:
            raise serializers.ValidationError("Applicant ID is required.")

        # Set the applicant_id field
        validated_data['applicant_id'] = applicant_id

        # Create the Application instance
        application = Application.objects.create(**validated_data)

        # Handle file upload
        submission_application = validated_data.get('submission_application')
        if submission_application and isinstance(submission_application, dict):
            for field_name, file_data in submission_application.items():
                if isinstance(file_data, str) and file_data.startswith("data:"):
                    # File data is a base64-encoded string, decode it
                    file_data_decoded = base64.b64decode(file_data.split(",")[1])

                    # Get the applicant's folder path
                    applicant_folder = os.path.join(settings.MEDIA_ROOT, str(applicant_id))

                    # Create the folder if it doesn't exist
                    os.makedirs(applicant_folder, exist_ok=True)

                    # Generate a unique filename using applicant_id and field_name
                    filename = f"{applicant_id}_{field_name}.bin"

                    # Construct the full file path
                    file_path = os.path.join(applicant_folder, filename)

                    # Save the file
                    with open(file_path, "wb") as file:
                        file.write(file_data_decoded)

                    # Update the file path in the submission_application
                    submission_application[field_name] = file_path

        # Save the updated submission_application to the Application instance
        application.submission_application = submission_application
        application.save()

        return application



