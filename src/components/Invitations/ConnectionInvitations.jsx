import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import supabase from '../../supabse/supabaseConfig'
import InvitationCard from './InvitationCard'
import Header from '../Header/Header'
import Loader from '../Loader/Loader'

function ConnectionInvitations() {

    const userId = useSelector((state)=>(state.auth.userId))
    const [invitations,setInvitations] = useState(null)
    const [loading,setLoading] = useState(false)

    const getAllInvitations = async(userId)=>{
 
      setLoading(true)

      let { data, error } = await supabase
        .rpc('get_all_invitations_data', {
          userid:userId
        })
     if(data){
      // console.log(data);
      setInvitations(data)
     }else{
      console.log(error);
     }

     setLoading(false)
          
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            getAllInvitations(userId)
        },100)

        return ()=> clearTimeout(timer)
    },[userId])



    if(!userId){
      return(
        <h1>Login to view your invitaions</h1>
      )
    }

    

  return (
    <>
        <Header/>
        {loading && <Loader/> }
      {!loading &&
      <div className='mx-auto max-w-xl '>
        <h1 className='text-xl text-center my-5'>Your invitations</h1>
        
        {invitations && invitations.map((invitation)=>(
          <InvitationCard key={invitation.user_id} invitation={invitation} loggedInUser={userId} />
          
        ))}
        {
          (!invitations || invitations.length ==0) &&
          <div className='bg-gray-300 py-2 px-5 mx-2 rounded-lg text-md text-center'>
            You don't have any invitations
          </div>
        }
      </div>}
    </>
  )
}

export default ConnectionInvitations
