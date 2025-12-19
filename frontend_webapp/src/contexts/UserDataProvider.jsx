
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from './AuthProvider';
import { GENERATE_ENDPOINT,TOPICS_ENDPOINT,PUBLIC_GROUP_ENDPOINT,PRIVATE_GROUP_ENDPOINT } from '../constants/endpoints';

const UserDataContext = createContext();

const UserDataProvider = ({children}) => {

    const {isLoggedIn,register,login,logout,accessToken} = useContext(AuthContext);
    const [studyPrograms,setStudyPrograms] = useState([]);
    const isUpdated = useRef(false);

    const listAllMyPrograms = async () => {
        if(!isLoggedIn || isUpdated.current) return;

        /*[{created_at:"2025-12-12T16:26:35.624941Z",id:1,title:"Python",updated_at:"2025-12-12T16:26:35.624941Z",user:1}]*/
        const res = await fetch(GENERATE_ENDPOINT,{
            method:"GET",
            headers:{"Authorization": "Bearer " + accessToken.current}
        });

        const data = await res.json();
        if(res.ok){
            setStudyPrograms(data);
            isUpdated.current = true;
        }
        else{
            console.log(data);
        }
    }

    //useEffect(()=>{initUserData();},[isLoggedIn]);

    const getStudyGroup = async (pk,endpoint,header) => {
        const res = await fetch(`${endpoint}${pk}/` ,{method:"GET",headers:header});
        const data = await res.json();

        if(res.ok){
            return data;
        }else{
            console.log(data);
        }
        return null;
    }

    const getStudyProgramId = (pk) => {
        for(let i=0;i<studyPrograms.length;i++){
            if(studyPrograms[i].id == pk){
                return i;
            }
        }
        return null;
    }

    const getStudyProgram = async (pk) => {

        if(!isLoggedIn){
            return await getStudyGroup(pk,PUBLIC_GROUP_ENDPOINT,{});
        }

        const index =null; //getStudyProgramId(pk);

        if (index == null){
            return await getStudyGroup(pk,PRIVATE_GROUP_ENDPOINT,{"Authorization":`Bearer ${accessToken.current}`});
        }

        if ("topics" in studyPrograms[index]){
            return studyPrograms[index];
        }

        const res = await fetch(`${TOPICS_ENDPOINT}${pk}/`,{
            method:"GET",
            headers:{"Authorization":`Bearer ${accessToken.current}`}
        });
        const data = await res.json();
        
        if(res.ok){
            const studyProgramsCopy = [...studyPrograms];
            studyProgramsCopy[index].topics = data;
            setStudyPrograms(studyProgramsCopy);
            return studyProgramsCopy[index];
        }else{
            console.log(data);
        }
        return null;
    }




    const addStudyProgram = (studyProgram) => {
        //setStudyPrograms({...studyPrograms,[studyProgram.pk]:studyProgram});
        setStudyPrograms([...studyPrograms,studyProgram]);
    }


  return (
    <UserDataContext.Provider value={{getStudyProgram,addStudyProgram,listAllMyPrograms,studyPrograms}} >
        {children}
    </UserDataContext.Provider>
  )
}

export {UserDataContext};
export default UserDataProvider