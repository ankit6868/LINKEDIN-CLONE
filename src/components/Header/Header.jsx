import React, { useEffect, useState,useRef } from 'react'
import {Home,Users,MessageCircleMore,BellDot ,CircleUserRound,AlignJustify,ChevronDown ,LogIn, LogOut, UserRound ,Search } from 'lucide-react'
import {Link} from 'react-router-dom'
import {  useSelector } from 'react-redux'
import LinkedInLogo from '../../assets/LinkedinLogo.png'
import supabase from '../../supabse/supabaseConfig'
import { useNavigate } from 'react-router-dom'
import DefaultLogo from '../../assets/defaultLogo.jpg'


function Header() {
  const [showProfile,setShowProfile] = useState(false)
  const [toggle,setToggle] = useState(false)
  const userId = useSelector((state)=>(state.auth.userId));
  const navigate = useNavigate()
  const [search,setSearch] = useState('')
  const [suggestions,setSuggestions] = useState(null)
  const inputRef = useRef(null);

  const handleLogout = async()=>{
      
    const { error } = await supabase.auth.signOut()
    if(error){
      console.log(error);
    }
    navigate('/')
  }

  const getSuggestions = async()=>{
    // console.log(search);
    if(search.trim().length ==0){
      return
    }
    
    let { data: profile, error } = await supabase
      .from('profile')
      .select('user_name,user_id,image_url,headline')
      .ilike('user_name',`%${search}%`)
    

      if(profile){
        // console.log('suggestions');
        setSuggestions(profile)
        // console.log(profile);
      }else{
        console.log(error);
      }
  
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

   const handleDocumentClick = (event) => {
    // Check if the clicked element is not the input field
    if (!inputRef.current.contains(event.target)) {
      setSearch('');
    }
  };

    useEffect(() => {
      // Add event listener when component mounts
      document.addEventListener('click', handleDocumentClick);

      // Remove event listener when component unmounts
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, []);

    useEffect(()=>{
      const timer = setTimeout(()=>{
        getSuggestions()
      },500)

      return()=> clearTimeout(timer)
    },[search])
  return (
    
     <div className='z-10 sticky top-0 bg-gray-100 shadow-lg grid  grid-flow-col py-2'>
        <div className='grid-cols-3 flex'>
          <button onClick={()=>(setToggle(!toggle))}>

          <AlignJustify className='block sm:hidden h-10 w-10 ml-2'/>
          </button>
        <Link to={'/'} >
        <button className='mx-2'>
        <img className='w-10 h-10  pt-2 hidden sm:block  ' src={LinkedInLogo} alt="linkedin logo" />
       
        </button>
        </Link>
        </div>

       <div className='relative'>
      <form className='flex grid-cols-8 mr-2' onSubmit={handleSubmit}>
        <div  ref={inputRef} className='flex-col'>
          <div className='flex'>
            <input
              placeholder='Search users'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='rounded-l-xl bg-gray-200 w-full px-4 py-2 border-2 border-gray-500 outline-none border-r-0'
              type='text'
            />
            <button className='rounded-r-xl bg-gray-200 px-4 border-2 border-gray-500 border-l-0'>
              <Search />
            </button>
          </div>
        </div>
      </form>
      {search && (
        <div className='bg-gray-200 absolute w-11/12 rounded-lg  mx-auto '>
          {suggestions && suggestions.map((suggestion) => (
            <Link key={suggestion.user_id} to={`/profile/${suggestion.user_id}`}>
              <div className='flex items-center justify-between py-1 my-0.5 bg-neutral-300 rounded-lg '>
                <div className='flex items-center ml-2'>

                <Search className='w-5 h-5'/>
                <div key={suggestion.user_name} className='py-0.5 px-2 font-semibold'>{suggestion.user_name}
               <span className='text-xs  font-normal ml-2  text-wrap '> {suggestion.headline} </span>

                </div>
                </div>
                <img src={suggestion?.image_url || DefaultLogo} className='w-9 h-9 mr-2 rounded-full ml-1' alt="profile_image" />
              </div>
            </Link>

            
          ))}
          {(!suggestions || suggestions.length ==0) && <div className='items-center py-1 my-0.5 bg-neutral-300 rounded-lg px-4'>No suggestions</div> }
        </div>
      )}
    </div>
       

        <div className='grid-cols-1  justify-end hidden sm:flex '>
          <Link to={'/feed'}>
          <div className='flex-col mx-6 cursor-pointer'>
            <Home className='w-8  h-8 '/>
            <p className='text-xs '>Home</p>
          </div>
          </Link>
          <Link to={'/mynetwork'}>
            <div className='flex-col mx-6 cursor-pointer'>
              <Users className='w-8  h-8 ml-4 '/>
              <p className='text-xs '>My Network</p>
            </div>
          </Link>
          <Link to={'/messaging'}>
            <div className='flex-col mx-6 cursor-pointer'>
              <MessageCircleMore className='w-8  h-8 ml-4'/>
              <p className='text-xs '>Messaging</p>
            </div>
          </Link>

          <Link  to={'/notifications'}>
          <div className='flex-col mx-6 cursor-pointer'>
            <BellDot  className='w-8  h-8 ml-4'/>
            <p className='text-xs '>Notifications</p>
          </div>
          </Link>
          {!userId && 
          <Link to={'/login'}>

            <div className='flex-col mx-6 cursor-pointer'>
              <LogIn className='w-8  h-8 pr-2'/>
              <p className='text-xs '>Login</p>
            </div>
          </Link>
          }

          {userId && <div onClick={()=>setShowProfile(!showProfile)} className='flex-col mx-6 cursor-pointer'>
            <CircleUserRound className='w-8 ml-2 h-8 '/>
            <p className='text-xs flex '> <ChevronDown className='w-4 h-4' /> Profile</p>
            </div>}
            {showProfile && 
            
            <ul className=' absolute w-30 bg-gray-100 rounded-lg  px-1 text-center mt-14'>
              <Link to={`/profile/${userId}`}>
              <li className='mt-1'>
                <button onClick={()=>(setShowProfile(false))} className='bg-slate-200 hover:bg-slate-300 px-2 py-1 w-full mt-1  my-1 mr-1 rounded-md'>View Profile</button>
              </li>
              </Link>
              
              <li className='mb-1 '>
                <button onClick={()=>(handleLogout(),setShowProfile(false),navigate('/'))} className='bg-slate-200 hover:bg-slate-300 w-full px-2 py-1 mr-1 rounded-md '>Logout</button>
              </li>
            </ul>
            }
      
        </div>

      { toggle && <SideBar userId={userId } setToggle={setToggle} navigate={navigate} />}
    </div>

    
  )
}

function SideBar({userId,setToggle,navigate}){

  const handleLogout = async()=>{
    const { error } = await supabase.auth.signOut()
    if(error){
      console.log(error);
    }
    setToggle(false)
    navigate('/')
  }
  return(
     <aside id='sidebar' className="fixed flex min-h-screen overflow-scroll w-3/5 z-10  top-14 left-0  sm:w-3/12 lg:w-2/12 flex-col overflow-y-auto border-r bg-gray-50 px-5 py-3  ">
     
      <div className=" flex flex-1 flex-col justify-between">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-6 ">
            
            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to={'/feed'}
              onClick={()=>(setToggle(false))}
            >
              <Home className="h-5 w-5" aria-hidden="true"  />
              <span className="mx-2 text-sm font-medium ">Home</span>
            </Link>
            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to={'/mynetwork'}
            >
              <Users className="h-5 w-5" aria-hidden="true"  />
              <span className="mx-2 text-sm font-medium ">My Network</span>
            </Link>
          </div>
          <div className="space-y-6 ">
          
            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to={'/messaging'}
            >
              <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Messaging</span>
            </Link>
            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to={'/notifications'}
            >
              <BellDot className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Notifications</span>
            </Link>
           {!userId &&  <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to={'/login'}
            >
              <LogIn className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Login</span>
            </Link>}

             { userId && 
             
             <>

            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to={`/profile/${userId}`}
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">View Profile</span>
            </Link>
             <div onClick={()=>(handleLogout())}
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-900 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              
            >
              <LogOut className="h-5  w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Logout</span>
            </div>
             </>
              
            }
          </div>

        
        </nav>
      </div>
    </aside>
  )
}



export default Header
