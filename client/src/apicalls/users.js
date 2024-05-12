const { apiRequest } = require('.');

export const RegisterUser = async (payload) => apiRequest('post', '/api/users/register', payload);
export const LoginUser = async (payload) => apiRequest('post', '/api/users/login', payload);
export const GetLoggedInUser = async () => apiRequest('get', '/api/users/me');
export const CheckEmailExistence = async (email) => apiRequest('post', '/api/users/check-email', { email });