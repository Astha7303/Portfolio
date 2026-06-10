import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/**
 * Scene3D — a scroll-driven 3D portfolio journey.
 *
 * Scrolling advances a TIMELINE rather than just moving content: a stylized
 * avatar walks along a curved path through five connected "environments"
 * (Hero → About → Skills → Projects → Contact). The camera smoothly follows and
 * gently orbits the avatar; floating geometric shapes, particles and dynamic,
 * per-environment lighting fill the world. Depth-of-field + bloom add cinematic
 * depth on capable devices.
 *
 * Synchronization: scroll position drives a target progress; everything is
 * frame-rate-independent damped toward its target (no abrupt jumps). When
 * scrolling stops, the gait blends into a relaxed idle. Built on raw three.js
 * (already a dependency) with a performance-tier system for graceful mobile
 * degradation.
 */
export default function Scene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const damp = THREE.MathUtils.damp;
    const lerp = THREE.MathUtils.lerp;
    const clamp = THREE.MathUtils.clamp;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---------- performance tier ----------
    const isMobile =
      window.matchMedia("(max-width: 900px)").matches ||
      (navigator.maxTouchPoints || 0) > 1;
    const tier = isMobile ? "low" : "high";
    const cfg = {
      high: { dpr: 2, shapes: 26, particles: 700, post: true, aa: true },
      low: { dpr: 1.5, shapes: 10, particles: 220, post: false, aa: false },
    }[tier];

    // ---------- palette: one accent hue per environment ----------
    const HUES = [0x7c4dff, 0x2d8fc5, 0x29c5a8, 0xc54db0, 0xf0a93b];
    const hueColors = HUES.map((h) => new THREE.Color(h));
    const SECTIONS = HUES.length; // 5

    // ---------- renderer ----------
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: cfg.aa,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.dpr));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // ---------- scene & camera ----------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.028);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 2, 10);

    // ---------- lights ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(5, 10, 6);
    scene.add(key);
    // dynamic mood light that follows the avatar and changes color per zone
    const moodLight = new THREE.PointLight(HUES[0], 2.4, 26, 1.6);
    scene.add(moodLight);
    const moodLight2 = new THREE.PointLight(HUES[1], 1.4, 22, 1.8);
    scene.add(moodLight2);

    // ---------- the curved path (the timeline) ----------
    const pts = [
      new THREE.Vector3(0, 0, 6),
      new THREE.Vector3(-3.2, 0.6, -1),
      new THREE.Vector3(3.0, -0.3, -8),
      new THREE.Vector3(-2.6, 0.9, -15),
      new THREE.Vector3(2.6, -0.2, -22),
      new THREE.Vector3(0, 0.5, -29),
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);

    // faint path ribbon so the route reads in space
    const pathLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(200)),
      new THREE.LineBasicMaterial({
        color: 0x66708a,
        transparent: true,
        opacity: 0.25,
      })
    );
    scene.add(pathLine);

    // ---------- per-environment props (platform + ring) ----------
    const envGroup = new THREE.Group();
    scene.add(envGroup);
    const envT = (i) => i / (SECTIONS - 1); // 0..1 along the curve
    for (let i = 0; i < SECTIONS; i++) {
      const p = curve.getPointAt(envT(i));
      const col = hueColors[i];

      const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.6, 0.18, 40),
        new THREE.MeshStandardMaterial({
          color: 0x0e1320,
          roughness: 0.6,
          metalness: 0.3,
          emissive: col,
          emissiveIntensity: 0.05,
        })
      );
      platform.position.set(p.x, p.y - 1.3, p.z);
      envGroup.add(platform);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.04, 12, 60),
        new THREE.MeshStandardMaterial({
          color: col,
          emissive: col,
          emissiveIntensity: 1.4,
          roughness: 0.4,
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(p.x, p.y - 1.2, p.z);
      envGroup.add(ring);
    }

    // ---------- floating geometric shapes ----------
    const shapeGeos = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.55, 0),
      new THREE.TorusGeometry(0.4, 0.16, 10, 24),
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.DodecahedronGeometry(0.5, 0),
    ];
    const shapes = [];
    for (let i = 0; i < cfg.shapes; i++) {
      const t = Math.random();
      const on = curve.getPointAt(clamp(t, 0, 1));
      const col = hueColors[Math.floor(t * (SECTIONS - 1) + 0.5)];
      const geo = shapeGeos[i % shapeGeos.length];
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: col,
          emissive: col,
          emissiveIntensity: 0.5,
          roughness: 0.35,
          metalness: 0.4,
          flatShading: true,
        })
      );
      mesh.position.set(
        on.x + (Math.random() - 0.5) * 9,
        on.y + (Math.random() - 0.5) * 6 + 1.5,
        on.z + (Math.random() - 0.5) * 6
      );
      const s = 0.5 + Math.random() * 1.1;
      mesh.scale.setScalar(s);
      mesh.userData = {
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ),
        bob: Math.random() * Math.PI * 2,
        bobAmp: 0.2 + Math.random() * 0.4,
        baseY: mesh.position.y,
      };
      shapes.push(mesh);
      scene.add(mesh);
    }

    // ---------- particles ----------
    const pCount = cfg.particles;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const t = Math.random();
      const on = curve.getPointAt(clamp(t, 0, 1));
      pPos[i * 3] = on.x + (Math.random() - 0.5) * 16;
      pPos[i * 3 + 1] = on.y + (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = on.z + (Math.random() - 0.5) * 10;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xbfd0ff,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particles);

    // ================= the avatar (articulated walking rig) =================
    const PURPLE = 0x7c4dff;
    const BLUE = 0x2d8fc5;
    const SKIN = 0xf1c6a3;
    const HAIR = 0x241c16;
    const SHOE = 0x14171c;
    const mat = (color, opts = {}) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.1,
        ...opts,
      });
    const skinMat = mat(SKIN);
    const hairMat = mat(HAIR, { roughness: 0.75 });
    const shirtMat = mat(PURPLE, { emissive: PURPLE, emissiveIntensity: 0.2 });
    const pantsMat = mat(BLUE, { emissive: BLUE, emissiveIntensity: 0.15 });
    const shoeMat = mat(SHOE, { metalness: 0.3, roughness: 0.4 });
    const eyeMat = mat(0x101418, { roughness: 0.3 });

    const avatar = new THREE.Group(); // built facing +Z (its "forward")

    const torso = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.34, 0.5, 8, 16),
      shirtMat
    );
    torso.position.y = 0.55;
    avatar.add(torso);

    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.34), pantsMat);
    hips.position.y = 0.16;
    avatar.add(hips);

    const head = new THREE.Group();
    head.position.y = 1.2;
    avatar.add(head);
    head.add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), skinMat));
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
      hairMat
    );
    hair.position.y = 0.04;
    head.add(hair);
    const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.11, 0.02, 0.3);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.11, 0.02, 0.3);
    head.add(eyeR);

    const makeLimb = (radius, length, material, jointPos) => {
      const pivot = new THREE.Group();
      pivot.position.set(...jointPos);
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(radius, length, 6, 12),
        material
      );
      mesh.position.y = -(length / 2 + radius);
      pivot.add(mesh);
      return { pivot, reach: length + radius * 2 };
    };
    const armL = makeLimb(0.11, 0.42, shirtMat, [-0.42, 0.92, 0]);
    const armR = makeLimb(0.11, 0.42, shirtMat, [0.42, 0.92, 0]);
    const handGeo = new THREE.SphereGeometry(0.1, 12, 12);
    [armL, armR].forEach((a) => {
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.y = -a.reach + 0.02;
      a.pivot.add(hand);
    });
    avatar.add(armL.pivot, armR.pivot);

    const legL = makeLimb(0.13, 0.5, pantsMat, [-0.18, 0.1, 0]);
    const legR = makeLimb(0.13, 0.5, pantsMat, [0.18, 0.1, 0]);
    const shoeGeo = new THREE.BoxGeometry(0.26, 0.14, 0.4);
    [legL, legR].forEach((l) => {
      const shoe = new THREE.Mesh(shoeGeo, shoeMat);
      shoe.position.set(0, -l.reach + 0.02, 0.12);
      l.pivot.add(shoe);
    });
    avatar.add(legL.pivot, legR.pivot);

    avatar.scale.setScalar(0.95);
    scene.add(avatar);

    // ---------- post-processing (high tier only) ----------
    let composer = null;
    let bokehPass = null;
    if (cfg.post) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.7, // strength
        0.6, // radius
        0.85 // threshold
      );
      composer.addPass(bloom);
      bokehPass = new BokehPass(scene, camera, {
        focus: 8.0,
        aperture: 0.0009,
        maxblur: 0.006,
      });
      composer.addPass(bokehPass);
      composer.addPass(new OutputPass());
    }

    // ================= scroll → progress =================
    let scrollFraction = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollFraction = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) composer.setSize(w, h);
      onScroll();
    };
    window.addEventListener("resize", onResize);

    // ---------- smoothed animation state ----------
    let progress = 0; // smoothed journey progress 0..1
    let lastProgress = 0;
    let stepPhase = 0;
    let strideAmp = 0; // blends 0 (idle) ↔ walk for smooth start/stop
    let orbit = 0;

    const camPos = new THREE.Vector3(0, 2, 10);
    const camLook = new THREE.Vector3();
    const tmpPos = new THREE.Vector3();
    const tmpTan = new THREE.Vector3();
    const tmpOff = new THREE.Vector3();
    const UP = new THREE.Vector3(0, 1, 0);
    const lookTarget = new THREE.Vector3();
    const lookAhead = new THREE.Vector3();

    const clock = new THREE.Clock();
    let elapsed = 0;
    let raf;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      let dt = clock.getDelta();
      dt = Math.min(dt, 0.05); // clamp after tab switches → no jumps
      elapsed += dt;

      // --- progress: damp toward scroll target (synchronized, no jumps) ---
      progress = prefersReduced
        ? scrollFraction
        : damp(progress, scrollFraction, 4, dt);
      const dP = progress - lastProgress;
      lastProgress = progress;
      const speed = Math.abs(dP) / Math.max(dt, 1e-4); // progress/sec
      const walking = speed > 0.015;

      // --- gait: blend stride amplitude, advance step phase ---
      const targetStride = prefersReduced ? 0 : walking ? 0.65 : 0.0;
      strideAmp = damp(strideAmp, targetStride, 6, dt);
      if (!prefersReduced) {
        // steps track scroll distance; gentle sway when idle
        stepPhase += Math.abs(dP) * 180 + (walking ? 0 : dt * 0.7);
      }
      const s = Math.sin(stepPhase);
      const sOff = Math.sin(stepPhase + Math.PI);
      const idleSway = prefersReduced ? 0 : 0.12;

      legL.pivot.rotation.x = s * strideAmp;
      legR.pivot.rotation.x = sOff * strideAmp;
      armL.pivot.rotation.x = sOff * strideAmp * 0.9 + sOff * idleSway * 0.2;
      armR.pivot.rotation.x = s * strideAmp * 0.9 + s * idleSway * 0.2;
      armL.pivot.rotation.z = 0.12;
      armR.pivot.rotation.z = -0.12;

      // --- place & orient the avatar on the curve ---
      curve.getPointAt(progress, tmpPos);
      curve.getTangentAt(progress, tmpTan).normalize();
      const bob = prefersReduced ? 0 : Math.abs(s) * (walking ? 0.1 : 0.0);
      const breathe = prefersReduced ? 0 : Math.sin(elapsed * 1.4) * 0.02;
      avatar.position.set(tmpPos.x, tmpPos.y + bob + breathe, tmpPos.z);
      lookAhead.copy(tmpPos).add(tmpTan);
      avatar.lookAt(lookAhead); // +Z faces along the path
      head.rotation.x = prefersReduced ? 0 : Math.sin(elapsed * 0.9) * 0.05;

      // --- camera: follow behind + above, gentle orbit, smooth ---
      orbit = prefersReduced ? 0 : Math.sin(elapsed * 0.16) * 0.55;
      tmpOff.copy(tmpTan).multiplyScalar(-6.5); // behind the avatar
      tmpOff.y += 2.6; // above
      tmpOff.applyAxisAngle(UP, orbit); // orbit around the avatar
      const desired = tmpPos.clone().add(tmpOff);
      camPos.x = damp(camPos.x, desired.x, 3, dt);
      camPos.y = damp(camPos.y, desired.y, 3, dt);
      camPos.z = damp(camPos.z, desired.z, 3, dt);
      camera.position.copy(camPos);

      lookTarget.set(tmpPos.x, tmpPos.y + 1.0, tmpPos.z);
      camLook.x = damp(camLook.x, lookTarget.x, 4, dt);
      camLook.y = damp(camLook.y, lookTarget.y, 4, dt);
      camLook.z = damp(camLook.z, lookTarget.z, 4, dt);
      camera.lookAt(camLook);

      // --- dynamic mood lighting: lerp hue across environments ---
      const seg = progress * (SECTIONS - 1);
      const i0 = Math.floor(seg);
      const i1 = Math.min(i0 + 1, SECTIONS - 1);
      const f = seg - i0;
      moodLight.color.copy(hueColors[i0]).lerp(hueColors[i1], f);
      moodLight.position.set(tmpPos.x, tmpPos.y + 3, tmpPos.z + 2);
      moodLight2.color.copy(hueColors[i1]).lerp(hueColors[i0], f);
      moodLight2.position.set(tmpPos.x - 3, tmpPos.y + 1, tmpPos.z - 2);

      // --- floating shapes ---
      if (!prefersReduced) {
        for (const m of shapes) {
          const u = m.userData;
          m.rotation.x += u.spin.x * dt;
          m.rotation.y += u.spin.y * dt;
          m.rotation.z += u.spin.z * dt;
          m.position.y = u.baseY + Math.sin(elapsed * 0.6 + u.bob) * u.bobAmp;
        }
        // drift particles upward, recycle
        const arr = pGeo.attributes.position.array;
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] += dt * 0.25;
          if (arr[i] > 10) arr[i] -= 20;
        }
        pGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = elapsed * 0.01;
      }

      // --- depth of field: keep the avatar in focus ---
      if (bokehPass) {
        const dist = camera.position.distanceTo(avatar.position);
        const u = bokehPass.uniforms || bokehPass.materialBokeh?.uniforms;
        if (u && u.focus) u.focus.value = damp(u.focus.value, dist, 5, dt);
      }

      if (composer) composer.render(dt);
      else renderer.render(scene, camera);
    };
    animate();

    // ---------- cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (composer) composer.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material))
            obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="scene3d-canvas" aria-hidden="true" />;
}
