import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

url = URL("http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series")
dom = DOM(url.download(cached=True))
#print dom.body.content

shows=[]
info = {}
for e in dom.by_tag("div.lister-item-content")[:2]:
	for a in e.by_tag("p"):
		if "Stars" in a.content:
			print plaintext(a.content).encode("utf-8")
			info = plaintext(a.content).encode("utf-8").strip("Stars:")
			shows.append(info)
print shows

    shows = [{"title": plaintext((e.by_tag("a")[:1])[0].content),
    "rating": plaintext((e.by_tag("strong"))[0].content),
    "genre":  plaintext((e.by_class("genre"))[0].content),
    "actors": "bob","runtime":  plaintext((e.by_class("runtime"))[0].content)} for e in dom.by_tag("div.lister-item-content")]
