from .models import Vacancy, CustomUser
from .serializers import VacancySerializer, UserSerializer
from rest_framework import generics, status, permissions
from .permissions import IsAdminOrReadOnly
from rest_framework.response import Response
from .filters import VacancyFilter
from django_filters.rest_framework import DjangoFilterBackend
from .smtp import send_email
from rest_framework.pagination import PageNumberPagination
import smtplib
from rest_framework.views import APIView

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class VacancyAPIList(generics.ListCreateAPIView):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    filterset_class = VacancyFilter
    pagination_class = StandardResultsSetPagination

    
class VacancyAPIUpdate(generics.RetrieveUpdateAPIView):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer


class VacancyAPIDestroy(generics.RetrieveDestroyAPIView):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer


class UserAPIList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserAPIUpdate(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer



class SendMailView(APIView):
    def post(self, request):
        subject = request.data.get('subject', '')
        body = request.data.get('body', '')
        to = request.data.get('to', '')

        if not subject or not body or not to:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_email(subject, body, to)
            return Response({'status': 'Email sent successfully'}, status=status.HTTP_200_OK)
        except smtplib.SMTPAuthenticationError:
            return Response({'status': 'Failed to authenticate'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'status': 'Error sending email', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)