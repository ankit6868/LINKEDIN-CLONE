import Header from "./components/Header/Header.jsx"
import { Outlet } from "react-router-dom"
import supabase from "./supabse/supabaseConfig.js"
import {useDispatch} from 'react-redux'
import { setIsLoggedIn,setUserId,setIsProfileCreated } from "./store/authSlice.js"

function App() {
  const dispatch  = useDispatch()

  const checkIsProfileCreated = async(userId)=>{
    
    let { data: profile, error } = await supabase
      .from('profile')
      .select('user_id')
      .eq('user_id',userId)

      if(profile){
        if(profile.length){
          dispatch(setIsProfileCreated(true))
        }else{
          dispatch(setIsProfileCreated(false))
          
        }
      }else{
        dispatch(setIsProfileCreated(false))

      }
  
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // console.log(event, session)

   if (event === 'SIGNED_IN') {
     // handle sign in event
      dispatch(setIsLoggedIn(true));
      dispatch(setUserId(session.user.id))
      checkIsProfileCreated(session.user.id)
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
      dispatch(setIsLoggedIn(false));
      dispatch(setUserId(null))
    } 
  })

// call unsubscribe to remove the callback
// data.subscription.unsubscribe()
  return(
    <>
    <Outlet/>
    </>
  )
}

export default App
