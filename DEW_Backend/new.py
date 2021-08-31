import sqlite3
from flask import Flask, request, jsonify
import sqlite3
import json
from flask_cors import CORS, cross_origin 
app = Flask(__name__)

def db_connection():
  conn = None
  try:
    conn = sqlite3.connect('dew.sqlite')
  except sqlite3.error as e:
    print(e)
  return conn
    

@app.route("/topology", methods=["GET", "POST"])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def topology():
  conn = db_connection()
  cursor = conn.cursor()

  if request.method == 'GET':
    cursor = conn.execute("SELECT * FROM TOPOLOGY_DEW")
    nodes = [
      dict(id=row[0], name=row[1], disabled=row[2], isNode=row[3], isLink=row[4], x=row[5], y =row[6])
      for row in cursor.fetchall()
    ]
    if nodes is not None:
      return jsonify(nodes)

  if request.method == "POST":
     data = request.get_json()
     nodes_data = data['0']
     for node in nodes_data:
      new_name = node['name']
      new_isNode = node['isNode']
      new_isLink = node['isLink']
      new_x = node['x']
      new_y = node['y']
      new_disabled = node['disabled']
      new_id = node['id']
      cursor = conn.execute("SELECT * FROM TOPOLOGY_DEW WHERE id = ?", [new_id])
      nodes = [
      dict(id=row[0], name=row[1], disabled=row[2], isNode=row[3], isLink=row[4], x=row[5], y =row[6])
      for row in cursor.fetchall()
      ]
      print(len(nodes))
      if len(nodes) == 0:
        sql = """INSERT INTO TOPOLOGY_DEW (id, name, disabled, isNode, isLink, x, y) VALUES (?, ?, ?, ?, ?, ?, ?) """
        cursor = cursor.execute(sql, (new_id, new_name, new_disabled, new_isNode, new_isLink, new_x, new_y))
        conn.commit()
      else:
         if nodes[0]['name'] != new_name or nodes[0]['x'] != new_x or nodes[0]['y'] != new_y or nodes[0]['disabled'] != new_disabled:
          sql = """ UPDATE TOPOLOGY_DEW SET name= ?, x= ?, y= ?,disabled= ? WHERE id = ? """
          cursor = conn.execute(sql, (new_name,new_x,new_y,new_disabled,new_id))
          conn.commit()
  return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


if __name__ == "__main__":
  app.run(debug=True)