import axios from "axios";
const BASE_URL = 'http://127.0.0.1:8000/auth/';

export const signup = (name, email, password, re_password) => {
  return axios.post(BASE_URL + 'users/', {
    name,
    email,
    password,
    re_password,
  });
};

