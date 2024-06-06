import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import {Provider} from 'react-redux'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import ErrorPage from './components/ErrorPage.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import PageNotFound from './components/PageNotFound.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNotFound from './components/UserNotFound.jsx'
import PostPage from './pages/CreatePostPage.jsx'
import AllPosts from './components/Posts/AllPosts.jsx'
import ListAllUsers from './components/AllUsers/ListAllUsers.jsx'
import ConnectionInvitations from './components/Invitations/ConnectionInvitations.jsx'
import Messaging from './components/Messaging/Messaging.jsx'
import MessageUsersList from './components/Messaging/MessageUsersList.jsx'
import AllNotifications from './components/Notifications/AllNotifications.jsx'
import ConnectedUsers from './components/ConnectedUsers/ConnectedUsers.jsx'
import MyPosts from './components/Posts/MyPosts/MyPosts.jsx'

import { Analytics } from "@vercel/analytics/react"

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    errorElement:<ErrorPage/>,
    children:[
      {
        path:'/',
        element:<AllPosts/>
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/register',
        element:<Register/>
      },
      {
        path:'/profile/:user_id',
        element:<ProfilePage/>,
      },
      {
        path:'/user-not-found',
        element:<UserNotFound/>
      },
      {
        path:'/createpost',
        element:<PostPage/>
      },
      {
        path:'/feed',
        element:<AllPosts/>
      },
      {
        path:'/myposts',
        element:<MyPosts/>
      },
      {
        path:'/mynetwork',
        element:<ListAllUsers/>,
        
      },
       {
            path:'/myconnections',
            element:<ConnectedUsers/>
       },
      {
        path:'/myinvitations',
        element:<ConnectionInvitations/>
      },
      {
        path:'/notifications',
        element:<AllNotifications/>
      },
      {
        path:'/messaging',
        element:<MessageUsersList/>
      },
      {
        path:'/messaging/:receiver_user_id',
        element:<Messaging/>
      },
      {
        path:'/*',
        element:<PageNotFound/>

      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
 
      <Provider store={store}>
        <ToastContainer/>
        <Analytics/>
    <RouterProvider router={router}>
    </RouterProvider>
      </Provider>

 
)
