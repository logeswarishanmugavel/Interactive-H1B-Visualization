from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'h1b'
FIELDS = {'maxcertifiedjobtitle': True, 'max_salary': True, 'maxcertifiedemployername': True, 'certifiedwithdrawn': True, 'jobtitlewithmaxsalary': True, 'jobtitlewithminsalary': True, 'withdrawn':True, 'certified':True, 'min_salary':True, 'enmaxno': True,'jtmaxno': True, 'denied':True,'employer_state':True, '_id': False}
FIELDS2 = {'case_status': True, 'visa_class': True, 'employer_name': True, 'employer_city': True, 'employer_state': True, 'soc_code': True, 'soc_name': True,'prevailing_wage': True, '_id': False}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/h1b/alldata")
def alldata():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME]['2016']
    applications = collection.find(projection=FIELDS, limit=100)
    json_applications = []
    for application in applications:
        json_applications.append(application)
    json_applications = json.dumps(json_applications, default=json_util.default)
    connection.close()
    return json_applications

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)