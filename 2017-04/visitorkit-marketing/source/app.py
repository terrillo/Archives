#!/usr/bin/python
# encoding=utf8
import codecs
import datetime
import os
import re
import shutil
import sys

# Encoding
reload(sys)
sys.setdefaultencoding('utf-8')

from xml.dom import minidom

# Date
today = datetime.date.today()

# Config FILE
config_doc = minidom.parse('config.xml')

def apply_config( data ):
    if (sys.argv[1] == 'dev'):
        data = data.replace('::baseurl', 'http://localhost/marketing/www')
    if (sys.argv[1] == 'live'):
        data = data.replace('::baseurl', 'https://www.visitorkit.com')
    if (sys.argv[1] == 'beta'):
        data = data.replace('::baseurl', 'http://beta.visitorkit.com.s3-website-us-east-1.amazonaws.com')
    config_list = config_doc.getElementsByTagName('var')
    for v in config_list:
        na = v.attributes['name'].value
        va = v.attributes['value'].value
        data = data.replace('::'+na, va)
    return data

QUOTE_PATTERN = r"""([&<>"'])(?!(amp|lt|gt|quot|#39);)"""
def escape(word):
    """
    Replaces special characters <>&"' to HTML-safe sequences.
    With attention to already escaped characters.
    """
    replace_with = {
        '>': '&gt;',
        '<': '&lt;',
        '&': '&amp;',
        '"': '&quot;', # should be escaped in attributes
        "'": '&#39'    # should be escaped in attributes
    }
    quote_pattern = re.compile(QUOTE_PATTERN)
    return re.sub(quote_pattern, lambda x: replace_with[x.group(0)], word)

# Templates
header_template = apply_config(codecs.open("./templates/header.html", 'r').read())
footer_template = apply_config(codecs.open("./templates/footer.html", 'r').read())

# Map FILE
map_doc = minidom.parse('map.xml')

# Create folder
if os.path.exists('./www/'):
    shutil.rmtree('./www/')
    os.makedirs('./www/')
    os.makedirs('./www/blog')
else:
    os.makedirs('./www/')
    os.makedirs('./www/blog')

# Move Public
shutil.copytree('./public', './www/public')

# Sitemap
sitemap_template = '<?xml version="1.0" encoding="UTF-8"?> \n'
sitemap_template += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"> \n'

# Build Pages
itemlist = map_doc.getElementsByTagName('page')
for s in itemlist:
    path = s.attributes['path'].value
    template = s.attributes['template'].value
    priority = s.attributes['priority'].value
    title = s.attributes['title'].value
    description = s.attributes['description'].value
    keywords = s.attributes['keywords'].value

    sitemap_template += '\t <url> \n'
    sitemap_template += '\t\t <loc>::baseurl'+path+'</loc> \n'
    sitemap_template += '\t\t <changefreq>daily</changefreq> \n'
    sitemap_template += '\t\t <lastmod>'+str(today)+'</lastmod> \n'
    sitemap_template += '\t\t <priority>'+priority+'</priority> \n'
    sitemap_template += '\t </url> \n'

    if os.path.exists('./views/'+template+'.html'):
        page_template = apply_config(codecs.open('./views/'+template+'.html', 'r').read())
    else:
        page_template = template

    if (template == 'home'):
        new_header_template = header_template.replace('::thisurl', '')
    else:
        new_header_template = header_template.replace('::thisurl', template+'.html')
    new_file_template = new_header_template
    new_file_template = new_file_template.replace('::image', '::baseurl/public/images/favicon.png')
    new_file_template += page_template
    new_file_template += footer_template
    # new_file_template = new_file_template.replace('\n', ' ').replace('\r', '')

    # Meta
    new_file_template = new_file_template.replace('::title', title)
    new_file_template = new_file_template.replace('::description', description)
    new_file_template = new_file_template.replace('::keywords', keywords)
    new_file_template = apply_config(new_file_template)

    # Create New File
    new_file = open('./www'+path, 'a+')
    new_file.write(new_file_template)
    new_file.close()
    print ('Page:: /www'+path)

