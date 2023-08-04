from fastapi import FastAPI
from pydantic import BaseModel
from db import Storage, Song, Result
from fastapi.middleware.cors import CORSMiddleware

import os

class UpdateParams(BaseModel):
	id_str: str
	result: Result

class LoadParams(BaseModel):
	playlist_id: str

class SongParams(BaseModel):
	id_str: str
	title: str
	artists: list[str]

class AddParams(BaseModel):
	songs: list[SongParams]

app = FastAPI()

storage = Storage()

origins = [
    "http://localhost:8000",  # Allow only this origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
	return {"message": "Hello World"}

@app.get("/sample")
async def sample():
	song = storage.sample()
	print("sampling song from", storage.save_file)
	return song.to_dict()

@app.post("/update")
async def update(update: UpdateParams):
	storage.update(result=update.result, id_str=update.id_str)
	return {}

@app.post("/load")
async def load(load: LoadParams):
	expected_name = f"../save_files/{load.playlist_id}.p"
	print("expected name is", expected_name)
	if os.path.exists(expected_name):
		storage.load(save_file=expected_name)
	else:
		storage.save_file = expected_name
	print("sampling song from", storage.save_file)
	return {}

@app.post("/add")
async def add(add: AddParams):
	for song in add.songs:
		storage.insert_song(id_str=song.id_str, title=song.title, artists=song.artists, dedupe=True)
	return {}

@app.post("/save")
async def save():
	print("saving to " + storage.save_file)
	storage.save()
	return {}

@app.get("/display")
async def display():
	return {"state": storage.get_state()}


	
