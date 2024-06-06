import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name:'auth',
    initialState:{
        isLoggedIn:false,
        userId:null,
        isProfileCreated:false
    },
    reducers:{
        setIsLoggedIn:(state,action)=>{
            state.isLoggedIn = action.payload;
        },
        setUserId:(state,action)=>{
            state.userId = action.payload;
        },
        setIsProfileCreated:(state,action)=>{
            state.isProfileCreated = action.payload;
        }
    }
})

export const { setIsLoggedIn, setUserId, setIsProfileCreated } = authSlice.actions;
export default authSlice.reducer