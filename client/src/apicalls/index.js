import axios from 'axios';

export const apiRequest = async (method, url, payload) => {
  try {
    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (err) {
    return err;
  }
};