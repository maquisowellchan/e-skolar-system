# Generated by Django 4.2.5 on 2023-10-04 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eskolar', '0003_form'),
    ]

    operations = [
        migrations.AlterField(
            model_name='form',
            name='form_status',
            field=models.CharField(choices=[('active', 'active'), ('inactive', 'inactive')], max_length=8),
        ),
    ]
