#!/usr/bin/env python
# Name: Troy C. Breijaert
# Student number:   11587407
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    shows = []
    showinfo = {}
    # gets the title, rating, genre, actors and runtime, puts those in a dict
    # and puts the dict in an array
    for e in dom.by_tag("div.lister-item-content"):
        for a in e.by_tag("p"):
            if "Stars" in a.content:
                info = plaintext(a.content).encode("utf-8").strip("Stars:")
        title = plaintext((e.by_tag("a")[:1])[0].content)
        rating = plaintext((e.by_tag("strong"))[0].content)
        genre =  plaintext((e.by_class("genre"))[0].content)
        actors = info
        runtime =  plaintext((e.by_class("runtime"))[0].content.strip("min"))

        # creates a dict with the different values
        showinfo = {
                    "title": title, "rating": rating,
                    "genre": genre, "actors": actors,
                    "runtime": runtime,
                   }
        # appends the info into the shows array
        shows.append(showinfo)

    # replace this line as well as appropriate
    return shows


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    # i know i'm using list comprehension here and a for-loop above,
    # blame imbd for not naming their list of actors something like
    # class="actors" instead they chose to name it class=""

    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    [writer.writerow([info["title"].encode('utf-8'), info["rating"],
                    info["genre"], info["actors"], info["runtime"]])
                    for info in extract_tvseries(dom)]


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
