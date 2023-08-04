import React, { useEffect, useState } from 'react';
import { SaveProgressButton } from './SpotifyTracks';
import SpotifyLogin, { getToken } from "./SpotifyLogin"
import { Game } from "./Game";
import { getQueryParam, logErrors } from "./Utils";
import { PlaylistTextBoxWithButton } from "./Playlist.js"

function App() {

  const [token, setToken] = useState(null);
  const [showComponent, setShowComponent] = useState(false);
  const [trackId, setTrackId] = useState(null);

  useEffect(() => {
    if (getQueryParam("code") != null && getQueryParam("state") != null && token == null) {
      getToken(token)
        .then((res) => {
          if (res != null) {
            setToken(res);
          }
      }).catch((error) => {
        console.log("Error while getting token", error);
        logErrors(error);
      });
    }}, [token]);

  useEffect(() => {
      if (token != null) {
        setShowComponent(true);
      }
    }, [token]);

  return (
    <div className="App">
      {!showComponent &&<SpotifyLogin token={token}/>}
      {(showComponent || token != null) && <Game token={token} setTrackId={setTrackId} trackId={trackId}/>}
      {(showComponent || token != null) && <PlaylistTextBoxWithButton token={token} />}
      {(showComponent || token != null) && <SaveProgressButton />}
    </div>
  );
}

export default App;
