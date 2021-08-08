import CookiesService from "./CookiesService"
import axios from 'axios';
import { store } from '../redux/store'
import { dispatchLogout } from '../redux/actions/authAction'

const cookiesService = CookiesService.getService()
let isRefreshing = false;
let refreshSubscribers = [];

axios.interceptors.request.use(
  config => {
    const accessToken = cookiesService.getToken()
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// axios.interceptors.response.use((response) => {
//   return response
// },

//   async error => {
//     const originalRequest = error.config
//     if (error.response.config.url === '/api/auth/login') {
//       return Promise.reject(error);
//     }
//     console.log("ra ngoài")
//     console.log(error.response)
//     if((error.response.status === 400 ) && originalRequest.url.includes("/api/auth/refreshToken")){
//       console.log("error: logout")
//       cookiesService.clearToken()
//       store.dispatch(dispatchLogout())
//       // window.location.href = "/login"
//       return Promise.reject(error)
//     }
//     else if (error.response.status === 403 && !originalRequest._retry) {
//       originalRequest._retry = true
//       console.log("token: " + cookiesService.getToken())
//       return axios.post('/api/auth/refreshToken', null, {
//         headers: { Authorization: 'Bearer ' + cookiesService.getToken() }
//       })
//         .then(res => {
//           if (res.status === 200) {
//             //1. Put token to cookies
//             cookiesService.setToken(res.data.token)
//             //2. Change 'Authorization' header
//             axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
//             //3. return originalRequest object with Axios
//             return axios(originalRequest)
//           }
//         })
//     }
//     return Promise.reject(error);
//   }
// )
const refreshAccessToken = () => {
  return axios.post("/api/auth/refreshToken", null, {
    headers:  { Authorization: 'Bearer ' + cookiesService.getToken() }
  })
}

axios.interceptors.response.use(response => {
  return response;
}, error => {
  const { config, response: { status } } = error;
  const originalRequest = config;
  if((status === 400 || status === 403) && originalRequest.url.includes("/api/auth/refreshToken")) {
    cookiesService.clearToken()
    store.dispatch(dispatchLogout())
    window.location.href = "/login"
    return Promise.reject(error)
  }

  else if (status === 403) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshAccessToken()
        .then(res => {
          isRefreshing = false;
          cookiesService.setToken(res.data.token)
          onRrefreshed(res.data.token);
        })
    }
    console.log("lỗi j z ?")
    console.log(status)
    const retryOrigReq = new Promise((resolve, reject) => {
      subscribeTokenRefresh(token => {
        // replace the expired token and retry
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        resolve(axios(originalRequest));
      });
    });
    return retryOrigReq;
  } else {
    return Promise.reject(error);
  }
});

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRrefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}