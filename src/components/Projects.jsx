import React from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Vidyalaya",
    desc: "School management portal for teachers.",
    tech: "Angular, Typescript",
    link: "https://www.vidyalayaschoolsoftware.com/",
  },
  {
    title: "Opps LMS",
    desc: "Scalable LMS with Zoom integration (Teacher Panel).",
    tech: "React.js, Zoom SDK",
    link: "https://oopsstudy.com/",
  },
  {
    title: "Klevr",
    desc: "Employee verification portal with task mgmt.",
    tech: "Next.js, Node.js, Typescript",
    link: "#",
  },
  {
    title: "Fanbucs",
    desc: "Creator-follower platform.",
    tech: "React, Next.js, Typescript",
    link: "https://fanbucs.com/",
  },
  {
    title: "easyIME",
    desc: "Connecting Green Card applicants with certified USCIS civil surgeons.",
    tech: "React.js",
    link: "https://www.easyime.com/",
  },
  {
    title: "easyILA",
    desc: "Connecting individuals with lawyers for Green Card renewals, EB-5, and naturalization.",
    tech: "React.js",
    link: "https://easyila.com/",
  },
  {
    title: "Jaher Notice",
    desc: "A mobile app providing property notices, title searches, and related information.",
    tech: "React Native",
  },
  {
    title: "Property Valuation",
    desc: "A mobile app for storing and managing data for property valuation reports.",
    tech: "React Native",
  },
];

export default function Projects() {
  return (
    <motion.section
      id="projects"
      className="section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <motion.div
          className="projects-grid"
          initial="hidden"
          whileInView="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {projects.map((p, i) => (
            <motion.a
              key={i}
              className="project-card"
              href={p.link || "#"}
              target="_blank"
              rel="noreferrer"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <div className="project-content">
                <h5 className="project-title">{p.title}</h5>
                <p className="project-desc text-secondary">{p.desc}</p>
                <div className="project-tech">{p.tech}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
