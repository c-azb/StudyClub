
import React, { useContext, useEffect, useState } from 'react'
import { GENERATE_ENDPOINT } from '../constants/endpoints';
import { useNavigate, useParams } from 'react-router-dom';
import { UserDataContext } from '../contexts/UserDataProvider';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../contexts/AuthProvider';
import { GET_CONFIGS_ENDPOINT } from '../constants/endpoints';

const GenerateStudy = () => {

  const {pk} = useParams();

  const contentLayerOptions = ["Basics","Mediun","Advanced"];
  const schoolLevelOptions = ["Primary","Middle school","High School","Bachelor's","Specialist","Master's","Doctoral"];
  const learnSpeedOptions = ["Fast","Slow","Balanced"];
  const aiComplexityOptions = ["Simple","Medium","Advanced"];

  const [title,setTitle] = useState('');
  const [image,setImage] = useState(null);
  const [subject,setSubject] = useState('');
  const [contentLayer,setContentLayer] = useState("0");
  const [schoolLevel,setSchoolLevel] = useState(schoolLevelOptions[0].toLowerCase());
  const [startPoint,setStartPoint] = useState('');
  const [learnSpeed,setLearnSpeed] = useState("0");
  const [aiComplexity,setAIComplexity] = useState("0");
  const [isPublic,setIsPublic] = useState(false);

  const [isGenerating,setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const {getStudyProgram,addStudyProgram} = useContext(UserDataContext);
  const {isLoggedIn,register,login,logout,accessToken} = useContext(AuthContext);

  const initData = async () => {
    if (pk == "none") return;
    
    const res = await fetch(`${GET_CONFIGS_ENDPOINT}${pk}/`,{
      method:"GET",
      headers:{"Authorization": "Bearer " + accessToken.current }
    })
    
    const data = await res.json();
    console.log(data);
    
    if(res.ok){
      /*
      aiComplexity:0
contentLayer:0
id 2
learnSpeed 0
schoolLevel "high school"
startPoint:""
studyPlan:3
subject:"Python basics"
      */

    }



  }

  useEffect(()=>{initData();},[]);

  const onClickGenerate = async () => {
    setIsGenerating(true);

    const sendData = {title,image,subject,contentLayer,schoolLevel,startPoint,learnSpeed,aiComplexity,"is_public":isPublic};
    const formData = new FormData();
    Object.entries(sendData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetch(GENERATE_ENDPOINT,{
      method:"POST",
      headers:{"Authorization": "Bearer " + accessToken.current }, //"Content-Type": "multipart/form-data", 
      body:formData
    });

    const data = await res.json();
    //console.log(data);
    setIsGenerating(false);

    if(res.ok){
      addStudyProgram(data);
      navigate(`/displayStudy/${data.id}`)
    }else{console.log(data);}
  }

  return (
    <>

    <div className="d-flex flex-column">
       <h2 className='mb-3'>Title</h2>
       <input className='p-2 text-input' value={title} onChange={(e)=>{setTitle(e.target.value);}} 
       type='text' placeholder='Study program Title'/>
    </div>

    <div className="d-flex flex-column mt-5">
       <h3>Image</h3>
       <span className='txt-description'>Optional...</span>
      <input type="file" accept="image/*" onChange={(e)=>{setImage(e.target.files[0]);}} />
    </div>

    <div className="d-flex flex-column mt-5">
       <h3>Study Topics</h3>
       <span className='txt-description'>Type the topics you want the AI to generate your study plan and content.</span>
        <textarea placeholder="topics you already know; don't want the ai to repeat itself,... " className='p-2 text-input'
        value={subject} onChange={(e)=>{setSubject(e.target.value);}}
        ></textarea>
    </div>

    <div className='d-flex flex-column mt-5'>
      <h3>Content Layer</h3>
      <span className='txt-description'>Content layer helps the AI know how deep in the subject it should go.</span>
      <select value={contentLayer} onChange={(e)=>{setContentLayer(e.target.value);}}>
        {contentLayerOptions.map((item,index)=>(
          <option key={index} value={index} >{item}</option>
        ) )}
      </select>
    </div>

    <div className="d-flex flex-column mt-5">
       <h3>Schoolar Level</h3>
       <span className='txt-description'>Inform the level of the study, this will help the ai to identify which terms should use.</span>
      <select value={schoolLevel} onChange={(e)=>{setSchoolLevel(e.target.value);}}>
        {schoolLevelOptions.map((item,index) =>(
          <option key={index} value={item.toLowerCase()} >{item}</option>
        ))}
      </select>
    </div>

    <div className="d-flex flex-column mt-5">
       <h3>Start Point</h3>
       <span className='txt-description'>Inform which topics you already know with keywords, this will help the 
        AI to find the starting point, avoinding generating content you already know or unecessary. This can also be used to remove unwanted
        topics even if you don't know about it. Leave blank if you want the AI to decide the starting point.</span>
        <textarea placeholder="topics you already know; don't want the ai to repeat itself,... " className='p-2 text-input'
        value={startPoint} onChange={(e)=>{setStartPoint(e.target.value);}}>
        </textarea>
    </div>


    <div className="d-flex flex-column mt-5">
       <h3>Learn Speed</h3>
       <span className='txt-description'>
        *Fast will provide direct explanations and exemples<br/>
        *Slow will provide a slower explanation constantly recaptulating past explanations and more detailes examples.<br/>
        *Medium provide a balance between fast and slow.
       </span>
      <select value={learnSpeed} onChange={(e)=>{setLearnSpeed(e.target.value);}}>
        {learnSpeedOptions.map((item,index) =>(
          <option key={index} value={index} >{item}</option>
        ) )}
      </select>
    </div>

    <div className="d-flex flex-column mt-5">
       <h3>AI Complexity</h3>
       <span className='txt-description'>
        By setting the AI complexity you can balance costs and quality of the generated content.
        *Simple: Uses simple llm models and workflows.
        *Medium: Uses bigger llm models with a simplified workflow.
        *Advanced: Uses complex llm models with a more complex workflow by adding a validation of content layer.
       </span>
      <select value={aiComplexity} onChange={(e)=>{setAIComplexity(e.target.value);}}>
        {aiComplexityOptions.map((item,index) =>(
          <option key={index} value={index} >{item}</option>
        ))}
      </select>
    </div>

    <div className="d-flex flex-column mt-5">
       <h3>Accessibility</h3>
       <span className='txt-description'>
        Public study programs can be accessed by anyone.
        Private people can only access by being invited.
        </span>
        <div className="d-flex mt-1">
          <label htmlFor="public" className='my-auto'>Public</label>
          <input className='ms-2 my-auto' type="checkbox" name='public' checked={isPublic} onChange={(e)=>{setIsPublic(true);}} />

          <label htmlFor="private" className='ms-4'>Private</label>
          <input type="checkbox" className='my-auto ms-2' name='private' checked={!isPublic} onChange={(e)=>{setIsPublic(false);}} />
        </div>
      
      
    </div>

    {!isGenerating ? <button className='btn btn-outline-warning my-5' onClick={onClickGenerate}>Generate</button> :
    <button className='btn btn-outline-warning my-5' disabled>Generating <FontAwesomeIcon icon={faSpinner} spin/> </button>}
    
    
    </>
  )
}

export default GenerateStudy