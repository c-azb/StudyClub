import { useContext, useEffect, useState } from 'react'
import { USERNAME_ENDPOINT,PSW_ENDPOINT } from '../../constants/endpoints';
import { AuthContext } from '../../contexts/AuthProvider';

const AccInfo = () => {

  const [username,setUsername] = useState('');
  const [psw,setPsw] = useState('');
  const [newPsw,setNewPsw] = useState('');
  const [newPswConf,setNewPswConf] = useState('');
  const {isLoggedIn,register,login,logout,accessToken,tryRefreshAccessToken} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);

  function clearPswFields(){
    setPsw('');
    setNewPsw('');
    setNewPswConf('');
  }

  const initUsername = async () => {
    setLoading(true);
    const res = await fetch(USERNAME_ENDPOINT,{method:'GET',headers:{"Authorization":`Bearer ${accessToken.current}`}})
    const data = await res.json();
    if(res.ok){
      setUsername(data.username);
    }else{
      console.log(data);
      await tryRefreshAccessToken(data,initUsername,[]);
    }
    setLoading(false);
  }

  useEffect(()=>{initUsername();},[]);

  const changeUsername = async (e) => {
    e.preventDefault();
    const data = {username,psw};
    await sendRequest(USERNAME_ENDPOINT,data);
  }

  const changePsw = async (e) => {
    e.preventDefault();
    const data = {psw,newPsw,newPswConf};
    await sendRequest(PSW_ENDPOINT,data);
  }

  const sendRequest = async (endpoint,data) => {
    clearPswFields();
    setLoading(true);
    const res = await fetch(endpoint,{
      method:'POST',
      headers:{"Authorization":`Bearer ${accessToken.current}`,"Content-type":"application/json"},
      body:JSON.stringify(data)
    });

    if(res.ok){
      alert('Password successfully updated');
    }else{
      const resData = await res.json();
      console.log(resData);
      await tryRefreshAccessToken(resData,sendRequest,[endpoint,data]);
      //if(success) sendRequest(endpoint,data);
    }
    setLoading(false);
  }


  return (
    <>
    
    <div className='d-flex flex-column px-5'>

      <form onSubmit={changeUsername} className='d-flex flex-column'>
        
          <label htmlFor="" className='mt-1'>Username</label>
          <input value={username} onChange={(e)=>{setUsername(e.target.value);}} type="text" className='ms-1 text-input mt-1' />
          <label className='mt-1' htmlFor="">Current Password</label>
          <input value={psw} onChange={(e)=>{setPsw(e.target.value);}} type="password" className='ms-1 text-input mt-1' />
        <input type="submit" value='Update Username' disabled={loading} className='w-50 mx-auto mt-3 btn btn-outline-warning' />
        
      </form>

      <form onSubmit={changePsw} className='d-flex flex-column mt-5'>
          <label htmlFor="">Current Password</label>
        <input className='ms-1 text-input mt-1' value={psw} onChange={(e)=>{setPsw(e.target.value);}} type="password" />
          <label className='mt-1' htmlFor="">New Password</label>
        <input className='ms-1 text-input mt-1' value={newPsw} onChange={(e)=>{setNewPsw(e.target.value);}} type="password" />
          <label className='mt-1' htmlFor="">Confirm New Password</label>
        <input className='ms-1 text-input mt-1' value={newPswConf} onChange={(e)=>{setNewPswConf(e.target.value);}} type="password" />
        <input type="submit" value='Change Password' disabled={loading} className='w-50 mx-auto mt-3 btn btn-outline-warning' />
      </form>


    </div>
    
    </>
  )
}

export default AccInfo