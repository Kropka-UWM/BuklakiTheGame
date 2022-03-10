from django.contrib import admin

# Register your models here.
from buklakithebackend.handler.models import Record


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    """Record admin."""

    list_display = [
        'name',
        'score',
    ]
    search_fields = [
        'name',
    ]