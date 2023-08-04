import React, { useState } from 'react';
import axios from 'axios';
import { logErrors } from './Utils';

export const PlaylistTextBoxWithButton = (props) => {

  const { token } = props;

  const [playlistId, setPlaylistId] = useState('');

  const handleTextChange = (event) => {
    setPlaylistId(event.target.value);
  };

  const handleSubmit = async () => {
  	const localHeaders = {
  		'Content-Type': 'application/json'
  	}

    try {
      await axios.post('http://localhost:8080/load', { 'playlist_id': playlistId }, { localHeaders });
    } catch (error) {
    	console.log("Error while loading");
    	logErrors(error);
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    	};

    try {
    	const getPlaylistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    	const spotifyResponse = await axios.get(getPlaylistUrl, { headers });
    	const songs = spotifyResponse.data['items'].map(item => ({'id_str': item['track']['id'], 'title': item['track']['name'], 'artists': item['track']['artists'].map(artist => artist['name'])}));
	   	try {
			await axios.post('http://localhost:8080/add', { songs }, { localHeaders });
		} catch (error) {
			console.log("Error while adding to playlist");
			logErrors(error);
		}

		try {
			await axios.post('http://localhost:8080/save', { }, { localHeaders });
		} catch (error) {
			console.log("Error while saving");
			logErrors(error);
		}
    } catch (error) {
    	console.log("Error while fetching playlist");
    	logErrors(error);
    	throw error;
    }
  };

  return (
    <div>
      <p>Load playlist: </p>
      <input type="text" value={playlistId} onChange={handleTextChange} />
      <button onClick={handleSubmit}>Confirm</button>
    </div>
  );
};