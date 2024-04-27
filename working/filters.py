import django_filters
from .models import Vacancy

class VacancyFilter(django_filters.FilterSet):
    VacancyName = django_filters.CharFilter(lookup_expr='icontains')
    VacancyGeo = django_filters.CharFilter(lookup_expr='icontains')
    min_salary = django_filters.NumberFilter(field_name='Salary', lookup_expr='gte')
    max_salary = django_filters.NumberFilter(field_name='Salary', lookup_expr='lte')
    user_id = django_filters.NumberFilter(field_name='userId')

    class Meta:
        model = Vacancy
        fields = ['VacancyName', 'VacancyGeo', 'min_salary', 'max_salary', 'user_id']