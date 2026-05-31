
import axios from 'axios';
import React from 'react';



const axiosSecure = axios.create({
  baseURL: 'https://mis-information-server-api.vercel.app'
});


const UseAxiosSecure = () => {
    return axiosSecure
};

export default UseAxiosSecure;
