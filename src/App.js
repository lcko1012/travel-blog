import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetUser, dispatchLogin, fetchUser } from './redux/actions/authAction'
import useSocketDataObject from './real-time/useSocketDataObject'
import CookiesService from './services/CookiesService'
import { ToastContainer } from 'react-toastify';
import Routes from './routes';
// import Body from './users/Body'


function App() {

  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const realtime = useSelector(state => state.realtime)
  const { ConnectSocket, Subscribe_notify, Disconnect } = useSocketDataObject()
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
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    ConnectSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const token = cookiesService.getToken()
    if (token && realtime.ws !== null && realtime.isSuccess === true) {
      // myVar = setTimeout(() => Subscribe_notify(user.email), 10000)
      Subscribe_notify(user.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime.isSuccess])




  return (
    <>
      <Router>
        <div className="App">
          {/* <Header /> */}
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
          {/* <Body /> */}
          {/* <Footer /> */}
          <Routes />
        </div>
      </Router>
    </>
  );
}

export default App;
