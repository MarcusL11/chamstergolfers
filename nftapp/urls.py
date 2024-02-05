from django.urls import path
from . import views

urlpatterns = [
    path('nft/', views.nft_gallery, name='nft_gallery'),
    path('nftprofile/<str:pk>', views.nft_profile, name='nft_profile'),
]

