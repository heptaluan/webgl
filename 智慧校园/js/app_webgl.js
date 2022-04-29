import * as THREE from '../../jslib/three.module.js'
import { WEBGL } from '../../jslib/WebGL.js'
import { OrbitControls } from '../../jslib/OrbitControls.js'
import { MTLLoader } from '../../jslib/MTLLoader.js'
import { OBJLoader } from '../../jslib/OBJLoader.js'
import { TWEEN } from '../../jslib/tween.module.min.js'
import { CSS2DRenderer, CSS2DObject } from '../../jslib/CSS2DRenderer.js'
import { EffectComposer } from '../../jslib/EffectComposer.js'
import { RenderPass } from '../../jslib/RenderPass.js'
import { UnrealBloomPass } from '../../jslib/UnrealBloomPass.js'

let camera, scene, renderer, cssRenderer, controls, composer, base
let materials = {}
let waterPipes = []
let positionBuilding = []
let heightBuilding = []
let timeNow, buildingRotateRadius
let currentLabel = []
let mainData = []
let buildingData = []
let interactiveCamera = []

const container = document.getElementById('container')
const loadingMask = document.getElementsByClassName('loadingMask').item(0)
const mainMenu = document.getElementsByClassName('mainMenu').item(0).getElementsByTagName('li')
const popBuilding = document.getElementsByClassName('popBuilding').item(0)
const popBuildingTitle = popBuilding.getElementsByClassName('title').item(0).getElementsByClassName('content').item(0)
const popCamera = document.getElementsByClassName('popCamera').item(0)
const popCameraTitle = popCamera.getElementsByClassName('title').item(0).getElementsByClassName('content').item(0)
const dataBlock = document.getElementsByClassName('dataBlock')
const cameraPosition = [-22560, 39690, 56370]
const defaultRadius = Math.sqrt(cameraPosition[0] * cameraPosition[0] + cameraPosition[2] * cameraPosition[2])
const controlPosition = [0, 0, 0]
const generalDuration = 750
const energyType = [
  ['power', 'kWh'],
  ['water', 'm3'],
  ['AQI', 'AQI'],
]
const colorStartEnd = [0x153eda, 0x13e54e, 0xff3924]

let buildingColors
let currentRadius = defaultRadius
let currentView = 0
let currentType = -1
let currentID = -1
let interactiveObjects
let currentBox

let lightWave = null
let IsRotated = false
let IsZoomed = false
let IsMoving = false
let IsPopBuilding = false
let IsPopCamera = false

window.onload = function () {
  setTime()

  for (let i = 0; i < dataBlock.length; i++) {
    let dataUnit = {}
    dataUnit.dom = dataBlock[i]
    dataUnit.content = dataBlock[i].innerHTML
    dataUnit.chart = dataBlock[i].getElementsByClassName('chart')

    dataUnit.dom.innerHTML = '<div class="loadingData"></div>'

    dataUnit.hide = function () {
      dataUnit.dom.innerHTML = '<div class="loadingData"></div>'
    }

    dataUnit.show = function () {
      setTimeout(function () {
        dataUnit.dom.innerHTML = dataUnit.content
        for (let j = 0; j < dataUnit.chart.length; j++) {
          let chart = echarts.init(dataUnit.chart[j])
          chart.setOption(chartOption[dataUnit.chart[j].id])
        }
      }, Math.random() * 800)
    }

    if (dataBlock[i].classList.contains('main')) {
      mainData.push(dataUnit)
    } else if (dataBlock[i].classList.contains('building')) {
      buildingData.push(dataUnit)
    }
  }

  if (WEBGL.isWebGLAvailable()) {
    init()
  } else {
    container.innerHTML = ''
    alert('当前浏览器不支持WebGL')
  }
}

function setTime() {
  let now = new Date()
  document.getElementsByClassName('rightCorner').item(0).getElementsByClassName('date').item(0).innerHTML =
    now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
  let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  document.getElementsByClassName('rightCorner').item(0).getElementsByClassName('time').item(0).innerHTML =
    hour + ':' + minute
}

