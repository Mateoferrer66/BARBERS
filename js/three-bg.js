/* ============================================
   Three.js 3D Particle Background
   Golden floating particles with orbital motion
   ============================================ */

(function () {
  'use strict';

  // Wait for Three.js to load
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded, 3D background disabled.');
    return;
  }

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Particle system
  const PARTICLE_COUNT = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const opacities = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Distribute in a sphere
    const radius = 4 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Random velocities for orbital motion
    velocities[i3] = (Math.random() - 0.5) * 0.002;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;

    sizes[i] = Math.random() * 3 + 0.5;
    opacities[i] = Math.random() * 0.5 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

  // Custom shader material for gold particles
  const vertexShader = `
    attribute float aSize;
    attribute float aOpacity;
    varying float vOpacity;
    uniform float uTime;
    
    void main() {
      vOpacity = aOpacity;
      vec3 pos = position;
      
      // Subtle floating motion
      pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.15;
      pos.y += cos(uTime * 0.2 + position.x * 0.5) * 0.15;
      pos.z += sin(uTime * 0.25 + position.z * 0.3) * 0.1;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vOpacity;
    
    void main() {
      // Circular soft particle
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
      
      // Gold color: rgb(201, 169, 110) = (0.788, 0.663, 0.431)
      vec3 color = vec3(0.788, 0.663, 0.431);
      
      // Slight warm variation
      color += vec3(0.08, 0.04, -0.02) * sin(dist * 6.0);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }
    }
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Add a second layer of larger, dimmer particles for depth
  const LARGE_COUNT = 200;
  const lgGeometry = new THREE.BufferGeometry();
  const lgPositions = new Float32Array(LARGE_COUNT * 3);
  const lgSizes = new Float32Array(LARGE_COUNT);
  const lgOpacities = new Float32Array(LARGE_COUNT);

  for (let i = 0; i < LARGE_COUNT; i++) {
    const i3 = i * 3;
    const radius = 6 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    lgPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    lgPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    lgPositions[i3 + 2] = radius * Math.cos(phi);

    lgSizes[i] = Math.random() * 6 + 3;
    lgOpacities[i] = Math.random() * 0.15 + 0.05;
  }

  lgGeometry.setAttribute('position', new THREE.BufferAttribute(lgPositions, 3));
  lgGeometry.setAttribute('aSize', new THREE.BufferAttribute(lgSizes, 1));
  lgGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(lgOpacities, 1));

  const lgParticles = new THREE.Points(lgGeometry, material);
  scene.add(lgParticles);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsed;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    // Slow rotation
    particles.rotation.y = elapsed * 0.03 + mouseX * 0.1;
    particles.rotation.x = mouseY * 0.05;

    lgParticles.rotation.y = elapsed * 0.02 - mouseX * 0.05;
    lgParticles.rotation.x = elapsed * 0.01 + mouseY * 0.03;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);

  // Reduce animation on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    renderer.setPixelRatio(1);
  }

})();
