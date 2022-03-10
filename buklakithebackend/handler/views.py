from django.http import JsonResponse

# Create your views here.
from buklakithebackend.handler.models import Record


def handle_record(request):
    try:
        Record.objects.create(
            name=request.POST['name'],
            score=request.POST['score'],
        )
        return JsonResponse({'is_finished': True})
    except BaseException:
        pass
    return JsonResponse({'is_finished': False})
