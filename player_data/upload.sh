#!/bin/bash
#for f in *.json
#do
#echo "Processing $f file...";
#mongoimport --host fm-api-shard-00-00-1fvjl.mongodb.net:27017 --db players_db --collection players --type json --file $f --authenticationDatabase admin --ssl --username yjkimb --password wjfwjsahem15
#done

for file in *; do 
    if [ -f "$file" ]; then 
        echo "$file"
        mongoimport --host fm-api-shard-00-00-1fvjl.mongodb.net:27017 --db players_db --collection players --type json --file "$file" --authenticationDatabase admin --ssl --username yjkimb --password wjfwjsahem15
    fi 
done