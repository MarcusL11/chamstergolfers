from django.db import models

class Chamster(models.Model):
    id = models.CharField(max_length=100, primary_key=True, default=0)
    encoded_id = models.CharField(max_length=100, default=0)
    owner_address = models.CharField(max_length=100, default=0)
    name = models.CharField(max_length=100, default=0)
    background = models.CharField(max_length=50, default=0)
    fur = models.CharField(max_length=50, default=0)
    shirt = models.CharField(max_length=50, default=0)
    pants = models.CharField(max_length=50, default=0)
    head = models.CharField(max_length=50, default=0)
    eyes = models.CharField(max_length=50, default=0)
    club = models.CharField(max_length=50, default=0)
    power = models.IntegerField(default=0)
    putting = models.IntegerField(default=0)
    accuracy = models.IntegerField(default=0)
    recovery = models.IntegerField(default=0)
    luck = models.IntegerField(default=0)
    specialty = models.CharField(max_length=50, default=0)
    tsi = models.IntegerField(default=0)

    def __str__(self):
        return self.name
