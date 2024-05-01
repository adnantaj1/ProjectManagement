const { apiRequest } = require('.');

export const RegisterUser = async (payload) => apiRequest('post', '/api/users/register', payload);
export const LoginUser = async (payload) => apiRequest('post', '/api/users/login', payload);
