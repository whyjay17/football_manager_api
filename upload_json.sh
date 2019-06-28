#!/bin/bash
mongoimport --host <PRIMARY_CLUSTER> --db <DB_NAME> --collection players --type json --file <PATH_TO_JSON_FILE> --jsonArray --authenticationDatabase admin --ssl --username <USERNAME> --password <PASSWORD>