function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x01091e)
  scene.fog = new THREE.Fog(0x01091e, 100000, 120000)

  let CW = container.offsetWidth
  let CH = container.offsetHeight
  camera = new THREE.PerspectiveCamera(26, CW / CH, 0.5, 300000000)
  //camera.setViewOffset(CW, CH, 0, CH*0.09, CW, CH);

  controls = new OrbitControls(camera, container)
  //controls.enablePan = false;

  //controls.minDistance = minDT;
  controls.maxPolarAngle = Math.PI * 0.44
  controls.minPolarAngle = Math.PI * 0.1

  camera.position.x = cameraPosition[0]
  camera.position.y = 150000
  camera.position.z = cameraPosition[2]

  controls.target.set(controlPosition[0], controlPosition[1], controlPosition[2])

  scene.add(new THREE.AmbientLight(0xffffff, 1.2))

  let light_A = new THREE.DirectionalLight(0xffffff, 1.1)
  light_A.position.x = -8
  light_A.position.y = 8
  light_A.position.z = 6
  light_A.castShadow = true
  light_A.shadow.camera.near = -100000
  light_A.shadow.camera.far = 100000
  light_A.shadow.camera.right = 100000
  light_A.shadow.camera.left = -100000
  light_A.shadow.camera.top = 100000
  light_A.shadow.camera.bottom = -100000
  light_A.shadow.mapSize.width = 1680
  light_A.shadow.mapSize.height = 1680
  scene.add(light_A)

  /*
	let helper_A = new THREE.DirectionalLightHelper(light_A);
	scene.add(helper_A);
	let helper_B = new THREE.CameraHelper(light_A.shadow.camera );
	scene.add(helper_B);

	let light_B = new THREE.DirectionalLight(0xffffff, 0.3);
	light_B.position.x=20;
	light_B.position.y=100;
	light_B.position.z=90;
	scene.add(light_B);
	 */

  let gtx = document.createElement('canvas').getContext('2d')
  gtx.canvas.width = 128
  gtx.canvas.height = 128
  let gradient = gtx.createLinearGradient(0, 0, 0, 128)
  gradient.addColorStop(0, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  gtx.fillStyle = gradient
  gtx.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 16; i++) {
    gtx.fillStyle = 'rgba(255,255,255,' + ((16 - i) / 16) * 0.6 + ')'
    gtx.fillRect(0, i * 8, 128, 3)
  }
  let texture = new THREE.CanvasTexture(gtx.canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  let mt_otherBuilding = new THREE.MeshLambertMaterial({ map: texture, transparent: true, opacity: 0.5 })

  let mt_glow = createGradientMaterial('148,207,91')

  let paraLightRoad = {
    density: 0.00005,
    smooth: 0.1,
    direction: 1,
    colorStep: [
      [0, '255,255,255,0'],
      [0.01, '255,255,255,1'],
      [0.5, '255,255,255,0'],
      [1, '255,255,255,0'],
    ],
    thickness: 120,
    segment: 4,
    animationTime: 1500,
  }

  let paraWaterPipe = {
    density: 0.0015,
    smooth: 0.1,
    direction: -1,
    colorStep: [
      [0, '8,20,70,1'],
      [0.3, '32,226,255,1'],
      [0.6, '8,20,70,1'],
      [1, '8,20,70,1'],
    ],
    thickness: 50,
    segment: 6,
    animationTime: 750,
  }

  CreateBase()

  function CreateBase() {
    interactiveObjects = new THREE.Object3D()

    let mtlLoader = new MTLLoader()
    mtlLoader.load('models/base.mtl', function (sourceMaterial) {
      sourceMaterial.preload()
      let objLoader = new OBJLoader()
      objLoader.setMaterials(sourceMaterial)

      objLoader.load('models/base.obj', function (object) {
        object.traverse(function (child) {
          let ot = child.name.split('_')[0]

          if (ot === 'weiLan' || ot === 'tree') {
            child.material.transparent = true
            child.material.side = THREE.DoubleSide
            child.material.depthWrite = false
            child.castShadow = true
            child.renderOrder = 2
          } else if (ot === 'ground' || ot === 'road') {
            child.receiveShadow = true
          } else if (ot === 'otherBuilding') {
            child.material = mt_otherBuilding
            child.renderOrder = 0
          } else if (ot === 'lightRoad') {
            child.visible = false
            let car = createTube(child, paraLightRoad)
            car.object.renderOrder = 2
            scene.add(car.object)
            car.play()
          } else if (ot === 'waterPipe') {
            child.visible = false
            let pipe = createTube(child, paraWaterPipe)
            pipe.object.renderOrder = 2
            waterPipes.push(pipe)
          } else if (ot === 'gridBack') {
            child.renderOrder = 0
          } else if (ot === 'glow') {
            child.material = mt_glow
            child.renderOrder = 1
          } else if (ot === 'interactiveObject') {
            let id = parseInt(child.name.split('_')[1])
            let interactiveObject = child.clone()
            child.visible = false
            interactiveObjects.add(interactiveObject)
            positionBuilding[id] = getChildPosition(child)
            heightBuilding[id] = child.geometry.boundingBox.max.y
          } else if (ot === 'camera') {
            child.visible = false
          } else if (ot === 'cctv') {
            let id = parseInt(child.name.split('_')[1])
            interactiveCamera[id] = child.clone()
            child.visible = false
          } else {
            child.castShadow = true
            child.renderOrder = 2
          }

          materials[child.uuid] = child.material
        })

        base = object
        scene.add(object)
        AllCreated()
      })
    })
  }

  function AllCreated() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    let renderScene = new RenderPass(scene, camera)
    composer = new EffectComposer(renderer)
    composer.renderToScreen = true
    composer.addPass(renderScene)
    let bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.offsetWidth, container.offsetHeight),
      1.5,
      0.4,
      0.85
    )
    composer.addPass(bloomPass)

    cssRenderer = new CSS2DRenderer()
    cssRenderer.setSize(container.offsetWidth, container.offsetHeight)
    cssRenderer.domElement.style.position = 'absolute'
    cssRenderer.domElement.style.top = '0px'
    container.appendChild(cssRenderer.domElement)

    window.addEventListener('resize', onWindowResize, false)
    container.addEventListener('click', onMouseClick, false)
    container.addEventListener('mousemove', onMouseMove, false)

    animate()

    loadingMask.classList.add('hide')

    new TWEEN.Tween(camera.position)
      .to({ y: cameraPosition[1] }, 900)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
      .onComplete(function () {
        document.body.removeChild(loadingMask)
        controls.maxDistance = 100000
        controls.enabled = true

        for (let i = 0; i < mainData.length; i++) {
          mainData[i].show()
        }
      })
  }
}

