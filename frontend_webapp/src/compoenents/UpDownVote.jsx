import React, { useContext, useEffect, useState } from 'react'
import { UP_DOWN_VOTE_ENDPOINT } from '../constants/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp,faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../contexts/AuthProvider';

const UpDownVote = ({studyProgram,canVote=false}) => {

    const [myVote,setMyVote] = useState(0);
    const [voting,setVoting] = useState(!canVote);
    const {isLoggedIn,register,login,logout,accessToken} = useContext(AuthContext);

    useEffect(()=>{
        if("my_vote" in studyProgram && canVote) 
            setMyVote(studyProgram.my_vote);
        },
        [studyProgram] );

    const onVote = async (newVote) => {        
        if(!isLoggedIn || !canVote) return;

        setVoting(true);

        if(myVote == newVote) newVote = 0;
        const method = myVote == 0 ? "POST" : newVote == 0 ? "DELETE" : "PUT"
        //console.log(method);        
        
        const res = await fetch(`${UP_DOWN_VOTE_ENDPOINT}${studyProgram.id}/`,{
            method:method,
            headers:method=="DELETE"?{"Authorization":`Bearer ${accessToken.current}`}: {"Content-type":"application/json","Authorization":`Bearer ${accessToken.current}`},
            body:method=="DELETE"?{}:JSON.stringify({"vote":newVote})
        });
        const data = await res.json();

        if(res.ok){            
            setMyVote(newVote);
        }else{console.log(data);}
        setVoting(false);
    }

  return (
    <>      
            <div className='d-flex ms-auto mt-auto'>
                <div className='me-2'>
                <button disabled={voting} onClick={()=>{onVote(1);}} className={`underline-btn ${myVote==1?'underline-btn-highlight':null}`}>
                    <FontAwesomeIcon icon={faArrowUp}  />
                </button>
                
                <button disabled={voting} onClick={()=>{onVote(-1);}} className={`underline-btn ${myVote==-1?'underline-btn-highlight':null}`}>
                    <FontAwesomeIcon icon={faArrowDown}  />
                </button>

                </div>
                <span className=''>
                {"votes" in studyProgram ? studyProgram.votes:null}
                </span>
            </div>
    </>
  )
}

export default UpDownVote