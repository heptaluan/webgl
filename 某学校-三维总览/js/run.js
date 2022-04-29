var camera, scene, renderer, controls

var container = document.getElementById('main3d')
var msgbox = document.getElementById('loadinginfo')
var infoj = document.getElementById('floatinfo')
var swtbar = document.getElementById('switchbar').getElementsByTagName('li')
var pipelist = document.getElementById('pipes').getElementsByTagName('li')
var bpic = document.getElementById('bottombar').getElementsByTagName('img')
for (i = 1; i < bpic.length; i++) {
  bpic[i].style.display = 'none'
}

var LoadTxt = ''

var camerapi = [-4480, 6700, 10700]
var RotateR = Math.sqrt(camerapi[0] * camerapi[0] + camerapi[2] * camerapi[2])
var contrlpi = [0, -300, 0]
var anitime = 750

var VBox = new THREE.Object3D()
var ShowBox = []
var Pipe = []
var PipeMeter = []
var PipeOther = new THREE.Object3D()
var CurrVw = 0
var CurrId = -1
var CurrMi = -1
var MT_Building = []
var MT_Ground = []
var CurrZz = []
var CurrBq = []
var CurrPt = []
var MT_Zhu = []
MT_Zhu[0] = new THREE.MeshLambertMaterial({ color: 0xff7200 }) //柱_电_材质
MT_Zhu[1] = new THREE.MeshLambertMaterial({ color: 0x609efa }) //柱_水_材质
MT_Zhu[2] = new THREE.MeshLambertMaterial({ color: 0xb68eec }) //柱_蒸汽_材质
MT_Zhu[3] = new THREE.MeshLambertMaterial({ color: 0x49d5a5 }) //柱_燃气_材质
var mt_Building = new THREE.MeshLambertMaterial({ color: 0x888888, transparent: true, opacity: 0.2 })
var mt_PGround = new THREE.MeshLambertMaterial({ color: 0x666666, transparent: true, opacity: 0.3 })
var mt_WaterMeter = new THREE.MeshLambertMaterial({ color: 0x00009a })
var mt_Pump = new THREE.MeshLambertMaterial({ color: 0x3a3afb })

var mt_pipe = []
var tx_pipe = []
var color_pipe = ['#3e8400', '#508597', '#d50000', '#ff6565', '#ff7e00', '#0515b1', '#9000c6', '#633d1e', '#0097c9']
for (var i = 0; i < color_pipe.length; i++) {
  var ptx = document.createElement('canvas').getContext('2d')
  ptx.canvas.width = 64
  ptx.canvas.height = 64
  ptx.fillStyle = color_pipe[i]
  ptx.fillRect(0, 0, 64, 64)
  ptx.translate(32, 32)
  ptx.rotate(Math.PI)
  ptx.fillStyle = 'rgba(255,255,255,0.5)'
  ptx.textAlign = 'center'
  ptx.textBaseline = 'middle'
  ptx.font = '60px sans-serif'
  ptx.fillText('▲', 0, 0)
  var pytexture = new THREE.CanvasTexture(ptx.canvas)
  pytexture.wrapS = THREE.RepeatWrapping
  pytexture.wrapT = THREE.RepeatWrapping
  pytexture.repeat.x = 3
  pytexture.repeat.y = 50
  tx_pipe.push(pytexture)
  mt_pipe.push(new THREE.MeshPhongMaterial({ map: pytexture }))
  Pipe.push(new THREE.Object3D())
  PipeMeter.push(new THREE.Object3D())
}

for (i = 0; i < pipelist.length; i++) {
  var sp = pipelist[i].getElementsByTagName('span').item(0)
  sp.style.background = color_pipe[i]
}

var CurrIc, GridGround, SkyBox, Trees, Ground, Building

var IsRotated = false
var IsZoomed = false
var IsMoving = false
var IsLockLab = false
var IsFlowAni = false

