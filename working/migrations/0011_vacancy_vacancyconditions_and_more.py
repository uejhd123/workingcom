# Generated by Django 5.0.4 on 2024-04-26 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('working', '0010_vacancy_vacancyrequirements'),
    ]

    operations = [
        migrations.AddField(
            model_name='vacancy',
            name='VacancyConditions',
            field=models.TextField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='vacancy',
            name='VacancyResponsibilities',
            field=models.TextField(default=1),
            preserve_default=False,
        ),
    ]
