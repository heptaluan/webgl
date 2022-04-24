var camera_bird, camera_person, scene, renderer
var line_g, earth
var controls, controlbird
var raycaster, mouse
var delta

var FullScr = 0 //默认非全屏显示

var scrmx, scrmy

var INTERSECTED
var AJNow = -1
var SXTNow = -1
var RPNow = -1
var AutoRo = 0
var AutoRP = 0
var intersects = []
var MouseMoving = 0
var InnerView = 0
var RPView = 0
var ShowInfo = 1

var IsInPchuang = 0
var IsInPfengji = 0
var IsChuangKai = '一键开窗'
var IsFengjiKai = '风机启停'

var IsWDShowing = 0 //正在显示测温

var IsCQShowing = 0 //正在显示测温

var treetx = [] //存储树贴图的容器
var loadtreetxindex = 0 //树贴图当前加载索引
var TRE

var Ground //除了仓库之外其他的东西
var ajw1, ajw2
var ajf1, ajf2
var AJ_VG_G = [
  [53, 15, 25],
  [53, 15, 25],
  [53, 15, 25],
  [53, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [27, 15, 25],
  [50, 15, 25],
  [27, 15, 25],
] //所有廒间交互物体体积信息
var AJ_VG_P = [
  [42.88, 15, -45.15],
  [42.97, 15, -86.72],
  [97.6, 15, -45.16],
  [97.5, 15, -86.75],
  [147.8, 15, -45],
  [147.8, 15, -87],
  [184, 15, -45],
  [184, 15, -87],
  [219.6, 15, -45],
  [219.6, 15, -87],
  [255.5, 15, -45],
  [252, 15, -87],
  [280.3, 15, -45],
  [298.2, 15, -87],
  [310.5, 15, -45],
] //所有廒间交互物体位置信息
var AJ_VG = [] //所有廒间虚拟交互物体

var SXT_VG_P = [
  //摄像头位置信息
  [14.6, 18.5, -53.2],
  [321, 17.5, -32.5],
  [321, 17.5, -99.7],
  [14.6, 17.5, -99.7],
  [16, 17.5, -58],
  [16, 17.5, -73],
  [68.5, 17.5, -73],
  [71.5, 17.5, -73],
  [68.5, 17.5, -59],
  [71.5, 17.5, -59],
  [123, 21.3, -73],
  [123, 21.3, -59],
  [139, 21.3, -73],
  [139, 21.3, -59],
  [165.5, 21.3, -73],
  [165.5, 21.3, -59],
  [193.5, 17.5, -73],
  [193.5, 17.5, -59],
  [209, 17.5, -73],
  [209, 17.5, -59],
  [235, 17.5, -73],
  [237.5, 17.5, -59],
  [264, 17.5, -73],
  [265, 17.5, -59],
  [320, 17.5, -73],
  [320, 17.5, -59],
  [16, 19, -21.5],
  [18.5, 19, -21.5],
  [69, 19, -21.5],
  [71.5, 19, -21.5],
  [130.5, 19, -21.5],
  [133, 19, -21.5],
  [164, 19, -21.5],
  [166.5, 19, -21.5],
  [199.5, 19, -21.5],
  [202, 19, -21.5],
  [237.5, 19, -21.5],
  [240, 19, -21.5],
  [277.5, 19, -21.5],
  [280, 19, -21.5],
  [320, 19, -21.5],
  [322.5, 19, -21.5],
  [56.5, 13, -109.5],
  [96, 13.5, -109.5],
  [98.5, 13.5, -109.5],
  [130.5, 19, -110.5],
  [133, 19, -110.5],
  [164.5, 19, -110.5],
  [167, 19, -110.5],
  [200, 19, -110.5],
  [202.5, 19, -110.5],
  [234.5, 19, -110.5],
  [237, 19, -110.5],
  [264.5, 19, -110.5],
  [267.5, 19, -110.5],
  [292.5, 19, -110.5],
  [295, 19, -110.5],
  [-14.7, 13.3, -27.3],
  [-9.8, 12.7, -29.4],
  [-14.7, 13.3, -34.9],
  [-14.7, 13.3, -37.7],
  [-14.7, 13.3, -40.4],
  [-14.7, 13.3, -43.5],
  [-19.8, 17.4, -80.2],
  [-19.8, 17.9, -92.3],
  [-11.3, 18.3, -99.9],
  [88.7, 13.5, -109.7],
  [-6.1, 16.1, -77.7],
  [320.7, 17.5, -51.1],
]
var SXT_VG = [] //所有摄像头虚拟交互物体

var qxy //气象仪

var RP_VG_P = [
  [19, -104],
  [80, -66],
  [131, -104],
  [131, -27],
  [200, -66],
  [266, -104],
  [266, -27],
  [328, -66],
] //虚拟旋转点位置
var RP_VG = []
var RP_VG_div = []

var MoveInAJ_VG = 0
var MoveInSXT_VG = 0
var MoveInQXY_VG = 0
var MoveInRP_VG = 0

var groundMaterial = new THREE.MeshPhongMaterial({ color: 0x263d16, specular: 0x111111 }) //地面材质

var xn_mt = new THREE.MeshPhongMaterial({ color: 0xff0000 }) //虚拟物体材质，用于测试

var sball_mt = new THREE.MeshPhongMaterial({ color: 0x0082e3 }) //小球
var sball_mt_c = new THREE.MeshPhongMaterial({ color: 0xff0000 }) //选中的小球
var sballn = [
  [6, 12],
  [6, 12],
  [6, 12],
  [6, 12],
  [6, 8],
  [6, 8],
  [6, 8],
  [6, 8],
  [6, 7],
  [5, 7],
  [6, 7],
  [5, 8],
  [6, 7],
  [5, 10],
  [6, 6],
] //各个仓几行几列
var sline = []
var spoint = []
var SPOINTC
var spinfo = [] //温度信息的div面板
var sprpi = [] //行列信息的div面板
var svr = [] //用于绑定行列信息虚拟物体

var cq_mt = new THREE.MeshPhongMaterial({ color: 0xc36000 }) //虫气管道和点的材质
var cqgd
var cqpoint = []
var cq_p = [
  [-25, 9.3],
  [-25, -10.5],
  [25, -10.5],
  [25, 9.3],
  [-14.25, -8.5],
  [-11.4, -8.5],
  [8.4, -8.5],
  [11.2, -8.5],
  [-14.25, 6.9],
  [-11.4, 6.9],
  [8.4, 6.9],
  [11.2, 6.9],
  [-17.2, -0.9],
  [-1.3, -0.9],
  [16.2, -0.9],
]
var cqinfo = [] //虫害或气体的div面板

var chuangVG = []

var fengjiVG

var isbird = 1 //鸟瞰状态

var isperson = 0 //第一人称状态

var havePointerLock =
  'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document

if (havePointerLock) {
  var element = document.body

  var pointerlockchange = function (event) {
    if (
      document.pointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element
    ) {
      controlsEnabled = true
      controls.enabled = true
    } else {
      controls.enabled = false
    }
  }

  var pointerlockerror = function (event) {
    //
  }

  // Hook pointer lock state change events
  document.addEventListener('pointerlockchange', pointerlockchange, false)
  document.addEventListener('mozpointerlockchange', pointerlockchange, false)
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false)

  document.addEventListener('pointerlockerror', pointerlockerror, false)
  document.addEventListener('mozpointerlockerror', pointerlockerror, false)
  document.addEventListener('webkitpointerlockerror', pointerlockerror, false)
}

