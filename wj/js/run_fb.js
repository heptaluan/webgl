var camera, scene, renderer
var controls, water, sphere
var cpi = [2500, 1200, 2500, -800]
var container = document.getElementById('container')
var msgbox = document.getElementById('loadinginfo')

var parameters = {
  width: 2000,
  height: 2000,
  widthSegments: 250,
  heightSegments: 250,
  depth: 1500,
  param: 4,
  filterparam: 1,
}

var cubeMap, waterNormals

if (!Detector.webgl) {
  Detector.addGetWebGLMessage()
  document.getElementById('container').innerHTML = ''
  msgbox.innerHTML = '当前浏览器不支持WebGL'
} else {
  init()
}

function init() {
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  //scene.fog = new THREE.FogExp2( 0xaabbbb, 0.0001 );

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 3000000)
  camera.position.set(cpi[0], cpi[1], cpi[2])

  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableZoom = false
  //controls.minDistance = 1000.0;
  //controls.maxDistance = 5000.0;
  //controls.maxPolarAngle = Math.PI * 0.47;

  controls.target.set(0, 100, 0)

  scene.add(new THREE.AmbientLight(0x444444))

  var light = new THREE.DirectionalLight(0xffffbb, 1)
  light.position.set(-1, 1.5, 2)
  scene.add(light)

  var light_b = new THREE.DirectionalLight(0xffffbb, 1)
  light_b.position.set(-1, -1.5, -1)
  scene.add(light_b)

  CreateWater()

  function CreateWater() {
    msgbox.innerHTML = '正在创建水面...'

    waterNormals = new THREE.TextureLoader().load('textures/waternormals.jpg', function () {
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

      water = new THREE.Water(renderer, camera, scene, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 0.9,
        sunDirection: light.position.clone(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 50.0,
        //side: THREE.DoubleSide,
        fog: scene.fog != undefined,
      })

      var mirrorMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
        water.material
      )
      mirrorMesh.add(water)
      mirrorMesh.rotation.x = -Math.PI * 0.5
      scene.add(mirrorMesh)

      var underwater_g = new THREE.PlaneGeometry(parameters.width * 500, parameters.height * 500, 1, 1)
      var underwater = new THREE.Mesh(
        underwater_g,
        new THREE.MeshPhongMaterial({ color: 0x387260, transparent: true, opacity: 0.6 })
      )
      //var underwater = new THREE.Mesh(underwater_g, water.material );
      underwater.position.y = -30
      underwater.rotation.x = Math.PI * 0.5
      scene.add(underwater)

      CreateSky()
    })
  }

  function CreateSky() {
    msgbox.innerHTML = '正在创建天空...'

    cubeMap = new THREE.CubeTexture([])
    cubeMap.format = THREE.RGBFormat

    var loader = new THREE.ImageLoader()
    loader.load('textures/skybox.jpg', function (image) {
      var getSide = function (x, y) {
        var size = 1024
        var canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        var context = canvas.getContext('2d')
        context.drawImage(image, -x * size, -y * size)
        return canvas
      }
      cubeMap.images[0] = getSide(2, 1) // px
      cubeMap.images[1] = getSide(0, 1) // nx
      cubeMap.images[2] = getSide(1, 0) // py
      cubeMap.images[3] = getSide(1, 2) // ny
      cubeMap.images[4] = getSide(1, 1) // pz
      cubeMap.images[5] = getSide(3, 1) // nz
      cubeMap.needsUpdate = true

      var cubeShader = THREE.ShaderLib['cube']
      cubeShader.uniforms['tCube'].value = cubeMap

      var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide,
      })

      var skyBox = new THREE.Mesh(new THREE.BoxGeometry(1000000, 1000000, 1000000), skyBoxMaterial)

      scene.add(skyBox)

      CreateDevice()
    })
  }

  function CreateDevice() {
    msgbox.innerHTML = '正在创建设备...'

    var loader = new THREE.MTLLoader()
    loader.load('models/device.mtl', function (materials) {
      materials.preload()
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load('models/device.obj', function (object) {
        scene.add(object)
        CreateMetalMaterial()
      })
    })

    AllCreated()
  }

  function AllCreated() {
    msgbox.innerHTML = '正在处理数据项...'

    window.addEventListener('resize', onWindowResize, false)

    msgbox.style.display = 'none'

    animate()
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)

  var time = performance.now() * 0.001

  water.material.uniforms.time.value += 1.0 / 60.0
  water.render()
  controls.update()
  TWEEN.update()
  renderer.render(scene, camera)
}

document.getElementById('btn_upw').onclick = function () {
  new TWEEN.Tween(camera.position)
    .to({ x: cpi[0], y: cpi[1], z: cpi[2] }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
}

document.getElementById('btn_dnw').onclick = function () {
  new TWEEN.Tween(camera.position)
    .to({ x: cpi[0], y: cpi[3], z: cpi[2] }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
}
