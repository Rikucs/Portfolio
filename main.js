import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Global variables
let scene, camera, renderer, clock
let heroMesh, aboutMesh, skillsMesh, contactMesh
let particles = []
let mouse = { x: 0, y: 0 }
let isLoaded = false

// Initialize the application
class Portfolio3D {
  constructor() {
    this.init()
    this.setupEventListeners()
    this.animate()
  }

  init() {
    // Create loading screen
    this.createLoadingScreen()
    
    // Initialize Three.js
    this.initThree()
    
    // Create 3D scenes
    this.createHeroScene()
    this.createAboutScene()
    this.createSkillsScene()
    this.createProjectScenes()
    this.createContactScene()
    
    // Initialize interactions
    this.initScrollAnimations()
    this.initNavigation()
    this.initSkillBars()
    
    // Manually trigger skill animation after 3 seconds for testing
    setTimeout(() => {
      console.log('Manual skill animation trigger')
      this.animateSkillBars()
    }, 3000)
    
    // Remove loading screen
    setTimeout(() => {
      this.removeLoadingScreen()
    }, 2000)
  }

  createLoadingScreen() {
    const loading = document.createElement('div')
    loading.className = 'loading'
    loading.innerHTML = '<div class="loader"></div>'
    document.body.appendChild(loading)
  }

  removeLoadingScreen() {
    const loading = document.querySelector('.loading')
    if (loading) {
      loading.classList.add('fade-out')
      setTimeout(() => {
        loading.remove()
        isLoaded = true
      }, 500)
    }
  }

  initThree() {
    // Scene
    scene = new THREE.Scene()
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Clock
    clock = new THREE.Clock()
    
    // Add to hero container
    const container = document.getElementById('three-container')
    if (container) {
      container.appendChild(renderer.domElement)
    }
  }

  createHeroScene() {
    // Create floating geometric shapes
    const geometry = new THREE.IcosahedronGeometry(1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    })
    
    heroMesh = new THREE.Mesh(geometry, material)
    heroMesh.position.set(2, 0, 0)
    scene.add(heroMesh)
    
    // Create particle system
    this.createParticles()
    
