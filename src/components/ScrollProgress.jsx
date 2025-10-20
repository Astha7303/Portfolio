import React, { useEffect, useState } from 'react'

export default function ScrollProgress(){
  const [progress, setProgress] = useState(0)
  useEffect(()=>{
    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (scrolled / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    return ()=> {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  },[])
  return <div className="scroll-progress" style={{width: progress+'%'}}></div>
}
