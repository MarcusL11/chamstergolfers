
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage
from .models import Chamster
from django.db.models import Avg
import requests
import logging

def nft_gallery(request):
    query_params = [
        "search_name", "search_background", "search_fur", "search_shirt", 
        "search_pants", "search_head", "search_eyes", "search_club", 
        "search_power", "search_putting", "search_accuracy", "search_recovery", 
        "search_luck", "search_specialty", "search_tsi", "ordering"
    ]

    # Retrieve query parameters
    filters = {}
    ordering = None

    for param in query_params:
        value = request.GET.get(param)
        if param == "ordering" and value:
            ordering = value
        elif value:
            filters[param.replace('search_', '') + '__iexact'] = value

    # Filter the Chamster model based on query parameters
    chamsters = Chamster.objects.filter(**filters)

    # Apply ordering
    # ordering = request.GET.get("ordering")
    if ordering:
        if ordering == 'tsi':
            chamsters = chamsters.order_by('tsi')   
        elif ordering == '-tsi':
            chamsters = chamsters.order_by('-tsi')
        else:
            # Handle other ordering cases if needed
            pass

    # Paginate the results
    items_per_page = 24
    perpage = request.GET.get("perpage", items_per_page)
    paginator = Paginator(chamsters, perpage)
    page_number = request.GET.get("page", 1)
    total_pages = paginator.num_pages
    page_param = request.GET.get("page")
    all_items = chamsters.count()

    # Extracting unique values from attributes
    unique_values = {}
    for param in query_params[:-1]:  # Exclude 'ordering' from unique values extraction
        unique_values[param.replace('search_', 'unique_')] = (
            Chamster.objects.values(param.replace('search_', '')).distinct().order_by(param.replace('search_', ''))
        )

    # Apply pagination
    try:
        chamsters = paginator.page(page_number)
    except EmptyPage:
        chamsters = paginator.page(paginator.num_pages)

    if page_param and page_param.isdigit() and int(page_param) > 1:
        current_items = items_per_page * int(page_param)
    else:
        current_items = items_per_page
    
    main_data = {
        "chamster": chamsters, 
        "page_number" : page_number,
        "total_pages": total_pages,
        "current_items": current_items,
        "all_items": all_items, 
        **unique_values
    }

    return render(request, 'nftapp/nftgallery.html', main_data)


def nft_profile(request, pk=None):
    if pk:
        try: 
            nft_profile = Chamster.objects.get(pk=pk)
            chamsters = Chamster.objects.all()
    
            mintgarden_api = f"https://api.mintgarden.io/nfts/{nft_profile.encoded_id}"
            dexi_api = "https://api.dexie.space/v2/prices/tickers?ticker_id=USDSC_XCH"

            mintgarden_response = requests.get(mintgarden_api)
            dexi_response = requests.get(dexi_api)

        
            if mintgarden_response.status_code and dexi_response.status_code == 200:
                mintgarden_api = mintgarden_response.json()
                dexi_api = dexi_response.json()
            
                average_power = chamsters.aggregate(avg_power=Avg('power'))['avg_power']
                average_accuracy = chamsters.aggregate(avg_accuracy=Avg('accuracy'))['avg_accuracy']
                average_luck = chamsters.aggregate(avg_luck=Avg('luck'))['avg_luck']
                average_recovery = chamsters.aggregate(avg_recovery=Avg('recovery'))['avg_recovery']
                average_putting = chamsters.aggregate(avg_putting=Avg('putting'))['avg_putting']

                collection_name = mintgarden_api["data"]["metadata_json"]["collection"]["name"]
                owner_address = mintgarden_api["owner_address"]["id"]
                
                # DID Profile of owner 
                if mintgarden_api["owner"] is not None and mintgarden_api["owner"]["encoded_id"] is not None:
                    owner_did = mintgarden_api["owner"]["encoded_id"]
                else:
                    owner_did = "DID not available"

                # XCH price
                xch_price = mintgarden_api.get("xch_price")
                if xch_price is None:
                    xch_price = None                    
                    usdsc_price = None
                else:
                    # USDSC price                   
                    usdsc_xch_price = dexi_api["tickers"][0]["last_price"]
                    if usdsc_xch_price:
                        usdsc_price = 1 / float(usdsc_xch_price)
                    else:
                        usdsc_price = "N/A"  # Or any value/error handling that fits your application logic

                # Chamster type
                if "Legendary" in nft_profile.name:
                    chamster_type = "Legendary"
                else:
                    chamster_type = "Normal"

                profile_data = {
                    "nft_profile": nft_profile,
                    "collection_name": collection_name,
                    "owner_address": owner_address,
                    "chamster_type": chamster_type,
                    "xch_price": xch_price,
                    "usdsc_price": usdsc_price,
                    "owner_did": owner_did,
                    "avg_data": [
                        average_power,
                        average_accuracy,
                        average_luck,
                        average_recovery,
                        average_putting,
                    ],
                    "radar_data": [
                        nft_profile.power, 
                        nft_profile.accuracy, 
                        nft_profile.luck, 
                        nft_profile.recovery, 
                        nft_profile.putting
                    ],
                }
                return render(request, "nftapp/nftprofile.html", profile_data)
            else:
                error_message = {
                    "mintgarden_api": f"Failed to fetch data from Mintgarden API: {mintgarden_response.status_code}",
                    "dexi_api": f"Failed to fetch data from Dexi API: {dexi_response.status_code}",
                }
                logging.error(error_message)
                return render(request, "nftapp/nftprofile.html", {"error_message": error_message})
        except Chamster.DoesNotExist:
            nft_profile = "Error: NFT not found"
            return render(request, "nftapp/nftprofile.html", {"nft_profile": nft_profile})
        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            logging.error(error_message)
            return render(request, "nftapp/nftprofile.html", {"error_message": error_message})
    else:
        nft_profile = "Error: No ID provided"
        return render(request, "nftapp/nftprofile.html", {"nft_profile": nft_profile})            


