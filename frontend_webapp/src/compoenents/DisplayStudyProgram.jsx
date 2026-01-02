


import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../contexts/UserDataProvider'
import { faAngleDown,faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp,faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import UpDownVote from './UpDownVote';


const DisplayStudyProgram = () => {

    const {pk} = useParams();

    const {getStudyProgram,addStudyProgram,listAllMyPrograms,studyPrograms,deleteStudyProgrms} = useContext(UserDataContext);
    const [studyProgram,setStudyProgram] = useState(null);
    const [displaysStatus,setDisplaysStatus] = useState({});

    const navigate = useNavigate();

    const setStudyPrograms = async () =>{
        const program = await getStudyProgram(pk);
        if (program == null) return;
        //console.log(program);
        
        const displays = {}
        for (let i=0;i<program.topics.length;i++){
           displays[`${i}-dispbar` ] = i == 0;
        }
        setStudyProgram(program);
        setDisplaysStatus(displays);
    }

    useEffect(()=>{setStudyPrograms(); },[] );

    const onClickOption = (id) =>{
        const div_ = document.getElementById(id);
        if(div_.classList.contains('d-none')){
            setDisplaysStatus({...displaysStatus,[id]:true});
        }else{
            setDisplaysStatus({...displaysStatus,[id]:false});
        }
    }

    const onClickDelete = async () => {
        const res = await deleteStudyProgrms(studyProgram.id);
        if(res){navigate('/');}
    }

    const onClickRegen = () => {
        if(studyProgram != null) navigate(`/generateStudy/${studyProgram.id}`);
    }



  return (
    <>
    {studyProgram != null ?

    <div>

    <div className="d-flex">
        <h2 className='ms-5 mb-5 fw-bolder'> {studyProgram.title}</h2>
        <UpDownVote studyProgram={studyProgram} canVote={true}/>
    </div>
        

    {studyProgram.topics.map((item,index) => (
        <div key={index} className='p-3' >
            <div onClick={() => {onClickOption(`${index}-dispbar`);}} className="d-flex pt-3 pb-1 ps-3 study-topic">
                <h3>{item.title}</h3>
                {
                    displaysStatus[`${index}-dispbar`] ? <FontAwesomeIcon className='ms-auto me-3 my-auto' icon={faAngleUp} /> :
                    <FontAwesomeIcon className='ms-auto me-3 my-auto' icon={faAngleDown} />
                }
            </div>
            
            <div id={`${index}-dispbar`} className={displaysStatus[`${index}-dispbar`] ? '':'d-none' }>
                <div className="topic-content p-3">
                    <Markdown>{item.content}</Markdown>
                </div>
            </div>
        </div>
    ))}

    {studyProgram.is_owner ? 
    <div className='d-flex float-end my-5'>
        <button className='btn btn-danger me-3' onClick={onClickDelete}>Delete Program</button>
        <button className='btn btn-warning' onClick={onClickRegen}>Regenerate</button>
    </div>
    : null
    }

    </div> 
    
    : null
    }
    
    </>
  )
}

export default DisplayStudyProgram