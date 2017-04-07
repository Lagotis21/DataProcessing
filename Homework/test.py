import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

url = URL("http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series")
dom = DOM(url.download(cached=True))
#print dom.body.content
shows = []
showinfo = {}
for e in dom.by_tag("div.lister-item-content")[:2]:
    showinfo ={ "title": plaintext((e.by_tag("a")[:1])[0].content).encode("utf-8"),
    "name": "bob"}
    shows.append(showinfo)
print shows
