from django.contrib import admin
from .models import Vacancy, VacancyStatus, CompanyAccount, CustomUser
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class CustomUserAdmin(BaseUserAdmin):
    # Отображаем все поля в списке пользователей
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'is_active', 'last_login', 'date_joined', 'phone_number', 'address', 'CompanyAccount')
    # Отображаем все поля в форме редактирования пользователя
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'address', 'bio', 'preferences', 'CompanyAccount')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # Отображаем все поля в форме добавления нового пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'bio', 'preferences', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'is_active', 'is_staff', 'is_superuser', 'CompanyAccount'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Vacancy)
admin.site.register(VacancyStatus)
admin.site.register(CompanyAccount)