var VGI = [
  //虚拟物体信息： 长 高 宽 X Y Z 建筑名称 镜头X 镜头Y 镜头Z 镜头目标点X 镜头目标点Y 镜头目标点Z
  [1000, 660, 1500, -3650, 330, 2300, '体育馆', -7000, 1300, 7000, -1600, 0, 2300],
  [1800, 660, 600, -1900, 330, 2600, '综合楼', -6000, 1700, 7000, 300, 0, 2600],
  [800, 660, 400, -2500, 330, 1750, '教学楼', -3500, 2600, 4000, -1900, 0, 1800],
  [400, 200, 1600, -4300, 100, -1300, '看台', -3500, 600, 1000, -3700, 0, -1300],
  [2200, 660, 700, -500, 330, 1500, '教学楼', 200, 20, 4000, 500, 300, 1400],
  [800, 500, 500, 700, 250, 2370, '教学楼', -800, 800, 6000, 1700, 0, 2700],
  [1000, 500, 830, 600, 250, 315, '教学楼', -2600, 800, 300, 600, 0, 1200],
  [1300, 500, 580, -1050, 250, -1180, '学生宿舍', 100, 700, 1000, -1000, 0, -1800],
  [1300, 500, 580, -1050, 250, -2040, '学生宿舍', -3300, 700, -500, -700, 0, -1500],
  [950, 500, 500, -1240, 250, -3100, '学生宿舍', -3300, 1000, -1400, -700, 0, -2600],
  [260, 200, 260, -500, 100, -1700, '锅炉房', 500, 600, -1500, -500, 0, -2000],
  [1000, 460, 500, 450, 230, -2300, '实验楼', 2600, 600, -1300, 450, 0, -3100],
  [1200, 460, 1200, 550, 230, -1000, '实验楼', 4000, 1200, 1300, 450, 0, -2400],
  [1500, 300, 500, 100, 150, -3100, '实验楼', -1700, 500, -2400, -100, 0, -2600],
  [300, 200, 260, 1100, 100, -3150, '超市', 1750, 600, -2300, 1350, 100, -3100],
  [1000, 300, 1000, 1900, 150, -2500, '食堂', 3000, 600, -300, 2400, 0, -2500],
  [1500, 1200, 600, 3400, 600, -3100, '综合楼', 1700, 100, -200, 4500, 600, -2600],
  [1200, 400, 1250, 3500, 200, -700, '综合楼', 1500, 500, 0, 3500, 0, -700],
  [1200, 600, 500, 3500, 300, 500, '综合楼', 6500, 900, 1700, 3500, 0, -500],
  [1080, 560, 500, 2550, 280, 1250, '综合楼', 1600, 1300, 4000, 3100, 0, 1250],
  [700, 500, 500, 3800, 250, 1450, '综合楼', 5700, 500, 3700, 2700, 0, -2500],
  [180, 160, 180, 1600, 80, 1400, '污水泵房', 2400, 600, 2200, 1900, 100, 1400],
  [500, 180, 200, -950, 90, 3150, '门卫', 900, 100, 3800, -300, 0, 3150],
  [300, 220, 300, 1450, 110, 3000, '综合楼', 600, 500, 3900, 1700, 0, 3200],
  [400, 220, 250, 2500, 110, 3030, '水泵房', 1500, 500, 3900, 2600, 0, 3200],
  [500, 220, 250, 2950, 110, 3030, '员工宿舍', 2200, 500, 3900, 3200, 0, 3200],
  [360, 200, 300, 3470, 100, 3020, '育才中心', 2300, 500, 4500, 4300, 0, 2900],
  [500, 200, 500, 3900, 100, 2900, '综合楼', 2700, 500, 4500, 4700, 0, 2900],
]
var PH = [
  //能耗排行的数组 数据我随便写的，请换成真实的数组, 但电和水的数量一定要和前面的建筑数量相符，否则会出错
  [55, 12, 33, 44, 22, 188, 55, 12, 33, 44, 22, 188, 235, 56, 122, 66, 23, 15, 89, 90, 123, 66, 333, 35, 60, 77, 155], //电
  [89, 90, 123, 66, 333, 35, 89, 90, 123, 66, 333, 35, 60, 77, 55, 12, 33, 44, 22, 188, 235, 56, 122, 66, 23, 15, 155], //水
  [0, 0, 123, 0, 333, 0, 0, 0, 0, 66, 30, 35, 0, 77, 0, 0, 0, 0, 0, 0, 235, 0, 0, 66, 0, 0, 0], //蒸汽
  [55, 12, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 56, 0, 0, 0, 0, 0, 90, 0, 66, 333, 0, 0, 0, 155], //燃气
]
var DW = ['kWh', 'm³', 'm³', 'm³'] //能耗单位
var YS = ['#ff7200', '#609efa', '#b68eec', '#49d5a5'] //能耗分类颜色

