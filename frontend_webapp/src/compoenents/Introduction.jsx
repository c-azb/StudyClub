
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Introduction = () => {
  const navigate = useNavigate();
  
  return (
    <>

    <p className='text-center'>
        Welcome to study club! Here you find study groups from different topics to learn together!
        <br />You can also generate your own study content with AI and use it for yourself or open it for a new study group!
    </p>

    <div className='d-flex'>
        <button onClick={()=>{navigate("/generateStudy");}} className='mx-auto mt-3 btn btn-outline-warning fw-bold'>
            Start Creating
        </button>
    </div>
    
    
    </>
  )
}

export default Introduction