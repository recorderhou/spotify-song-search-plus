from flask import Flask, render_template, request, redirect, url_for, jsonify
from db import client
import requests

app = Flask(__name__)


@app.route('/')
def login():
    return render_template('login.html')





@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/user')
def user():
    return render_template('user.html')


@app.route('/adminauth', methods=['POST', 'GET'])
def admin_auth():
    admin_login = request.json
    admin_name = admin_login['admin_name']
    password = admin_login['password']
    print(admin_name, password)
    admin = client.distdb0.adminuser.find_one({'admin_name': admin_name, 'password': password})
    if admin:
        return jsonify({'success': True, 'redirect_url': url_for('modify')})
    else:
        return jsonify({'success': False, 'redirect_url': url_for('wrong_auth')})


@app.route('/userauth', methods=['POST', 'GET'])
def user_auth():
    user_login = request.json
    username = user_login['username']
    password = user_login['password']
    print(username, password)
    user = client.distdb0.user.find_one({'username': username, 'password': password})
    if user:
        print('correct')
        return jsonify({'success': True, 'redirect_url': url_for('query')})
    else:
        return jsonify({'success': False, 'redirect_url': url_for('wrong_auth')})

@app.route('/modify')
def modify():
    return render_template('modify.html')

@app.route('/wrongauth')
def wrong_auth():
    return render_template('wrong_auth.html')

@app.route('/search')
def query():
    return render_template('search_result.html')


if __name__ == '__main__':
    app.run(debug=True)