if (!Detector.webgl) {
  Detector.addGetWebGLMessage()
  document.getElementById('container').innerHTML = ''
  msgbox.innerHTML = '当前浏览器不支持WebGL'
} else {
  init()
}

var manager = new THREE.LoadingManager()
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = (xhr.loaded / xhr.total) * 100
    msgbox.innerHTML = LoadTxt + parseInt(percentComplete) + '%'
  }
}

//初始化
function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)
  scene.fog = new THREE.Fog(0xf5f5f5, 15000, 26000)

  camera = new THREE.PerspectiveCamera(26, container.offsetWidth / container.offsetHeight, 0.5, 3000000)
  controls = new THREE.OrbitControls(camera, container)
  //controls.enablePan = false;

  //controls.minDistance = minDT;
  controls.maxPolarAngle = Math.PI * 0.46
  //controls.minPolarAngle = minSA;

  camera.position.x = camerapi[0]
  camera.position.y = 20000
  camera.position.z = camerapi[2]

  controls.target.set(contrlpi[0], contrlpi[1], contrlpi[2])

  scene.add(new THREE.AmbientLight(0xffffff, 0.7))

  var light_A = new THREE.DirectionalLight(0xffffff, 0.8)
  light_A.position.x = 500
  light_A.position.y = 1000
  light_A.position.z = 1000
  light_A.castShadow = true
  light_A.shadow.camera.near = -10000
  light_A.shadow.camera.far = 6000
  light_A.shadow.camera.right = 7000
  light_A.shadow.camera.left = -7000
  light_A.shadow.camera.top = 4000
  light_A.shadow.camera.bottom = -4000
  scene.add(light_A)

  /*
	var helper_A = new THREE.DirectionalLightHelper(light_A);
	scene.add(helper_A);
	var helper_B = new THREE.CameraHelper(light_A.shadow.camera );
	scene.add(helper_B);
	*/

  var light_B = new THREE.DirectionalLight(0xffffff, 0.4)
  light_B.position.x = -90
  light_B.position.y = 100
  light_B.position.z = -20
  scene.add(light_B)

  CreateEnv()

  function CreateEnv() {
    msgbox.innerHTML = '正在创建环境'

    GridGround = new THREE.Group()

    var w = 40000
    var t = 200
    var n = 50
    var k = 44
    var d = -100

    var line_g = new THREE.Geometry()
    line_g.vertices.push(new THREE.Vector3(-w / 2, d, 0))
    line_g.vertices.push(new THREE.Vector3(w / 2, d, 0))
    var mt_gridline = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.1 })
    var sline_g

    for (var i = 0; i <= t; i++) {
      if (i > t / 2 - k / 2 && i < t / 2 + k / 2) {
        sline_g = new THREE.Geometry()
        sline_g.vertices.push(new THREE.Vector3(-w / 2, d, (w / t) * (n / 2) - ((i - (t / 2 - n / 2)) * w) / t))
        sline_g.vertices.push(
          new THREE.Vector3(((-w / t) * n) / 2, d, (w / t) * (n / 2) - ((i - (t / 2 - n / 2)) * w) / t)
        )
        var sline = new THREE.Line(sline_g, mt_gridline)
        GridGround.add(sline)

        sline_g = new THREE.Geometry()
        sline_g.vertices.push(new THREE.Vector3(w / 2, d, (w / t) * (n / 2) - ((i - (t / 2 - n / 2)) * w) / t))
        sline_g.vertices.push(
          new THREE.Vector3(((w / t) * n) / 2, d, (w / t) * (n / 2) - ((i - (t / 2 - n / 2)) * w) / t)
        )
        sline = new THREE.Line(sline_g, mt_gridline)
        GridGround.add(sline)
      } else {
        var gline = new THREE.Line(line_g, mt_gridline)
        gline.position.z = (i * w) / t - w / 2
        GridGround.add(gline)
      }

      if (i > t / 2 - n / 2 && i < t / 2 + n / 2) {
        sline_g = new THREE.Geometry()
        sline_g.vertices.push(new THREE.Vector3((w / t) * (k / 2) - ((i - (t / 2 - k / 2)) * w) / t, d, w / 2))
        sline_g.vertices.push(
          new THREE.Vector3((w / t) * (k / 2) - ((i - (t / 2 - k / 2)) * w) / t, d, ((w / t) * k) / 2)
        )
        sline = new THREE.Line(sline_g, mt_gridline)
        GridGround.add(sline)

        sline_g = new THREE.Geometry()
        sline_g.vertices.push(new THREE.Vector3((w / t) * (k / 2) - ((i - (t / 2 - k / 2)) * w) / t, d, -w / 2))
        sline_g.vertices.push(
          new THREE.Vector3((w / t) * (k / 2) - ((i - (t / 2 - k / 2)) * w) / t, d, ((-w / t) * k) / 2)
        )
        sline = new THREE.Line(sline_g, mt_gridline)
        GridGround.add(sline)
      } else {
        gline = new THREE.Line(line_g, mt_gridline)
        gline.position.x = (i * w) / t - w / 2
        gline.rotation.y = Math.PI / 2
        GridGround.add(gline)
      }
    }

    scene.add(GridGround)

    var iloader = new THREE.ImageLoader()
    iloader.load('textures/skybox.jpg', function (image) {
      function getSide(x, y, size, tm) {
        var canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        var context = canvas.getContext('2d')
        context.drawImage(tm, -x * size, -y * size)
        return canvas
      }
      var getimgx = [
        [2, 1],
        [0, 1],
        [3, 0],
        [3, 2],
        [1, 1],
        [3, 1],
      ]

      var cubemap = new THREE.CubeTexture([])
      cubemap.format = THREE.RGBFormat
      cubemap.needsUpdate = true
      for (var i = 0; i < 6; i++) {
        cubemap.images[i] = getSide(getimgx[i][0], getimgx[i][1], 1024, image)
      }
      var cubeShader = THREE.ShaderLib['cube']
      cubeShader.uniforms['tCube'].value = cubemap
      var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide,
      })
      var sky = new THREE.Mesh(new THREE.BoxGeometry(45000, 45000, 45000), skyBoxMaterial)

      scene.add(sky)

      SkyBox = sky

      CreateBuilding()
    })
  }

  function CreateBuilding() {
    LoadTxt = '建筑模型加载：'

    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.load('models/building.mtl', function (materials) {
      materials.preload()
      var objLoader = new THREE.OBJLoader(manager)
      objLoader.setMaterials(materials)
      objLoader.load(
        'models/building.obj',
        function (object) {
          object.traverse(function (child) {
            child.castShadow = true
            if (child.material !== undefined) {
              if (child.material.length === undefined) {
                MT_Building.push(child.material.clone())
              }
            }
          })

          scene.add(object)

          Building = object

          CreateGround()
        },
        onProgress
      )
    })
  }

  function CreateGround() {
    LoadTxt = '地面模型加载：'

    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.load('models/ground.mtl', function (materials) {
      materials.preload()
      var objLoader = new THREE.OBJLoader(manager)
      objLoader.setMaterials(materials)
      objLoader.load(
        'models/ground.obj',
        function (object) {
          object.traverse(function (child) {
            child.receiveShadow = true
            if (child.material !== undefined) {
              if (child.material.length === undefined) {
                MT_Ground.push(child.material.clone())
              }
            }
          })

          scene.add(object)

          Ground = object

          CreateTree()
        },
        onProgress
      )
    })
  }

  function CreateTree() {
    LoadTxt = '树木模型加载：'

    var imagelist = ['tree1.png', 'tree2.png', 'tree3.png']
    var MtTreeArray = []

    LoadImage()

    function LoadImage() {
      msgbox.innerHTML = '正在加载贴图'

      var iloader = new THREE.ImageLoader(manager)
      iloader.load(
        'textures/' + imagelist[MtTreeArray.length],
        function (image) {
          var treetexture = new THREE.Texture()
          treetexture.image = image
          treetexture.needsUpdate = true
          var mt_tree = new THREE.MeshLambertMaterial({
            map: treetexture,
            transparent: true,
            depthWrite: false,
            opacity: 0.7,
          })
          MtTreeArray.push(mt_tree)

          if (MtTreeArray.length < imagelist.length) {
            LoadImage()
          } else {
            LoadImageComplete()
          }
        },
        onProgress
      )
    }

    function LoadImageComplete() {
      var treei = 1
      var tai
      var objLoader = new THREE.OBJLoader(manager)
      objLoader.load(
        'models/tree.obj',
        function (object) {
          object.traverse(function (child) {
            if (treei) {
              tai = parseInt(3 * Math.random())
              treei = 0
            } else {
              treei = 1
            }

            child.material = MtTreeArray[tai]
            child.castShadow = true
          })

          scene.add(object)

          Trees = object
          CreatePipe()
        },
        onProgress
      )
    }
  }

  function CreatePipe() {
    LoadTxt = '管道模型加载：'

    var objLoader = new THREE.OBJLoader(manager)
    objLoader.load(
      'models/pipe.obj',
      function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            var pt = child.name.substr(0, 1)
            var id = parseInt(child.name.substr(1, 1))
            if (pt === 'p') {
              //管道
              child.material = mt_pipe[id]
              Pipe[id].add(child.clone())
            } else if (pt === 's') {
              //水表
              child.material = mt_WaterMeter
              PipeMeter[id].add(child.clone())
            } else {
              //水箱和泵房
              child.material = mt_Pump
              PipeOther.add(child.clone())
            }

            child.geometry.dispose()
            child.material.dispose()
          }
        })

        AllCreated()
      },
      onProgress
    )
  }

  function AllCreated() {
    msgbox.innerHTML = '正在进行最后准备'

    for (var i = 0; i < VGI.length; i++) {
      var vgs_g = new THREE.CubeGeometry(VGI[i][0], VGI[i][1], VGI[i][2])
      var vgs = new THREE.Mesh(
        vgs_g,
        new THREE.MeshLambertMaterial({ color: 0x3091ff, transparent: true, opacity: 0.5 })
      )
      vgs.position.x = VGI[i][3]
      vgs.position.y = VGI[i][4]
      vgs.position.z = VGI[i][5]
      vgs.name = i
      ShowBox.push(vgs.clone())
      VBox.add(vgs)
    }

    VBox.visible = false
    scene.add(VBox)

    CurrIc = VBox

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    window.addEventListener('resize', onWindowResize, false)
    container.addEventListener('click', onMouseClick, false)
    container.addEventListener('mousemove', onMouseMove, false)

    animate()

    msgbox.style.display = 'none'
    document.getElementById('yun').classList.add('yun_ani')

    new TWEEN.Tween(camera.position)
      .to({ y: camerapi[1] }, anitime)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
      .onComplete(function () {
        controls.maxDistance = 20000
        controls.enabled = true
        document.getElementById('main3d_mask').remove()
        document.getElementById('ptopbar').style.display = 'block'
        document.getElementById('btnwarp').style.display = 'block'
        document.getElementById('switchbar').style.display = 'block'
      })
  }
}

