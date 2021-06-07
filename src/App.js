import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './users/header/Header'
import Body from './users/Body';
import Footer from './users/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetUser, dispatchLogin, dispatchLogout, fetchUser } from './redux/actions/authAction'
// import useSocketDataObject from './real-time/useSocketDataObject'
import CookiesService from './services/CookiesService'

function App() {

  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  // const { connect } = useSocketDataObject()
  const cookiesService = CookiesService.getService()

  useEffect(() => {
    const token = cookiesService.getToken()

    if (token) {
      console.log("check first login")
      dispatch(dispatchLogin())
      fetchUser(token).then(res => {
        dispatch(dispatchGetUser(res))
      })
    }

  }, [auth.isLogged, dispatch])


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
