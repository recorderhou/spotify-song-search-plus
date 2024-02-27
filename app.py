from flask import Flask, render_template
from db import mongo_db

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/login')
def login_function():
    return render_template('login.html')


@app.route('/search')
def query_process():
    return render_template('search_result.html')


@app.route('/admin')
def login_function():
    return render_template('admin.html')


@app.route('/user')
def login_function():
    return render_template('user.html')


if __name__ == '__main__':
    app.run()
