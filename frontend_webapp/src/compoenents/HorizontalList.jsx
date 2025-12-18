

import React, { useRef, useState,useEffect } from 'react'
import StudyGroupItem from './StudyGroupItem'
import { faAngleRight,faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HorizontalList = ({groups,title}) => {

    const scrollRef = useRef(null);
    const [canScroll, setCanScroll] = useState(false);

    // Detect if scroll is needed
    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollWidth, clientWidth } = scrollRef.current;
        setCanScroll(scrollWidth > clientWidth);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [groups]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({left: -300,behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({left: 300, behavior: "smooth" });
        }
    };

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftPos = useRef(0);
    const [dragging,setDragging] = useState(false);

    const onMouseDown = (e) => {
        isDragging.current = true;
        setDragging(true);
        startX.current = e.clientX;
        scrollLeftPos.current = scrollRef.current.scrollLeft;
    };

    const onMouseMove = (e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - startX.current;
        scrollRef.current.scrollLeft = scrollLeftPos.current - dx;
    };

    const onMouseUp = () => {
        isDragging.current = false;
        setDragging(false);
    };



    return (
        <>
            <div className='m-2 mt-4 p-2'>

                <h3 className='fw-bold'>{title}</h3>

                <div className='d-flex'>
                
                {canScroll && (<button className='my-auto me-3 side-btn' onClick={scrollLeft}> 
                    <FontAwesomeIcon icon={faAngleLeft} className='side-btn-icon' /> 
                    </button>)}

                <div ref={scrollRef} className="d-flex flex-nowrap overflow-x-auto border rounded border-secondary"
                style={{scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE
                        cursor: dragging ? "grabbing" : "grab",
                        }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                     {/* Hide scrollbar for Chrome/Webkit */}
                    <style>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {groups.map((item,index) => (
                        <StudyGroupItem key={index} group={item}/> 
                    ))}


                </div>
                {canScroll && (
                    <button onClick={scrollRight} className='my-auto ms-3 side-btn'> 
                    <FontAwesomeIcon icon={faAngleRight} className='side-btn-icon' />
                    </button>)}

                 </div>

            </div>


        </>
    )
}

export default HorizontalList