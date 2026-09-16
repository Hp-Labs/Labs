import sqlite3
import os

db_path = os.path.join(os.getcwd(), 'data', 'hplabs.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("SELECT id, username, xp FROM users")
print(c.fetchall())
