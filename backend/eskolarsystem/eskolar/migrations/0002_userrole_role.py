# Generated by Django 4.2.5 on 2023-10-03 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eskolar', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userrole',
            name='role',
            field=models.CharField(default='student', max_length=30),
        ),
    ]
