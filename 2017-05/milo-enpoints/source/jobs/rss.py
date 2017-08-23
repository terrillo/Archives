from milo.db import *

import json
import feedparser
import re

def rss_load(count):
    results = []
    articles = D2S('news', count)
    for article in articles:
        results.append(json.loads(article))
    return results
