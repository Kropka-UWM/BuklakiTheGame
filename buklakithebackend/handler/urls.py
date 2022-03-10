from django.urls import path
from .views import handle_record

app_name = 'handler'

urlpatterns = [
    path('handle-record/', handle_record, name='handle_record'),
]
