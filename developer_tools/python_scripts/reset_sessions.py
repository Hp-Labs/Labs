from src.lib.db import getDb
db = getDb()
db.prepare("DELETE FROM lab_sessions").run()
print("Cleared all lab sessions!")
