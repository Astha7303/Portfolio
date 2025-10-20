import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <section id="home" className="hero-section" aria-labelledby="hero-heading">
      <motion.div initial={{opacity:0, y:12, scale:0.98}} animate={{opacity:1, y:0, scale:1}} transition={{duration:0.8}} className="hero-inner">
        <h1 id="hero-heading" className="hero-title">Hi, I'm <span className="name-gradient">Astha Jethava</span></h1>
        <p className="hero-sub">Frontend Developer — building accessible, performant and user-friendly web apps with React.</p>
        <div className="hero-cta">
          <a href="#projects" className="btn btn-cta me-3">See my work</a>
          <a href="/Astha_Jethava.pdf" className="btn btn-ghost" download>Download CV</a>
        </div>
      </motion.div>
    </section>
  )
}
