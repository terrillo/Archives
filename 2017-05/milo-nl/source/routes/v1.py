from bottle import route, run, debug, response
from interface.classify import *

from json import dumps

@route('/v1/push/classify/<text>')
def classify_route(text):
    response.content_type = 'application/json'
    whatis = classify(text)
    commands = []
    if ('weather' in whatis):
        commands = [
            {
                'call': 'api',
                'text': whatis,
                'command': text
            }
        ]

    if ('project' in whatis):
        commands = [
            {
                'call': 'ui',
                'text': whatis,
                'command': text,
            }
        ]

    return dumps(commands)

run(host='0.0.0.0', port=8089, debug=True)
