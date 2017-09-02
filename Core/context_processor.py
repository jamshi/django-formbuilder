__author__ = 'jamshi'


def get_forms(request):
    from models import MyForms
    return {'my_forms': MyForms.objects.all()}
