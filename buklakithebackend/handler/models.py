from django.db import models


class Record(models.Model):
    """Record model."""

    name = models.CharField(max_length=255)
    days = models.IntegerField()
    basket_amount = models.IntegerField()
    distance = models.IntegerField()

    def __str__(self):
        return f'Record {self.id}'

    class Meta:
        verbose_name = 'Record'
        verbose_name_plural = 'Records'