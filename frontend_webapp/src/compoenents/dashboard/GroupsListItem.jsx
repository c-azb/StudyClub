import React from 'react'
import { useNavigate } from 'react-router-dom';
import UpDownVote from '../UpDownVote';

const GroupsListItem = ({studyPrograms}) => {

    const navigate = useNavigate();

    const onClickItem = (pk) => {
      navigate(`/displayStudy/${pk}`);
    }

  return (
    <>
    {studyPrograms.map((item,index)=>(
      <div key={index} className='study-topic p-3 d-flex flex-column' onClick={()=>{onClickItem(item.id);}}>
        <div className="d-flex">
          <h3>{`${index+1}- ${item.title}`}</h3>
          <div className="ms-auto">
            <UpDownVote studyProgram={item} canVote={true} />
          </div>
          
        </div>
        <span className='mt-auto ms-auto txt-description'>{item.updated_at}</span>
      </div>
    ))}
    
    </>
  )
}

export default GroupsListItem