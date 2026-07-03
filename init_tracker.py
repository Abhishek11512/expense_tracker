import sqlite3

con = sqlite3.connect('expenses.db')
cr = con.cursor()
cr.execute('''CREATE TABLE IF NOT EXISTS expenses (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           item VARCHAR (50),
           amount INTEGER,
           category VARCHAR (50))''')

con.commit()
con.close()
print("TABLE CREATED SUCCESSFULLY!!")