__author__ = 'jamshi'


from django import template
register = template.Library()

@register.filter
def Pretify(value):
    return value.replace('_', ' ').capitalize()