from pytubefix import YouTube

url = "https://www.youtube.com/watch?v=1ziIpehWMiI"

yt = YouTube(url)

for stream in yt.streams.filter(progressive=True):
    print(stream.resolution)

yt.streams.filter(progressive=True, res="360p").first().download()