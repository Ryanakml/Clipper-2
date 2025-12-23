from pytubefix import YouTube

url = "https://www.youtube.com/watch?v=donDxq9Eg-s&pp=ygUQcG9kY2FzdCAzMCBtZW5pdA%3D%3D"

yt = YouTube(url)

for stream in yt.streams.filter(progressive=True):
    print(stream.resolution)

yt.streams.filter(progressive=True, res="360p").first().download()