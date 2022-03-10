from django.http import JsonResponse
from django.http import Http404

# Create your views here.
from .models import Record


def handle_record(request):
    if request.method == 'GET':
        raise Http404
    try:
        Record.objects.create(
            name=request.POST['name'],
            score=request.POST['score'],
        )
        return JsonResponse({'is_finished': True})
    except BaseException:
        pass
    return JsonResponse({'is_finished': False})
