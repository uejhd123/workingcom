# Generated by Django 5.0.4 on 2024-04-25 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('working', '0006_alter_vacancy_userid'),
    ]

    operations = [
        migrations.AddField(
            model_name='vacancy',
            name='VacancyUsename',
            field=models.CharField(default=1, max_length=300),
            preserve_default=False,
        ),
    ]
