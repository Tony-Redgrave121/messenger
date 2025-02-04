import axios from 'axios'

const $api = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000/",
})

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

export default $api