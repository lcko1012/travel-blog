import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'
import Header from './users/header/Header'
import Body from './users/Body';
import Footer from './users/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchLogin } from './redux/actions/authAction'
import Cookies, { get } from 'js-cookie';
import { useState } from 'react';
import jwt_decode from 'jwt-decode'

function App() {
  const dispatch = useDispatch()
  const token = Cookies.get('token')
  console.log(token)


  useEffect(() => {
    console.log("app")
    if(token){
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
        }
        getToken()
        getUser()
      }
      else {
        Cookies.remove("token")
        Cookies.remove("duration")
        localStorage.removeItem("firstLogin")
      }
    }
   
  }, [token])

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
