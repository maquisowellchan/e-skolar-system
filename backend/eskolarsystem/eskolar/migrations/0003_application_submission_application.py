# Generated by Django 4.2 on 2023-11-28 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eskolar', '0002_application'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='submission_application',
            field=models.JSONField(null=True),
        ),
    ]