//刷新动画
function animate(time) {
  if (IsRotated) {
    var timer = time * 0.0001
    camera.position.x = Math.cos(timer) * RotateR
    camera.position.y = camerapi[1]
    camera.position.z = Math.sin(timer) * RotateR
  }

  if (IsLockLab) {
    for (var i = 0; i < CurrBq.length; i++) {
      CurrBq[i].style.left = ScrPos(CurrPt[i])[0] - CurrBq[i].offsetWidth / 2 + 'px'
      CurrBq[i].style.top = ScrPos(CurrPt[i])[1] + 10 + 'px'
    }
  }

  if (IsFlowAni) {
    for (i = 0; i < tx_pipe.length; i++) {
      tx_pipe[i].offset.y = (time * 0.003) % 1
    }
  }

  requestAnimationFrame(animate)
  TWEEN.update()
  controls.update()
  renderer.render(scene, camera)
}

//窗体改变事件
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
}

//交互射线
function IntX(event) {
  var Sx = event.clientX
  var Sy = event.clientY
  var x = (Sx / container.offsetWidth) * 2 - 1
  var y = -(Sy / container.offsetHeight) * 2 + 1
  var standardVector = new THREE.Vector3(x, y, 0.5)
  var worldVector = standardVector.unproject(camera)
  var ray = worldVector.sub(camera.position).normalize()
  var raycaster = new THREE.Raycaster(camera.position, ray)
  var meshChildren = CurrIc.children
  var intersects = raycaster.intersectObjects(meshChildren)
  var result = null
  if (intersects.length > 0) {
    result = intersects[0].object
  }
  return result
}