init()
animate()

var controlsEnabled = false

var moveForward = false
var moveBackward = false
var moveLeft = false
var moveRight = false
var canJump = false

var prevTime
var velocity = new THREE.Vector3()

function init() {
  //场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xcce0ff)
  scene.fog = new THREE.Fog(0xcce0ff, 260, 1500)

  //场景-环境光
  var ambient = new THREE.AmbientLight(0x777777)
  scene.add(ambient)

  //场景-平行光
  var directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(8, 16, 11)
  directionalLight.intensity = 0.8
  scene.add(directionalLight)

  var directionalLight1 = new THREE.DirectionalLight(0xffffff)
  directionalLight1.position.set(8, -5, -11)
  directionalLight1.intensity = 0.5
  scene.add(directionalLight1)

  //鸟瞰镜头
  camera_bird = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 80000)
  camera_bird.position.x = -100
  camera_bird.position.y = 100
  camera_bird.position.z = 100

  controlbird = new THREE.TrackballControls(camera_bird)
  controlbird.target = new THREE.Vector3(80, 0, -50)
  //controlbird.noZoom = true;
  //controlbird.noPan = true;
  controlbird.maxDistance = 600

  //第一人称镜头
  camera_person = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000)
  controls = new THREE.PointerLockControls(camera_person)
  scene.add(controls.getObject())

  //加载信息
  var manager = new THREE.LoadingManager()
  manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total)
  }
  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100
      document.getElementById('loadinginfo').innerHTML = Math.round(percentComplete, 2) + '%'
    }
  }
  var onError = function (xhr) {}

  //创建树
  function LoadTreeTx() {
    var texture = new THREE.Texture()
    var imgLoader = new THREE.ImageLoader()
    imgLoader.load(
      'models/maps/tree' + (loadtreetxindex + 1) + '.png',
      function (img) {
        texture.image = img
        texture.needsUpdate = true
        treetx.push(texture)
        if (loadtreetxindex < 2) {
          loadtreetxindex++
          LoadTreeTx()
        } else {
          var objLoader = new THREE.OBJLoader()
          var treei = 1
          var tai
          objLoader.load(
            'models/trees.obj',
            function (object) {
              object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  if (treei) {
                    tai = parseInt(3 * Math.random())
                    treei = 0
                  } else {
                    treei = 1
                  }
                  child.material.map = treetx[tai]
                  child.material.transparent = true
                  child.material.depthWrite = false
                }
              })
              TRE = object
              scene.add(object)
            },
            onProgress,
            onError
          )
          return
        }
      },
      onProgress,
      onError
    )
  }
  LoadTreeTx()

  //创建地面
  var earth = new THREE.Mesh(new THREE.PlaneBufferGeometry(3000, 3000), groundMaterial)
  earth.position.y = 4
  earth.rotation.x = -Math.PI / 2
  scene.add(earth)

  //画地面上的线
  var line_g = new THREE.Geometry()
  line_g.vertices.push(new THREE.Vector3(-1000, 0, 0))
  line_g.vertices.push(new THREE.Vector3(1000, 0, 0))

  var gridline = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })

  for (var i = 0; i <= 200; i++) {
    var line = new THREE.Line(line_g, gridline)
    line.position.z = i * 10 - 1000
    line.position.y = 4.3
    scene.add(line)

    var line = new THREE.Line(line_g, gridline)
    line.position.x = i * 10 - 1000
    line.position.y = 4.3
    line.rotation.y = (90 * Math.PI) / 180
    scene.add(line)
  }

  //加载窗户
  var mtlLoader = new THREE.MTLLoader()

  mtlLoader.load('models/windows1.mtl', function (materials) {
    materials.preload()

    var objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      'models/windows1.obj',
      function (object) {
        ajw1 = object
        scene.add(object)
        ajw1.visible = 0
      },
      onProgress,
      onError
    )
  })
  var mtlLoader = new THREE.MTLLoader()

  mtlLoader.load('models/windows2.mtl', function (materials) {
    materials.preload()

    var objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      'models/windows2.obj',
      function (object) {
        ajw2 = object
        scene.add(object)
        ajw2.visible = 0
      },
      onProgress,
      onError
    )
  })

  //加载风机
  var mtlLoader = new THREE.MTLLoader()

  mtlLoader.load('models/fengji1.mtl', function (materials) {
    materials.preload()

    var objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      'models/fengji1.obj',
      function (object) {
        ajf1 = object
        scene.add(object)
        ajf1.visible = 0
      },
      onProgress,
      onError
    )
  })
  var mtlLoader = new THREE.MTLLoader()

  mtlLoader.load('models/fengji2.mtl', function (materials) {
    materials.preload()

    var objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      'models/fengji2.obj',
      function (object) {
        ajf2 = object
        scene.add(object)
        ajf2.visible = 0
      },
      onProgress,
      onError
    )
  })

  //创建仓库交互物体
  for (i = 0; i < AJ_VG_P.length; i++) {
    var cangku_g = new THREE.CubeGeometry(AJ_VG_G[i][0], AJ_VG_G[i][1], AJ_VG_G[i][2])
    var cangku = new THREE.Mesh(cangku_g, xn_mt)
    cangku.position.set(AJ_VG_P[i][0], AJ_VG_P[i][1], AJ_VG_P[i][2])
    scene.add(cangku)
    cangku.visible = 0
    AJ_VG.push(cangku)
  }

  //创建摄像头交互物体
  for (i = 0; i < SXT_VG_P.length; i++) {
    var sxt_g = new THREE.CubeGeometry(1.5, 1.5, 1.5)
    var sxt = new THREE.Mesh(sxt_g, xn_mt)
    sxt.position.set(SXT_VG_P[i][0], SXT_VG_P[i][1], SXT_VG_P[i][2])
    scene.add(sxt)
    sxt.visible = 0
    SXT_VG.push(sxt)
  }

  //创建气象仪交互物体
  var qxy_g = new THREE.CubeGeometry(2.5, 3, 3)
  qxy = new THREE.Mesh(qxy_g, xn_mt)
  qxy.position.set(-10.3, 18.5, -81.3)
  scene.add(qxy)
  qxy.visible = 0

  //加载虫气管道
  var loader = new THREE.OBJLoader(manager)

  loader.load(
    'models/guandao.obj',
    function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = cq_mt
        }
      })

      scene.add(object)
      cqgd = object
      cqgd.visible = 0
    },
    onProgress,
    onError
  )

  //创建捕虫器
  for (i = 0; i < 15; i++) {
    var cqb_g = new THREE.SphereGeometry(0.3, 8, 6)
    var cqb = new THREE.Mesh(cqb_g, cq_mt)
    cqb.position.set(cq_p[i][0], 17.3, cq_p[i][1])
    cqb.visible = 0
    scene.add(cqb)
    cqpoint.push(cqb)

    var div = document.createElement('div')
    div.setAttribute('class', 'pwendu')
    div.innerHTML = '虫害:12只 气体:20%'
    document.body.appendChild(div)
    cqinfo.push(div)
  }

  //创建窗户虚拟物体
  var schuang_g = new THREE.CubeGeometry(51, 1.5, 0.1)
  var schuang = new THREE.Mesh(schuang_g, xn_mt)
  scene.add(schuang)
  schuang.visible = 0
  chuangVG.push(schuang)
  var schuang_g = new THREE.CubeGeometry(51, 1.5, 0.1)
  var schuang = new THREE.Mesh(schuang_g, xn_mt)
  scene.add(schuang)
  schuang.visible = 0
  chuangVG.push(schuang)

  //创建风机虚拟物体
  var sfengji_g = new THREE.CubeGeometry(51, 1.5, 0.1)
  fengjiVG = new THREE.Mesh(sfengji_g, xn_mt)
  scene.add(fengjiVG)
  fengjiVG.visible = 0

  //创建旋转虚拟点
  for (i = 0; i < RP_VG_P.length; i++) {
    var ropoint_g = new THREE.CubeGeometry(3, 3, 3)
    var ropoint = new THREE.Mesh(ropoint_g, xn_mt)
    ropoint.position.set(RP_VG_P[i][0], 22, RP_VG_P[i][1])
    scene.add(ropoint)
    ropoint.visible = 0
    RP_VG.push(ropoint)

    var div = document.createElement('div')
    div.setAttribute('class', 'rop')
    document.body.appendChild(div)
    RP_VG_div.push(div)
  }

  //加载全部不可动模型
  var mtlLoader = new THREE.MTLLoader()
  mtlLoader.setPath('models/')
  mtlLoader.load('Base.mtl', function (materials) {
    materials.preload()

    var objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.setPath('models/')
    objLoader.load(
      'Base.obj',
      function (object) {
        Ground = object
        scene.add(object)
        document.getElementById('loadinginfo').style.visibility = 'hidden'
      },
      onProgress,
      onError
    )
  })

  //画电子围栏的线
  var linepos_xz = [
    [14.7, -18.9],
    [438, -18.9],
    [425.5, -113.5],
    [279.9, -113.5],
    [-40.9, -133.35],
    [-43.3, -132.16],
    [-43.3, -18.9],
    [-12.7, -18.9],
  ]
  var linepos_y = [12.3, 12.7, 13.2]
  var wallline = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })

  for (var i = 0; i < linepos_xz.length - 1; i++) {
    for (var j = 0; j < 3; j++) {
      var line_g = new THREE.Geometry()
      line_g.vertices.push(new THREE.Vector3(linepos_xz[i][0], linepos_y[j], linepos_xz[i][1]))
      line_g.vertices.push(new THREE.Vector3(linepos_xz[i + 1][0], linepos_y[j], linepos_xz[i + 1][1]))
      var line = new THREE.Line(line_g, wallline)
      scene.add(line)
    }
  }

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true
        break

      case 37: // left
      case 65: // a
        moveLeft = true
        break

      case 40: // down
      case 83: // s
        moveBackward = true
        break

      case 39: // right
      case 68: // d
        moveRight = true
        break

      case 27: // ESC
        controlsEnabled = false
        controls.enabled = false

        document.exitPointerLock()

        break
    }
  }

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
        break

      case 37: // left
      case 65: // a
        moveLeft = false
        break

      case 40: // down
      case 83: // s
        moveBackward = false
        break

      case 39: // right
      case 68: // d
        moveRight = false
        break

      case 27: // ESC
        QuitView()
        break
    }
  }

  window.addEventListener('resize', onWindowResize, false)

  document.addEventListener('mousemove', onMouseMoveFloat, false)

  document.addEventListener('mousedown', onMouseDownAJ, false)

  document.addEventListener('keydown', onKeyDown, false)

  document.addEventListener('keyup', onKeyUp, false)
}

