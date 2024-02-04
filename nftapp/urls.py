from django.urls import path
from . import views

urlpatterns = [
    path('', views.nft_gallery, name='nft_gallery'),
]