    // Create additional shapes
    const shapes = []
    for (let i = 0; i < 5; i++) {
      const shape = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
          wireframe: true,
          transparent: true,
          opacity: 0.4
        })
      )
      shape.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      )
      shapes.push(shape)
      scene.add(shape)
    }
    
    // Animate shapes
    shapes.forEach(shape => {
      gsap.to(shape.rotation, {
        duration: 20,
        y: Math.PI * 2,
        repeat: -1,
        ease: "none"
      })
    })
    
    // Create mini spaceships
    this.createSpaceships()
  }

  createSpaceships() {
    const spaceships = []
    
    // Create spaceship geometry (simple triangular spaceship)
    const createSpaceshipGeometry = () => {
      const geometry = new THREE.ConeGeometry(0.1, 0.3, 3)
      return geometry
    }
    
    // Create multiple spaceships
    for (let i = 0; i < 3; i++) {
      const spaceship = new THREE.Mesh(
        createSpaceshipGeometry(),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        })
      )
      
      // Position spaceships off-screen
      spaceship.position.set(-15, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 3)
      spaceship.rotation.z = -Math.PI / 2 // Point forward (right direction)
      
      scene.add(spaceship)
      spaceships.push(spaceship)
      
      // Animate spaceship flying across
      gsap.to(spaceship.position, {
        x: 15,
        duration: 8 + Math.random() * 4, // Random speed
        delay: i * 3, // Stagger the spaceships
        repeat: -1,
        ease: "none",
        onComplete: () => {
          // Reset position when reaching the end
          spaceship.position.x = -15
          spaceship.position.y = (Math.random() - 0.5) * 8
          spaceship.position.z = (Math.random() - 0.5) * 3
        }
      })
      
      // Add subtle bobbing motion
      gsap.to(spaceship.position, {
        y: spaceship.position.y + (Math.random() - 0.5) * 2,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }
  }

  createParticles() {
    const particleCount = 100
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const material = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    })
    
    const points = new THREE.Points(geometry, material)
    scene.add(points)
    particles.push(points)
  }

  createAboutScene() {
    // Create about 3D visual
    const container = document.getElementById('about-3d')
    if (!container) return
    
    const aboutScene = new THREE.Scene()
    const aboutCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
    const aboutRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    aboutRenderer.setSize(container.offsetWidth, container.offsetHeight)
    container.appendChild(aboutRenderer.domElement)
    
    // Create rotating torus
    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0080,
      wireframe: true
    })
    
    aboutMesh = new THREE.Mesh(geometry, material)
    aboutScene.add(aboutMesh)
    aboutCamera.position.z = 3
    
    // Animation loop for about section
    const animateAbout = () => {
      if (aboutMesh) {
        aboutMesh.rotation.x += 0.01
        aboutMesh.rotation.y += 0.01
        aboutRenderer.render(aboutScene, aboutCamera)
      }
      requestAnimationFrame(animateAbout)
    }
    animateAbout()
  }

  createSkillsScene() {
    // Create skills 3D visual
    const container = document.getElementById('skills-3d')
    if (!container) return
    
    const skillsScene = new THREE.Scene()
    const skillsCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
    const skillsRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    skillsRenderer.setSize(container.offsetWidth, container.offsetHeight)
    container.appendChild(skillsRenderer.domElement)
    
    // Create skill nodes
    const skillNodes = []
    const colors = [0x00d4ff, 0xff0080, 0x00ff88, 0xffaa00, 0xff3366, 0x9933ff]
    
    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32)
      const material = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.8
      })
      
      const node = new THREE.Mesh(geometry, material)
      const angle = (i / 6) * Math.PI * 2
      node.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0)
      skillNodes.push(node)
      skillsScene.add(node)
    }
    
    skillsCamera.position.z = 4
    
    // Animation loop for skills section
    const animateSkills = () => {
      skillNodes.forEach((node, index) => {
        const time = clock.getElapsedTime()
        node.position.y += Math.sin(time + index) * 0.01
        node.rotation.x += 0.02
        node.rotation.y += 0.02
      })
      skillsRenderer.render(skillsScene, skillsCamera)
      requestAnimationFrame(animateSkills)
    }
    animateSkills()
  }

  createProjectScenes() {
    // Helper function to create star shape
    const createStarGeometry = (innerRadius = 0.4, outerRadius = 1, points = 5) => {
      const starShape = new THREE.Shape()
      for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        if (i === 0) {
          starShape.moveTo(x, y)
        } else {
          starShape.lineTo(x, y)
        }
      }
      starShape.closePath()
      
      const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: false
      }
      
      return new THREE.ExtrudeGeometry(starShape, extrudeSettings)
    }

    // Create 3D visuals for each project
    for (let i = 1; i <= 6; i++) {
      const container = document.getElementById(`project-3d-${i}`)
      if (!container) continue
      
      const projectScene = new THREE.Scene()
      const projectCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
      const projectRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      
      projectRenderer.setSize(container.offsetWidth, container.offsetHeight)
      container.appendChild(projectRenderer.domElement)
      
      // Create different shapes for each project
      let geometry, material, mesh
      
      switch (i) {
        case 1:
          // Create multiple star shapes
          const starGroup = new THREE.Group()
          for (let j = 0; j < 3; j++) {
            geometry = createStarGeometry(0.3, 0.6, 5)
            material = new THREE.MeshBasicMaterial({
              color: 0xffff00, // Yellow color
              wireframe: true
            })
            const star = new THREE.Mesh(geometry, material)
            star.position.set(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2
            )
            star.rotation.set(
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            )
            starGroup.add(star)
          }
          mesh = starGroup
          break
        case 2:
          geometry = new THREE.ConeGeometry(0.7, 1.5, 8)
          material = new THREE.MeshBasicMaterial({
            color: 0xff0080,
            wireframe: true
          })
          break
        case 3:
          geometry = new THREE.DodecahedronGeometry(0.8)
          material = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            wireframe: true
          })
          break
        case 4:
          geometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100)
          material = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            wireframe: true
          })
          break
        case 5:
          geometry = new THREE.OctahedronGeometry(0.8)
          material = new THREE.MeshBasicMaterial({
            color: 0xff3366,
            wireframe: true
          })
          break
        case 6:
          geometry = new THREE.TetrahedronGeometry(1)
          material = new THREE.MeshBasicMaterial({
            color: 0x9933ff,
            wireframe: true
          })
          break
      }
      
      mesh = new THREE.Mesh(geometry, material)
      projectScene.add(mesh)
      projectCamera.position.z = 3
      
      // Animation loop for project
      const animateProject = () => {
        mesh.rotation.x += 0.015
        mesh.rotation.y += 0.015
        projectRenderer.render(projectScene, projectCamera)
        requestAnimationFrame(animateProject)
      }
      animateProject()
    }
  }

  createContactScene() {
    // Create contact 3D visual
    const container = document.getElementById('contact-3d')
    if (!container) return
    
    const contactScene = new THREE.Scene()
    const contactCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
    const contactRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    contactRenderer.setSize(container.offsetWidth, container.offsetHeight)
    container.appendChild(contactRenderer.domElement)
    
    // Create spiral geometry
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0, 2, 1),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(0, 0, -1)
    ])
    
    const geometry = new THREE.TubeGeometry(curve, 50, 0.1, 8, false)
    const material = new THREE.MeshBasicMaterial({
      color: 0x9933ff,
      wireframe: true
    })
    
    contactMesh = new THREE.Mesh(geometry, material)
    contactScene.add(contactMesh)
    contactCamera.position.z = 4
    
    // Animation loop for contact section
    const animateContact = () => {
      if (contactMesh) {
        contactMesh.rotation.x += 0.01
        contactMesh.rotation.z += 0.02
        contactRenderer.render(contactScene, contactCamera)
      }
      requestAnimationFrame(animateContact)
    }
    animateContact()
  }

  initScrollAnimations() {
    // Animate skill bars on scroll
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('skills')) {
            console.log('Skills section in view, animating...')
            this.animateSkillBars()
          }
        }
      })
    }, observerOptions)
    
    const sections = document.querySelectorAll('section')
    sections.forEach(section => observer.observe(section))
  }

  animateSkillBars() {
    console.log('Animating skill bars...')
    const skillBars = document.querySelectorAll('.skill-progress')
    console.log('Found skill bars:', skillBars.length)
    let totalScore = 0
    let skillCount = 0
    
    skillBars.forEach(bar => {
      const progress = bar.dataset.progress
      console.log('Skill progress:', progress)
      totalScore += parseInt(progress)
      skillCount++
      
      gsap.to(bar, {
        width: `${progress}%`,
        duration: 1.5,
        ease: "power2.out",
        delay: Math.random() * 0.5
      })
    })
    
    // Calculate and animate average score
    const averageScore = Math.round(totalScore / skillCount)
    console.log('Average score calculated:', averageScore)
    const averageScoreElement = document.getElementById('averageScore')
    
    if (averageScoreElement) {
      console.log('Animating average score to:', averageScore)
      // Animate the score counting up
      gsap.to({ value: 0 }, {
        value: averageScore,
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
        onUpdate: function() {
          averageScoreElement.textContent = Math.round(this.targets()[0].value) + '%'
        }
      })
    } else {
      console.log('Average score element not found!')
    }
  }

  initNavigation() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger')
    const navMenu = document.querySelector('.nav-menu')
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active')
      })
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link')
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = link.getAttribute('href').substring(1)
        const targetSection = document.getElementById(targetId)
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
        
        // Close mobile menu
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active')
        }
      })
    })
  }

  initSkillBars() {
    // Initialize skill bars to 0 width
    const skillBars = document.querySelectorAll('.skill-progress')
    skillBars.forEach(bar => {
      bar.style.width = '0%'
    })
    
    // Initialize average score to 0
    const averageScoreElement = document.getElementById('averageScore')
    if (averageScoreElement) {
      averageScoreElement.textContent = '0%'
    }
  }

  setupEventListeners() {
    // Mouse movement for parallax effect
    document.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    })
    
    // Window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form')
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.handleFormSubmission(e.target)
      })
    }
    
    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card')
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    })
  }

  handleFormSubmission(form) {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    
    // Show success message (replace with actual form handling)
    const button = form.querySelector('button[type="submit"]')
    const originalText = button.textContent
    
    button.textContent = 'Sending...'
    button.disabled = true
    
    setTimeout(() => {
      button.textContent = 'Message Sent!'
      button.style.background = 'linear-gradient(45deg, #00ff88, #00d4ff)'
      
      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
        button.style.background = ''
        form.reset()
      }, 2000)
    }, 1000)
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    
    if (!isLoaded) return
    
    const elapsedTime = clock.getElapsedTime()
    
    // Animate hero mesh
    if (heroMesh) {
      heroMesh.rotation.x = elapsedTime * 0.3
      heroMesh.rotation.y = elapsedTime * 0.2
      heroMesh.position.y = Math.sin(elapsedTime) * 0.5
    }
    
    // Animate particles
    particles.forEach(particle => {
      particle.rotation.y = elapsedTime * 0.1
    })
    
    // Camera parallax based on mouse movement
    camera.position.x = mouse.x * 0.5
    camera.position.y = mouse.y * 0.5
    camera.lookAt(scene.position)
    
    // Render
    renderer.render(scene, camera)
  }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio3D()
})
