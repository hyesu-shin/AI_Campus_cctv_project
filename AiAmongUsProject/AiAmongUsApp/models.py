from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserAccount(models.Model) :
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='useraccount')
    name = models.CharField(max_length=20)
    phone_num = models.CharField(max_length=20)
    email = models.CharField(max_length=20)

class UserNotice(models.Model) :
    current_user = models.ForeignKey(
        User, related_name='usernotice',on_delete=models.CASCADE)
    current_time = models.CharField(max_length=20, null=True)
    current_notice = models.CharField(max_length=30, null=True)