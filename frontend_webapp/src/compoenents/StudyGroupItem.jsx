

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

  return (
    <>

    <div className='border rounded border-secondary p-2 m-2'>
        <div className="d-flex">
        <div>
        <img draggable={false} src={
          group.image ? `${FILE_ENDPOINT}${group.image}` : undefinedimg
        } alt="" style={{width:"150px",height:"auto",objectFit:"cover"}} />

        </div>
        <div className='mx-3 d-flex flex-column'>
            <span  onClick={onSelectItem} className='fw-bold fs-3 item-title'>{group.title}</span>
            <span className='fst-italic' >{"subject" in group ? group.subject : null}</span>
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