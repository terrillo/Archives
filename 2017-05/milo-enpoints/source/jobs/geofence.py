from matplotlib import path
from milo.db import *

def geofence_lookup(current_latitude, current_longitude):
    locations = []
    sql = "SELECT * FROM locations"
    db.execute(sql)
    results = []
    for row in db:
        locations.append([row['latitude'], row['longitude'], row['name']])

    scene = 'Unknown'
    for long, lat, place in locations:
        distance_range = 0.005
        latitude = float(long)
        longitude = float(lat)
        most_west = (latitude - distance_range)
        most_east = (latitude + distance_range)
        most_south = (longitude - distance_range)
        most_north = (longitude + distance_range)

        p = path.Path([(most_west, most_north), (most_west, most_south), (most_east, most_south), (most_east, most_north)])
        if (p.contains_points([(current_latitude, current_longitude)])[0]):
            scene = place

    return scene
