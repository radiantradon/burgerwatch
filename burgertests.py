import os
import unittest
import tempfile
import burgerwatch
from pprint import pprint

class BurgerwatchTestCase(unittest.TestCase):
    def setUp(self):
        burgerwatch.app.config['TESTING'] = True
        self.app = burgerwatch.app.test_client()

    def tearDown(self):
        # Normally used for database connections
        # but we don't need that here
        pass

    def test_homepage(self):
        rv = self.app.get('/')
        assert rv.status=='200 OK'

    def test_trucks(self):
        rv = self.app.get('/trucks')
        assert rv.status=='200 OK'

    def test_filtertrucks(self):
        rv = self.app.get('/filtertrucks')
        assert rv.status=='200 OK'

if __name__=='__main__':
    unittest.main()