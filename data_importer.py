"""
data_importer.py
All code written by KE to import JSON data into SQLite3 db
"""
import os
import json
from burgerwatch import app, get_db

def main():
    data = extract_data()
    sql_str = make_sql_str(len(data[0]))
    print sql_str
    with app.app_context():
        db = get_db()
        db.executemany(sql_str, data)
        db.commit()

def make_sql_str(num_columns):
    question_marks = ",".join("?"*num_columns)
    sql_str = "INSERT INTO trucks VALUES (null, %s)" % question_marks
    return sql_str

def extract_data():
    filepath = os.path.join(app.root_path, 'data/foodtruckdata.json')
    with open(filepath) as data_file:
        json_data = json.load(data_file)
        data = json_data['data']
        # We want to discard the first 7 columns in each row
        schema_data = [c[8:30] for c in data]
    sanitized_data = scrub_data(schema_data)
    return sanitized_data

def scrub_data(data):
    """ 1. Convert all NoneTypes to an empty string"""
    for i, line in enumerate(data):
        data[i] = [u'' if e is None else e for e in line]
    return data

if __name__=='__main__':
    main()