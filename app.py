import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
@app.route('/')
def main():
    return render_template('index.html')

@app.route('/api/expense', methods=['GET'])
def get_exp():
    con = sqlite3.connect('expenses.db')
    cr = con.cursor()
    cr.execute('''SELECT id, item, amount, category from expenses''')
    all_exp = cr.fetchall()
    con.close()
    exp_list = [{"id" : exp[0], "item" : exp[1], "amount": exp[2], "category": exp[3]} for exp in all_exp]
    total = sum(exp["amount"] for exp in exp_list)
    otp = {"expenses": exp_list, "total": total}
    return jsonify(otp)

@app.route('/api/add_expense', methods=['POST'])
def add_exp():
    data = request.get_json()
    item = data.get("item")
    amount = data.get("amount")
    category = data.get("category")
    con = sqlite3.connect('expenses.db')
    cr = con.cursor()
    cr.execute('''INSERT INTO expenses (item, amount, category) VALUES (?, ?, ?)''', (item, amount, category))
    con.commit()
    con.close()
    return jsonify({"message": "DATA WRITTEN SUCCESSFULLY!"}), 201

@app.route('/api/delete_expense', methods=['POST'])
def del_exp():
    data = request.get_json()
    expense_id = data.get("id")

    if expense_id:
        con = sqlite3.connect('expenses.db')
        cr = con.cursor()
        cr.execute('''DELETE FROM expenses WHERE id =?''', (expense_id,))
        con.commit()
        con.close()
        return jsonify({"message": "Expense Record Removed Successfully!"}), 200
    return jsonify({"error": "No ID provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)