import urllib.request, json
url = 'https://en.wikipedia.org/w/api.php?action=query&titles=Avengers:_Doomsday|Dune:_Part_Two|The_Odyssey_(film)&prop=pageimages&format=json&pithumbsize=500'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req).read().decode('utf-8')
data = json.loads(resp)
pages = data['query']['pages']
for k, v in pages.items():
    if 'thumbnail' in v:
        print(f"{v['title']}: {v['thumbnail']['source']}")
    else:
        print(f"{v['title']}: no image")
