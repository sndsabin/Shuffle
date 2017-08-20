import axios from 'axios';

export function get(url, params) {
  // Get Request
  return axios({
    method: 'GET',
    url: url,
    params: params
  });


}



