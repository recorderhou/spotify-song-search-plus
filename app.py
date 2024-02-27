from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from db import client
import os

app = Flask(__name__)


app.secret_key = os.urandom(24)

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
        session['admin_name'] = admin_name
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
        session['username'] = username
        return jsonify({'success': True, 'redirect_url': url_for('search')})
    else:
        return jsonify({'success': False, 'redirect_url': url_for('wrong_auth')})

@app.route('/modify')
def modify():
    return render_template('modify.html')

@app.route('/wrongauth')
def wrong_auth():
    return render_template('wrong_auth.html')

@app.route('/search')
def search():
    return render_template('search_result.html')

@app.route('/searchresult')
def query():
    key_words = request.args.get('query', default='', type=str)
    print(key_words)
    res = []
    for i in range(4):
        collection = client.distdb0.aggregation_results
        query = {'name': {'$regex': key_words, '$options': 'i'}}
        for document in collection.find(query):
            document['_id'] = str(document['_id'])
            for video in document['video_info']:
                video['_id'] = str(video['_id'])
            print(document)
            res.append(document)
    return jsonify(res)


if __name__ == '__main__':
    app.run(debug=True)
