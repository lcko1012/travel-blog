import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import {useSelector} from 'react-redux'


import Register from './body/auth/Register'
import Login from './body/auth/Login'
import Home from './body/home/Home'
import NotFound from './utils/NotFound/NotFound'
import NewPosts from './body/newPosts/NewPosts'
import Post from './body/post/Post'
import ForgotPassword from './body/auth/ForgotPassword'
import ResetPassword from './body/auth/ResetPassword'
import Profile from './body/profile/Profile'
import MyProfile from './body/profile/MyProfile'

function Body() {
    const auth = useSelector(state => state.auth)
    const {isLogged, idAdmin} = auth
    return (
        <section>
            <Switch>
                <Route path="/"  component={Home} exact/>
                <Route path="/register" component={Register} exact />
                {/* <Route path="/login" component={Login} /> */}
                <Route path="/login" component={!isLogged ? Login : Home} exact />
                <Route path="/forgot_password" component= {isLogged ? Home : ForgotPassword} exact />
                <Route path="/auth/resetPassword/:token" component= {isLogged ? Home : ResetPassword} exact />
                
                <Route path="/posts/new" component={isLogged ? NewPosts : Home} exact />
                <Route path='/posts/:slug' component={Post} />

                <Route path="/profile/:id" component={Profile} exact />
                <Route path="/myprofile" component={MyProfile} exact />

            </Switch>
        </section>
    )
}

export default Body
