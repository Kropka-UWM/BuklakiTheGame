from django.test import TransactionTestCase

from .models import Record


class RecordApiTests(TransactionTestCase):
    def setUp(self):
        self.score = dict(name='ABC', days=3, basket_amount=2, distance=2)

    def test_empty_ranking(self):
        response = self.client.get('/get-records/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_save_and_read_score(self):
        response = self.client.post('/handle-record/', self.score)
        self.assertEqual(response.json(), {'is_finished': True})
        self.assertEqual(self.client.get('/get-records/').json(), [self.score])

    def test_ranking_remains_available_via_post(self):
        Record.objects.create(**self.score)
        self.assertEqual(self.client.post('/get-records/').json(), [self.score])

    def test_ranking_preserves_seven_record_limit(self):
        for i in range(9):
            Record.objects.create(**{**self.score, 'name': str(i)})
        response = self.client.get('/get-records/').json()
        self.assertEqual([row['name'] for row in response], list(map(str, range(7))))

    def test_get_cannot_create_score(self):
        self.assertEqual(self.client.get('/handle-record/', self.score).status_code, 404)
        self.assertEqual(Record.objects.count(), 0)

    def test_missing_fields_do_not_create_score(self):
        self.assertEqual(self.client.post('/handle-record/', {'name': 'ABC'}).json(), {'is_finished': False})
        self.assertEqual(Record.objects.count(), 0)

    def test_invalid_numbers_do_not_create_score(self):
        response = self.client.post('/handle-record/', {**self.score, 'days': 'invalid'})
        self.assertEqual(response.json(), {'is_finished': False})
        self.assertEqual(Record.objects.count(), 0)

    def test_electron_file_origin_is_allowed(self):
        response = self.client.get('/get-records/', HTTP_ORIGIN='null')
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), '*')
