import os
from flask import render_template, json, jsonify, request
from burgerwatch import app

@app.route('/')
def index():
    api_key = app.config['GMAPS_API_KEY'];
    json_data = open_json()
    context = dict(
        api_key=api_key,
        truckdata=json_data,
    )
    return render_template('index.html', **context)

@app.route('/trucks')
def get_all_trucks():
    json_data = open_json()
    json_data.pop('meta')
    return jsonify(**json_data)

@app.route('/filtertrucks')
def filter_trucks():
    filtered = []
    # Get URL args here
    exclude_catering = request.args.get('exclude_catering', False)
    filter_by_food_item = request.args.get('filter_by_food_item', False)
    truck_name = request.args.get('truck_name', False)
    json_data = open_json()
    filtered = json_data['data']

    if exclude_catering:
        filtered = [item for item in filtered if 'catering' not in item[9].lower()]

    if filter_by_food_item:
        filtered = [item for item in filtered if filter_by_food_item.lower() in item[19].lower()]

    if truck_name:
        filtered = [item for item in filtered if truck_name.lower() in item[9].lower()]

    data = dict(
        data=filtered
    )
    return jsonify(**data)

def open_json():
    filepath = os.path.join(app.root_path, 'data/foodtruckdata.json')
    with open(filepath) as json_file:
        json_data = json.load(json_file)
    json_data['data'] = scrub_data(json_data['data'])
    return json_data

def scrub_data(data):
    """ 1. Convert all NoneTypes to an empty string"""
    for i, line in enumerate(data):
        data[i] = [u'' if e is None else e for e in line]
    return data

