import axios from "axios";
import Cookies from 'js-cookie';


const BASE_URL = 'http://127.0.0.1:8000/';
const csrftoken = Cookies.get('csrftoken');


export const usersignup = async (formData) => {
  const response = await axios.post(BASE_URL + 'auth/users/', formData);
  return response; // Return the entire response object
};

export const useractivate = async (uid,token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
  };
  const body = JSON.stringify({ uid, token });
  const response = await axios.post(BASE_URL + 'auth/users/activation/', body,config);
  return response; // Return the entire response object
};

export const userlogin = async (loginData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
  };
  const response = await axios.post(BASE_URL + 'auth/jwt/create/', loginData, config)
  return response; // Return the entire response object
};

export const resetpassword = async (email) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
  };
  const useremail = JSON.stringify({email})
  const response = await axios.post(BASE_URL + 'auth/users/reset_password/', useremail, config)
  return response; // Return the entire response object
};

export const resetpasswordconfirm = async (uid,token,new_password,re_new_password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
  };
  const body = JSON.stringify({ uid, token,new_password,re_new_password });
  const response = await axios.post(BASE_URL + 'auth/users/reset_password_confirm/', body,config);
  return response; // Return the entire response object
};

export const changePassword = async (access, current_password,new_password,re_new_password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
      'Authorization': `JWT ${access}`
    },
  };

  const body = JSON.stringify({ current_password,new_password,re_new_password });
  const response = await axios.post(BASE_URL + 'auth/users/set_password/', body,config);
  return response; // Return the entire response object
};

export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    return true;
  }
  return false;
};

export const checkEmail = async(email)=>{
  const response = await axios.get(BASE_URL + `api/${email}/`);
  return response; 
}
export const load_user = async() => {
  const access = localStorage.getItem('access');
      const config = {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${access}`,
              'Accept': 'application/json'
          }
      }; 

      try {
          const response = await axios.get(BASE_URL + 'auth/users/me/', config) 
          return response     
      }catch (err) {
          
      }

};

export const getImages = async () => {
  try {
    const response = await axios.get(BASE_URL + 'api/images/');
    const data = response.data; // Corrected from response.JSON to response.data
    return data;
  } catch (error) {
    throw new Error('Failed to fetch images: ' + error.message);
  }
};
