import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackgroundBlobs from "./components/BackgroundBlobs";
import Scene3D from "./components/Scene3D";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <ScrollProgress />
      <Scene3D />
      <BackgroundBlobs />
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="main-content top-offset">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
