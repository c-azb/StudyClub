import React, { useState } from 'react'


function useRegister(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [psw,setPsw] = useState('');
    const [confPsw,setConfPsw] = useState('');

    const clearRegister = (bSuccess) => {
        if (bSuccess) { setUsername('');setEmail('');setPsw('');setConfPsw(''); }
        else { setConfPsw(''); }
    }

    return {username,setUsername,email,setEmail,psw,setPsw,confPsw,setConfPsw,clearRegister};
}

function useLogin(){
    const [username,setUsername] = useState('');
    const [psw,setPsw] = useState('');
    const clearLogin = (bSuccess) => {
        if (bSuccess) { setUsername('');setPsw(''); }
        else { setPsw(''); }
    }

    return {username,setUsername,psw,setPsw,clearLogin};
}

export {useRegister};
export {useLogin};