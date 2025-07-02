import axios from "axios";

// Create axios instance for Laravel API
const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`, // Correct way in Vite
});
  

// Add request interceptor
instance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem('token');
      const tokenType = localStorage.getItem('token_type');

      if(config.url == '/api/storeCandidates'){
        if (token) {
          config.headers = {
              
              'Authorization': `${tokenType} ${token}`,
              'Accept': 'application/json',
            };
            
        }
      }else if (token) {
        config.headers = {
            
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };
          
      }
  
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  

// Add response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Export API methods
export const GET = (url, config) =>
  instance.get(url, config).catch((error) => error?.response);

export const POST = (url, data, config) =>
  instance.post(url, data, config).catch((error) => error?.response);
