import sqlite3
from sqlite3.dbapi2 import Connection, Cursor

import click
from flask import current_app, g
from flask.cli import with_appcontext

conn = sqlite3.connect("dew.sqlite")

cursor = conn.cursor()
sql_query = """ CREATE TABLE TOPOLOGY_DEW (
    id varchar(1000) PRIMARY KEY,
    name TEXT NOT NULL,
    disabled INT(1),
    isNode INT(1) NOT NULL,
    isLink INT(1) NOT NULL,
    x INT,
    y INT
) """

cursor.execute(sql_query)


