const API_BASE_URL_DEVELOPMENT = 'https://localhost:7105';
const API_BASE_URL_RPODUCTION = 'https://group8-teamproject1.azurewebsites.net';

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? API_BASE_URL_DEVELOPMENT : API_BASE_URL_RPODUCTION;

const ENDPOINTS = {
  POST_API_ACCOUNT_SIGNIN: `${API_BASE_URL}/api/account/signin/`,
  POST_API_ACCOUNT_SIGNUP: `${API_BASE_URL}/api/account/signup/`

};

export default ENDPOINTS;
