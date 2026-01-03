

import React, { useEffect, useState } from 'react'
import Introduction from './Introduction'
import HorizontalList from './HorizontalList'
import { LATESTS_ENDPOINT } from '../constants/endpoints'

const HomePage = () => {

    const [featuredGroups, setFeaturedGroups] = useState([]);
    const [latestGroups,setLatestGroups] = useState([]);

    const getGroups = async () =>{
      //const url = new URL(LATESTS_ENDPOINT);url.search = new URLSearchParams( {"isFeatured":isFeatured} ).toString();

      const res = await fetch(LATESTS_ENDPOINT,{method:"GET"})
      const data = await res.json();

      //if("latest" in data) console.log(data.latest);
      //console.log(data);
      
      if(res.ok){
        setFeaturedGroups(data.featured);
        setLatestGroups(data.latest);
      }else{console.log(data);}

    }

    useEffect(()=>{getGroups();},[]);

  return (
    <>
    <Introduction />
    <HorizontalList groups={featuredGroups} title={"Featured"} />
    <HorizontalList groups={latestGroups} title={"Latest Groups"} />
    </>
  )
}

export default HomePage