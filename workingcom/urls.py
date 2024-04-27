
from django.contrib import admin
from django.urls import path, include, re_path
from working.views import VacancyAPIList, VacancyAPIUpdate, VacancyAPIDestroy, UserAPIList, UserAPIUpdate, SendMailView
from rest_framework import routers, urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


"""
router = routers.DefaultRouter()
router.register(r'vacancy', VacancyViewSet, basename="vacancy")
"""
"""path('api/v1/', include(router.urls)),
    path('api/v1/auth/', include('rest_framework.urls')),"""


urlpatterns = [
    path('admin/', admin.site.urls),
    
    path("api/v1/vacancylist/", VacancyAPIList.as_view()),
    path("api/v1/vacancylist/<int:pk>/", VacancyAPIUpdate.as_view()),
    path("api/v1/vacancydelete/<int:pk>/", VacancyAPIDestroy.as_view()),
    path("api/v1/useradd/", UserAPIList.as_view()),
    path("api/v1/user/<int:pk>", UserAPIList.as_view()),
    path("api/v1/userupdate/<int:pk>", UserAPIUpdate.as_view()),
    path('api/v1/sendmail/', SendMailView.as_view()),

    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/auth/', include('djoser.urls')),  # new
    re_path('api/v1/auth/', include('djoser.urls.authtoken')),  # new
]
