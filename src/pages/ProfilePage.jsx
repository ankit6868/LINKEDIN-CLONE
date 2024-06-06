import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useState ,useEffect} from 'react'
import ProfileBanner from '../profilePageComponents/ProfileBanner'
import EducationBanner from '../profilePageComponents/EducationBanner'
import SkillsBanner from '../profilePageComponents/SkillsBanner'
import ExperienceBanner from '../profilePageComponents/ExperienceBanner'
import Header from '../components/Header/Header'
import Loader from '../components/Loader/Loader'

function ProfilePage() {
    const {user_id} = useParams()
    const loggedInuser = useSelector((state)=>(state.auth.userId))
    const [isAuthor,setIsAuthor] = useState(null)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
    // Check if the logged in user is the same as the user_id
        setIsAuthor(loggedInuser === user_id);
        setTimeout(()=>{

            setLoading(false)
        },1000)
    }, [loggedInuser,user_id]);



    return(
        <>
            <Header/>
            { !loading &&
            <div className='w-full sm:max-w-xl px-1 mx-auto'>

            <ProfileBanner user_id={user_id} isAuthor={isAuthor} />
            <EducationBanner user_id={user_id} isAuthor={isAuthor} />
            <SkillsBanner user_id={user_id}  isAuthor={isAuthor} />
            <ExperienceBanner user_id={user_id} isAuthor={isAuthor}  />
            </div>}
            {
                loading && 
                <Loader/>
            }
        </>

    )
}

export default ProfilePage