# Dir of Post
blog_posts = ''
blog_post_template = codecs.open("./views/blog.html", 'r').read().decode('utf8')
blog_post_landing_template = codecs.open("./templates/blog-post.html", 'r').read().decode('utf8')
rss_template = codecs.open("./templates/rss.xml", 'r').read().decode('utf8')
source = './blog/'
for root, dirs, posts in os.walk(source):
    for post in posts:

        # Get Post
        post_full_path = os.path.join(source, post)
        post = codecs.open(post_full_path, 'r')
        post_readable = post.read();

        # Config
        lines = post_readable.splitlines()
        title = lines[0].replace('<!-- title: ', '').replace(' -->', '')
        date = lines[1].replace('<!-- date: ', '').replace(' -->', '')
        image = lines[2].replace('<!-- image: ', '').replace(' -->', '')
        summary = lines[3].replace('<!-- summary: ', '').replace(' -->', '')
        link = post_full_path.replace('./', '/')

        # Build Article
        built_post = blog_post_template
        built_post = built_post.replace('::article', post_readable)
        built_post = built_post.replace('::link', link)
        built_post = built_post.replace('::image', image)
        built_post = built_post.replace('::title', title)
        built_post = built_post.replace('::date', date)
        built_post = built_post.replace('::summary', summary)

        # This Post
        this_post = blog_post_landing_template
        this_post = this_post.replace('::link', link)
        this_post = this_post.replace('::image', image)
        this_post = this_post.replace('::title', title)
        this_post = this_post.replace('::date', date)
        this_post = this_post.replace('::summary', summary)

        # Update Sitemap
        sitemap_template += '\t <url> \n'
        sitemap_template += '\t\t <loc>::baseurl'+link+'</loc> \n'
        sitemap_template += '\t\t <changefreq>daily</changefreq> \n'
        sitemap_template += '\t\t <lastmod>'+str(today)+'</lastmod> \n'
        sitemap_template += '\t\t <priority>0.7</priority> \n'
        sitemap_template += '\t </url> \n'

        # Update rss
        rss_template += '\t <entry> \n'
        rss_template += '\t\t <published>'+str(today)+'T09:37:38-04:00</published> \n'
        rss_template += '\t\t <updated>'+str(today)+'T09:37:38-04:00</updated> \n'
        rss_template += '\t\t <title>'+title+'</title> \n'
        rss_template += '\t\t <content type="html"> \n'
        # rss_template += '\t\t <img src="https://www.visitorkit.com'+image+'"/> \n'
        rss_template += '\t\t '+escape(post_readable)+' \n'
        rss_template += '\t\t </content> \n'
        rss_template += '\t\t <link rel="alternate" type="text/html" href="https://www.visitorkit.com'+link+'"/> \n'
        rss_template += '\t\t <id>https://www.visitorkit.com'+link+'</id> \n'
        rss_template += '\t\t <author> \n'
        rss_template += '\t\t\t <name>Terrillo Walls</name> \n'
        rss_template += '\t\t </author> \n'
        rss_template += '\t </entry> \n'

        # Create File
        new_file = open('./www'+(post_full_path.replace('./', '/')), 'a+')
        new_header = header_template.replace('::title', title);
        new_header = new_header.replace('::thisurl', (post_full_path.replace('./', '')))
        new_header = new_header.replace('::image', '::baseurl/public/images/'+image)
        new_header = new_header.replace('::description', summary);
        new_file.write(apply_config(new_header))
        new_file.write(apply_config(built_post))
        new_file.write(footer_template)
        new_file.close()

        # Buld Landing
        blog_posts += this_post

        print 'Blog Post: '+title


# Build RSS
rss_template += '</feed>'
rss_file = open('./www/rss.xml', 'a+')
rss_file.write(rss_template)
rss_file.close()

# Blog Landing
blog_landing = codecs.open("./views/blog-landing.html", 'r').read().decode('utf8')
new_file = open('./www/blog/index.html', 'a+')
header_template = header_template.replace('::title', 'Blog');
header_template = header_template.replace('::thisurl', 'blog/')
header_template = header_template.replace('::description', 'Blog');
new_file.write(header_template)
new_file.write(apply_config(blog_landing.replace('::articles', blog_posts)))
new_file.write(footer_template)
new_file.close()

# Update Sitemap
sitemap_template += '\t <url> \n'
sitemap_template += '\t\t <loc>::baseurl/blog</loc> \n'
sitemap_template += '\t\t <changefreq>daily</changefreq> \n'
sitemap_template += '\t\t <lastmod>'+str(today)+'</lastmod> \n'
sitemap_template += '\t\t <priority>0.9</priority> \n'
sitemap_template += '\t </url> \n'

# Sitemap
sitemap_template = apply_config(sitemap_template)
sitemap_template = sitemap_template.replace('index.html', '')
sitemap_template += '</urlset>'
new_sitemap = open('./www/sitemap.xml',"a+")
new_sitemap.write(sitemap_template)
new_sitemap.close()
print ('File: /www/sitemap.xml')

# Robots.txt
robots = 'User-agent: * \n'
robots += 'Disallow:'
new_robots = open('./www/robots.txt',"a+")
new_robots.write(robots)
new_robots.close()

# error.html
notfound = 'Page not Found'
new_notfound = open('./www/error.html',"a+")
new_notfound.write(notfound)
new_notfound.close()

if (sys.argv[1] == 'beta'):
    os.system("cd ./www && aws s3 cp . s3://beta.visitorkit.com/ --recursive")

if (sys.argv[1] == 'live'):
    os.system("cd ./www && aws s3 cp . s3://www.visitorkit.com/ --recursive")
