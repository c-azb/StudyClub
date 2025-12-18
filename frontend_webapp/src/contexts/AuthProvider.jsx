
import React, { createContext, useEffect, useRef, useState } from 'react'
import { REGISTER_ENDPOINT,LOGIN_ENDPOINT,REFRESH_ENDPOINT,LOGOUT_ENDPOINT } from '../constants/endpoints';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const accessToken = useRef(null);
    const navigate = useNavigate()

    const register = async (username,email,password,confirm_password) => {
        const res = await fetch(REGISTER_ENDPOINT,
          {
            method:"POST",
            headers:{ "Content-type":"application/json" },
            body: JSON.stringify( {username,email,password,"password2":confirm_password} )
          }
        );
        if(res.ok){
          console.log("Successfully registered!");
        }
        else{
          console.error("Failed to register");
        }
        return res.ok;
    }

    const login = async (username,password) =>{
      const res = await fetch(LOGIN_ENDPOINT,{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify( {username,password} ),
        credentials:"include"
      });

      const data = await res.json()

      if (res.ok && "access" in data){
        accessToken.current = data['access'];
        setIsLoggedIn(true);
        console.log("Successfully logged in");
        return true;
      }
      else{
        console.error(`Failed to loggin\n${data}`);
      }

      return false;
    }

    const refreshLogin = async () => {
      const res = await fetch(REFRESH_ENDPOINT,{
        method:"POST",
        credentials:"include"
      });

      const data = await res.json();

      if (res.ok){
        accessToken.current = data.access;
        setIsLoggedIn(true);
      }
      else{
        console.log(data);
        accessToken.current = null;
        setIsLoggedIn(false);
      }

      if (isLoggedIn && accessToken.current === null){
        console.log("Login expired, please login again...");
        navigate("/LoginRegister");
      }
    }

    const logout = async () => {
      const res = await fetch(LOGOUT_ENDPOINT,{method:"POST",credentials:"include"});
      accessToken.current = null;
      setIsLoggedIn(false);
      if(!res.ok){
        localStorage.setItem("logout","1")
      }
      return res.ok;
    }

    useEffect( ()=>{refreshLogin();},[] );
  


  return (
   <AuthContext.Provider value={ {isLoggedIn,register,login,logout,accessToken} }>
    {children}
   </AuthContext.Provider>
  )
}

export default AuthProvider;
export {AuthContext};