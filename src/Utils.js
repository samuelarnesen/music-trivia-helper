export function generateRandomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

export function getQueryParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

export function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function logErrors(error) {
  if (error.response != null) {
  	console.log(error.response.data);
  	console.log(error.response.status);
  	console.log(error.response.headers);
  }
}