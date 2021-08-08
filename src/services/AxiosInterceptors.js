import CookiesService from "./CookiesService"
import axios from 'axios';
import { store } from '../redux/store'
import { dispatchLogout } from '../redux/actions/authAction'

const cookiesService = CookiesService.getService()

var loop = 0

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

  async error => {
    const originalRequest = error.config
    if (error.response.config.url === '/api/auth/login') {
      return Promise.reject(error);
    }
    console.log((error.response.status === 400 || error.response.status === 401) && originalRequest.url.includes("/api/auth/refreshToken"))
    if((error.response.status === 400 || error.response.status === 401) && originalRequest.url.includes("/api/auth/refreshToken")){
      cookiesService.clearToken()
      store.dispatch(dispatchLogout())
      window.location.href = "/login"
      return Promise.reject(error)
    }

    else if(error.response.status === 403 && originalRequest.url.includes("/api/auth/refreshToken" && loop > 4)) {
      cookiesService.clearToken()
      store.dispatch(dispatchLogout())
      window.location.href = "/login"
      return Promise.reject(error)
    } 

    else if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      loop += 1
      if(loop > 3) {
        loop = 0
        cookiesService.clearToken()
        store.dispatch(dispatchLogout())
        window.location.href = "/login"
        return Promise.reject(error)
      }

      await axios.post('/api/auth/refreshToken', null, {
        headers: { Authorization: 'Bearer ' + cookiesService.getToken() }
      })
        .then(res => {
          if (res.status === 200) {
            loop = 0
            //1. Put token to cookies
            cookiesService.setToken(res.data.token)
            //2. Change 'Authorization' header
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
            //3. return originalRequest object with Axios
            return axios(originalRequest)
          }
        })
    }
    return Promise.reject(error);
  }
)

