from bson import ObjectId
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from db import client
import os
import requests
from googleapiclient.discovery import build

app = Flask(__name__)


app.secret_key = os.urandom(24)


def h(name):
    if len(name) == 0:
        return 0
    return ord(name[0]) % 4




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
    print(song)
    print(artist)
    collection = client.distdb0.test_delete
    res = []
    query = {'name': {'$regex': song, '$options': 'i'}, 'prim_artist': {'$regex': artist, '$options': 'i'} }
    for document in collection.find(query):
        print(document)
        document['_id'] = str(document['_id'])
        for video in document['video_info']:
            video['_id'] = str(video['_id'])
        if 'lyrics_info' in document.keys():
            for lyrics in document['lyrics_info']:
                lyrics['_id'] = str(lyrics['_id'])
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

# assume we can only modify one entry at a time
@app.route('/modifyquery', methods=['POST', 'GET'])
def modify_query():
    input = request.json
    select_id = input['_id']
    input.pop('_id', None)
    for video in input['video_info']:
        video['_id'] = ObjectId(video['_id'])
    for lyrics in input['lyrics_info']:
        lyrics['_id'] = ObjectId(lyrics['_id'])
    try:
        client.distdb0.test_delete.update_one({'_id': ObjectId(select_id)}, {'$set': input})
        return {'success': True}
    except Exception as e:
        print(str(e))
        return {'success': False, 'message': str(e)}

@app.route('/insert', methods=['POST', 'GET'])
def insert():
    if request.method == 'GET':
        type = request.args.get('type')
        key = request.args.get('key')
        query = request.args.get('query')
        if type == 'song':
            spotify_key = key
            headers = {
                'Authorization': f'Bearer {spotify_key}',
            }
            spotify_query = query
            endpoint = 'https://api.spotify.com/v1/search'
            params = {'q': spotify_query, 'type': 'track'}
            response = requests.get(endpoint, headers=headers, params=params)
            print(response)
            tracks = response.json()['tracks']['items']
            print(tracks)
            return tracks
        elif type == 'video':
            youtube_key = key
            youtube_query = query
            # Set up the YouTube API client
            youtube = build('youtube', 'v3', developerKey=youtube_key)
            response = youtube.search().list(
                q=youtube_query,
                part="snippet",
                type="video",
                maxResults=50  # Specify the number of results you want
            ).execute()
            videos = response['items']
            print(videos)
            return videos
        elif type == 'lyrics':
            geniusKey = key
            headers = {
                'Authorization': f'Bearer {geniusKey}',
            }
            genius_query = query
            endpoint = 'https://api.genius.com'
            search_url = f"{endpoint}/search"
            data = {'q': genius_query}
            response = requests.get(search_url, params=data, headers=headers)
            lyrics = response.json()['response']['hits']
            return lyrics
    elif request.method == 'POST':
        print('inside post')
        input = request.json
        if input['type'] == 'song':
            track = input['track']
            print(track)
            prim_artist = track['artists'][0]['name']
            hash_value = h(prim_artist)
            album = {"id": track['album']['id'], "images": track['album']['images'], "name": track['album']['name'],
                     "release_date": track['album']['release_date']}
            artists = [{"id": art['id'], "name": art['name']} for art in track['artists']]
            song = {"name": track['name'], "artists": artists, "album": album, "popularity": track['popularity'],
                    "explicit": track['explicit'], "type": track['type'], "duration_ms": track['duration_ms'],
                    "preview_url": track['preview_url'], "id": track['id'], "prim_artist": artists[0]['name'], "video_info": [], "lyrics_info": []}
            print(hash_value)
            try:
                if hash_value == 0:
                    client.distdb0.test_insert.insert_one(song)
                elif hash_value == 1:
                    client.distdb1.test_insert.insert_one(song)
                elif hash_value == 2:
                    client.distdb2.test_insert.insert_one(song)
                elif hash_value == 3:
                    client.distdb3.test_insert.insert_one(song)
                return ({'success': True})
            except Exception as e:
                print(str(e))
                return ({'success': False, 'message': str(e)})
        elif input['type'] == 'video':
            track = input['track']
            print(track)
            new_video = input['video']
            new_id = ObjectId()
            insert_video = {
                '_id': new_id,
                'video_id': new_video['id']['videoId'],
                'song_title': new_video['snippet']['title'],
                'artist_name': track['prim_artist']
            }
            print(insert_video)
            try:
                client.distdb0.test_delete.update_one({'_id': ObjectId(track['_id'])}, {'$push': {'video_info': insert_video}},
                                                      upsert=True)
                return ({'success': True})
            except Exception as e:
                print(str(e))
                return ({'success': False, 'message': str(e)})
        elif input['type'] == 'lyrics':
            track = input['track']
            print(track)
            new_lyrics = input['lyrics']
            new_id = ObjectId()
            insert_lyrics = {
                '_id': new_id,
                'title': new_lyrics['result']['full_title'],
                'url': new_lyrics['result']['url'],
                'artist': track['prim_artist']
            }
            print(insert_lyrics)
            try:
                client.distdb0.test_delete.update_one({'_id': ObjectId(track['_id'])}, {'$push': {'lyrics_info': insert_lyrics}},
                                                      upsert=True)
                return ({'success': True})
            except Exception as e:
                print(str(e))
                return ({'success': False, 'message': str(e)})






if __name__ == '__main__':
    app.run(debug=True)
