import spotipy
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials
import requests
import json
cid = '35420352b585478bb8989149b70c39df'
secret = '2c4419a4019541259766a0c459fd803d'
access_token = 'BQBKuXKfIDe0DjrNNdjZRMYDjCd-yL7mee2BKJSGL-AmAnl4dHKdjvfQFOUOdDTlbHFcIEYzxvYyDcAcu7w8ewC3u7NiyXhzIbcD6gciWVVnVff-iEM'

headers = {
    'Authorization': f'Bearer {access_token}',
}

# Spotify API endpoint
endpoint = 'https://api.spotify.com/v1/search'

# Define your search parameters
params = {
    'q': 'year:2022-2024',
    'type': 'track',
    'limit': 50,
    'offset': 0
}

total_song = 0

# Make the GET request
while total_song < 1000000:
    response = requests.get(endpoint, headers=headers, params=params)
    print(response.json())
    break