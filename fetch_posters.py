import urllib.request, json, os

movies = {
    'movies_avengers.png': 'Avengers',
    'movies_dune.png': 'Dune',
    'movies_odyssey.png': 'The Odyssey'
}

for filename, title in movies.items():
    try:
        url = f'http://www.omdbapi.com/?t={title.replace(" ", "+")}&apikey=trilogy'
        resp = urllib.request.urlopen(url).read().decode('utf-8')
        poster_url = json.loads(resp).get('Poster')
        if poster_url and poster_url != 'N/A':
            print(f"Downloading {title} from {poster_url}")
            urllib.request.urlretrieve(poster_url, f'images/events/{filename}')
            print(f"Saved to images/events/{filename}")
        else:
            print(f"No poster found for {title}")
    except Exception as e:
        print(f"Error for {title}: {e}")
