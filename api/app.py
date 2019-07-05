from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient, TEXT
from langdetect import detect
import json
import utils
import config

connection_str = config.connection_str
db_name = config.db_name

app = Flask(__name__)
cors = CORS(app)
client = MongoClient(connection_str)
db = client.get_database(db_name)

# Text Indexing for Full Text Search
# db.players.create_index([("name", TEXT)])

def player_to_dict(player):
    return {
        'name': player['name'],
        'position': player['position'],
        'nationality': player['nation'],
        'position': player['position'],
        'foot': player['foot'],
        'age': utils.date_to_age(player['birth_date']),
        'profile_img': player['profile_img'],
        'abilities': player['abilities']
    }

@app.route('/', methods = ['GET'])
def index_route():
    return jsonify({
        'author': 'YJ Kim',
        'project': {
            'name': 'Football Manager API',
            'url': 'https://github.com/whyjay17/football_manager_api',
        },
        'endpoints': {
            'get_all_players': '/players',
            'get_player': '/players/{name}',
        }
    })

@app.route("/api/v1/players", methods = ['GET'])
def get_all_players():
    # TODO: Implement pagination
    """
    returns a list of players
    """
    try:
        if request.args:
            if request.args['nation']:
                players = db.players.find({ 'nation': request.args['nation'] })
        else:
            players = db.players.find()
        return jsonify({ 'result': [player_to_dict(player) for player in players]})

    except:
        return jsonify({
            'result': 'failure',
            "error": 400,
            "message": 'Bad Request'}), 400

@app.route("/api/v1/players/<name>", methods = ['GET'])
def get_player(name):
    """
    returns an object of a player given a name
    """
    try:
        # transform query if it's Korean
        if detect(name) == 'ko':
            query = ''
            for ch in name:
                if ch != ' ':
                    query += ch + ' '
            query = query.rstrip()
        else:
            query = name
        players = list(db.players.find({ "$text": { "$search": query }},
               { 'score': { "$meta": "textScore" }}))
        players.sort(key = lambda k: k['score'], reverse = True)
        # Return results based on the input query
        return jsonify({ 'count': len(players), 'result': [player_to_dict(player) for player in players][:4]})

    except:
        return jsonify({
            'result': 'failure', 
            "error": 400, 
            "message": "Bad Request (Double check player's name)"}), 400

if __name__ == '__main__':
    app.run(debug = True)