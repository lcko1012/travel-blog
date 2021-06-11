import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import AdminHome from '../admin/body/AdminHome/AdminHome'
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'
import ForgotPassword from '../users/body/auth/ForgotPassword'
import Login from '../users/body/auth/Login'
import Register from '../users/body/auth/Register'
import ResetPassword from '../users/body/auth/ResetPassword'
import Bookmarks from '../users/body/bookmark/Bookmarks'
import Category from '../users/body/category/Category'
import Home from '../users/body/home/Home'
import NewPosts from '../users/body/newPosts/NewPosts'
import Post from '../users/body/post/Post'
import EditProfile from '../users/body/profile/EditProfile'
import MyProfile from '../users/body/profile/MyProfile'
import Profile from '../users/body/profile/Profile'
import SearchPage from '../users/body/search/SearchPage'
import NotFound from '../users/utils/NotFound/NotFound'

export default () => {
    const auth = useSelector(state => state.auth)
    const { isLogged, idAdmin } = auth
    return (
        <section>
            <Switch>
                <Route path="/admin/:path?" exact>
                    <AdminLayout>
                        <Switch>
                            <Route path="/admin" exact component={AdminHome} />
                        </Switch>
                    </AdminLayout>
                </Route>

                <Route>
                    <UserLayout>
                        <Route path="/" component={Home} exact />
                        <Route path="/register" component={Register} exact />
                        {/* <Route path="/login" component={Login} /> */}
                        <Route path="/login" component={!isLogged ? Login : Home} exact />
                        <Route path="/forgot_password" component={isLogged ? Home : ForgotPassword} exact />
                        <Route path="/auth/resetPassword/:token" component={isLogged ? Home : ResetPassword} exact />

                        <Route path="/posts/new" component={isLogged ? NewPosts : Home} exact />
                        <Route path='/posts/:slug' component={Post} exact />
                        <Route path='/posts/:slug/edit' component={isLogged ? NewPosts : Home} exact />


                        <Route path='/search' component={SearchPage} exact />
                        <Route path='/bookmarks' component={isLogged ? Bookmarks : Login} exact />
                        <Route path='/category/:id' component={Category} exact />

                        <Route path="/profile/:id" component={Profile} exact />
                        <Route path="/myprofile" component={isLogged ? MyProfile : Login} exact />
                        <Route path="/myprofile/edit" component={isLogged ? EditProfile : Login} exact />
                        <Route component={NotFound} exact />
                    </UserLayout>
                </Route>

            </Switch>

        </section>
    )
}
