#!/usr/bin/python
# encoding=utf8
import codecs
import datetime
import os
import re
import shutil
import sys
import os
import boto3

defaultRegion = 'us-east-1'
defaultUrl = 'https://polly.us-east-1.amazonaws.com'

class MyString:
    def __init__(self, string):
        self.string = string
    def __div__(self, div):
        l = []
        for i in range(0, len(self.string), div):
            l.append(self.string[i:i+div])
        return l

def connectToPolly(regionName=defaultRegion, endpointUrl=defaultUrl):
    return boto3.client('polly', region_name=regionName, endpoint_url=endpointUrl)

def speak(polly, text, path):
    format = 'mp3'
    voice = 'Brian'
    resp = polly.synthesize_speech(OutputFormat=format, Text=text, VoiceId=voice)
    soundfile = open(path, 'w')
    soundBytes = resp['AudioStream'].read()
    soundfile.write(soundBytes)
    soundfile.close()
    # os.system('afplay /tmp/sound.mp3')  # Works only on Mac OS, sorry
    # os.remove('/tmp/sound.mp3')

polly = connectToPolly()
source = './shows/'
for root, dirs, posts in os.walk(source):
    for post in posts:
        post_full_path = os.path.join(source, post)
        post = codecs.open(post_full_path, 'r')
        post_readable = post.read();
        m = MyString(post_readable)
        break_up = m/1500
        new_post = break_up[0]
        new_path = post_full_path.replace('./shows/', './dist/').replace('.txt', '.mp3')


        speak(polly, new_post, new_path)



#
# polly = connectToPolly()
# # icelandicString =
# speak(polly, "Hello world, I'm Polly. Or Brian. Or anyone you want, really.")
# # speak(polly, icelandicString.decode('utf8'), voice='Karl')
