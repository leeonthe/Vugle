from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import UserRecord
from .forms import UserRecordForm

def upload_user_record(request):
    if request.method == 'POST':
        form = UserRecordForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = UserRecordForm()
    return render(request, 'upload.html', {'form': form})

def success(request):
    return HttpResponse('Successfully uploaded')
