import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

export function createInstance(token) {
  return token != null ? axios.create({
    baseURL: SPOTIFY_API_URL,
    timeout: 10000,
    headers: { Authorization: `Bearer ${token}` } // Insert your access token here
  }) : null;
}