function createGradientMaterial(color) {
  let gtx = document.createElement('canvas').getContext('2d')
  gtx.canvas.width = 128
  gtx.canvas.height = 128
  let gradient = gtx.createLinearGradient(0, 0, 0, 128)
  gradient.addColorStop(0, 'rgba(' + color + ',0.4)')
  gradient.addColorStop(1, 'rgba(' + color + ',0)')
  gtx.fillStyle = gradient
  gtx.fillRect(0, 0, 128, 128)
  let texture = new THREE.CanvasTexture(gtx.canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return new THREE.MeshBasicMaterial({ map: texture, depthWrite: false, depthTest: false, transparent: true })
}

function createTube(obj, para) {
  let tube = {}

  let pointArray = obj.clone().geometry.attributes.position.array
  let curvePath = new THREE.CurvePath()
  let distance = 0
  for (let i = 0; i < pointArray.length / 3 - 1; i++) {
    let x1 = pointArray[i * 3]
    let y1 = pointArray[i * 3 + 1]
    let z1 = pointArray[i * 3 + 2]
    let x2 = pointArray[(i + 1) * 3]
    let y2 = pointArray[(i + 1) * 3 + 1]
    let z2 = pointArray[(i + 1) * 3 + 2]
    distance += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))
    curvePath.curves.push(new THREE.LineCurve3(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)))
  }

  let gtx = document.createElement('canvas').getContext('2d')
  gtx.canvas.width = 128
  gtx.canvas.height = 128
  let gradient = gtx.createLinearGradient(0, 128, 128, 128)
  for (let i = 0; i < para.colorStep.length; i++) {
    gradient.addColorStop(para.colorStep[i][0], 'rgba(' + para.colorStep[i][1] + ')')
  }
  gtx.fillStyle = gradient
  gtx.fillRect(0, 0, 128, 128)
  let tubeTexture = new THREE.CanvasTexture(gtx.canvas)
  tubeTexture.wrapS = tubeTexture.wrapT = THREE.RepeatWrapping
  tubeTexture.repeat.set(Math.round(distance * para.density), 1)

  let tubeMaterial = new THREE.MeshLambertMaterial({
    map: tubeTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  let tubeGeometry = new THREE.TubeGeometry(
    curvePath,
    Math.round(distance * para.smooth),
    para.thickness,
    para.segment,
    false
  )

  tube.texture = tubeTexture
  tube.object = new THREE.Mesh(tubeGeometry, tubeMaterial)

  tube.play = function () {
    let startIndex = para.direction
    run()
    function run() {
      tube.animation = new TWEEN.Tween(tube.texture.offset)
        .to({ x: startIndex }, para.animationTime)
        .onComplete(function () {
          startIndex += para.direction
          run()
        })
        .start()
    }
  }

  tube.stop = function () {
    if (tube.animation) {
      TWEEN.remove(tube.animation)
      tube.animation.stop()
      tube.animation = null
    }
    tube.texture.offset.x = 0
  }

  return tube
}

function animate(time) {
  timeNow = time

  if (IsRotated) {
    let timer = time * 0.0001
    camera.position.x = Math.cos(timer) * currentRadius + controls.target.x
    camera.position.z = Math.sin(timer) * currentRadius + controls.target.z
  }

  requestAnimationFrame(animate)
  TWEEN.update()
  controls.update()
  composer.render()
  //renderer.render( scene, camera );
  cssRenderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  cssRenderer.setSize(container.offsetWidth, container.offsetHeight)
}

function IntX(event) {
  let Sx = event.clientX
  let Sy = event.clientY
  let x = (Sx / container.offsetWidth) * 2 - 1
  let y = -(Sy / container.offsetHeight) * 2 + 1
  let standardVector = new THREE.Vector3(x, y, 0.5)
  let worldVector = standardVector.unproject(camera)
  let ray = worldVector.sub(camera.position).normalize()
  let rayCaster = new THREE.Raycaster(camera.position, ray)
  let meshChildren = interactiveObjects.children
  let intersects = rayCaster.intersectObjects(meshChildren)
  let result = null
  if (intersects.length > 0) {
    result = intersects[0].object
  }
  return result
}

function getChildPosition(child) {
  let cg = child.geometry
  cg.computeBoundingBox()
  let centroid = new THREE.Vector3()
  centroid.addVectors(cg.boundingBox.min, cg.boundingBox.max)
  centroid.multiplyScalar(0.5)
  return centroid
}

function onMouseClick() {
  //console.log('camera:'+camera.position.x+'_'+camera.position.y+'_'+camera.position.z+'****controls:'+controls.target.x+'_'+controls.target.y+'_'+controls.target.z);

  IsRotated = false
  document.getElementById('autoRotate').classList.remove('active')
  controls.enabled = true

  if (!IsZoomed && currentID !== -1) {
    currentBox.destroy()

    if (currentType === 0) {
      hideLabel()
      moveToBuilding()
    } else if (currentType === 1) {
      popCameraTitle.innerHTML = cameraInfo['ca_' + currentID].name
      if (!IsPopCamera) {
        popCamera.style.display = 'block'
        setTimeout(function () {
          popCamera.classList.add('show')
        }, 10)
        IsPopCamera = true
      }
    }
  }
}

function onMouseMove(event) {
  if (!IsZoomed) {
    let obj = IntX(event)
    if (obj) {
      let ot = obj.name.split('_')[0]
      let id = parseInt(obj.name.split('_')[1])

      if (ot === 'interactiveObject') {
        currentType = 0
      } else if (ot === 'cctv') {
        currentType = 1
      }

      if (currentID !== id) {
        if (currentBox) {
          currentBox.destroy()
        }
        currentID = id
        currentBox = createCurrentBox(obj)
      }
    } else {
      if (currentID !== -1) {
        currentID = -1
        currentType = -1
        currentBox.destroy()
      }
    }
  }
}

function moveToBuilding() {
  IsZoomed = true
  IsMoving = true

  switchUI(0)

  let box
  interactiveObjects.traverse(function (child) {
    if (parseInt(child.name.split('_')[1]) === currentID) {
      box = child.geometry
    }
  })
  buildingRotateRadius =
    Math.sqrt(
      Math.pow(box.boundingBox.max.x - box.boundingBox.min.x, 2) +
        Math.pow(box.boundingBox.max.z - box.boundingBox.min.z, 2)
    ) * 2.4
  let buildingHeight = Math.abs(box.boundingBox.max.y - box.boundingBox.min.y)

  let targetTime = (timeNow + generalDuration) * 0.0001

  setMaterial(currentView, buildingRotateRadius / 6)

  for (let i = 0; i < buildingData.length; i++) {
    buildingData[i].hide()
  }

  new TWEEN.Tween(camera.position)
    .to(
      {
        x: positionBuilding[currentID].x + buildingRotateRadius * Math.cos(targetTime),
        y: buildingHeight * 4,
        z: positionBuilding[currentID].z + buildingRotateRadius * Math.sin(targetTime),
      },
      generalDuration
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  new TWEEN.Tween(controls.target)
    .to(
      {
        x: positionBuilding[currentID].x,
        y: buildingHeight / 3,
        z: positionBuilding[currentID].z,
      },
      generalDuration
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
    .onComplete(function () {
      currentRadius = buildingRotateRadius
      IsRotated = true
      document.getElementById('autoRotate').classList.add('active')
      controls.enabled = false
      IsMoving = false

      popBuildingTitle.innerHTML = buildingInfo['bd_' + currentID].name
      if (!IsPopBuilding) {
        popBuilding.style.display = 'block'
        setTimeout(function () {
          popBuilding.classList.add('show')
        }, 10)
        IsPopBuilding = true
      }
      for (let i = 0; i < buildingData.length; i++) {
        buildingData[i].show()
      }
    })
}

function lightCircle(radius, position) {
  let lightCircle = {}

  let gtx = document.createElement('canvas').getContext('2d')
  gtx.canvas.width = 128
  gtx.canvas.height = 128
  let gradient = gtx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0.8, 'rgba(0,94,250,0)')
  gradient.addColorStop(1, 'rgba(0,94,250,1)')
  gtx.fillStyle = gradient
  gtx.fillRect(0, 0, 128, 128)

  let texture = new THREE.CanvasTexture(gtx.canvas)

  let geometry = new THREE.CircleGeometry(radius, 64)
  let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ map: texture, transparent: true, opacity: 1 }))

  mesh.rotation.x = -Math.PI / 2
  mesh.position.x = position.x
  mesh.position.y = 10
  mesh.position.z = position.z

  scene.add(mesh)

  run()
  function run() {
    mesh.scale.x = 1
    mesh.scale.y = 1
    mesh.material.opacity = 1
    lightCircle.tween1 = new TWEEN.Tween(mesh.scale)
      .to({ x: 5, y: 5 }, 2600)
      .onComplete(function () {
        run()
      })
      .start()
    lightCircle.tween2 = new TWEEN.Tween(mesh.material).to({ opacity: 0 }, 2600).start()
  }

  lightCircle.destroy = function () {
    TWEEN.remove(lightCircle.tween1)
    lightCircle.tween1 = null
    TWEEN.remove(lightCircle.tween2)
    lightCircle.tween2 = null
    scene.remove(mesh)
    clearCache(mesh)
    lightWave = null
  }

  return lightCircle
}

