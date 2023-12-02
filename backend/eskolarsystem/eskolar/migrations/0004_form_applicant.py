# Generated by Django 4.2 on 2023-11-28 23:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eskolar', '0003_application_submission_application'),
    ]

    operations = [
        migrations.AddField(
            model_name='form',
            name='applicant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='forms', to=settings.AUTH_USER_MODEL),
        ),
    ]