import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'
import Header from './users/header/Header'
import Body from './users/Body';
import Footer from './users/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetUser, dispatchLogin, dispatchLogout, fetchUser } from './redux/actions/authAction'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'

function App() {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)


  useEffect(() => {
    if (localStorage.getItem("firstLogin")) {
      console.log("check first login")

      const getToken = async () => {
        console.log(token)
        const res = await axios.post("/auth/refreshToken", null, {
          headers: { Authorization: `Bearer ${token}` }
        })
        Cookies.set("token", res.data.token)
        Cookies.set("duration", res.data.duration)
      }

      const token = Cookies.get("token")
      const duration = Cookies.get("duration")
          fetchUser(token).then(res => {
            dispatch(dispatchGetUser(res))
          })

      if (token && duration) {
        const interval = setInterval(() => {
          console.log("get refresh token")
          getToken()
        }, duration - 360000)
        return () => clearInterval(interval)
      }
      
    }
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      console.log("zo app check token")
      const { exp } = jwt_decode(token)
      const expirationTime = (exp * 1000) - 60000
      if (Date.now() < expirationTime) {
        const getToken = async () => {
          console.log("goi refresh trong app")
          const res = await axios.post("/auth/refreshToken", null, {
            headers: { Authorization: `Bearer ${token}` }
          })
          Cookies.set("token", res.data.token)
          Cookies.set("duration", res.data.duration)
        }
        const getUser = () => {
          dispatch(dispatchLogin())
          // return 
        }
        getToken()
        getUser()
      }
      else {
        Cookies.remove("token")
        Cookies.remove("duration")
        localStorage.removeItem("firstLogin")
        dispatch(dispatchLogout())
      }
    }

  }, [dispatch])

  return (
    <Router>
      <div className="App">
        <Header />
        <Body />
        <Footer />
      </div>
    </Router>

  );
}

export default App;