//坐标转换
function ScrPos(pv) {
  var p = pv.clone()
  var vector = p.project(camera)
  vector.x = Math.round(((vector.x + 1) / 2) * container.offsetWidth)
  vector.y = Math.round((-(vector.y - 1) / 2) * container.offsetHeight)
  return [vector.x, vector.y]
}

//取得模型内部元素的位置
function GetChildPos(child) {
  var cg = child.geometry
  cg.computeBoundingBox()
  var centroid = new THREE.Vector3()
  centroid.addVectors(cg.boundingBox.min, cg.boundingBox.max)
  centroid.multiplyScalar(0.5)
  return centroid
}

//移动镜头
function MoveCamera(cx, cy, cz, tx, ty, tz) {
  new TWEEN.Tween(camera.position).to({ x: cx, y: cy, z: cz }, anitime).easing(TWEEN.Easing.Quadratic.Out).start()
  new TWEEN.Tween(controls.target).to({ x: tx, y: ty, z: tz }, anitime).easing(TWEEN.Easing.Quadratic.Out).start()
}

//光标点击事件
function onMouseClick(event) {
  //console.log('camera:'+camera.position.x+'_'+camera.position.y+'_'+camera.position.z+'****controls:'+controls.target.x+'_'+controls.target.y+'_'+controls.target.z);

  if (IsRotated) {
    IsRotated = false
    document.getElementById('btn_autorotate').classList.remove('active')
  }

  if (CurrVw === 0 && !IsZoomed) {
    var obj = IntX(event)
    if (obj) {
      infoj.style.display = 'none'
      scene.remove(ShowBox[CurrId])

      IsZoomed = true
      MoveToBuilding()
    }
  } else if (CurrVw === 1) {
    obj = IntX(event)
    if (obj) {
      document.getElementById('meterinfo').style.display = 'block'

      SetMeterCon()
    }
  }
}

