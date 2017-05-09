# Troy C. Breijaert
# studentnummer: 11587407

import csv
import json
import operator

# initializing of various arrays
Json2010 = []

# opens files
csvFile2010 = open('../DataProcessing/Homework/week 5/Data/KNMI2010.csv', 'r')
jsonFile2010 = open('../DataProcessing/Homework/week 5/Data/KNMI2010.json', 'w')

# reads the CSV file skipping over #
reader2010 = csv.reader(filter(lambda row: row[0]!='#', csvFile2010))

for row in reader2010:
    Json2010.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})

json.dump(Json2010, jsonFile2010)

# close files
csvFile2010.close()
jsonFile2010.close()
##############
