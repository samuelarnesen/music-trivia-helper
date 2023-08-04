import React, { useState } from 'react';
import { SongContainer, ResultButtonRow } from './SpotifyTracks';

import "./Game.css"

export const Game = (props) => {
	const {token, setTrackId, trackId } = props;

	const [showSong, setShowSong] = useState(false);
	const [showResultsBar, setShowResultsBar] = useState(false);

	return (
      <div class="centered-flexbox">
      	  <div>
          	<SongContainer token={token} setTrackId={setTrackId} showSong={showSong} setShowSong={setShowSong} setShowResultsBar={setShowResultsBar}/>
          </div>
          <div>
          	<ResultButtonRow trackId={trackId} setShowSong={setShowSong} showResultsBar={showResultsBar} setShowResultsBar={setShowResultsBar}/>
          </div>
      </div>
	);
}