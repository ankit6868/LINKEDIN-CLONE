import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import supabase from '../../supabse/supabaseConfig'
import moment from 'moment'
import Header from '../Header/Header'
import Loader from '../Loader/Loader'


function AllNotifications() {
    const loggeInUser = useSelector((state)=>(state.auth.userId))
    const [notifications,setNotifications] = useState(null)
    const [loading,setLoading] = useState(false)

    const getAllNotifications = async()=>{
        setLoading(true)
        
        let { data: notifications, error } = await supabase
        .from('notifications')
        .select()
        .eq('user_id',loggeInUser)
        .order('created_at',{ascending:false})

        if(notifications){
          // console.log(notifications);
          setNotifications(notifications);
        }
        else{
          console.log(error);
        }        
        
        setLoading(false)
    }

    useEffect(()=>{
      if(loggeInUser)
      getAllNotifications()
    },[loggeInUser])

    
  return (
    <>
   <Header />
      <div className='max-w-xl px-1 mx-auto'>
        <h1 className='text-center text-xl font-semibold my-2'>Your Notifications</h1>
        {loading && ( // Render loading message when data is loading
          <Loader/>
        )}
        {!loading && loggeInUser==null && 
            <div className='bg-gray-300 px-3 py-2 mx-2 text-md rounded-lg shadow-xl'>
              Please login to see your notifications
            </div>
        }
        {!loading && notifications && notifications.length === 0 && ( // Render message when no notifications
          <div className='bg-gray-300 px-3 py-2 mx-2 text-md rounded-lg shadow-xl'>
            You don't have any notifications...
          </div>
        )}
        {!loading && notifications && notifications.length > 0 && ( // Render notifications when data is loaded
          notifications.map(notification => (
            <div key={notification.id} className='bg-gray-200 shadow-lg my-4 px-3 py-2 mx-2 rounded-lg'>
              
              <p><span className='font-medium'>{notification.sender_user_name}</span> {notification.message}</p>
              <p className='text-xs'>{moment(notification.created_at).fromNow()}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default AllNotifications
