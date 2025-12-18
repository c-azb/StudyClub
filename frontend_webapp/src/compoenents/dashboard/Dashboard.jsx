
import React, { useState } from 'react'
import MyStudyPrograms from './MyStudyPrograms';
import AccInfo from './AccInfo';
import Friends from './Friends';
import Groups from './Groups';

const Dashboard = () => {

  const options = Object.freeze({"ACCOUNT":0,"PROGRAMS":1,"GROUPS":2,"FRIENDS":3} );

  const [option,setOption] = useState(options.ACCOUNT);

  const onClickOption = (ref,option) => {
    
    
    setOption(option);
    
  }

  return (
    <>
    
    <div className='row border rounded'>

        <div className='col d-flex flex-column dashboard-menu'>

            <button onClick={(e) => {onClickOption(e.target,options.ACCOUNT)}}>Account</button>
            <button onClick={(e) => {onClickOption(e.target,options.PROGRAMS)}}>My Study Programs</button>
            <button onClick={(e) => {onClickOption(e.target,options.GROUPS)}}>Groups</button>
            <button onClick={(e) => {onClickOption(e.target,options.FRIENDS)}}>Friends</button>

        </div>

        {/* <div className="col-1"></div> */}


        <div className="col-10 py-3 dashboard-content">

          {option == options.ACCOUNT ? <AccInfo /> :
          option == options.PROGRAMS ? <MyStudyPrograms /> :
          option == options.GROUPS ? <Groups /> :
          option == options.FRIENDS ? <Friends /> : null
          }

        </div>



    </div>
    
    
    </>
  )
}

export default Dashboard