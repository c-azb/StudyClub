

import React from 'react'
import undefinedimg from '../assets/undefined.jpg'
import { useNavigate } from 'react-router-dom'
import { FILE_ENDPOINT } from '../constants/endpoints'
import { faArrowUp,faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UpDownVote from './UpDownVote'

const StudyGroupItem = ( {group} ) => {

  const navigate = useNavigate();

  const onSelectItem = () =>{
    navigate("/displayStudy/"+group.id);
  }

  const get_limited_subject = () => {
    if("subject" in group){
      const subject = group.subject;
      if(subject.length > 25){
        return subject.slice(0, 25) + '...';
      }
      return subject;
    }
    return null;
  }

  return (
    <>

    <div className='border rounded border-secondary p-2 m-2'>
        <div className="d-flex">
        <div className='mt-2'>
        <img draggable={false} src={
          group.image ? `${FILE_ENDPOINT}${group.image}` : undefinedimg
        } alt="" style={{width:"200px",height:"200px",objectFit:"cover"}} />

        </div>
        <div className='mx-3 d-flex flex-column'>
            <span  onClick={onSelectItem} className='fw-bold fs-3 item-title'>{group.title}</span>
            <span className='fst-italic' >{get_limited_subject()}</span>
            <UpDownVote studyProgram={group} canVote={false} />
            {/* <div className='d-flex mt-auto ms-auto'>
              <div className='me-1'>
                <FontAwesomeIcon icon={faArrowUp}  />
                <FontAwesomeIcon icon={faArrowDown}  />
              </div>
              <span className=''>
                {group.votes}
              </span>
            </div> */}
            {/* <span className='fst-italic' >{description}</span>
            <span className='fst-italic'>{autor}</span> */}
        </div>
        </div>
    </div>
    
    </>
  )
}

export default StudyGroupItem