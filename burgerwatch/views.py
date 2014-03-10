import os
from flask import render_template, json, jsonify
from burgerwatch import app

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trucks')
def get_all_trucks():
    json_data = open_json()
    json_data.pop('meta')
    return jsonify(**json_data)

@app.route('/trucks/<type>')
def search_by_food_type():
    pass

def open_json():
    filepath = os.path.join(app.root_path, 'data/foodtruckdata.json')
    with open(filepath) as json_file:
        json_data = json.load(json_file)
    return json_data

