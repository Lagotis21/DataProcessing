# Troy C. Breijaert
# studentnummer: 11587407

import csv
import json
import operator

# opens files
csvFile = open('..\DataProcessing\Homework\week 3\static\KNMI.csv', 'r')
jsonFile = open('..\DataProcessing\Homework\week 3\static\KNMI.json', 'w')

# reads the CSV file skipping over #
reader = csv.reader(filter(lambda row: row[0]!='#', csvFile))

# initializing of various arrays
Array = []
januari, februari, march, april, may, june, july, august, september, oktober, november, december = ([] for i in range(12))
jsonArr= []

# changes every -1 to 0 as -1 indicates a rainfall of less than 0,05 as per KNMI website
for row in reader:
    if (int(row[2].strip()) == -1):
        Array.append(0)
    else:
        Array.append(int(row[2].strip()))

# appends the monthly average of rain to jsonArr in a valid json format
jsonArr.append({'name': 'januari', 'value': sum([(Array[i]) for i in range(len(Array)) if (i < 31)]) / 31})
jsonArr.append({'name':'februari', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 31 and i < 59)]) / 28})
jsonArr.append({'name':'march', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 59 and i < 90)]) / 31})
jsonArr.append({'name':'april','value': sum([(Array[i]) for i in range(len(Array)) if (i >= 90 and i < 120)]) / 30})
jsonArr.append({'name':'may', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 120 and i < 151)]) / 31})
jsonArr.append({'name':'june','value': sum([(Array[i]) for i in range(len(Array)) if (i >= 151 and i < 181)]) / 30})
jsonArr.append({'name':'july', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 181 and i < 212)]) / 31})
jsonArr.append({'name':'august', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 212 and i < 243 )]) / 31})
jsonArr.append({'name':'september','value': sum([(Array[i]) for i in range(len(Array)) if (i >= 243 and i < 273)]) / 30})
jsonArr.append({'name':'oktober','value': sum([(Array[i]) for i in range(len(Array)) if (i >= 273 and i < 304 )]) / 31})
jsonArr.append({'name':'november', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 304 and i < 334 )]) / 30})
jsonArr.append({'name':'december', 'value': sum([(Array[i]) for i in range(len(Array)) if (i >= 334 and i < 365 )]) / 31})

# dumps the data in the jsonfile
json.dump(jsonArr, jsonFile)

# close files
csvFile.close()
jsonFile.close()
