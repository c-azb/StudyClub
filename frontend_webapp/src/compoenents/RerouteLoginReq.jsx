import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import { Navigate } from 'react-router-dom';

const RerouteLoginReq = ({children,shouldBeLoggedIn}) => {

    const {isLoggedIn} = useContext(AuthContext);

  return shouldBeLoggedIn ? 
  (isLoggedIn ? children : <Navigate to='/LoginRegister'/>) : 
  (isLoggedIn ? <Navigate to='/'/> : children)

}

export default RerouteLoginReq;