//光标移动事件
function onMouseMove(event) {
  if (CurrVw === 0 && !IsZoomed) {
    //建筑

    infoj.style.display = 'none'
    if (CurrId !== -1) {
      scene.remove(ShowBox[CurrId])
    }

    CurrId = -1

    var obj = IntX(event)
    if (obj) {
      var id = parseInt(obj.name)

      infoj.style.display = 'block'
      infoj.getElementsByTagName('span').item(0).innerHTML = id + '_' + VGI[id][6]

      var p = new THREE.Vector3(VGI[id][3], VGI[id][4], VGI[id][5])
      infoj.style.left = ScrPos(p)[0] - infoj.offsetWidth / 2 + 'px'
      infoj.style.top = ScrPos(p)[1] - 60 + 'px'

      scene.add(ShowBox[id])
      CurrId = id
    }
  } else if (CurrVw === 1) {
    //管线

    infoj.style.display = 'none'
    CurrMi = null
    obj = IntX(event)

    if (obj) {
      infoj.style.display = 'block'
      infoj.getElementsByTagName('span').item(0).innerHTML = obj.name
      CurrMi = obj.name

      p = GetChildPos(obj)
      infoj.style.left = ScrPos(p)[0] - infoj.offsetWidth / 2 + 'px'
      infoj.style.top = ScrPos(p)[1] - 55 + 'px'
    }
  }
}

