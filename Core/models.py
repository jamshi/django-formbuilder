from __future__ import unicode_literals

from django.db import models

# Create your models here.

class MyForms(models.Model):
    name = models.CharField(max_length=250, verbose_name='Form Name')
    configuration = models.TextField(blank=True, null=True)
    form_location = models.CharField(max_length=700, verbose_name='File Location')