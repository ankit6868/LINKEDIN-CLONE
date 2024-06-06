import React, { useState } from 'react'
import UserCard from './UserCard';
import supabase from '../../supabse/supabaseConfig';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';

function ConnectedUsers() {
    const [connectedUsers,setConnectedUsers] = useState(null)
    const loggedInUser = useSelector((state)=>(state.auth.userId))

    const getConnectedUsers = async(userId)=>{
      
      let { data, error } = await supabase
        .rpc('get_connection_requested_users', {
          userid:loggedInUser
        })
      if(data){
        // console.log(data);
        data = data.filter(data =>(data.connection_status ==  1 ))

        setConnectedUsers(data)
      }else{
        console.log(error);
      }

    }

    useState(()=>{
      if(loggedInUser)
        getConnectedUsers()
    },[loggedInUser])
  return (
    <>
    <Header/>
    <h1 className='text-xl mt-3 font-semibold text-center'>Your Connections</h1>
    <div className='flex flex-wrap mx-2 sm:mx-auto justify-between max-w-xl'>
        {connectedUsers && connectedUsers.map((user)=>(
            user.connection_status==1?
            <UserCard key={user.receiver_user_id} user={user}  />:null
        ))}

        {(!connectedUsers ||connectedUsers.length == 0) &&
        <div className='bg-gray-300 text-center sm:mx-auto px-3 py-2 mx-2 text-md rounded-lg shadow-xl' >
          You don't have any connections. Create connections
        </div>
        }
          
    </div>
    </>
  )
}

export default ConnectedUsers