function onWindowResize() {
  camera_person.aspect = window.innerWidth / window.innerHeight
  camera_person.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMoveFloat(event) {
  MouseMoving = 1

  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop

  scrmx = event.pageX || event.clientX + scrollX
  scrmy = event.pageY || event.clientY + scrollY
}

function onMouseDownAJ(event) {
  if (!InnerView) {
    //鸟瞰 或 自动旋转显示

    AutoRo = 0 //停止自动旋转
    AutoRP = 0
    document.getElementById('btn_xuanz').classList.remove('active')

    if (SXTNow != -1) {
      //点到了任意摄像头上
      document.getElementById('sxttips').style.display = 'none'
      document.getElementById('sxtinfo').style.display = 'block'
      document.getElementById('sxtinfo_title').innerHTML = SXTNow + '号摄像头'
    }

    if (!RPView) {
      //鸟瞰图
      if (AJNow != -1) {
        //点到了任意仓上

        for (i = 0; i < RP_VG_div.length; i++) {
          //隐藏所有旋转点图标
          RP_VG_div[i].style.display = 'none'
        }

        document.getElementById('btn_xuanz').style.display = 'none'
        document.getElementById('btn_manyou').style.display = 'none'
        document.getElementById('ajtips').style.display = 'none'
        document.getElementById('sxtinfo').style.display = 'none'

        InnerView = 1

        new TWEEN.Tween(camera_bird.position)
          .to(
            {
              x: AJ_VG_P[AJNow][0] - AJ_VG_G[AJNow][0] / 3,
              y: 10,
              z: AJ_VG_P[AJNow][2],
            },
            1500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()

        new TWEEN.Tween(controlbird.target)
          .to(
            {
              x: AJ_VG_P[AJNow][0],
              y: 10,
              z: AJ_VG_P[AJNow][2],
            },
            1500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()

        //延时创建仓库内部物体，不然太卡
        setTimeout(function () {
          document.getElementById('ajinfo').style.display = 'block'
          document.getElementById('yjinfo').style.display = 'block'
          document.getElementById('ajtitle').innerHTML = AJNow + 1 + '号仓'

          ajf1.visible = 1
          ajf2.visible = 0
          ajw1.visible = 1
          ajw2.visible = 0

          //移动风机交互虚拟物体
          if (AJNow == 13) {
            //14号仓的通风位置特殊
            fengjiVG.position.set(AJ_VG_P[AJNow][0] + 2, 9, AJ_VG_P[AJNow][2] - 11)
          } else {
            fengjiVG.position.set(AJ_VG_P[AJNow][0] + 2, 9, AJ_VG_P[AJNow][2] + 11)
          }

          chuangVG[0].position.set(AJ_VG_P[AJNow][0] + 2, 17.5, AJ_VG_P[AJNow][2] - 11) //移动窗户交互虚拟物体
          chuangVG[1].position.set(AJ_VG_P[AJNow][0] + 2, 17.5, AJ_VG_P[AJNow][2] + 11)

          //创建测温线缆
          CreatWDLine(sballn[AJNow][1], sballn[AJNow][0])

          cqgd.position.set(AJ_VG_P[AJNow][0], -4, AJ_VG_P[AJNow][2]) //移动虫害管道

          for (i = 0; i < 15; i++) {
            //移动虫害气体点
            cqpoint[i].position.set(AJ_VG_P[AJNow][0] + cq_p[i][0], 13.3, AJ_VG_P[AJNow][2] + cq_p[i][1])
          }

          SHwd(1, 0) //显示测温线缆和标签

          //SHcq(1); //显示虫害气体和标签

          //controlbird.maxDistance = 13;
        }, 1600)

        controlbird.noZoom = true
      }

      if (RPNow != -1) {
        //点到了任意虚拟旋转点上

        for (i = 0; i < RP_VG_div.length; i++) {
          //隐藏所有旋转点图标
          RP_VG_div[i].style.display = 'none'
        }

        document.getElementById('btn_manyou').style.display = 'none'

        RPView = 1

        new TWEEN.Tween(camera_bird.position)
          .to(
            {
              x: RP_VG_P[RPNow][0],
              y: 10,
              z: RP_VG_P[RPNow][1],
            },
            1500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()

        new TWEEN.Tween(controlbird.target)
          .to(
            {
              x: RP_VG_P[RPNow][0] + 10,
              y: 10,
              z: RP_VG_P[RPNow][1],
            },
            1500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()

        setTimeout(function () {
          AutoRP = 1
          document.getElementById('btn_xuanz').classList.add('active')
        }, 1600)
      }
    }
  } else if (InnerView) {
    //仓库内部显示
    if (IsInPchuang) {
      //光标移到窗户控制器上
      if (ajw2.visible) {
        ajw1.visible = 1
        ajw2.visible = 0
        IsChuangKai = '一键开窗'
      } else {
        ajw1.visible = 0
        ajw2.visible = 1
        IsChuangKai = '一键关窗'
      }
    } else if (IsInPfengji) {
      //光标移到风机控制器上
      if (ajf2.visible) {
        ajf1.visible = 1
        ajf2.visible = 0
        IsFengjiKai = '风机启停'
      } else {
        ajf1.visible = 0
        ajf2.visible = 1
        IsFengjiKai = '风机启停'
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate)

  if (isbird) {
    TWEEN.update()
    controlbird.update()
    renderer.render(scene, camera_bird)

    if (AutoRo) {
      var timer = Date.now() * 0.0001
      camera_bird.position.x = -Math.cos(timer) * 210 + 80
      camera_bird.position.y = 110
      camera_bird.position.z = Math.sin(timer) * 210 - 50
    }

    if (AutoRP) {
      var timer1 = Date.now() * 0.0001
      camera_bird.position.x = -Math.cos(timer1) * 4 + RP_VG_P[RPNow][0] + 10
      camera_bird.position.y = 10
      camera_bird.position.z = Math.sin(timer1) * 4 + RP_VG_P[RPNow][1]
    }

    if (MouseMoving) {
      //如果光标移动了

      raycaster.setFromCamera(mouse, camera_bird)

      intersects = raycaster.intersectObjects(scene.children)

      if (InnerView) {
        //仓库内部显示

        if (IsWDShowing) {
          //如果正在显示测温
          for (i = 0; i < spoint.length; i++) {
            //绑定温度信息与小球
            spinfo[i].style.left = ScrPos(spoint[i], camera_bird)[0] + 'px'
            spinfo[i].style.top = ScrPos(spoint[i], camera_bird)[1] - 26 + 'px'
          }
          for (i = 0; i < sprpi.length; i++) {
            //绑定行列信息与线缆
            sprpi[i].style.left = ScrPos(svr[i], camera_bird)[0] + 'px'
            sprpi[i].style.top = ScrPos(svr[i], camera_bird)[1] + 'px'
          }
        }

        if (IsCQShowing) {
          //如果正在显示虫气
          for (i = 0; i < cqpoint.length; i++) {
            //绑定温度信息与小球
            cqinfo[i].style.left = ScrPos(cqpoint[i], camera_bird)[0] + 'px'
            cqinfo[i].style.top = ScrPos(cqpoint[i], camera_bird)[1] + 'px'
          }
        }

        if (intersects.length > 0) {
          //如果光线穿到了物体上

          //光标移到窗上
          for (i = 0; i < chuangVG.length; i++) {
            if (intersects[0].object == chuangVG[i]) {
              document.getElementById('pchuang').style.display = 'block'
              document.getElementById('pchuang').innerHTML = IsChuangKai
              document.getElementById('pchuang').style.left = scrmx - 32 + 'px'
              document.getElementById('pchuang').style.top = scrmy - 52 + 'px'
              IsInPchuang = 1
              break
            } else {
              document.getElementById('pchuang').style.display = 'none'
              IsInPchuang = 0
            }
          }
          //光标移到风机上
          //for(i=0; i<fengjiVG.length; i++){
          if (intersects[0].object == fengjiVG) {
            document.getElementById('pfengji').style.display = 'block'
            document.getElementById('pfengji').innerHTML = IsFengjiKai
            document.getElementById('pfengji').style.left = scrmx - 32 + 'px'
            document.getElementById('pfengji').style.top = scrmy - 52 + 'px'
            IsInPfengji = 1
          } else {
            document.getElementById('pfengji').style.display = 'none'
            IsInPfengji = 0
          }
          //}
        }
      } else {
        //鸟瞰图 或 自动旋转点显示

        MoveInSXT_VG = 0

        if (intersects.length > 0) {
          for (i = 0; i < SXT_VG.length; i++) {
            //监测摄像头交互
            if (intersects[0].object == SXT_VG[i]) {
              MoveInSXT_VG = 1

              if (INTERSECTED != SXT_VG[i]) {
                INTERSECTED = SXT_VG[i]
                SXTNow = i

                document.getElementById('sxttips').style.display = 'block'
                document.getElementById('sxttips').innerHTML = i + '号摄像头'
                document.getElementById('sxttips').style.left = ScrPos(SXT_VG[i], camera_bird)[0] - 10 + 'px'
                document.getElementById('sxttips').style.top = ScrPos(SXT_VG[i], camera_bird)[1] - 36 + 'px'
                break
              }
            }
          }
        }

        if (!RPView) {
          //鸟瞰图 有仓库交互 和 虚拟旋转点交互

          for (i = 0; i < RP_VG.length; i++) {
            //旋转点div与虚拟物体绑定
            RP_VG_div[i].style.left = ScrPos(RP_VG[i], camera_bird)[0] - 10 + 'px'
            RP_VG_div[i].style.top = ScrPos(RP_VG[i], camera_bird)[1] - 10 + 'px'
          }

          MoveInAJ_VG = 0
          MoveInRP_VG = 0
          MoveInQXY_VG = 0
          document.getElementById('tianqi').style.display = 'none'

          if (intersects.length > 0) {
            for (i = 0; i < AJ_VG.length; i++) {
              //监测廒间交互
              if (intersects[0].object == AJ_VG[i]) {
                MoveInAJ_VG = 1

                if (INTERSECTED != AJ_VG[i]) {
                  INTERSECTED = AJ_VG[i]
                  AJNow = i

                  document.getElementById('ajtips').style.display = 'block'
                  document.getElementById('ajtips_title').innerHTML = i + 1 + '号仓'
                  document.getElementById('ajtips').style.left = ScrPos(AJ_VG[i], camera_bird)[0] - 160 + 'px'
                  document.getElementById('ajtips').style.top = ScrPos(AJ_VG[i], camera_bird)[1] - 130 + 'px'

                  break
                }
              }
            }

            for (i = 0; i < SXT_VG.length; i++) {
              //监测虚拟旋转点交互
              if (intersects[0].object == RP_VG[i]) {
                MoveInRP_VG = 1

                if (INTERSECTED != RP_VG[i]) {
                  INTERSECTED = RP_VG[i]
                  RPNow = i
                  break
                }
              }
            }

            if (intersects[0].object == qxy) {
              //监测气象仪的交互
              MoveInQXY_VG = 1
              document.getElementById('tianqi').style.display = 'block'
              document.getElementById('tianqi').style.left = ScrPos(qxy, camera_bird)[0] - 30 + 'px'
              document.getElementById('tianqi').style.top = ScrPos(qxy, camera_bird)[1] - 130 + 'px'
            }
          }
        } //鸟瞰图判断结束

        if (INTERSECTED) {
          if (!MoveInAJ_VG) {
            AJNow = -1
            document.getElementById('ajtips').style.display = 'none'
          }
          if (!MoveInSXT_VG) {
            SXTNow = -1
            document.getElementById('sxttips').style.display = 'none'
          }
          if (!MoveInRP_VG) {
            RPNow = -1
          }
          if (!MoveInAJ_VG && !MoveInSXT_VG && !MoveInRP_VG) {
            //如果同时移出廒间或摄像头或虚拟点
            INTERSECTED = null
          }
        }
      }
    }
  } else if (isperson) {
    renderer.render(scene, camera_person)
    if (controlsEnabled) {
      var time = performance.now()
      delta = (time - prevTime) / 1000

      velocity.x -= velocity.x * 10.0 * delta
      velocity.z -= velocity.z * 10.0 * delta
      velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

      if (moveForward) velocity.z -= 150.0 * delta
      if (moveBackward) velocity.z += 150.0 * delta

      if (moveLeft) velocity.x -= 150.0 * delta
      if (moveRight) velocity.x += 150.0 * delta

      controls.getObject().translateX(velocity.x * delta)
      controls.getObject().translateY(velocity.y * delta)
      controls.getObject().translateZ(velocity.z * delta)

      velocity.y = 0
      controls.getObject().position.y = 10

      prevTime = time
    }
  }
}

document.getElementById('btn_huifu').onclick = function () {
  QuitView()
}

document.getElementById('btn_xuanz').onclick = function () {
  if (!RPView) {
    if (AutoRo) {
      AutoRo = 0
      document.getElementById('btn_xuanz').classList.remove('active')
    } else {
      AutoRo = 1
      document.getElementById('btn_xuanz').classList.add('active')
    }
  } else {
    if (AutoRP) {
      AutoRP = 0
      document.getElementById('btn_xuanz').classList.remove('active')
    } else {
      AutoRP = 1
      document.getElementById('btn_xuanz').classList.add('active')
    }
  }
}

document.getElementById('sxtinfo_close').onclick = function () {
  document.getElementById('sxtinfo').style.display = 'none'
}

document.getElementById('sxtinfoui_close').onclick = function () {
  document.getElementById('sxtinfoui').style.display = 'none'
}

document.getElementById('sxtui').onclick = function () {
  document.getElementById('sxtinfoui').style.display = 'block'
}

//取得屏幕位置
function ScrPos(object, camera) {
  var p = object.position.clone()
  var vector = p.project(camera)
  vector.x = Math.round(((vector.x + 1) / 2) * window.innerWidth)
  vector.y = Math.round((-(vector.y - 1) / 2) * window.innerHeight)
  return [vector.x, vector.y]
}

function QuitView() {
  camera_bird = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 80000)
  camera_bird.position.x = -100
  camera_bird.position.y = 100
  camera_bird.position.z = 100

  controlbird = new THREE.TrackballControls(camera_bird)
  controlbird.target = new THREE.Vector3(80, 0, -50)
  controlbird.maxDistance = 600

  AutoRo = 0
  document.getElementById('btn_xuanz').classList.remove('active')
  document.getElementById('sxtinfo').style.display = 'none'
  isbird = 1
  isperson = 0
  document.getElementById('btnwarp').style.display = 'block'
  document.getElementById('tishi').style.display = 'none'
  InnerView = 0
  controlbird.noZoom = false
  document.getElementById('btn_xuanz').style.display = 'inline-block'
  document.getElementById('btn_manyou').style.display = 'inline-block'
  document.getElementById('ajinfo').style.display = 'none'
  document.getElementById('yjinfo').style.display = 'none'
  document.getElementById('pchuang').style.display = 'none'
  document.getElementById('pfengji').style.display = 'none'
  document.getElementById('sxtinfoui').style.display = 'none'

  ajf1.visible = 0
  ajf2.visible = 0
  ajw1.visible = 0
  ajw2.visible = 0

  SHwd(0) //隐藏温度点和标签
  SHcq(0) //隐藏虫害气体和标签

  DeleteWDLine() //删除测温线缆

  if (RPView) {
    RPView = 0
    if (AutoRP) {
      AutoRP = 0
    }
  }
  for (i = 0; i < RP_VG_div.length; i++) {
    //显示所有旋转点图标
    RP_VG_div[i].style.display = 'block'
  }
}

function SHwd(f, a) {
  //0隐藏或1显示测温线缆及标签
  for (i = 0; i < sline.length; i++) {
    //测温线缆
    sline[i].visible = f
    if (a) sprpi[i].style.display = 'block'
    else sprpi[i].style.display = 'none'
  }

  for (i = 0; i < spoint.length; i++) {
    //温度点和温度标签
    spoint[i].visible = f
    if (a) spinfo[i].style.display = 'block'
    else spinfo[i].style.display = 'none'
  }

  IsWDShowing = f
}

function SHcq(f) {
  //0隐藏或1显示虫害气体管道

  cqgd.visible = f //管道

  for (i = 0; i < cqpoint.length; i++) {
    //温度点和温度标签
    cqpoint[i].visible = f
    if (f) cqinfo[i].style.display = 'block'
    else cqinfo[i].style.display = 'none'
  }

  IsCQShowing = f
}

document.getElementById('show_wd').onclick = function () {
  SHwd(1, 1)
  SHcq(0)
}

document.getElementById('show_ch').onclick = function () {
  SHwd(0, 0)
  SHcq(1)
}

document.getElementById('show_tf').onclick = function () {
  SHwd(0, 0)
  SHcq(0)
}

var LeftIsShow = 1
document.getElementById('shbtn_left').onclick = function () {
  if (LeftIsShow) {
    document.getElementById('leftwarp').style.display = 'none'
    document.getElementById('shbtn_left').style.left = '10px'
    document.getElementById('shla').style.backgroundPosition = 'right'
    LeftIsShow = 0
  } else {
    document.getElementById('leftwarp').style.display = 'block'
    document.getElementById('shbtn_left').style.left = '355px'
    document.getElementById('shla').style.backgroundPosition = 'left'
    LeftIsShow = 1
  }
}

var RightIsShow = 1
document.getElementById('shbtn_right').onclick = function () {
  if (RightIsShow) {
    document.getElementById('rightwarp').style.display = 'none'
    document.getElementById('shbtn_right').style.right = '10px'
    document.getElementById('shra').style.backgroundPosition = 'left'
    RightIsShow = 0
  } else {
    document.getElementById('rightwarp').style.display = 'block'
    document.getElementById('shbtn_right').style.right = '355px'
    document.getElementById('shra').style.backgroundPosition = 'right'
    RightIsShow = 1
  }
}

/////////////创建测温线缆
function CreatWDLine(ha, hb) {
  for (i = 0; i < ha; i++) {
    //行
    for (j = 0; j < hb; j++) {
      //列
      var sptp_g = new THREE.CubeGeometry(0.03, 6, 0.03)
      var sptp = new THREE.Mesh(sptp_g, sball_mt)

      sptp.position.set(AJ_VG_P[AJNow][0] - 21 + i * 4, 11.5, AJ_VG_P[AJNow][2] - 9 + j * 3.6)
      scene.add(sptp)
      sline.push(sptp)

      var spvr_g = new THREE.CubeGeometry(0.03, 0.03, 0.03)
      var spvr = new THREE.Mesh(spvr_g, sball_mt)
      spvr.position.set(AJ_VG_P[AJNow][0] - 21 + i * 4, 8.4, AJ_VG_P[AJNow][2] - 9 + j * 3.6)
      spvr.visible = 0
      scene.add(spvr)
      svr.push(spvr)

      var div = document.createElement('div')
      div.setAttribute('class', 'phl')
      div.innerHTML = j + 1 + '行' + (i + 1) + '列'
      document.body.appendChild(div)
      sprpi.push(div)

      for (k = 0; k < 4; k++) {
        var sball_g = new THREE.SphereGeometry(0.075, 8, 6)
        var sball = new THREE.Mesh(sball_g, sball_mt)

        sball.position.set(AJ_VG_P[AJNow][0] - 21 + i * 4, 8.5 + k * 2, AJ_VG_P[AJNow][2] - 9 + j * 3.6)
        scene.add(sball)
        spoint.push(sball)

        var div = document.createElement('div')
        div.setAttribute('class', 'pwendu')
        var iswd = Math.random() * 5 + 20
        div.innerHTML = iswd.toFixed(1) + '℃'
        document.body.appendChild(div)
        spinfo.push(div)
      }
    }
  }
}

////////////删除测温线缆

function DeleteWDLine() {
  for (i = 0; i < sline.length; i++) {
    scene.remove(sline[i])
    delete sline[i]
    scene.remove(svr[i])
    delete svr[i]
    document.body.removeChild(sprpi[i])
  }
  sline = []
  sprpi = []
  svr = []

  for (i = 0; i < spoint.length; i++) {
    scene.remove(spoint[i])
    delete spoint[i]
    document.body.removeChild(spinfo[i])
  }
  spoint = []
  spinfo = []
}

//全屏或退出全屏
document.getElementById('btn_quanp').onclick = function () {
  wscript = new ActiveXObject('WScript.Shell')
  alert(123)
  if (wscript) {
    wscript.SendKeys('{F11}')
  }
}

//漫游
document.getElementById('btn_manyou').onclick = function () {
  for (i = 0; i < RP_VG_div.length; i++) {
    //隐藏所有旋转点图标
    RP_VG_div[i].style.display = 'none'
  }

  prevTime = performance.now()

  element.requestPointerLock =
    element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
  element.requestPointerLock()
  //alert(123);
  isbird = 0
  isperson = 1
  document.getElementById('btnwarp').style.display = 'none'
  document.getElementById('tishi').style.display = 'block'
  //	document.getElementById('ajinfo').style.display = 'none';
  document.getElementById('ajtips').style.display = 'none'
}
