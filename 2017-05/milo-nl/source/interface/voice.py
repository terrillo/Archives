from boto3 import  client
import boto3
import StringIO
from contextlib import closing

polly = client("polly", 'us-east-1')

def voice(text):
    response = polly.synthesize_speech(
        Text="Good Morning Sir",
        OutputFormat="mp3",
        VoiceId="Brian")

    if "AudioStream" in response:
        with closing(response["AudioStream"]) as stream:
            data = stream.read()
            fo = open("pollytest.mp3", "w+")
            fo.write( data )
            fo.close()

voice('Good Morning Sir')
