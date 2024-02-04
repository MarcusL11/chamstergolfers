from django.shortcuts import render


def nft_gallery(request):
    return render(request, 'nftapp/nftgallery.html')
