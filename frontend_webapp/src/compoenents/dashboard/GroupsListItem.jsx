import React from 'react'
import { useNavigate } from 'react-router-dom';
import UpDownVote from '../UpDownVote';

const GroupsListItem = ({ studyPrograms }) => {

  const navigate = useNavigate();

  const onClickItem = (pk) => {
    navigate(`/displayStudy/${pk}`);
  }

  const get_limited_subject = (group) => {
    if ("subject" in group) {
      const subject = group.subject;
      if (subject.length > 25) {
        return subject.slice(0, 25) + '...';
      }
      return subject;
    }
    return null;
  }

  return (
    <>
      {studyPrograms.map((item, index) => (
        <div key={index} className='study-topic p-3 d-flex flex-column' onClick={() => { onClickItem(item.id); }}>
          <div className="d-flex">
            <h3>{`${index + 1}- ${item.title}`}</h3>
            <div className="ms-auto">
              <UpDownVote studyProgram={item} canVote={true} />
            </div>

          </div>
          <span className='fst-italic' >{get_limited_subject(item)}</span>
          <span className='mt-auto ms-auto txt-description'>{item.updated_at}</span>
        </div>
      ))}

    </>
  )
}

export default GroupsListItem