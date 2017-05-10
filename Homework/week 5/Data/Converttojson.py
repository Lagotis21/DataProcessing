# Troy C. Breijaert
# studentnummer: 11587407

import csv
import json

# initializing of various arrays
Json = []

# opens files
csvFile = open('../DataProcessing/Homework/week 5/Data/KNMI2010.csv', 'r')
jsonFile = open('../DataProcessing/Homework/week 5/Data/KNMI2010.json', 'w')

# reads the CSV file skipping over #
reader = csv.reader(filter(lambda row: row[0]!='#', csvFile))

for row in reader:
    Json.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})

json.dump(Json, jsonFile)

# close files
csvFile.close()
jsonFile.close()
