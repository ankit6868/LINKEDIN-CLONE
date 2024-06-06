import React, { Suspense, useEffect, useState } from 'react'
import supabase from '../../supabse/supabaseConfig'
import UserCard from './UserCard'
import {useSelector} from 'react-redux'
import ConnectionsUserCard from './ConnectionsUserCard'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'

function ListAllUsers() {
    const [allUsers,setAllUsers] = useState(null)
    const [connectionRequestedUsers,setConnectionRequestedUsers] = useState(null)
    const userId = useSelector((state)=>(state.auth.userId))
    const navigate = useNavigate()
    // console.log(userId);

    const getAllUsers = async()=>{

        
        let { data: profile, error } = await supabase
        .from('profile')
        .select('headline,image_url,profile_id,user_id,user_name')
        

        if(profile){
            // console.log(profile);
            setAllUsers(profile)
        }else{
            console.log(error);
        }
          
    }

    const getAllRequestedUsers = async(userId)=>{
      
      let { data, error } = await supabase
        .rpc('get_connection_requested_users', {
          userid:userId
        })
      if(data){
        // console.log(data);
        setConnectionRequestedUsers(data)
      }else{
        console.log(error);
      }

    }

    const getAllNonRequestedUsers = async(userId)=>{
      
      let { data, error } = await supabase
        .rpc('get_all_non_requested_users', {
          userid:userId
        })
      if(data){
        // console.log(data);
        setAllUsers(data)
      }else{
        console.log(error);
      }

    }

    useEffect(()=>{
    
      const timer = setTimeout(()=>{

        if(userId){
            getAllRequestedUsers(userId)
            getAllNonRequestedUsers(userId)
        }else{
          getAllUsers()
        }
      },100)
        
      return ()=> clearTimeout(timer)
   
    },[userId])

    if(userId){

      return (
        <>
        <Header/>
        <div className='flex justify-center'>
            <button onClick={() => navigate('/myinvitations')} className='bg-gray-800 hover:bg-gray-700 py-2 px-5 sm:px-10 my-2 mr-4 rounded-full text-white block text-sm sm:text-md'>
                Check invitations
            </button>
            <button onClick={() => navigate('/myconnections')} className='bg-gray-800 hover:bg-gray-700 py-2 px-5 sm:px-10 my-2 rounded-full text-white block text-sm sm:text-md'>
                My Connections
            </button>
        </div>


       

        <div className='flex flex-wrap mx-2 mt-5 sm:mx-auto justify-between max-w-xl'>
          {/* display all the users to whom a connection request is sent */}
          {connectionRequestedUsers && connectionRequestedUsers.map((user)=>(
            <ConnectionsUserCard key={user.profile_id} user={user} loggedInUser={userId} />
          ))}
          {/* display the users to whom connection request is not sent */}
          {allUsers && allUsers.map((user)=>(
            user.user_id !== userId?
            <UserCard key={user.profile_id} user={user} loggedInUser={userId} />:null
          ))}
        </div>
        
        </>
      )
    }
    else{
      return(

        <>
        <Header/>

        <Suspense fallback={<Loader/>} >

         <div className='flex flex-wrap mx-2 mt-5 sm:mx-auto justify-between max-w-xl'>
         
          {/* display the users to whom connection request is not sent */}
          {allUsers && allUsers.map((user)=>(
            user.user_id !== userId?
            <UserCard key={user.profile_id} user={user} loggedInUser={userId}  />:null
          ))}
        </div>
        </Suspense>
        </>
      )
    }
}

export default ListAllUsers
