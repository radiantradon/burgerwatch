import os
import sqlite3
from flask import Flask, g
app = Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(
    DEBUG=False,
    GMAPS_API_KEY='AIzaSyB99_r-84VyVficwEHNY4-Zgpsf9XxAHB0',
))

from burgerwatch import views

