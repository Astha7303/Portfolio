import React from 'react'
import { motion } from 'framer-motion'

const skillCategories = [
  {title: 'Frontend', items: ['HTML','CSS','Bootstrap','JavaScript','React.js','Next.js','AngularJS']},
  {title: 'Version Control', items: ['Git','GitHub','GitLab']},
  {title: 'Design', items: ['Responsive Design','UX Optimization']}
]

export default function Skills(){
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">Skills</h2>
        <div className="row">
          {skillCategories.map((cat, idx)=>(
            <div key={idx} className="col-md-4 mb-3">
              <motion.div initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} transition={{delay:idx*0.12}} className="card p-3 skill-card">
                <h5 className="mb-3 text-secondary">{cat.title}</h5>
                <div>
                  {cat.items.map((s,i)=>(
                    <motion.span key={i} whileHover={{scale:1.05}} className="badge skill-badge me-2 mb-2">{s}</motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
