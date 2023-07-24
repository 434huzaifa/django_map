from django.db import models
from django.db.models import FloatField,CharField
# Create your models here.
class Location(models.Model):
    lng=FloatField(null=True,blank=True)
    lat=FloatField(null=True,blank=True)
    name=CharField(null=True,blank=True)
    