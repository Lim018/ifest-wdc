// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Three.js scene
    initThreeJS()
  
    // Initialize UI event listeners
    initUIControls()
  
    // Initialize sample data
    loadSampleData()
  })
  
  // Global variables for Three.js
  let scene, camera, renderer, controls
  let currentModel,
    currentModelType = "tshirt"
  let currentColor = "#FFFFFF"
  let currentPattern = "none"
  let currentMaterial = "cotton"
  let currentAccessories = []
  const isRotating = false
  const rotationSpeed = 0.01
  
  // Initialize Three.js scene
  function initThreeJS() {
    const modelViewer = document.getElementById("model-viewer")
  
    // Create scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
  
    // Create camera
    camera = new THREE.PerspectiveCamera(75, modelViewer.clientWidth / modelViewer.clientHeight, 0.1, 1000)
    camera.position.z = 5
  
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight)
  
    // Clear any existing content and append the renderer
    modelViewer.innerHTML = ""
    modelViewer.appendChild(renderer.domElement)
  
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)
  
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
  
    // Load initial model
    loadModel("tshirt")
  
    // Handle window resize
    window.addEventListener("resize", onWindowResize)
  
    // Start animation loop
    animate()
  }
  
  // Load 3D model
  function loadModel(modelType) {
    // Remove current model if exists
    if (currentModel) {
      scene.remove(currentModel)
    }
  
    // Create placeholder model (in a real app, you'd load actual 3D models)
    let geometry
  
    switch (modelType) {
      case "tshirt":
        // Simple T-shirt shape
        geometry = new THREE.BoxGeometry(3, 4, 0.5)
        break
      case "hoodie":
        // Hoodie shape (slightly larger with hood)
        geometry = new THREE.BoxGeometry(3.5, 4.5, 0.8)
        break
      case "jacket":
        // Jacket shape
        geometry = new THREE.BoxGeometry(4, 4.2, 1)
        break
      default:
        geometry = new THREE.BoxGeometry(3, 4, 0.5)
    }
  
    // Create material based on current selections
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentColor),
      roughness: getMaterialRoughness(),
      metalness: getMaterialMetalness(),
    })
  
    // Apply pattern if selected
    applyPattern(material)
  
    // Create the model
    currentModel = new THREE.Mesh(geometry, material)
    scene.add(currentModel)
  
    // Reset camera position
    camera.position.z = 7
    controls.update()
  
    // Update current model type
    currentModelType = modelType
  }
  
  // Apply pattern to material
  function applyPattern(material) {
    // In a real app, you would load and apply textures here
    // This is a simplified version
    switch (currentPattern) {
      case "stripes":
        // Create a canvas with stripes
        const stripeCanvas = document.createElement("canvas")
        stripeCanvas.width = 256
        stripeCanvas.height = 256
        const ctx = stripeCanvas.getContext("2d")
        ctx.fillStyle = currentColor
        ctx.fillRect(0, 0, 256, 256)
        ctx.fillStyle = adjustColor(currentColor, -30) // Darker color for stripes
        for (let i = 0; i < 256; i += 20) {
          ctx.fillRect(0, i, 256, 10)
        }
  
        const stripeTexture = new THREE.CanvasTexture(stripeCanvas)
        material.map = stripeTexture
        break
  
      case "dots":
        // Create a canvas with dots
        const dotsCanvas = document.createElement("canvas")
        dotsCanvas.width = 256
        dotsCanvas.height = 256
        const dotsCtx = dotsCanvas.getContext("2d")
        dotsCtx.fillStyle = currentColor
        dotsCtx.fillRect(0, 0, 256, 256)
        dotsCtx.fillStyle = adjustColor(currentColor, -30) // Darker color for dots
  
        for (let x = 0; x < 256; x += 30) {
          for (let y = 0; y < 256; y += 30) {
            dotsCtx.beginPath()
            dotsCtx.arc(x + 15, y + 15, 8, 0, Math.PI * 2)
            dotsCtx.fill()
          }
        }
  
        const dotsTexture = new THREE.CanvasTexture(dotsCanvas)
        material.map = dotsTexture
        break
  
      case "floral":
        // In a real app, you would load an actual floral texture
        // Here we'll just create a placeholder
        const floralCanvas = document.createElement("canvas")
        floralCanvas.width = 256
        floralCanvas.height = 256
        const floralCtx = floralCanvas.getContext("2d")
        floralCtx.fillStyle = currentColor
        floralCtx.fillRect(0, 0, 256, 256)
  
        // Draw simple flower shapes
        floralCtx.fillStyle = adjustColor(currentColor, 50)
        for (let x = 0; x < 256; x += 60) {
          for (let y = 0; y < 256; y += 60) {
            drawSimpleFlower(floralCtx, x + 30, y + 30, 15)
          }
        }
  
        const floralTexture = new THREE.CanvasTexture(floralCanvas)
        material.map = floralTexture
        break
  
      case "none":
      default:
        material.map = null
        break
    }
  
    if (material.map) {
      material.needsUpdate = true
    }
  }
  
  // Helper function to draw a simple flower
  function drawSimpleFlower(ctx, x, y, size) {
    const petalCount = 5
  
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2
      const x1 = x + Math.cos(angle) * size
      const y1 = y + Math.sin(angle) * size
  
      ctx.beginPath()
      ctx.arc(x1, y1, size / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  
    // Draw center
    ctx.fillStyle = adjustColor(currentColor, -70)
    ctx.beginPath()
    ctx.arc(x, y, size / 3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Get material roughness based on selected material
  function getMaterialRoughness() {
    switch (currentMaterial) {
      case "cotton":
        return 0.7
      case "linen":
        return 0.8
      case "denim":
        return 0.6
      case "silk":
        return 0.3
      default:
        return 0.7
    }
  }
  
  // Get material metalness based on selected material
  function getMaterialMetalness() {
    switch (currentMaterial) {
      case "cotton":
        return 0.0
      case "linen":
        return 0.0
      case "denim":
        return 0.1
      case "silk":
        return 0.2
      default:
        return 0.0
    }
  }
  
  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    const hex = color.replace("#", "")
    const r = Math.max(0, Math.min(255, Number.parseInt(hex.substring(0, 2), 16) + amount))
    const g = Math.max(0, Math.min(255, Number.parseInt(hex.substring(2, 4), 16) + amount))
    const b = Math.max(0, Math.min(255, Number.parseInt(hex.substring(4, 6), 16) + amount))
  
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }
  
  // Handle window resize
  function onWindowResize() {
    const modelViewer = document.getElementById("model-viewer")
    camera.aspect = modelViewer.clientWidth / modelViewer.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight)
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate)
  
    // Auto-rotate if enabled
    if (isRotating && currentModel) {
      currentModel.rotation.y += rotationSpeed
    }
  
    controls.update()
    renderer.render(scene, camera)
  }
  
  // Initialize UI controls
  function initUIControls() {
    // Item selection
    const itemOptions = document.querySelectorAll(".item-option")
    itemOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        itemOptions.forEach((opt) => opt.classList.remove("active"))
  
        // Add active class to clicked option
        this.classList.add("active")
  
        // Load the selected model
        const modelType = this.getAttribute("data-item")
        loadModel(modelType)
      })
    })
  
    // Color selection
    const colorOptions = document.querySelectorAll(".color-option")
    colorOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        colorOptions.forEach((opt) => opt.classList.remove("active"))
  
        // Add active class to clicked option
        this.classList.add("active")
  
        // Update current color
        currentColor = this.getAttribute("data-color")
  
        // Update model material
        if (currentModel && currentModel.material) {
          currentModel.material.color.set(currentColor)
  
          // Reapply pattern if needed
          applyPattern(currentModel.material)
        }
      })
    })
  
    // Pattern selection
    const patternOptions = document.querySelectorAll(".pattern-option")
    patternOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        patternOptions.forEach((opt) => opt.classList.remove("active"))
  
        // Add active class to clicked option
        this.classList.add("active")
  
        // Update current pattern
        currentPattern = this.getAttribute("data-pattern")
  
        // Update model material
        if (currentModel && currentModel.material) {
          applyPattern(currentModel.material)
        }
      })
    })
  
    // Material selection
    const materialOptions = document.querySelectorAll(".material-option")
    materialOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        materialOptions.forEach((opt) => opt.classList.remove("active"))
  
        // Add active class to clicked option
        this.classList.add("active")
  
        // Update current material
        currentMaterial = this.getAttribute("data-material")
  
        // Update model material properties
        if (currentModel && currentModel.material) {
          currentModel.material.roughness = getMaterialRoughness()
          currentModel.material.metalness = getMaterialMetalness()
          currentModel.material.needsUpdate = true
        }
      })
    })
  
    // Accessory toggles
    const accessoryToggles = document.querySelectorAll(".accessory-toggle")
    accessoryToggles.forEach((toggle) => {
      toggle.addEventListener("change", function () {
        const accessory = this.parentElement.getAttribute("data-accessory")
  
        if (this.checked) {
          // Add accessory if not already in the list
          if (!currentAccessories.includes(accessory)) {
            currentAccessories.push(accessory)
            addAccessoryToModel(accessory)
          }
        } else {
          // Remove accessory
          const index = currentAccessories.indexOf(accessory)
          if (index > -1) {
            currentAccessories.splice(index, 1)
            removeAccessoryFromModel(accessory)
          }
        }
      })
    })
  
    // Model controls
    document.getElementById("rotate-left").addEventListener("click", () => {
      if (currentModel) {
        currentModel.rotation.y -= Math.PI / 8
      }
    })
  
    document.getElementById("rotate-right").addEventListener("click", () => {
      if (currentModel) {
        currentModel.rotation.y += Math.PI / 8
      }
    })
  
    document.getElementById("zoom-in").addEventListener("click", () => {
      camera.position.z = Math.max(3, camera.position.z - 1)
    })
  
    document.getElementById("zoom-out").addEventListener("click", () => {
      camera.position.z = Math.min(10, camera.position.z + 1)
    })
  
    document.getElementById("reset-view").addEventListener("click", () => {
      if (currentModel) {
        currentModel.rotation.set(0, 0, 0)
        camera.position.z = 7
        controls.update()
      }
    })
  
    // Action buttons
    document.getElementById("save-design").addEventListener("click", () => {
      saveCurrentDesign()
    })
  
    document.getElementById("share-design").addEventListener("click", () => {
      shareDesign()
    })
  
    document.getElementById("add-to-cart").addEventListener("click", () => {
      addToCart()
    })
  
    // Edit and delete buttons for saved designs
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const designId = this.closest(".saved-design").getAttribute("data-id")
        loadSavedDesign(designId)
      })
    })
  
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const designId = this.closest(".saved-design").getAttribute("data-id")
        deleteSavedDesign(designId)
      })
    })
  
    // Try buttons for recommended designs
    document.querySelectorAll(".try-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const recommendedId = this.closest(".recommended-item").getAttribute("data-id")
        tryRecommendedDesign(recommendedId)
      })
    })
  }
  
  // Add accessory to model
  function addAccessoryToModel(accessory) {
    // In a real app, you would load and attach 3D models for accessories
    // This is a simplified version
  
    if (!currentModel) return
  
    let accessoryGeometry, accessoryMaterial, accessoryMesh
  
    switch (accessory) {
      case "pocket":
        accessoryGeometry = new THREE.BoxGeometry(1, 1, 0.2)
        accessoryMaterial = new THREE.MeshStandardMaterial({
          color: adjustColor(currentColor, -20),
          roughness: getMaterialRoughness(),
          metalness: getMaterialMetalness(),
        })
        accessoryMesh = new THREE.Mesh(accessoryGeometry, accessoryMaterial)
        accessoryMesh.position.set(0, 0, 0.35)
        accessoryMesh.name = "pocket"
        currentModel.add(accessoryMesh)
        break
  
      case "buttons":
        // Add multiple buttons
        for (let i = -1; i <= 1; i++) {
          accessoryGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16)
          accessoryMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.7,
          })
          accessoryMesh = new THREE.Mesh(accessoryGeometry, accessoryMaterial)
          accessoryMesh.rotation.x = Math.PI / 2
          accessoryMesh.position.set(0, i * 0.8, 0.35)
          accessoryMesh.name = `button-${i}`
          currentModel.add(accessoryMesh)
        }
        break
  
      case "hood":
        accessoryGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
        accessoryMaterial = new THREE.MeshStandardMaterial({
          color: currentColor,
          roughness: getMaterialRoughness(),
          metalness: getMaterialMetalness(),
        })
        accessoryMesh = new THREE.Mesh(accessoryGeometry, accessoryMaterial)
        accessoryMesh.position.set(0, 2.2, 0)
        accessoryMesh.name = "hood"
        currentModel.add(accessoryMesh)
        break
    }
  }
  
  // Remove accessory from model
  function removeAccessoryFromModel(accessory) {
    if (!currentModel) return
  
    switch (accessory) {
      case "pocket":
        const pocket = currentModel.getObjectByName("pocket")
        if (pocket) currentModel.remove(pocket)
        break
  
      case "buttons":
        for (let i = -1; i <= 1; i++) {
          const button = currentModel.getObjectByName(`button-${i}`)
          if (button) currentModel.remove(button)
        }
        break
  
      case "hood":
        const hood = currentModel.getObjectByName("hood")
        if (hood) currentModel.remove(hood)
        break
    }
  }
  
  // Save current design
  function saveCurrentDesign() {
    // In a real app, you would save to a database
    // Here we'll just show a notification
    alert("Design saved successfully!")
  
    // Refresh the saved designs section
    // In a real app, this would fetch from a database
    const savedDesignsGrid = document.querySelector(".saved-designs-grid")
    const newDesign = document.createElement("div")
    newDesign.className = "saved-design"
    newDesign.setAttribute("data-id", "design-" + Date.now())
  
    // Create a snapshot of the current design
    // In a real app, you would capture the actual 3D render
    newDesign.innerHTML = `
          <img src="assets/images/saved-design-1.jpg" alt="New Saved Design">
          <div class="design-info">
              <h3>Custom ${currentModelType.charAt(0).toUpperCase() + currentModelType.slice(1)}</h3>
              <p>Created on: ${new Date().toLocaleDateString()}</p>
              <div class="design-actions">
                  <button class="edit-btn">Edit</button>
                  <button class="delete-btn">Delete</button>
              </div>
          </div>
      `
  
    // Add event listeners to the new buttons
    newDesign.querySelector(".edit-btn").addEventListener("click", () => {
      loadSavedDesign(newDesign.getAttribute("data-id"))
    })
  
    newDesign.querySelector(".delete-btn").addEventListener("click", () => {
      deleteSavedDesign(newDesign.getAttribute("data-id"))
    })
  
    // Add to the grid
    savedDesignsGrid.prepend(newDesign)
  }
  
  // Share design
  function shareDesign() {
    // In a real app, you would generate a shareable link or open a share dialog
    alert("Share functionality would be implemented here. This would generate a unique URL to share your design.")
  }
  
  // Add to cart
  function addToCart() {
    // In a real app, you would add the current design to the shopping cart
    alert("Design added to cart!")
  
    // Optionally redirect to cart page
    // window.location.href = 'bag.html';
  }
  
  // Load saved design
  function loadSavedDesign(designId) {
    // In a real app, you would load the design data from a database
    // Here we'll just show a notification
    alert(`Loading saved design: ${designId}`)
  
    // For demonstration, we'll just set some random values
    // In a real app, these would come from the saved design data
    currentModelType = "tshirt"
    currentColor = "#3357FF"
    currentPattern = "stripes"
    currentMaterial = "cotton"
    currentAccessories = ["pocket"]
  
    // Update UI to reflect the loaded design
    updateUIFromCurrentSettings()
  
    // Load the model with these settings
    loadModel(currentModelType)
  
    // Add accessories
    currentAccessories.forEach((accessory) => {
      addAccessoryToModel(accessory)
    })
  }
  
  // Delete saved design
  function deleteSavedDesign(designId) {
    // In a real app, you would delete from a database
    // Here we'll just remove the element from the DOM
    const designElement = document.querySelector(`.saved-design[data-id="${designId}"]`)
    if (designElement) {
      designElement.remove()
      alert(`Design ${designId} deleted successfully!`)
    }
  }
  
  // Try recommended design
  function tryRecommendedDesign(recommendedId) {
    // In a real app, you would load the recommended design data
    // Here we'll just show a notification
    alert(`Loading recommended design: ${recommendedId}`)
  
    // For demonstration, we'll set some predefined values based on the recommendation
    switch (recommendedId) {
      case "eco-friendly":
        currentModelType = "tshirt"
        currentColor = "#33FF57"
        currentPattern = "none"
        currentMaterial = "cotton"
        currentAccessories = []
        break
  
      case "urban-style":
        currentModelType = "hoodie"
        currentColor = "#000000"
        currentPattern = "dots"
        currentMaterial = "cotton"
        currentAccessories = ["hood", "pocket"]
        break
  
      case "vintage":
        currentModelType = "jacket"
        currentColor = "#F3F3A6"
        currentPattern = "floral"
        currentMaterial = "linen"
        currentAccessories = ["buttons"]
        break
    }
  
    // Update UI to reflect the loaded design
    updateUIFromCurrentSettings()
  
    // Load the model with these settings
    loadModel(currentModelType)
  
    // Add accessories
    currentAccessories.forEach((accessory) => {
      const toggle = document.querySelector(`.accessory-option[data-accessory="${accessory}"] .accessory-toggle`)
      if (toggle) toggle.checked = true
      addAccessoryToModel(accessory)
    })
  }
  
  // Update UI to reflect current settings
  function updateUIFromCurrentSettings() {
    // Update item selection
    document.querySelectorAll(".item-option").forEach((option) => {
      option.classList.remove("active")
      if (option.getAttribute("data-item") === currentModelType) {
        option.classList.add("active")
      }
    })
  
    // Update color selection
    document.querySelectorAll(".color-option").forEach((option) => {
      option.classList.remove("active")
      if (option.getAttribute("data-color") === currentColor) {
        option.classList.add("active")
      }
    })
  
    // Update pattern selection
    document.querySelectorAll(".pattern-option").forEach((option) => {
      option.classList.remove("active")
      if (option.getAttribute("data-pattern") === currentPattern) {
        option.classList.add("active")
      }
    })
  
    // Update material selection
    document.querySelectorAll(".material-option").forEach((option) => {
      option.classList.remove("active")
      if (option.getAttribute("data-material") === currentMaterial) {
        option.classList.add("active")
      }
    })
  
    // Update accessory toggles
    document.querySelectorAll(".accessory-toggle").forEach((toggle) => {
      const accessory = toggle.parentElement.getAttribute("data-accessory")
      toggle.checked = currentAccessories.includes(accessory)
    })
  }
  
  // Load sample data
  function loadSampleData() {
    // In a real app, this would come from a database
    // Here we're just setting up the demo data
  
    // Set data attributes for saved designs
    document.querySelectorAll(".saved-design").forEach((design, index) => {
      design.setAttribute("data-id", `saved-design-${index + 1}`)
    })
  
    // Set data attributes for recommended designs
    const recommendedItems = document.querySelectorAll(".recommended-item")
    if (recommendedItems.length >= 1) recommendedItems[0].setAttribute("data-id", "eco-friendly")
    if (recommendedItems.length >= 2) recommendedItems[1].setAttribute("data-id", "urban-style")
    if (recommendedItems.length >= 3) recommendedItems[2].setAttribute("data-id", "vintage")
  }
  
  // Add this script tag to the HTML file
  // <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  // <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
  // <script src="assets/js/redesign.js"></script>
  
  