import { useContext, useEffect } from "react";
import { useLogin } from '../hooks/useBaseUser';
import { AuthContext } from "../contexts/AuthProvider";


const OverlayLogin = ({ setIsLoginDiv }) => { 

    const {username,setUsername,psw,setPsw,clearLogin} = useLogin();
    const {isLoggedIn,register,login,logout} = useContext(AuthContext);

    async function onClickLogin(e) {
        e.preventDefault();
        res = await login(username,psw);
        clearLogin(res);
        
    }


    function onLoginDiv(){
        function handleClickOutside(event) {
            const myDiv = document.getElementById('login-div');
            const loginBtn = document.getElementById('login-btn');
            
            if (myDiv && !myDiv.contains(event.target) && !loginBtn.contains(event.target) ) {        
                setIsLoginDiv(false);
            }
        }
        document.addEventListener('click', handleClickOutside);

        return () => {document.removeEventListener('click', handleClickOutside);}
    }

  useEffect( ()=>{onLoginDiv()},[] );

    return (
        <>
            <div className='overlay-div' id='login-div'>
                <div className="d-flex">
                    <h4 className="mt-2 ms-3 fw-bold">Login</h4>
                    <button onClick={() => { setIsLoginDiv(false) }} className='mt-1 me-1 ms-auto mb-auto fw-bold btn btn-danger px-1 py-0' >X</button>
                </div>
                

                <form action="" className="m-2" onSubmit={onClickLogin}>
                    <div className="d-flex flex-column">
                        <input className="text-input my-1" type="text" placeholder="Username"
                         onChange={ (e)=>{setUsername(e.target.value);} } value={username} />

                        <input className="text-input my-1" type="password" placeholder="Password"
                        value={psw} onChange={ (e)=>{setPsw(e.target.value);} } />

                        <input className="btn btn-outline-warning mt-2" type="submit" value="Login" />
                    </div>
                    
                </form>
            </div>
            
        </>
    )
}

export default OverlayLogin