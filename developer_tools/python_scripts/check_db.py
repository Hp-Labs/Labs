import sqlite3

conn = sqlite3.connect('C:/Users/VIJAY/.gemini/antigravity/hplabs.db')
c = conn.cursor()
c.execute("SELECT id, username, xp FROM users")
print(c.fetchall())
