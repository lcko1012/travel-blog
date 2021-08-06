import CookiesService from "./CookiesService"
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { dispatchLogout } from "../redux/actions/authAction";
import store from '../redux/store'



const cookiesService = CookiesService.getService()

axios.interceptors.request.use(
  config => {
    const token = cookiesService.getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

axios.interceptors.response.use((response) => {
  return response
},
  error => {
    const originalRequest = error.config
    if (error.response.config.url === '/api/auth/login') {
      return Promise.reject(error);
    }
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      return axios.post('/api/auth/refreshToken', null, {
        headers: { Authorization: 'Bearer ' + cookiesService.getToken() }
      }).then(res => {
        if (res.status === 200) {
          //1. Put token to cookies
          cookiesService.setToken(res.data.token)
          //2. Change 'Authorization' header
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + cookiesService.getToken()
          //3. return originalRequest object with Axios
          return axios(originalRequest)
        }
      }).catch(() => {
        store.dispatch('logout')
        cookiesService.clearToken()
      }) 
    }

    return Promise.reject(error);
  }
)