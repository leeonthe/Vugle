from django import forms
from .models import UserRecord

class UserRecordForm(forms.ModelForm):
    class Meta:
        model = UserRecord
        fields = ['user', 'pdf']
