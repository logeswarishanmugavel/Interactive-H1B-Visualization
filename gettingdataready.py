from flask import Flask
from flask import render_template
from pymongo import MongoClient
import csv
import json
from bson import json_util
from bson.json_util import dumps

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'h1b'
COLLECTION_NAME = 'y2016'
MY_COLLECTION_NAME = '2016'
FIELDS = {'case_status': True, 'visa_class': True, 'employer_name': True, 'employer_city': True, 'employer_state': True, 'soc_code': True, 'soc_name': True,'prevailing_wage': True, '_id': False}
FIELDS2 = {'maxcertifiedjobtitle': True, 'max_salary': True, 'maxcertifiedemployername': True, 'certifiedwithdrawn': True, 'jobtitlewithmaxsalary': True, 'jobtitlewithminsalary': True, 'withdrawn':True, 'certified':True, 'min_salary':True, 'enmaxno': True,'jtmaxno': True, 'denied':True,'employer_state':True, '_id': False}

connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
collection = connection[DBS_NAME][COLLECTION_NAME]
mycollection = connection[DBS_NAME][MY_COLLECTION_NAME]
dummy = connection[DBS_NAME]['dummy']
stateindex = 0
	
states = collection.distinct('employer_state')
print states

for state in states:
    certified = collection.find({'employer_state':state,'wage_unit_of_pay':'Year','pw_unit_of_pay':'Year','case_status':'CERTIFIED'}).count()
    certifiedwithdrawn = collection.find({'employer_state':state,'wage_unit_of_pay':'Year','pw_unit_of_pay':'Year','case_status':'CERTIFIED-WITHDRAWN'}).count()
    denied = collection.find({'employer_state':state,'wage_unit_of_pay':'Year','pw_unit_of_pay':'Year','case_status':'DENIED'}).count()
    withdrawn = collection.find({'employer_state':state,'wage_unit_of_pay':'Year','pw_unit_of_pay':'Year','case_status':'WITHDRAWN'}).count()
    print state
    maxsalary = collection.find_one({'employer_state':state,'wage_unit_of_pay':'Year','pw_unit_of_pay':'Year'}, sort=[("prevailing_wage", -1)])
    minsalary = collection.find_one({'employer_state':state,'wage_unit_of_pay':'Year','pw_unit_of_pay':'Year'}, sort=[("prevailing_wage", 1)])

    collection.aggregate([{"$match":{"employer_state":state,"case_status":"CERTIFIED"}},{"$group":{"_id":{"job_title":"$job_title"},"count":{"$sum":1}}},{"$sort":{"count":-1}},{"$out":"dummy"}])
    result = dummy.find_one(sort=[("count", -1)])
    jtmaxtitle = result['_id']['job_title']
    jtmaxno = result['count']

    collection.aggregate([{"$match":{"employer_state":state,"case_status":"CERTIFIED"}},{"$group":{"_id":{"employer_name":"$employer_name"},"count":{"$sum":1}}},{"$sort":{"count":-1}},{"$out":"dummy"}])
    result = dummy.find_one(sort=[("count", -1)])
    enmaxtitle = result['_id']['employer_name']
    enmaxno = result['count']
    stateindex = stateindex + 1
    finalresult = mycollection.insert({"id":stateindex,"employer_state":state,"certified":certified,"certifiedwithdrawn":certifiedwithdrawn,"withdrawn":withdrawn,"denied":denied,"max_salary":maxsalary['prevailing_wage'],"jobtitlewithmaxsalary":maxsalary['job_title'],"min_salary":minsalary['prevailing_wage'],"jobtitlewithminsalary":minsalary['job_title'],"maxcertifiedjobtitle":jtmaxtitle,"jtmaxno":jtmaxno,"maxcertifiedemployername":enmaxtitle,"enmaxno":enmaxno})
    print finalresult

#with open('data.json', 'w') as outfile:
#    json.dump(json_applications, outfile)
connection.close()
