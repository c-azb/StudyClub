
import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AuthContext} from '../contexts/AuthProvider'
import OverlayLogin from './OverlayLogin';

const HeaderNav = () => {

  const {isLoggedIn,register,login,logout} = useContext(AuthContext);
  const [isLoginDiv,setIsLoginDiv] = useState(false);
  const navigate = useNavigate();

  const onClickLogout = async () => {
    await logout();
    navigate("/");
  }
  

  return (
    <>
    
    <nav className='navbar p-3 '>
        <div className="container-fluid">
            <Link to='/' className='navbar-brand' style={{color:"lightgray",fontWeight:"bolder",fontSize:"35px"}}> 
              Study Club 
              </Link>

            <div className='d-flex'>

              {!isLoggedIn ? 
              <div>
                <button onClick={() => {navigate("/LoginRegister");}} className='underline-btn m-3'>Register</button>
                <button id='login-btn' onClick={()=>{setIsLoginDiv(true);}} className='underline-btn m-3'>Login</button>
                {/* <button className='underline-btn m-3' onClick={()=> {navigate('/Dashboard');}}>Dashboard</button> */}

              {isLoginDiv ? <OverlayLogin setIsLoginDiv={setIsLoginDiv} /> : null }
              </div>
               :
              <div>
                <button className='underline-btn m-3' onClick={onClickLogout}>Logout</button>
                {/* <a href='' className='link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover m-3'>Logout</a> */}
                <button className='underline-btn m-3' onClick={()=> {navigate('/Dashboard');}}>Dashboard</button>
              </div>
            }

              
                
            </div>
        </div>
    </nav>
    <hr />

    

    </>
  )
}

export default HeaderNav