//将镜头移至当前建筑
function MoveToBuilding() {
  document.getElementById('bucon').style.display = 'none'
  document.getElementById('bumoving').style.display = 'block'

  IsMoving = true

  new TWEEN.Tween(camera.position)
    .to(
      {
        x: VGI[CurrId][7],
        y: VGI[CurrId][8],
        z: VGI[CurrId][9],
      },
      anitime
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  new TWEEN.Tween(controls.target)
    .to(
      {
        x: VGI[CurrId][10],
        y: VGI[CurrId][11],
        z: VGI[CurrId][12],
      },
      anitime
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
    .onComplete(function () {
      controls.enabled = false
      document.getElementById('ptopbar').style.display = 'none'
      document.getElementById('switchbar').style.display = 'none'
      document.getElementById('buwarp').style.display = 'block'

      document.getElementById('bucon').style.display = 'block'
      document.getElementById('bumoving').style.display = 'none'
      SetBuInfoCon()

      IsMoving = false
    })
}

function ResetView() {
  if (IsRotated) {
    IsRotated = false
    document.getElementById('btn_autorotate').classList.remove('active')
  }
  MoveCamera(camerapi[0], camerapi[1], camerapi[2], contrlpi[0], contrlpi[1], contrlpi[2])
  CurrId = -1
  controls.enabled = true

  if (IsZoomed) {
    document.getElementById('ptopbar').style.display = 'block'
    document.getElementById('switchbar').style.display = 'block'
    document.getElementById('buwarp').style.display = 'none'
  }

  IsZoomed = false
}

//建筑信息面板关闭按钮
document.getElementById('buclose').onclick = function () {
  ResetView()
}

//计量表信息面板关闭按钮
document.getElementById('mclose').onclick = function () {
  document.getElementById('meterinfo').style.display = 'none'
}

//恢复视角
document.getElementById('btn_resetview').onclick = function () {
  ResetView()
}

//向前切换建筑
document.getElementById('btn_buprev').onclick = function () {
  if (!IsMoving) {
    //只有动画停下来时才生效
    if (CurrId > 0) {
      CurrId--
      MoveToBuilding()
    }
  }
}

//向后切换建筑
document.getElementById('btn_bunext').onclick = function () {
  if (!IsMoving) {
    if (CurrId < VGI.length - 1) {
      CurrId++
      MoveToBuilding()
    }
  }
}

//自动旋转
document.getElementById('btn_autorotate').onclick = function () {
  if (!IsZoomed) {
    if (IsRotated) {
      IsRotated = false
      document.getElementById('btn_autorotate').classList.remove('active')
      controls.enabled = true
    } else {
      IsRotated = true
      document.getElementById('btn_autorotate').classList.add('active')
      controls.enabled = false
    }
  }
}

//为切换条添加事件
for (i = 0; i < swtbar.length; i++) {
  ;(function (j) {
    swtbar[i].onclick = function () {
      bpic[CurrVw].style.display = 'none'
      swtbar[CurrVw].classList.remove('active')
      swtbar[j].classList.add('active')
      CurrVw = j
      bpic[CurrVw].style.display = 'block'

      SetView()
    }
  })(i)
}

//为管道列表添加事件
for (i = 0; i < pipelist.length; i++) {
  pipelist[i].getElementsByTagName('input').item(0).onclick = function () {
    SetView()
  }
}

//设置各元素的显示状态
function SetView() {
  IsLockLab = false

  for (i = 0; i < CurrZz.length; i++) {
    scene.remove(CurrZz[i])
    delete CurrZz[i]
    document.body.removeChild(CurrBq[i])
  }
  CurrZz = []
  CurrBq = []
  CurrPt = []

  for (var j = 0; j < Pipe.length; j++) {
    scene.remove(Pipe[j])
    scene.remove(PipeMeter[j])
  }
  scene.remove(PipeOther)

  if (CurrVw === 0) {
    //显示建筑

    scene.add(SkyBox)
    scene.add(Trees)

    var ix = 0
    Building.traverse(function (child) {
      if (child.material !== undefined) {
        if (child.material.length === undefined) {
          child.material = MT_Building[ix].clone()
          ix++
        }
      }
    })
    ix = 0
    Ground.traverse(function (child) {
      if (child.material !== undefined) {
        if (child.material.length === undefined) {
          child.material = MT_Ground[ix].clone()
          ix++
        }
      }
    })

    CurrIc = VBox

    IsFlowAni = false
    document.getElementById('pipes').style.display = 'none'
  } else {
    //显示管网或能耗排行

    scene.remove(SkyBox)
    scene.remove(Trees)

    Ground.traverse(function (child) {
      if (child.material !== undefined) {
        if (child.material.length === undefined) {
          child.material = mt_PGround
        }
      }
    })

    if (CurrVw === 1) {
      //显示管网

      Building.traverse(function (child) {
        if (child.material !== undefined) {
          if (child.material.length === undefined) {
            child.material = mt_Building
          }
        }
      })

      for (j = 0; j < Pipe.length; j++) {
        if (pipelist[j].getElementsByTagName('input').item(0).checked) {
          scene.add(Pipe[j])
          scene.add(PipeMeter[j])
        }
      }

      CurrIc = new THREE.Object3D()
      for (j = 0; j < PipeMeter.length; j++) {
        PipeMeter[j].traverse(function (child) {
          if (child.isMesh) {
            if (pipelist[j].getElementsByTagName('input').item(0).checked) {
              CurrIc.add(child.clone())
            }
          }
        })
      }

      scene.add(PipeOther)

      IsFlowAni = true
      document.getElementById('pipes').style.display = 'block'
    } else {
      //显示各类能耗排行

      ix = 0
      Building.traverse(function (child) {
        if (child.material !== undefined) {
          if (child.material.length === undefined) {
            child.material = MT_Building[ix].clone()
            child.material.transparent = true
            child.material.opacity = 0.4
            ix++
          }
        }
      })

      IsFlowAni = false
      document.getElementById('pipes').style.display = 'none'

      var id = CurrVw - 2

      var zmax = Math.max.apply(null, PH[id])

      for (var i = 0; i < PH[id].length; i++) {
        //创建柱
        var h = (PH[id][i] / zmax) * 1800
        if (h <= 20) h = 20
        var vgs_g = new THREE.CubeGeometry(100, h, 100)
        var vgs = new THREE.Mesh(vgs_g, MT_Zhu[id])
        vgs.castShadow = true
        vgs.position.x = VGI[i][3]
        vgs.position.y = h / 2
        vgs.position.z = VGI[i][5]
        if (i === 3) {
          vgs.visible = false
        }

        scene.add(vgs)
        CurrZz.push(vgs)
        CurrPt.push(new THREE.Vector3(VGI[i][3], h, VGI[i][5]))

        //创建标签
        var div = document.createElement('div')
        div.setAttribute('class', 'zinfo')
        div.style.color = YS[id]
        if (i === 3) {
          div.style.display = 'none'
        }
        div.innerHTML = VGI[i][6] + '<br>' + PH[id][i] + '<span>' + DW[id] + '</span>'

        document.body.appendChild(div)
        CurrBq.push(div)
      }

      IsLockLab = true
    }
  }
}

/*----------------建筑信息开始------------------*/
function SetBuInfoCon() {
  document.getElementById('butitle').innerHTML = VGI[CurrId][6] //不显示建筑序号

  /*** CurrId 是建筑的标识，从0到20，代表21幢建筑 ***/
}
/*----------------建筑信息结束------------------*/

/*----------------水表信息开始------------------*/
function SetMeterCon() {
  var pid = parseInt(CurrMi.substr(1, 1))

  //console.log(pid);

  var tt = pipelist[pid].getElementsByTagName('b').item(0).innerHTML
  var ot = CurrMi.split('_')

  document
    .getElementById('meterinfo')
    .getElementsByClassName('mtitle')
    .item(0)
    .getElementsByTagName('span')
    .item(0).innerHTML = '水表_' + ot[1] + '_' + tt

  /*** CurrId 是建筑的标识，从0到20，代表21幢建筑 ***/
}
/*----------------水表信息结束------------------*/
