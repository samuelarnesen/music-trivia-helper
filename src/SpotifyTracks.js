import React, { useState } from 'react';
import axios from 'axios';
import { logErrors } from "./Utils";
import "./SpotifyTracks.css";


const saveProgress = () => {
   const localHeaders = {
      'Content-Type': 'application/json'
    }
    axios.post('http://localhost:8080/save', { }, { localHeaders })
      .then((response) => {
        console.log("Successfully saved progress");
      }).catch((error) => {
        console.log("Error while saving progress");
        logErrors(error);
    });
}

export const CurrentlyPlayingSpotifyTrack = (props) => {
  const [track, setTrack] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const [previousCounter, setPreviousCounter] = useState(-1);

  const { token, counter, setTrackId } = props;

  if (token !== null && previousCounter !== counter) {

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const url = "https://api.spotify.com/v1/me/player/currently-playing";

    axios.get(url, { headers })
      .then(response => {
        setTrack(response.data.item);
        setTrackId(response.data.item.id);
        setShouldShow(true);
      })
      .catch(error => {
        console.log("Error while fetching tracks");
        logErrors(error);
      });

    setPreviousCounter(counter);
  }

return (
  <div>
    {
      shouldShow && 
      <div>
        <h3> Current Song</h3>
          <div>
            <h1> {track.name}</h1>
            <p> 
              {track.artists.map(artist => artist.name).join(', ')}
            </p>
          </div>
      </div>
    }
  </div>
  );
}

export const ClearButton = (props) => {
  const { setShowSong } = props;

  const clear = () => {
    setShowSong(false);
  }

  return (
    <div>
      {<button onClick={clear}>Clear</button>}
    </div>
  );

}


export const SongContainer = (props) => {
  const { token, setTrackId, showSong, setShowSong, setShowResultsBar } = props;
  const [counter, setCounter] = useState(0);

  const queueSong  = (songProps) => {
    const {token, trackId} = songProps;
    const url = "https://api.spotify.com/v1/me/player/queue";

    const data = new URLSearchParams();
    data.append('uri', 'spotify:track:' + trackId); // Annihilate by Metro Boomin'

    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    axios.post(url + "?" + data.toString(), {}, { headers: headers })
      .then(response => {
        console.log("Successfully queued song");
      }).catch(error => {
        console.log("Error queueing song with data", data.toString());
        logErrors(error);
      })
  }

  const queueNextSong = async () => {
    const localHeaders = {
      'Content-Type': 'application/json'
    }
    axios.get('http://localhost:8080/sample', { localHeaders })
      .then((response) => {
        queueSong({'token': token, 'trackId': response.data['id']});
      }).catch((error) => {
        console.log("Error queueing next song");
        logErrors(error);
      })
  }

  const revealSong = () => {
    setShowSong(true);
    queueNextSong();
    setShowResultsBar(true);
    setCounter(counter + 1);
  }

  return (
    <div class="centered-flexbox">
      <div>
        {showSong && <CurrentlyPlayingSpotifyTrack token={token} counter={counter} setTrackId={setTrackId}/>}
      </div>
      <div style={{display: 'flex'}}>
        {<button onClick={revealSong}>Reveal Song</button>}
        {showSong && <ClearButton setShowSong={setShowSong}/>}
      </div>  
    </div>
  );
}

export const ResultButton = (props) => {
  const {trackId, result, resultText, setShowSong, setShowResultsBar} = props;

  const reportResult = () => {
    const localHeaders = {
      'Content-Type': 'application/json'
    }
    axios.post('http://localhost:8080/update', {'id_str': trackId, 'result': result}, localHeaders)
      .then((response) => {
        console.log("Successfully recorded a response of", result);
        setShowSong(false);
        setShowResultsBar(false);
        saveProgress();
      }).catch((error) => {
        console.log(`Failed to update a result of ${result} for trackId ${trackId}`);
        logErrors(error);
      });
  }

  return (
    <div>
      {<button onClick={reportResult}>{resultText}</button>}
    </div>
  );
}

export const ResultButtonRow = (props) => {
  const {trackId, setShowSong, showResultsBar, setShowResultsBar} = props;
  return (
    <>
      { showResultsBar &&
        <div style={{display: 'flex'}}>
          <ResultButton trackId={trackId} result={0} resultText={"Ignore"} setShowSong={setShowSong} setShowResultsBar={setShowResultsBar}/>
          <ResultButton trackId={trackId} result={1} resultText={"Incorrect"} setShowSong={setShowSong} setShowResultsBar={setShowResultsBar}/>
          <ResultButton trackId={trackId} result={2} resultText={"Hard"} setShowSong={setShowSong} setShowResultsBar={setShowResultsBar}/>
          <ResultButton trackId={trackId} result={3} resultText={"Medium"} setShowSong={setShowSong} setShowResultsBar={setShowResultsBar}/>
          <ResultButton trackId={trackId} result={4} resultText={"Easy"} setShowSong={setShowSong} setShowResultsBar={setShowResultsBar}/>
        </div>
      }
    </>
  );
}

export const SaveProgressButton = () => {
  return (
    <div>
      {<button onClick={saveProgress}>Save Progress</button>}
    </div>
  );
}

