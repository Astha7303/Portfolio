import React from 'react'
import { motion } from 'framer-motion'

const aboutText = `Looking forward to a dynamic role in software development where I can leverage my expertise in modern web technologies to create innovative and efficient solutions. Passionate about exploring emerging frameworks, enhancing development processes, and continuously learning new tools to drive technical excellence.`

export default function About(){
  return (
    <motion.section id="about" className="section" initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
      <div className="container">
        <h2 className="section-title">About</h2>
        <div className="row">
          <div className="col-lg-10">
            <p className="lead text-grey">{aboutText}</p>
            <p><strong>Education:</strong> B.Tech in Computer Engineering — Silver Oak University (2024)</p>
            <p className="mt-2"><strong>Current:</strong> ReactJs Developer at Proplegit Global Pvt Ltd (June 2025 - Present)</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
