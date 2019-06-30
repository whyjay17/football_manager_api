from flask import Flask, jsonify, request
from pymongo import MongoClient
import json
import utils
import config

connection_str = config.connection_str
db_name = config.db_name

app = Flask(__name__)
client = MongoClient(connection_str)
db = client.get_database(db_name)

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

@app.route("/api/v1/players", methods = ['GET'])
def get_all_players():
    # TODO: Implement pagination
    """
    returns a list of players
    """
    try:
        players = db.players.find()
        return jsonify({'result': [player_to_dict(player) for player in players]})

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
        player = db.players.find_one({'name': name})
        return jsonify({'result': player_to_dict(player)})

    except:
        return jsonify({
            'result': 'failure', 
            "error": 400, 
            "message": "Bad Request (Double check player's name)"}), 400


app.run()