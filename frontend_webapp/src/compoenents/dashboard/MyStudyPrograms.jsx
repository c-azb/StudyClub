
import React, { useContext, useState } from 'react'
import { UserDataContext } from '../../contexts/UserDataProvider'
import { useNavigate } from 'react-router-dom';

const MyStudyPrograms = () => {

    const {getStudyProgram,addStudyProgram,listAllMyPrograms,studyPrograms} = useContext(UserDataContext);
    const navigate = useNavigate();

    const onClickItem = (pk) => {
      navigate(`/displayStudy/${pk}`);
    }

    useState(()=>{listAllMyPrograms();},[] );

  return (
    <>
    {studyPrograms.map((item,index)=>(
      <div key={index} className='study-topic p-3 d-flex' onClick={()=>{onClickItem(item.id);}}>
        <h3>{`${index+1}- ${item.title}`}</h3>
        <span className='mt-auto ms-auto txt-description'>{item.updated_at}</span>
      </div>
    ))}
    </>
  )
}

export default MyStudyPrograms