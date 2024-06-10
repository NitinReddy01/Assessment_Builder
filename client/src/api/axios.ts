import axios from "axios";
const URL =  import.meta.env.VITE_BACKEND_URL;

export default axios.create({
    baseURL:URL,
    // withCredentials:true
})

export const axiosPrivate=axios.create({
    baseURL:URL,
    withCredentials:true
})