import axios from 'axios';
import { generateRandomString, getQueryParam, base64Encode, logErrors} from "./Utils";

var client_id = '?' // fill this in
var client_secret = '?'; // fill this in
var redirect_uri = 'http://localhost:8000';

const scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-private';

export async function getToken(token) {

  if (token != null) {
    return token;
  }

  var code = getQueryParam('code');
  var state = getQueryParam('state');

  if (state === null) {
    // handling of error redirection can be done using `window.location.replace`
    let errorURL = '/#' + new URLSearchParams({ error: 'state_mismatch' }).toString();
    window.location.replace(errorURL);
  } else {
    const data = new URLSearchParams();
    data.append('code', code);
    data.append('redirect_uri', redirect_uri);
    data.append('grant_type', 'authorization_code');

    const headers = {
      'Authorization': 'Basic ' +  base64Encode(client_id + ':' + client_secret),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
      if (token == null) {
        const response = await axios.post('https://accounts.spotify.com/api/token', data.toString(), { headers: headers });
        return response.data['access_token'];
      } else {
        return token;
      }
    } catch (error) {
      if (token != null) {
        return token;
      }
      console.log("Error while fetching token");
      if (error.response) {
        logErrors(error);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
  }
}


function SpotifyLogin(props) {

  const { token } = props;

  function handleLogin() {

    var state = generateRandomString(16); // Implement this function
    var params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', client_id);
    params.append('scope', scope);
    params.append('redirect_uri', redirect_uri);
    params.append('state', state);
    var url = 'https://accounts.spotify.com/authorize?' + params.toString();
    if (token == null) {
      window.location.replace(url);
    }
  }
  return <button onClick={handleLogin}>Login with Spotify</button>
}

/////
export default SpotifyLogin;