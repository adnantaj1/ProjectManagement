import axios from 'axios';

export const apiRequest = async (method, url, payload) => {
  try {
    const options = {
      method: method,
      url: url,
      headers: {
        // Conditional header setup
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': undefined
      },
    };

    if (payload instanceof FormData) {
      options.data = payload;
      // Do not manually set 'Content-Type' for FormData, let the browser handle it
    } else {
      options.data = payload;
      options.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(options);
    return response.data;
  } catch (err) {
    return err;
  }
};
