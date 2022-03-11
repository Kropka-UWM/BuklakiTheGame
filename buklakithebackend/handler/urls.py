from django.urls import path
from .views import get_records
from .views import handle_record

app_name = 'handler'

urlpatterns = [
    path('handle-record/', handle_record, name='handle_record'),
    path('get-records/', get_records, name='handle_record'),
]
