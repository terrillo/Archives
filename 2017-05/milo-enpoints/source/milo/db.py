import pymysql.cursors
import pymysql

# Connect to the database
connection = pymysql.connect(host='23.23.6.195',
                             user='milo',
                             password='',
                             db='milo',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


db = connection.cursor()

def human(cue, characterization):
    sql = "UPDATE human SET `characterization`=%s WHERE `cue`=%s"
    db.execute(sql, (characterization, cue))
    connection.commit()

def human_data():
    sql = "SELECT * FROM human"
    db.execute(sql)
    results = []
    for row in db:
        results.append(row)
    return results

def writer(table, columns, values):
    sql = "INSERT INTO %s (%s) VALUES (%s)" % (table, ",".join(columns), ",".join('"{0}"'.format(w) for w in values))
    db.execute(sql)
    connection.commit()

# D1 Level Storage
def D1(source, information):
    sql = "INSERT INTO D1 (`source`, `information`) VALUES (%s, %s)"
    db.execute(sql, (source, information))
    connection.commit()

# D1 Level Storage (Select)
def D1S(source, limit):
    sql = "SELECT * FROM D1 WHERE source=%s  ORDER BY id DESC LIMIT %s"
    db.execute(sql, (source, limit))
    results = []
    for row in db:
        results.append(row['information'])
    return results

# D2 Level Storage
def D2(source, information):
    sql = "INSERT INTO D2 (`source`, `information`) VALUES (%s, %s)"
    db.execute(sql, (source, information))
    connection.commit()

# D2 Level Storage (Select)
def D2S(source, limit):
    sql = "SELECT * FROM D2 WHERE source=%s ORDER BY id DESC LIMIT %s"
    db.execute(sql, (source, limit))
    results = []
    for row in db:
        results.append(row['information'])
    return results

# T1 Level Storage
def T1(source, information):
    sql = "INSERT INTO T1 (`source`, `information`) VALUES (%s, %s)"
    db.execute(sql, (source, information))
    connection.commit()

# T1 Level Storage (Select)
def T1S(source):
    sql = "SELECT * FROM T1 WHERE source=%s ORDER BY id DESC"
    db.execute(sql, (source))
    results = []
    for row in db:
        results.append(row['information'])
    return results

# T1 Level Storage (Select)
def T1D(information):
    sql = "DELETE FROM `T1` WHERE information=%s"
    db.execute(sql, (information))
    print (sql, (information))
