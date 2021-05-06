import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import {useSelector} from 'react-redux'


import Register from './body/auth/Register'
import Login from './body/auth/Login'
import Home from './body/home/Home'
import NotFound from './utils/NotFound/NotFound'
import NewPosts from './body/newPosts/NewPosts'
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
                <Route path="/posts/new" component={isLogged ? NewPosts : Home} exact />

            </Switch>
        </section>
    )
}

export default Body
