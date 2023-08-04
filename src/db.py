from enum import Enum
import pickle
import random

import uuid, time # delete these

class Result(Enum):
	IGNORE = 0
	WRONG = 1
	CORRECT_BUT_HARD = 2
	CORRECT_BUT_THOUGHT_ABOUT_IT = 3
	CORRECT_AND_IMMEDIATE = 4

class Song:

	def __init__(self, id_str: str, title: str, artists: list[str]):
		self.id = id_str
		self.title = title
		self.artists = artists
		self.priority = 100

	def update(self, result: Result) -> None:
		if result == Result.WRONG:
			self.priority = 100
		elif result == Result.CORRECT_BUT_HARD:
			self.priority = 25
		elif result == Result.CORRECT_BUT_THOUGHT_ABOUT_IT:
			self.priority = 10
		else:
			self.priority = 1

	def to_dict(self) -> dict[str, str]:
		return {
			"id": self.id,
			"title": self.title,
			"artists": ", ".join(self.artists),
			"priority": self.priority
		}

class Storage:

	def __init__(self, songs: list[Song] = None, save_file: str = "state.p"):
		self.songs = songs if songs else []
		self.last_sampled = None
		self.save_file = save_file

	def insert_song(self, id_str: str, title: str, artists: list[str], dedupe=True):
		if dedupe:
			for song in filter(lambda x: x.id == id_str, self.songs):
				return
		self.songs.append(Song(id_str=id_str, title=title, artists=artists))

	def sample(self) -> Song:
		choice = random.choices(population=self.songs, k=1, weights=[song.priority for song in self.songs])[0]
		self.last_sampled = choice
		return choice

	def update(self, result: Result, id_str=None) -> None:
		if result != Result.IGNORE:
			if id_str and id_str == self.last_sampled.id:
				self.last_sampled.update(result)
			else:
				for song in filter(lambda x: x.id == id_str, self.songs):
					song.update(result)
		self.last_sampled = None

	def save(self) -> None:
		with open(self.save_file, "wb") as f:
			pickle.dump({"songs": self.songs, "save_file": self.save_file}, f)

	def load(self, save_file: str):
		with open(save_file, "rb") as f:
			loaded_dict = pickle.load(f)
		self.songs = loaded_dict["songs"]
		self.save_file = loaded_dict["save_file"]
		self.last_sampled = None

	def get_state(self):
		return [song.to_dict() for song in self.songs]

