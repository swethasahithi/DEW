import sqlite3
from flask import Flask, request, jsonify
import sqlite3
app = Flask(__name__)

def db_connection():
  conn = None
  try:
    conn = sqlite3.connect('dew.sqlite')
  except sqlite3.error as e:
    print(e)
  return conn
    
  


@app.route("/hi", methods=["GET", "POST"])
def hello():
  conn = db_connection()
  cursor = conn.cursor()

  if request.method == 'GET':
    cursor = conn.execute("SELECT * FROM TOPOLOGY")
    nodes = [
      dict(id=row[0], name=row[1], isNode=row[2], isLink=row[3], x=row[4], y =row[5])
      for row in cursor.fetchall()
    ]
    if nodes is not None:
      return jsonify(nodes)

  if request.method == "POST":
    new_name = request.form["name"]
    new_isNode = request.form["isNode"]
    new_isLink = request.form["isLink"]
    new_x = request.form["x"]
    new_y = request.form["y"]
    sql = """INSERT INTO TOPOLOGY (new_name, new_isNode, new_isLink, new_x, new_y) VALUES (?, ?, ?) """
    cursor = cursor.execute(sql, (new_name, new_isNode, new_isLink, new_x, new_y))
    conn.commit()
    return f"Node with id: {cursor.lastrowid} created"


if __name__ == "__main__":
  app.run(debug=True)