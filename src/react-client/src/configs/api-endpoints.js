const API_BASE_URL_DEVELOPMENT = 'https://localhost:7105';
const API_BASE_URL_RPODUCTION = 'https://group8-teamproject1.azurewebsites.net';

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? API_BASE_URL_DEVELOPMENT : API_BASE_URL_RPODUCTION;

const ENDPOINTS = {
  POST_API_ACCOUNT_SIGNIN: `${API_BASE_URL}/api/account/signin/`,
  POST_API_ACCOUNT_SIGNUP: `${API_BASE_URL}/api/account/signup/`,
  POST_API_ACCOUNT_SIGNOUT: `${API_BASE_URL}/api/account/signout`,
  POST_API_ACCOUNT_EXTERNAL_SIGNUP: `${API_BASE_URL}/api/account/external-signup/`,
  GET_API_ACCOUNT_AUTHENTICATE: `${API_BASE_URL}/api/account/authenticate/`,
  POST_API_ACCOUNT_CONFIRM_EMAIL: `${API_BASE_URL}/api/account/confirm-email`,

  POST_API_SCORE_ADD_SCORE: `${API_BASE_URL}/api/score/add-score/`,
};

export default ENDPOINTS;
