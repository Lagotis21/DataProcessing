import csv
import json

csvFile = open('..\DataProcessing\Homework\week 3\KNMI.csv', 'r')
jsonFile = open('..\DataProcessing\Homework\week 3\KNMI.JSON', 'w')
reader = csv.reader(filter(lambda row: row[0]!='#', csvFile))
for row in reader:
    json.dump({'date': row[1].strip(), 'rainfall':row[2].strip()}, jsonFile)
    jsonFile.write('\n')
csvFile.close()
jsonFile.close()
