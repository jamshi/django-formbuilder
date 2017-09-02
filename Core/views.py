from django.shortcuts import render, HttpResponse
from models import MyForms
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
# Create your views here.

def home(request):
    return render(request, 'home.html')


@csrf_exempt
def save_form(request):
    if request.method == "POST":
        try:
            form_name = request.POST['form_name']
            form_name = form_name.replace(' ', '_').lower()
            form, created = MyForms.objects.get_or_create(name=form_name)
            form.configuration = request.POST['config']
            temp_path = "{0}/{1}.html".format(settings.FORM_LOCATION, form_name)
            form.form_location = temp_path
            form.save()
            '''
            Writing the HTML created in a file, if exists this will rewrite.
            Form Name is expected to be unique, This wont raise any error as it is designed to overwrite if exists
            #TODO Raise warning if filename already exist
            '''
            f = open(temp_path, 'w')
            f.write(request.POST['form_html'])
            f.close()
        except Exception as ex:
            return HttpResponse(json.dumps({'status': False}), content_type="application/json")
        return HttpResponse(json.dumps({'status': True}), content_type="application/json")



@csrf_exempt
def get_form(request):
    if request.method == "POST":
        my_form = None
        try:
            # import ipdb;ipdb.set_trace();
            my_form = MyForms.objects.get(pk=int(request.POST['pk']))
        except MyForms.DoesNotExist:
            my_form = None
            return HttpResponse(json.dumps({'status': False}), content_type="application/json")
        return HttpResponse(json.dumps({'status': True, 'config': my_form.configuration,
                                        'form_name': my_form.name.replace('_', ' ').capitalize()}),
                            content_type="application/json")


'''
View the form created using the designer
This function renders the html we saved, embeded in viewForm.html
'''
def viewform(request, formname):
    form_path = "{0}/{1}.html".format(settings.FORM_LOCATION, formname.lower())
    return render(request, 'viewForm.html', {'form': form_path, 'form_name': formname})