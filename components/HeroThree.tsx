'use client';

import { useEffect, useRef } from 'react';

/* Iridescent glass "%" sculpture behind the hero.

   Ported from the prototype's hero3d.js custom element. Two changes:
   `three` is a real dependency rather than a jsdelivr import (the export
   build must not reach the network at runtime), and it renders into a React
   ref instead of a custom element.

   It is decorative: pointer-events are off, it never blocks paint, and if
   WebGL or the module fails it simply doesn't appear. */
export default function HeroThree() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let disposed = false;
    // Populated by the async setup so cleanup works even if it runs first.
    let teardown: (() => void) | null = null;

    (async () => {
      let THREE: typeof import('three');
      try {
        THREE = await import('three');
      } catch {
        return; // no WebGL bundle — leave the space empty
      }
      if (disposed || !el.isConnected) return;

      const W = () => Math.max(el.clientWidth, 10);
      const H = () => Math.max(el.clientHeight, 10);

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // WebGL unavailable (older browsers, blocked contexts)
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W(), H());
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 100);
      camera.position.set(0, 0, 8.4);

      // Soft studio environment painted into a canvas, so there is no HDR to fetch.
      const cnv = document.createElement('canvas');
      cnv.width = 512;
      cnv.height = 256;
      const ctx = cnv.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.42, '#e9e2ff');
      g.addColorStop(0.7, '#ffe6d4');
      g.addColorStop(1, '#cfe6ff');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.fillRect(0, 52, 512, 14);
      ctx.fillRect(0, 150, 512, 8);

      const envTex = new THREE.CanvasTexture(cnv);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(envTex).texture;

      const glass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.88,
        thickness: 1.6,
        roughness: 0.1,
        ior: 1.4,
        iridescence: 1,
        iridescenceIOR: 1.32,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.25,
        attenuationColor: new THREE.Color(0xf0e9ff),
        attenuationDistance: 2.5,
      });

      const pct = new THREE.Group();
      const t1 = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.35, 48, 96), glass);
      t1.position.set(-1.32, 1.32, 0);
      const t2 = t1.clone();
      t2.position.set(1.32, -1.32, 0);
      const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 3.5, 8, 28), glass);
      bar.rotation.z = -Math.PI / 4.2;
      pct.add(t1, t2, bar);
      scene.add(pct);

      const pal = [0xd9c7ff, 0xffd3b8, 0xbee3ff, 0xc8f1dd];
      const defs: [import('three').BufferGeometry, number, number, number, number][] = [
        [new THREE.SphereGeometry(0.34, 40, 40), -2.9, -1.5, -1.2, 0],
        [new THREE.SphereGeometry(0.2, 32, 32), 2.7, 1.9, -1.6, 1],
        [new THREE.IcosahedronGeometry(0.42, 0), 3, -0.4, -2.2, 2],
        [new THREE.SphereGeometry(0.14, 32, 32), -2.3, 2.2, -0.8, 3],
      ];
      const floaters = defs.map(([geo, x, y, z, ci], i) => {
        const m = new THREE.Mesh(
          geo,
          new THREE.MeshPhysicalMaterial({
            color: pal[ci],
            roughness: 0.28,
            clearcoat: 0.9,
            clearcoatRoughness: 0.2,
            envMapIntensity: 0.9,
          }),
        );
        m.position.set(x, y, z);
        m.userData = { y0: y, ph: i * 1.7, sp: 0.5 + i * 0.13 };
        scene.add(m);
        return m;
      });

      scene.add(new THREE.HemisphereLight(0xffffff, 0xe8e0ff, 1.1));
      const dir = new THREE.DirectionalLight(0xffffff, 2.2);
      dir.position.set(2, 4, 6);
      scene.add(dir);
      const p1 = new THREE.PointLight(0x9a6bff, 26, 0);
      p1.position.set(-4, 2.5, 4);
      scene.add(p1);
      const p2 = new THREE.PointLight(0xffb07a, 20, 0);
      p2.position.set(4, -2.5, 3);
      scene.add(p2);

      let mx = 0;
      let my = 0;
      let tx = 0;
      let ty = 0;
      let raf = 0;
      let visible = true;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return; // don't burn frames while scrolled away
        const t = clock.getElapsedTime();
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;
        pct.rotation.y = (reduced ? 0 : Math.sin(t * 0.28) * 0.34) + mx * 0.45;
        pct.rotation.x = (reduced ? 0 : Math.sin(t * 0.2) * 0.08) + my * 0.3;
        pct.position.y = reduced ? 0 : Math.sin(t * 0.7) * 0.12;
        for (const f of floaters) {
          const d = f.userData as { y0: number; ph: number; sp: number };
          if (!reduced) f.position.y = d.y0 + Math.sin(t * d.sp + d.ph) * 0.28;
          f.rotation.x += 0.003;
          f.rotation.y += 0.004;
        }
        renderer.render(scene, camera);
      };
      tick();

      const io = new IntersectionObserver((es) => {
        visible = es[0]?.isIntersecting ?? true;
      });
      io.observe(el);

      const ro = new ResizeObserver(() => {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      });
      ro.observe(el);

      teardown = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
        // Free GPU memory — StrictMode mounts twice in dev, and without this
        // each remount leaks a context until the browser drops the oldest.
        for (const f of floaters) {
          f.geometry.dispose();
          (f.material as import('three').Material).dispose();
        }
        t1.geometry.dispose();
        bar.geometry.dispose();
        glass.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };

      if (disposed) teardown();
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return <div ref={host} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
}
