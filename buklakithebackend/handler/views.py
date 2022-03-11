from django.http import JsonResponse
from django.http import Http404

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from .models import Record


@csrf_exempt
def handle_record(request):
    if request.method == 'GET':
        raise Http404
    try:
        Record.objects.create(
            name=request.POST['name'],
            days=request.POST['days'],
            basket_amount=request.POST['basket_amount'],
            distance=request.POST['distance'],
        )
        return JsonResponse({'is_finished': True})
    except BaseException:
        pass
    return JsonResponse({'is_finished': False})


@csrf_exempt
def get_records(request):
    records = []
    for obj in Record.objects.all():
        records.append({
            'name': obj.name,
            'days': obj.days,
            'basket_amount': obj.basket_amount,
            'distance': obj.distance,
        })
    return JsonResponse(records[:7], safe=False)
