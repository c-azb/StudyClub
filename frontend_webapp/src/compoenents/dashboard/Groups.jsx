import React, { useContext, useEffect, useRef, useState } from 'react'

import { LIST_MY_VOTED_ENDPOINT } from '../../constants/endpoints'
import { AuthContext } from '../../contexts/AuthProvider';
// import { useNavigate } from 'react-router-dom';
import GroupsListItem from './GroupsListItem';

const Groups = () => {

  const upVoteGroups = useRef(null);
  const downVoteGroups = useRef(null);
  const [studyPrograms,setStudyPrograms] = useState([]);
  const [displayUpVoteGroups,setDisplayUpVoteGroups] = useState(true);
  const {isLoggedIn,register,login,logout,accessToken} = useContext(AuthContext)

  const listMyUpVoteGroups = async () => {
    if(!isLoggedIn) return;

    const voteSearch = displayUpVoteGroups ? 2 : 0;

    if(voteSearch && upVoteGroups.current != null){
      setStudyPrograms(upVoteGroups.current)
      return;
    }else if(!voteSearch && downVoteGroups.current != null){
      setStudyPrograms(downVoteGroups.current)
      return;
    }

    const res = await fetch(`${LIST_MY_VOTED_ENDPOINT}${voteSearch}/`,{
      method:"GET",
      headers: {"Authorization": `Bearer ${accessToken.current}`}
    });
    const data = await res.json();
    //console.log(data);

    if (res.ok){
      if(displayUpVoteGroups){
        upVoteGroups.current = data;
      }
      else{
        downVoteGroups.current = data;
      }
      setStudyPrograms(data);
    }
    
  }

  // const navigate = useNavigate();

  // const onClickItem = (pk) => {
  //   navigate(`/displayStudy/${pk}`);
  // }

  useEffect(()=>{listMyUpVoteGroups();},[displayUpVoteGroups])


  return (
    <>
    <div className="d-flex mb-3 border border-2 border-secondary border-opacity-75 p-3 rounded">
      <div className='mx-auto d-flex'>
        <label className='me-1' htmlFor="selectUpVotes">Show up voted groups</label>
        <input className='mt-1' name='selectUpVotes' type="checkbox" checked={displayUpVoteGroups} onChange={()=>{setDisplayUpVoteGroups(true);}} />
      </div>

      <div className='mx-auto d-flex'>
        <label className='me-1' htmlFor="selectDownVotes">Show down voted groups</label>
        <input className='mt-1' name='selectDownVotes' type="checkbox" checked={!displayUpVoteGroups} onChange={()=>{setDisplayUpVoteGroups(false);}} />
      </div>

    </div>
    
    <GroupsListItem studyPrograms={studyPrograms} />
    
    {/* {studyPrograms ? 
    studyPrograms.map((item,index)=>(
      <div key={index} className='study-topic p-3 d-flex' onClick={()=>{onClickItem(item.study_plan.id);}}>
        <h3>{`${index+1}- ${item.study_plan.title}`}</h3>
        <span className='mt-auto ms-auto txt-description'>{item.study_plan.updated_at}</span>
      </div>
    )) : null
  } */}

      
    
    </>
  )
}

export default Groups