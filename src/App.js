import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './users/header/Header'
import Body from './users/Body';
import Footer from './users/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetUser, dispatchLogin, fetchUser } from './redux/actions/authAction'
import useSocketDataObject from './real-time/useSocketDataObject'
import CookiesService from './services/CookiesService'
import { ToastContainer } from 'react-toastify';


function App() {

  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const realtime = useSelector(state => state.realtime)
  // /
  const { ConnectSocket, Subscribe_notify } = useSocketDataObject()
  const { user } = auth
  const cookiesService = CookiesService.getService()

  useEffect(() => {
    const token = cookiesService.getToken()
    if (token) {
      dispatch(dispatchLogin())
      fetchUser(token).then(res => {
        dispatch(dispatchGetUser(res))
      })
    }

  }, [auth.isLogged, dispatch])

  useEffect(() => {
    ConnectSocket()
  }, [])

  useEffect(() => {
    const token = cookiesService.getToken()
    if (token && realtime.ws !== null && realtime.isSuccess === true) {
      // myVar = setTimeout(() => Subscribe_notify(user.email), 10000)
      Subscribe_notify(user.email)
    }
  }, [realtime.isSuccess])




  return (
    <>
      <Router>
        <div className="App">
          <Header />
          <Body />
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
