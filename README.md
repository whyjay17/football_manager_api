# Football Manager API
An unofficial API for Football Manager

# API Usage
## API Base URL: http://fm-api-heroku.herokuapp.com

# Endpoints Summary
- GET: `/players/<name>`
  - Sample Usage: `GET http://fm-api-heroku.herokuapp.com/api/v1/players/Son%20Heung%20Min`
  - Sample Result:
  ```
  {
  "count": 1, 
  "result": [
    {
      "abilities": {
        "mental": {
          "Aggression": 8, 
          "Anticipation": 13, 
          "Bravery": 6, 
          "Composure": 13, 
          "Concentration": 11, 
          "Decisions": 13, 
          "Determination": 13, 
          "Flair": 13, 
          "Leadership": 5, 
          "Off The Ball": 17, 
          "Positioning": 7, 
          "Teamwork": 15, 
          "Vision": 12, 
          "Work Rate": 16
        }, 
        "physical": {
          "Acceleration": 15, 
          "Agility": 14, 
          "Balance": 11, 
          "Jumping Reach": 10, 
          "Natural Fitness": 16, 
          "Pace": 15, 
          "Stamina": 16, 
          "Strength": 10
        }, 
        "technical": {
          "Corners": 11, 
          "Crossing": 13, 
          "Dribbling": 15, 
          "Finishing": 16, 
          "First Touch": 12, 
          "Free Kick": 10, 
          "Heading": 11, 
          "Long Shots": 16, 
          "Long Throws": 6, 
          "Marking": 5, 
          "Passing": 12, 
          "Penalty Taking": 13, 
          "Tackling": 6, 
          "Technique": 15
        }
      }, 
      "age": 26, 
      "foot": "Either", 
      "name": "Son Heung-Min", 
      "nationality": "South Korea KOR", 
      "position": "M (R), AM (RL), ST (C)", 
      "profile_img": "https://fmdataba.com/images/p/4592.png"
      }
    ]
  }
  ```
  - GET: `/alternatives/<name>`
  - Explanation: Given a player name, retrieves lists of players similar to the given player.
  - Fields:
    - name: name of the given player
    - close: top 4 players with similar ability stat sum
    - upper: top 4 better alternatives
    - lower: top 4 worse alternatives
  - Sample Usage: `GET http://fm-api-heroku.herokuapp.com/api/v1/alternatives/Harry%20Maguire`
  - Sample Result:
  ```
  {
    "result": [
      {
        "close": [
          "Gary Cahill",
          "Dante",
          "Gabriel Paulista",
          "Kalidou Koulibaly"
        ],
        "lower": [
          "Davinson Sánchez",
          "Laurent Koscielny",
          "Mamadou Sakho",
          "James Tarkowski"
        ],
        "name": "Harry Maguire",
        "upper": [
          "Gerard Piqué",
          "Leonardo Bonucci",
          "Sergio Ramos",
          "Nicolás Otamendi"
        ]
      }
    ]
  }
  ```
  - More to come
 
# Features
- Covers up to 30K player data (currently 8K)
- MongoDB Full Text Search (case insensitive)
- Accepts Korean Query (e.g. GET http://fm-api-heroku.herokuapp.com/api/v1/players/손흥민)
- Provides lists of similar players

## Future Plans
- Filter by parameters (nationality, position, foot, etc.)
- Sort by ability (e.g. Get Top 5 players with the highest Passing ability)

# Usage
- [FMcouter](https://github.com/whyjay17/football_manager_api/tree/master/use_case/FMcouter)
- [FMcouter_KOR (펨카우터)](https://github.com/whyjay17/football_manager_api/tree/master/use_case/FMcouter_KOR)
- [Discord Bot](https://github.com/whyjay17/football_manager_api/tree/master/use_case/discord_bot)

# How to Run
```
$ pip install -r requirements.txt
$ python api/app.py
