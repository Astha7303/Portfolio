import React, { useState } from 'react'
import { Link } from 'react-scroll'
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'

export default function Navbar({theme, setTheme}){
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar-custom">
      <div className="nav-container">
        <div className="brand">Astha Jethava<span className="brand-small">Frontend Developer</span></div>
        
        <button className="nav-toggle" onClick={()=>setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
        
        <nav className={`nav-links ${open?'show':''}`}>
          <Link to="home"  onClick={()=>setOpen(false)}>Home</Link>
          <Link to="about"  onClick={()=>setOpen(false)}>About</Link>
          <Link to="skills"  onClick={()=>setOpen(false)}>Skills</Link>
          <Link to="projects"  onClick={()=>setOpen(false)}>Projects</Link>
          <Link to="contact"  onClick={()=>setOpen(false)}>Contact</Link>
        </nav>

        <button className="theme-toggle-inline" onClick={()=> setTheme(theme==='dark'?'light':'dark')} title="Toggle theme">
          {theme==='dark'? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  )
}