function ResetView() {
  if (IsRotated) {
    IsRotated = false
    document.getElementById('autoRotate').classList.remove('active')
  }

  new TWEEN.Tween(camera.position)
    .to({ x: cameraPosition[0], y: cameraPosition[1], z: cameraPosition[2] }, generalDuration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
  new TWEEN.Tween(controls.target)
    .to({ x: controlPosition[0], y: controlPosition[1], z: controlPosition[2] }, generalDuration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  controls.enabled = true

  if (IsZoomed) {
    currentID = -1
    setMaterial(currentView)
    switchUI(1)
    showLabel()
  }

  currentRadius = defaultRadius
  IsZoomed = false

  if (IsPopBuilding) {
    popBuilding.classList.remove('show')
    setTimeout(function () {
      popBuilding.style.display = 'none'
    }, 600)
    IsPopBuilding = false
  }

  if (IsPopCamera) {
    popCamera.classList.remove('show')
    setTimeout(function () {
      popCamera.style.display = 'none'
    }, 600)
    IsPopCamera = false
  }
}

function setMaterial(flag, radius) {
  let opacityMaterial_A = new THREE.MeshLambertMaterial({ color: 0x083260, transparent: true, opacity: 0.3 })
  let opacityMaterial_B = new THREE.MeshLambertMaterial({ color: 0x000c1f })
  let opacityMaterial_C = createGradientMaterial('0,138,255')
  let opacityMaterial_D = new THREE.MeshLambertMaterial({
    color: 0x004bc8,
    transparent: true,
    opacity: 0.6,
    depthTest: false,
  })

  base.traverse(function (child) {
    let ot = child.name.split('_')[0]
    if (child instanceof THREE.Mesh) {
      if (ot !== 'otherBuilding' && ot !== 'otherBuildingCap' && ot !== 'otherGround') {
        if (ot === 'ground') {
          child.material = flag ? opacityMaterial_B : materials[child.uuid]
        } else if (ot === 'tree') {
          child.visible = flag <= 0
        } else if (ot === 'glow') {
          child.material = flag ? opacityMaterial_C : materials[child.uuid]
        } else if (ot === 'building') {
          let id = parseInt(child.name.split('_')[1])
          if (id === currentID) {
            child.material = flag ? opacityMaterial_D : materials[child.uuid]
            child.renderOrder = 3
          } else {
            if (flag) {
              if (currentID === -1 && flag < 4) {
                ////////////////////
                child.material = new THREE.MeshLambertMaterial({
                  color: buildingColors['bd_' + id],
                  transparent: true,
                  opacity: 0.3,
                })
              } else {
                child.material = opacityMaterial_A
              }
            } else {
              if (currentID === -1) {
                child.material = materials[child.uuid]
              } else {
                let opacityMaterial = materials[child.uuid].clone()
                opacityMaterial.transparent = true
                opacityMaterial.opacity = 0.2
                child.material = opacityMaterial
              }
            }
          }
        } else if (ot === 'camera') {
          child.visible = flag === 6
        } else {
          child.material = flag ? opacityMaterial_A : materials[child.uuid]
        }
      }
    }
  })

  if (lightWave !== null) {
    lightWave.destroy()
  }
  if (flag && currentID !== -1) {
    lightWave = lightCircle(radius, positionBuilding[currentID])
  }
}

function createCurrentBox(obj) {
  let vg = new THREE.Geometry().fromBufferGeometry(obj.geometry)
  let vs = UniqueArray(vg.vertices)
  let geometry = new THREE.Geometry()
  for (let i = 0; i < vs.length; i++) {
    geometry.vertices.push(vs[i])
  }
  let face = [
    [4, 1, 0],
    [1, 4, 7],
    [2, 1, 7],
    [7, 6, 2],
    [2, 6, 5],
    [5, 3, 2],
    [3, 5, 4],
    [4, 0, 3],
  ]
  let t0 = new THREE.Vector2(0, 0)
  let t1 = new THREE.Vector2(1, 0)
  let t2 = new THREE.Vector2(1, 0.95)
  let t3 = new THREE.Vector2(0, 0.95)
  let faceUV = [
    [t2, t0, t1],
    [t0, t2, t3],
    [t0, t1, t2],
    [t2, t3, t0],
    [t1, t2, t3],
    [t3, t0, t1],
    [t1, t2, t3],
    [t3, t0, t1],
  ]
  for (let i = 0; i < face.length; i++) {
    geometry.faces.push(new THREE.Face3(face[i][0], face[i][1], face[i][2]))
    geometry.faceVertexUvs[0].push(faceUV[i])
  }

  let g_box = geometry

  let box = {}
  box.body = null
  box.mask = null
  box.texture = null
  box.material = null
  box.animationTexture = null
  box.animationOpacity = null

  let div = document.createElement('div')
  div.className = 'floatName'
  let c2d = new CSS2DObject(div)
  if (currentType === 0) {
    div.innerHTML = buildingInfo['bd_' + currentID].name
    c2d.position.set(positionBuilding[currentID].x, heightBuilding[currentID], positionBuilding[currentID].z)
  } else if (currentType === 1) {
    div.innerHTML = cameraInfo['ca_' + currentID].name
    let pos = getChildPosition(obj)
    c2d.position.set(pos.x, obj.geometry.boundingBox.max.y, pos.z)
  }

  scene.add(c2d)
  box.c2d = c2d
  setTimeout(function () {
    div.classList.add('show')
  }, 30)

  let gtx = document.createElement('canvas').getContext('2d')
  gtx.canvas.width = 128
  gtx.canvas.height = 128
  let gradient = gtx.createLinearGradient(0, 0, 0, 128)
  gradient.addColorStop(0, 'rgba(30,152,255,0)')
  gradient.addColorStop(1, 'rgba(30,152,255,1)')
  gtx.fillStyle = gradient
  gtx.fillRect(0, 0, 128, 128)
  let texture = new THREE.CanvasTexture(gtx.canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  let mt_body = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
  })

  gtx = document.createElement('canvas').getContext('2d')
  gtx.canvas.width = 128
  gtx.canvas.height = 128
  gtx.fillStyle = 'rgba(108,226,255,1)'
  gtx.fillRect(0, 0, 128, 6)
  gtx.fillRect(0, 12, 128, 6)
  gtx.fillRect(0, 24, 128, 6)
  box.texture = new THREE.CanvasTexture(gtx.canvas)
  box.texture.wrapS = box.texture.wrapT = THREE.RepeatWrapping
  box.material = new THREE.MeshLambertMaterial({
    map: box.texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
  })

  box.body = new THREE.Mesh(g_box, mt_body)
  scene.add(box.body)

  box.mask = new THREE.Mesh(g_box, box.material)
  scene.add(box.mask)

  box.texture.offset.y = -0.3

  let startIndex = -1.3
  run()
  function run() {
    box.material.opacity = 1
    box.animationTexture = new TWEEN.Tween(box.texture.offset)
      .to({ y: startIndex }, 1000)
      .onComplete(function () {
        startIndex -= 1
        run()
      })
      .start()

    box.animationOpacity = new TWEEN.Tween(box.material).to({ opacity: 0 }, 1000).start()
  }

  box.destroy = function () {
    if (box.animationTexture) {
      TWEEN.remove(box.animationTexture)
      box.animationTexture.stop()
      box.animationTexture = null
    }
    if (box.animationOpacity) {
      TWEEN.remove(box.animationOpacity)
      box.animationOpacity.stop()
      box.animationOpacity = null
    }
    scene.remove(box.body)
    scene.remove(box.mask)
    clearCache(box.body)
    clearCache(box.mask)
    scene.remove(box.c2d)
    startIndex = -1.3
  }

  return box
}

function clearCache(mesh) {
  mesh.geometry.dispose()
  mesh.material.dispose()
}

function UniqueArray(array) {
  let r = []
  r.push(array[0])

  for (let i = 1; i < array.length; i++) {
    let f = 1
    for (let j = 0; j < r.length; j++) {
      if (r[j].x === array[i].x && r[j].y === array[i].y && r[j].z === array[i].z) {
        f = 0
      }
    }
    if (f) {
      r.push(array[i])
    }
  }
  return r
}

function switchUI(flag) {
  let leftMask = document.getElementsByClassName('leftBar').item(0)
  let rightMask = document.getElementsByClassName('rightBar').item(0)

  if (flag) {
    leftMask.classList.remove('hide')
    rightMask.classList.remove('hide')
  } else {
    leftMask.classList.add('hide')
    rightMask.classList.add('hide')
  }
}

function hideLabel() {
  for (let i = 0; i < currentLabel.length; i++) {
    scene.remove(currentLabel[i].c2d)
  }
}

function showLabel() {
  for (let i = 0; i < currentLabel.length; i++) {
    scene.add(currentLabel[i].c2d)
  }
}

function destroyLabel() {
  for (let i = 0; i < currentLabel.length; i++) {
    scene.remove(currentLabel[i].c2d)
    currentLabel[i].div = null
    currentLabel[i].c2d = null
  }
  currentLabel = []
}

function runNumber(dom) {
  let target = parseInt(dom.innerHTML)
  let originNum = 1
  let stepNum = 0
  let timeNum = 10
  let addTime = target / 1000
  let addSpace = target / 200

  dom.innerHTML = '1'

  let timeId = setInterval(function () {
    if (originNum < target) {
      timeNum -= addTime
      stepNum += addSpace
      originNum = originNum + stepNum
      dom.innerHTML = parseInt(originNum)
    } else {
      dom.innerHTML = target
      clearInterval(timeId)
    }
  }, timeNum)
}

document.getElementById('closePopBuilding').onclick = function () {
  ResetView()
}

document.getElementById('closePopCamera').onclick = function () {
  ResetView()
}

document.getElementById('switchButtonLeft').onclick = function () {
  if (currentID > 0) {
    currentID--
    moveToBuilding()
  }
}

document.getElementById('switchButtonRight').onclick = function () {
  if (currentID < Object.keys(buildingInfo).length - 1) {
    currentID++
    moveToBuilding()
  }
}

document.getElementById('resetView').onclick = function () {
  ResetView()
}

document.getElementById('autoRotate').onclick = function () {
  if (IsRotated) {
    IsRotated = false
    this.classList.remove('active')
    controls.enabled = true
  } else {
    currentRadius = Math.sqrt(
      Math.pow(camera.position.x - controls.target.x, 2) + Math.pow(camera.position.z - controls.target.z, 2)
    )
    IsRotated = true
    this.classList.add('active')
    controls.enabled = false
  }
}

for (let i = 0; i < mainMenu.length; i++) {
  mainMenu[i].onclick = function () {
    if (currentView !== i) {
      mainMenu[currentView].classList.remove('active')
      mainMenu[i].classList.add('active')

      if (currentView === 6) {
        modifyInteractiveObjects(interactiveCamera, false)
      }

      destroyLabel()

      if (i) {
        //非全局

        if (i < 4) {
          //电、水、环境
          buildingColors = {}
          let currentMaxValue = 0
          let currentMinValue = 0
          for (let name in buildingInfo) {
            if (buildingInfo[name][energyType[i - 1][0]] > currentMaxValue) {
              currentMaxValue = buildingInfo[name][energyType[i - 1][0]]
            }
            if (buildingInfo[name][energyType[i - 1][0]] < currentMaxValue) {
              currentMinValue = buildingInfo[name][energyType[i - 1][0]]
            }
          }
          let currentD = currentMaxValue - currentMinValue
          for (let name in buildingInfo) {
            let colorRate = (buildingInfo[name][energyType[i - 1][0]] - currentMinValue) / currentD
            let colorType
            if (colorRate < 0.4) {
              buildingColors[name] = colorStartEnd[0]
              colorType = 'low'
            } else if (colorRate >= 0.4 && colorRate < 0.8) {
              buildingColors[name] = colorStartEnd[1]
              colorType = 'medium'
            } else {
              buildingColors[name] = colorStartEnd[2]
              colorType = 'high'
            }

            let barWidth = Math.round((buildingInfo[name][energyType[i - 1][0]] / currentMaxValue) * 90) + '%'
            let label = {}
            label.div = document.createElement('div')
            label.div.className = 'floatInfo ' + colorType
            let span = document.createElement('span')
            span.innerHTML = buildingInfo[name][energyType[i - 1][0]]
            label.div.appendChild(span)
            runNumber(span)
            let b = document.createElement('b')
            b.innerHTML = energyType[i - 1][1]
            label.div.appendChild(b)
            let bar = document.createElement('div')
            bar.style.width = barWidth
            setTimeout(function () {
              bar.classList.add('show')
            }, 10)

            label.div.appendChild(bar)
            label.c2d = new CSS2DObject(label.div)
            let id = name.split('_')[1]
            let position = positionBuilding[id]
            label.c2d.position.set(position.x, heightBuilding[id], position.z)
            currentLabel.push(label)
          }
        } else if (i === 6) {
          //监控
          modifyInteractiveObjects(interactiveCamera, true)
        }
      }

      if (currentID === -1) {
        showLabel()
      }

      setMaterial(i, buildingRotateRadius / 6)

      if (i === 2) {
        for (let j = 0; j < waterPipes.length; j++) {
          scene.add(waterPipes[j].object)
          waterPipes[j].play()
        }
      }
      if (currentView === 2) {
        for (let j = 0; j < waterPipes.length; j++) {
          scene.remove(waterPipes[j].object)
          waterPipes[j].stop()
        }
      }

      currentView = i
    }
  }
}

function modifyInteractiveObjects(array, flag) {
  for (let i = 0; i < array.length; i++) {
    if (flag) {
      interactiveObjects.add(array[i].clone())
    } else {
      interactiveObjects.remove(array[i])
    }
  }
}
