export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILUER = "FETCH_USERS_FAILUER";
export const USER_LOGIN_DATA     ="USER_LOGIN_DATA";
export const USER_LOGOUT_DATA    ="USER_LOGOUT_DATA";
export const fetchusersrequest =()=>({
    type:FETCH_USERS_REQUEST
});
export  const fetchUserssuccess =(users)=>({
        type:FETCH_USERS_SUCCESS,
        payload:users
})
export const fetchusersfailuer=(error)=>({
    type:FETCH_USERS_FAILUER,
    payload:error

})
export const userlogindata=(data)=>({    
    type:USER_LOGIN_DATA,
    payload:data
    
})
export const userlogoutdata=(outdata)=>({
    type:USER_LOGOUT_DATA,
    payload:outdata,
})