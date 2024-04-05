from bson import ObjectId
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
        if user['password'] == password:
            session['username'] = username
            return jsonify({'success': True, 'redirect_url': url_for('search')})
        else:
            return jsonify({'success': False, 'redirect_url': url_for('wrong_auth')})
    else:
        client.distdb0.user.insert_one({'username': username, 'password': password})


@app.route('/session_data')
def get_session_data():
    print(session)
    if 'username' in session:
        return jsonify({'username': session['username'], 'admin_name': None})
    elif 'admin_name' in session:
        return jsonify({'username': None, 'admin_name': session['admin_name']})
    return jsonify({'username': None, 'admin_name': None})


@app.route('/rating', methods=['POST', 'GET'])
def get_rating():
    if request.method == 'GET':
        cur_user = client.distdb0.user.find_one({'username': session['username']})
        print('user in get', cur_user['rating'])
        if 'rating' in cur_user:
            return jsonify({'rating': cur_user['rating']})
        else:
            return jsonify({'rating': []})
    elif request.method == 'POST':
        new_rating = request.json
        cur_user = client.distdb0.user.find_one({'username': session['username']})
        print('find user', cur_user)
        print('new rating', new_rating)
        if 'rating' in cur_user:
            cur_rating = cur_user['rating']
            past_songs = [str(rate['song_id']) for rate in cur_rating]
            if new_rating['song_id'] in past_songs:
                index = past_songs.index(new_rating['song_id'])
                cur_rating[index]['rating'] = new_rating['rating']
            else:
                cur_rating.append(new_rating)
        else:
            cur_rating = [new_rating]
        try:
            client.distdb0.user.update_one({'username': session['username']}, {'$set': {'rating': cur_rating}}, upsert=True)
            return jsonify({'success': True})
        except:
            return jsonify({'success': False})


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


@app.route('/adminquery')
def delete_query():
    song = request.args.get('song', default='', type=str)
    artist = request.args.get('artist', default='', type=str)
    collection = client.distdb0.test_delete
    res = []
    query = {'name': {'$regex': song, '$options': 'i'}, 'prim_artist': {'$regex': artist, '$options': 'i'} }
    for document in collection.find(query):
        document['_id'] = str(document['_id'])
        for video in document['video_info']:
            video['_id'] = str(video['_id'])
        res.append(document)
    return jsonify(res)


@app.route('/delete', methods=['POST', 'GET'])
def delete():
    deletion = request.json
    print(deletion)
    try:
        deletion_id = ObjectId(deletion['_id'])
        client.distdb0.test_delete.delete_one({'_id': deletion_id})
        return ({'success': True})
    except:
        return ({'success': False})




if __name__ == '__main__':
    app.run(debug=True)
