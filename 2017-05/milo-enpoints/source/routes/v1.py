from bottle import route, run, debug, response
from pymongo import MongoClient

from milo.db import *
from jobs.weather import *
from jobs.geofence import *
from jobs.rss import *

from json import dumps

client = MongoClient('mongodb://milo:Toca1991@ds111851.mlab.com:11851/milo')
mongo = client.milo
projects_db = mongo.projects

# Sync Human location
@route('/v1/push/location/<latitude>/<longitude>')
def location(latitude, longitude):
    scene = geofence_lookup(latitude, longitude)
    human('location', scene)
    human('latitude', latitude)
    human('longitude', longitude)
    if (scene != 'Unknown'):
        D2('location', scene)

    blocks = {
        'scene': scene,
        'templates': [
            'weather',
        ]
    }

    # Home
    if (scene == 'Home'):
        blocks = {
            'scene': scene,
            'templates': [
                'weather',
            ]
        }

    # Brief Media
    if (scene == 'Brief Media') or (scene == 'Brief Media'):
        blocks = {
            'scene': scene,
            'templates': [
                'weather',
            ]
        }

    return blocks

# Add Locations
@route('/v1/add/location/<name>/<latitude>/<longitude>')
def location(name, latitude, longitude):
    writer('locations', ['latitude', 'longitude', 'name'], [latitude, longitude, name])
    return name

# Pull Block
@route('/v1/pull/google-api/<event>')
def google_api(event):
    data = human_data();
    for d in data:
        if (d['cue'] == 'latitude'):
            latitude = d['characterization']
        if (d['cue'] == 'longitude'):
            longitude = d['characterization']

    if (event == 'time-to-home'):
        request_url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s"  % (latitude, longitude)
        request_url += '&destinations=36.059746%2C-95.965874%7C'

    request_url += '&key=AIzaSyCUSFNl7-kqGu04qdRF_t4BoQSu9BaPaQU'

    req = requests.get(request_url)
    data = json.loads(req.text)
    return data

# Pull Block
@route('/v1/pull/blocks/<block>')
def blocks(block):
    response.content_type = 'application/json'
    data = human_data();
    for d in data:
        if (d['cue'] == 'latitude'):
            latitude = d['characterization']
        if (d['cue'] == 'longitude'):
            longitude = d['characterization']

    # News
    if (block == 'weather'):
        blocks = {
            'template': 'weather',
            'data': weather_cords(latitude, longitude),
        }

    # News
    if (block == 'news'):
        blocks = {
            'template': 'news',
            'data': rss_load(3),
        }

    return dumps(blocks)

# Push Alerts
@route('/v1/push/alerts/<scene>/<message>')
def create_alerts(scene, message):
    T1(scene, message)
    return message

# Pull Alerts
@route('/v1/pull/alerts/<scene>')
def find_alerts(scene):
    alerts = T1S(scene)
    response.content_type = 'application/json'
    return dumps(alerts)

# Delete Alerts
@route('/v1/delete/alerts/<message>')
def delete_alerts(message):
    T1D(message)
    return message

# Command
@route('/v1/command/task/<action>/<text>')
def command(action, text):
    response.content_type = 'application/json'
    responer = {
        'classifier': action
    }
    return dumps(responer)

# Create Project
@route('/v1/create/project/<name>')
def create_project(name):
    name = name.lower()
    new_project = {
        'name': name
    }
    projects_db.insert_one(new_project)
    return dumps({})

# Delete Project
@route('/v1/delete/project/<name>')
def delete_project(name):
    name = name.lower()
    new_project = {
        'name': name
    }
    projects_db.delete_many(new_project)
    return dumps({})

# Pull Project
@route('/v1/pull/project/<name>')
def pull_project(name):
    name = name.lower()
    new_project = {
        'name': name
    }
    project = projects_db.find_one(new_project)
    del project['_id']
    return dumps(project)

# Update
@route('/v1/update/project/<name>/<data>')
def update_project(name, data):
    name = name.lower()
    projects_db.delete_many({'name': name})
    new_project = {
        'name': name,
        'data': data
    }
    projects_db.insert_one(new_project)
    return dumps({})

debug(True)
run(host='0.0.0.0', port=88, reloader=True)
