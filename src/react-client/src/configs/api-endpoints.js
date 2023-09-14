const API_BASE_URL_DEVELOPMENT = 'https://localhost:7105';
const API_BASE_URL_RPODUCTION = 'https://group8-teamproject1.azurewebsites.net/';

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? API_BASE_URL_DEVELOPMENT : API_BASE_URL_RPODUCTION;

const ENDPOINTS = {
  POST_API_ACCOUNT_LOGIN: `${API_BASE_URL}/api/account/login/`
};

export default ENDPOINTS;
