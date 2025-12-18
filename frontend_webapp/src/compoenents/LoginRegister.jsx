import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import {useRegister,useLogin} from '../hooks/useBaseUser';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {

  const {isLoggedIn, register,login} = useContext(AuthContext);
  const {username:usernameR,setUsername:setUsernameR,email:emailR,setEmail:setEmailR,psw:pswR,setPsw:setPswR,confPsw,setConfPsw,clearRegister} = useRegister();
  const {username,setUsername,psw,setPsw,clearLogin} = useLogin();
  const navigate = useNavigate();

  const onClickRegister = async (e) =>{
    e.preventDefault();
    const res = await register(usernameR,emailR,pswR,confPsw);
    clearRegister(res);
  }

  const onClickLogin = async (e) =>{
    e.preventDefault();
    const res = await login(username,psw);
    clearLogin(res);
    if (res){
      navigate("/");
    }
  }

  return (
    <>

      <div className="row">

        <div className="col me-4">

          <h3>Login</h3>

          <div className="p-2 mt-3">
            <form action="" method='POST' className='form-group' onSubmit={onClickLogin}>
              <div className="d-flex">
                <label htmlFor="userimputl" className='my-auto me-auto fw-bold'>Username or Email</label>
                <input id='userimputl' type="text" className='text-input w-75 ms-auto' placeholder='Username or Email' 
                value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="d-flex mt-4">
                <label htmlFor="pswimputl" className='my-auto me-auto fw-bold'>Pasword</label>
                <input id='pswimputl' type="password" className='text-input w-75 ms-auto' placeholder='Password' 
                value={psw} onChange={(e) => setPsw(e.target.value)}/>
              </div>
                <input type="submit" className='btn btn-primary mx-auto mt-4 me-2 float-end' value='Login' />
            
            </form>
          </div>

        </div>


        <div className="col">

          <h3>Register</h3>
          <div className="p-2 mt-3">
            <form action="" method='POST' className='form-group' onSubmit={onClickRegister}>
              <div className="d-flex">
                <label htmlFor="userimputr" className='my-auto me-auto fw-bold'>Username</label>
                <input id='userimputr' type="text" className='text-input w-75 ms-auto' placeholder='Username' 
                value={usernameR} onChange={(e) => setUsernameR(e.target.value)}/>
              </div>
              <div className="d-flex mt-4">
                <label htmlFor="Emailimputr" className='my-auto me-auto fw-bold'>Email</label>
                <input id='Emailimputr' type="text" className='text-input w-75 ms-auto' placeholder='Email' 
                value={emailR} onChange={(e) => setEmailR(e.target.value)}/>
              </div>
              <div className="d-flex mt-4">
                <label htmlFor="pswimputr" className='my-auto me-auto fw-bold'>Pasword</label>
                <input id='pswimputr' type="password" className='text-input w-75 ms-auto' placeholder='Password' 
                value={pswR} onChange={(e) => setPswR(e.target.value)}/>
              </div>
              <div className="d-flex mt-4">
                <label htmlFor="cpswimputr" className='my-auto me-auto fw-bold'>Confirm Pasword</label>
                <input id='cpswimputr' type="password" className='text-input w-75 ms-auto' placeholder='Confirm Password' 
                value={confPsw} onChange={(e) => setConfPsw(e.target.value)}/>
              </div>
              
              <input type="submit" className='btn btn-primary mx-auto mt-4 me-2 float-end' value='Register' />
            
            </form>
          </div>

        </div>


      </div>
    
    
    </>
  )
}

export default LoginRegister