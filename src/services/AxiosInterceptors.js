import CookiesService from "./CookiesService"
import axios from 'axios';
import { store } from '../redux/store'
import { dispatchLogout } from '../redux/actions/authAction'

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
      console.log(error.response.status)
      originalRequest._retry = true

      axios.post('/api/auth/refreshToken', null, {
        headers: { Authorization: 'Bearer ' + cookiesService.getToken() }
      })
        .then(res => {
          if (res.status === 200) {
            //1. Put token to cookies
            cookiesService.setToken(res.data.token)
            //2. Change 'Authorization' header
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + cookiesService.getToken()
            //3. return originalRequest object with Axios
            return axios(originalRequest)
          }
        })
        .catch(() => {
          cookiesService.clearToken()
          store.dispatch(dispatchLogout())
          window.location.reload()
        })
    }

    return Promise.reject(error);
  }
)