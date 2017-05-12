# Troy C. Breijaert
# studentnummer: 11587407

import csv
import json

# initializing of various arrays
Json1 = []
Json2 = []
Json3 = []
Json4 = []
Json5 = []
Json6 = []
Json7 = []

# opens files
csvFile1 = open('../DataProcessing/Homework/week 5/Data/KNMI2010.csv', 'r')
csvFile2 = open('../DataProcessing/Homework/week 5/Data/KNMI2011.csv', 'r')
csvFile3 = open('../DataProcessing/Homework/week 5/Data/KNMI2012.csv', 'r')
csvFile4 = open('../DataProcessing/Homework/week 5/Data/KNMI2013.csv', 'r')
csvFile5 = open('../DataProcessing/Homework/week 5/Data/KNMI2014.csv', 'r')
csvFile6 = open('../DataProcessing/Homework/week 5/Data/KNMI2015.csv', 'r')
csvFile7 = open('../DataProcessing/Homework/week 5/Data/KNMI2016.csv', 'r')
jsonFile = open('../DataProcessing/Homework/week 5/Data/KNMICOMBO.json', 'w')

# reads the CSV file skipping over #
reader1 = csv.reader(filter(lambda row: row[0]!='#', csvFile1))
reader2 = csv.reader(filter(lambda row: row[0]!='#', csvFile2))
reader3 = csv.reader(filter(lambda row: row[0]!='#', csvFile3))
reader4 = csv.reader(filter(lambda row: row[0]!='#', csvFile4))
reader5 = csv.reader(filter(lambda row: row[0]!='#', csvFile5))
reader6 = csv.reader(filter(lambda row: row[0]!='#', csvFile6))
reader7 = csv.reader(filter(lambda row: row[0]!='#', csvFile7))

for row in reader1:
    Json1.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})
for row in reader2:
    Json2.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})
for row in reader3:
    Json3.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})
for row in reader4:
    Json4.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})
for row in reader5:
    Json5.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})
for row in reader6:
    Json6.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})
for row in reader7:
    Json7.append({'date':row[1].strip(), 'minimum': row[3].strip(), 'maximum': row[4].strip(), 'average': row[2].strip()})

json.dump({2010:Json1, 2011:Json2, 2012:Json3, 2013:Json4, 2014:Json5, 2015:Json6, 2016:Json7}, jsonFile)

# close files
csvFile1.close()
csvFile2.close()
csvFile3.close()
csvFile4.close()
csvFile5.close()
csvFile6.close()
csvFile7.close()
jsonFile.close()
