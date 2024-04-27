from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    address = models.CharField(max_length=100, blank=True)
    bio = models.TextField()
    preferences = models.TextField(blank=True)
    CompanyAccount = models.BooleanField(default=False)
    email = models.CharField(max_length=254, unique=True)

    def __str__(self):
        return self.username

    def get_preferences_list(self):
        return self.preferences.split(',') if self.preferences else []

    def set_preferences_list(self, preferences_list):
        self.preferences = ','.join(preferences_list)

    def __str__(self):
        return self.username
    
class CompanyAccount(models.Model):
    CompanyName = models.CharField(max_length=300)
    CompanyLogin = models.CharField(max_length=100)
    CompanyPass = models.CharField(max_length=256)
    CompanyBio = models.TextField()
    logo = models.CharField(max_length=255)
    def __str__(self) -> str:
        return self.CompanyName

class VacancyStatus(models.Model):
    VacancyStatus = models.CharField(max_length=30, db_index=True)
    def __str__(self) -> str:
        return self.VacancyStatus
    
class Vacancy(models.Model):
    VacancyName = models.CharField(max_length=300)
    Salary = models.IntegerField()
    Busyness = models.CharField(max_length=50)
    Experience = models.CharField(max_length=20)
    VacancyDescription = models.TextField()
    VacancyDate = models.DateTimeField(auto_now_add=True) 
    VacancyGeo = models.CharField(max_length=300)
    VacancyStatus = models.ForeignKey("VacancyStatus", on_delete=models.PROTECT, null=True, db_index=True, default=1)
    userId = models.IntegerField()
    VacancyUsername = models.CharField(max_length=300)
    VacancyRequirements = models.TextField()
    VacancyResponsibilities = models.TextField()
    VacancyConditions = models.TextField()
    Contacts = models.TextField()
    """
    def save(self, *args, **kwargs):
        if not self.userId:
            # Предполагается, что вы передаете user_id в save метод
            user_id = kwargs.pop('user_id', None)
            if user_id:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                self.userId = User.objects.get(pk=user_id)
        super().save(*args, **kwargs)
    """

    def __str__(self) -> str:
        return self.VacancyName
