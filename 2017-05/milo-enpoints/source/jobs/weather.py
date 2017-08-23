#!/usr/bin/python
# encoding=utf8
from geotext import GeoText
from milo.db import *

import json
import requests
import codecs
import time


def weather(text):
    start = time.time()
    if (text == 'block'):
        data = D2S('weather', 1)
        data = json.loads(data[0])
    else:
        # title = text.title()
        places = GeoText(text)
        location = places.cities

        # Base Request URL
        request_url = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&APPID=3857a87bd99d4aecc1dc6e71e489772a'

        # IF Location
        if (location):
            request_url += str('&q='+str(location))
        else:
            request_url += '&zip=74136,us'

        # Grab Weather Data
        req = requests.get(request_url)
        data = json.loads(req.text)

    end = time.time()
    print(end - start)

    return data

def weather_cords(lat, long):
    request_url = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&APPID=3857a87bd99d4aecc1dc6e71e489772a'
    request_url += "&lat=%s&lon=%s" % (lat, long)
    req = requests.get(request_url)
    data = json.loads(req.text)
    return data;

def weather_commander(text, context):
    weather_data = weather(text)

    # Build Message
    text = "%s in %s with %s" % (weather_data['main']['temp_min'], weather_data['name'], weather_data['weather'][0]['description'])

    # Rain
    if (context == 'weather-rain') or (context == 'weather-bad'):
        if ('rain' in text) or ('raining' in text) or ('thunderstorm' in text):
            if ('thunderstorm' in text):
                return 'Very Bad'
            else:
                return 'Yes'
        else:
            return 'No'

    # Snow
    if (context == 'weather-snow'):
        if ('snow' in text) or ('snowing' in text):
            return 'Yes'
        else:
            return 'No'

    # Generic weather
    if (context == 'weather-general'):
        return text

    return "Not sure what you mean but, "+text
