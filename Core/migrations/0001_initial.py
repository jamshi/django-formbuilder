# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-09-02 13:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MyForms',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='Form Name')),
                ('configuration', models.TextField(blank=True, null=True)),
                ('form_location', models.CharField(max_length=700, verbose_name='File Location')),
            ],
        ),
    ]