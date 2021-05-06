import React, {useEffect} from 'react'
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom'
import axios from 'axios'
import Header from './users/header/Header'
import Body from './users/Body';
import Footer from './users/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import {dispatchLogin} from './redux/actions/authAction'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin){
      const getToken = async () => {
        // const res = await axios.post("/user/refresh_token", null, {withCredentials: true})
        // if(res){
        //   console.log("access" ,res.data.access_token)
        //   dispatch({type: 'GET_TOKEN', payload: res.data.access_token})
        // }
        dispatch({type: 'GET_TOKEN', payload: 'kieuoanh-1' })
      }
      getToken()
    }
  }, [auth.isLogged, dispatch])


  useEffect(() => {
    console.log(token)
    if(token){
      const getUser = () => {
        dispatch(dispatchLogin())
      }
      getUser()
    }
  }, [token, dispatch])

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
