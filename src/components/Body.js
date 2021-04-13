import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Register from './body/auth/Register'
import Login from './body/auth/Login'
import Home from './body/home/Home'

function Body() {
    return (
        <section>
            <Switch>
                <Route path="/"  component={Home} exact/>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
            </Switch>
        </section>
    )
}

export default Body
