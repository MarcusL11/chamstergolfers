from django.urls import path
from . import views

urlpatterns = [
    path('nft/', views.nft_gallery, name='nft_gallery'),
]

