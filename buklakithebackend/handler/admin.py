from django.contrib import admin

# Register your models here.
from .models import Record


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    """Record admin."""

    list_display = [
        'name',
        'days',
        'basket_amount',
        'distance',
    ]
    search_fields = [
        'name',
    ]