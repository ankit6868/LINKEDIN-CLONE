import React,{useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import { Link ,useNavigate} from 'react-router-dom';
import supabase from '../supabse/supabaseConfig';
import {  useSelector } from 'react-redux'
import {toast} from 'react-toastify'
import Loader from './Loader/Loader';



function Register() {

  const navigate = useNavigate()

  const isLoggedIn = useSelector((state)=>(state.auth.isLoggedIn))
  const [loading,setLoading] = useState(false)
   
   useEffect(() => {
    if (isLoggedIn) {
      setLoading(true)
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();


  const createNewUser = async(credentials)=>{

    // console.log(credentials);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp(credentials)

    if(data){
      if(data.user){
        navigate('/')
        // console.log(data);
        toast.success("Successfully Registered  !!!")
      }

    } 
    if(error){
      toast.error(error.message)
      console.log(error);
    }

    setLoading(false)
    reset();

  }

  if(loading){
    return(
      <Loader/>
    )
  }
  
  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
           
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Sign up to create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
           Already have an account?{' '}
            <Link
             to={'/login'}
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>
          <form onSubmit={handleSubmit(createNewUser)} className="mt-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-gray-900">
                  {' '}
                  Email address{' '}
                </label>
                <div className="mt-2">
                  <input 
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    name="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Email is not valid."
              }
            })}
                  ></input>
                  <div className='h-5'>

                  {errors.email && (<p className='text-red-600'>{errors.email.message}</p>) }
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                    {' '}
                    Password{' '}
                  </label>
                  <a href="#" title="" className="text-sm font-semibold text-black hover:underline">
                    {' '}
                    Forgot password?{' '}
                  </a>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    name="password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters."
              }
            })}
                  ></input>
                  <div className='h-5'>

                  {errors.password && (<p className='text-red-600'>{errors.password.message}</p>)}
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
         
        </div>
      </div>
    </section>
  )
}

export default Register
