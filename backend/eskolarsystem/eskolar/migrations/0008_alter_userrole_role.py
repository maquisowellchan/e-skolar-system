# Generated by Django 4.2 on 2023-12-01 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eskolar', '0007_alter_application_applicant_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrole',
            name='role',
            field=models.CharField(choices=[('admin', 'admin'), ('director', 'director'), ('head', 'head'), ('staff', 'staff')], default='student', max_length=30),
        ),
    ]
