// <!------******>>>>>>BY YangZP<<<<<<******------!>

var camera, scene, renderer, controls

var loadstep = 0 //加载步数
var loadinfo = [
  '创建场景',
  '规划农田',
  '河道开挖',
  '建筑物施工',
  '铺设管道',
  '安装水泵',
  '种植绿化带树木',
  '生长农作物',
]

var container = document.getElementById('container')
var msgbox = document.getElementById('loadinginfo')
var swtbar = document.getElementById('switchbar').getElementsByTagName('li')
var fltbox = document.getElementById('floatinfo')
var ppbox = document.getElementById('pumpinfo')
var bbar = document.getElementById('databar')
var bpic = document.getElementById('databar').getElementsByTagName('section')
var btnbox = document.getElementById('btnwarp')

var pipeall, pumpall, pimpt //管道和水泵
var pipe = [] //管道物体组
var pindex = [0, 6, 16, 26, 34, 41, 47, 54, 63, 72, 80, 85, 96]
var pump = [] //水泵物体组

var farm, building, water, tree, wheat

var VG = []
var PVG = []
var SWVG = []
var vg_mt = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 })
var vg_pi = [
  [-1207, -81],
  [-679, -109],
  [-65, -322],
  [31, 17],
  [137, 6],
  [40, -358],
  [310, -521],
  [400, -537],
  [836, -326],
  [827, 14],
  [1246, -109],
  [1616, -296],
]
var pvg_pi = [
  [[-1207, -81]],
  [[-679, -109]],
  [[-65, -322]],
  [[31, 17]],
  [[137, 6]],
  [[40, -358]],
  [[310, -521]],
  [[400, -537]],
  [[836, -326]],
  [[827, 14]],
  [[1246, -109]],
  [[1616, -296]],
]
var swvg_pi = [
  [-634, -233],
  [366, -421],
  [1540, -417],
]
var sw_mt = new THREE.MeshPhongMaterial({ color: 0x888888 })
var pccc = []

var cubeMap

var td_start = 2000 //穿越云层动画时间
var td_swz = 1000 //鸟瞰图时切换视图的动画时间
var td_swb = 1000 //切换建筑的动画时间

var camerapi = [-1000, 900, 2600] //镜头标准位置
var contrlpi = [-150, 0, 200] //控制点标准位置
var showzpi = [-1200, 1600, 2500]

//管道有水流的材质
var ctx = document.createElement('canvas').getContext('2d')
ctx.canvas.width = 64
ctx.canvas.height = 64
ctx.fillStyle = 'rgba(46,73,162,1)'
ctx.fillRect(0, 0, 64, 64)
ctx.translate(32, 32)
ctx.rotate(Math.PI)
ctx.fillStyle = 'rgb(88,218,250)'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.font = '60px sans-serif'
ctx.fillText('▲', 0, 0)
var ptexture = new THREE.CanvasTexture(ctx.canvas)
ptexture.wrapS = THREE.RepeatWrapping
ptexture.wrapT = THREE.RepeatWrapping
ptexture.repeat.x = 3
ptexture.repeat.y = 9
var pvm = new THREE.MeshPhongMaterial({ map: ptexture, transparent: true })
var pnm = new THREE.MeshPhongMaterial({ color: 0xff9000 }) //管道没水流的材质

var btexture = new THREE.Texture() //运转的泵的材质
var bdx = 0 //运转的泵的偏移量
var bvm = new THREE.MeshPhongMaterial()
var bnm = new THREE.MeshPhongMaterial({ color: 0xff9000 }) //没有运转的泵的材质
var btm = new THREE.MeshPhongMaterial({ color: 0x2e49a2 }) //泵体的材质

var raycaster, mouse
var INTERSECTED
var intersects = []
var MouseMoving = 0
var IsNow = -1
var ShowB = 0

var Cur_ID = 0 //当前显示模式： 0灌区展示 1水泵 2电 3水 4时长 5水位 6监控
var RotateScene = 0 //是否自动旋转
var PlayAni = 0 //是否播放动画

var DW = ['kWh', 'm³', 'h', 'm'] //单位
var zmt = [
  new THREE.MeshPhongMaterial({ color: 0xff7200 }), //柱_电_材质
  new THREE.MeshPhongMaterial({ color: 0x609efa }), //柱_水_材质
  new THREE.MeshPhongMaterial({ color: 0xb68eec }), //柱_时长_材质
  new THREE.MeshPhongMaterial({ color: 0x49d5a5 }), //柱_水位_材质
]
var CurZ = [] //存储当前柱子的容器
var CurZVG = []
var zinfo = [] //存储能耗柱浮动标签的容器
var YS = ['#ff7200', '#609efa', '#b68eec', '#49d5a5'] //能耗分类颜色

//////////////////以下数据我随便编的//////////////////
var zdata = [
  [33, 55, 66, 77, 123, 234, 0, 55, 99, 0, 222, 78], //电量信息
  [234, 999, 678, 1234, 63, 555, 656, 321, 123, 0, 567, 432], //水量信息
  [[893], [155], [666], [0], [1213], [555], [233], [515], [689], [123], [777], [578]], //灌溉时长
  [1.3, 0.4, 2.6], //水位信息
]

if (!Detector.webgl) {
  Detector.addGetWebGLMessage()
  document.getElementById('container').innerHTML = ''
  msgbox.innerHTML = '当前浏览器不支持WebGL'
} else {
  init()
  animate()
}

function init() {
  for (i = 0; i < bpic.length; i++) {
    //隐藏全部底部图片
    bpic[i].style.display = 'none'
  }

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  container.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xcce0ff)
  scene.fog = new THREE.Fog(0xcce0ff, 2500, 4500)

  camera = new THREE.PerspectiveCamera(36, container.offsetWidth / container.offsetHeight, 0.5, 3000000)
  camera.position.set(-900, 3600, 1700)
  controls = new THREE.OrbitControls(camera, container)
  controls.target.set(contrlpi[0], contrlpi[1], contrlpi[2])

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  var light = new THREE.DirectionalLight(0xffffff, 1.75)
  light.position.set(-10, 100, 50)
  scene.add(light)

  var line_g = new THREE.Geometry()
  line_g.vertices.push(new THREE.Vector3(-3000, 0, 0))
  line_g.vertices.push(new THREE.Vector3(3000, 0, 0))
  var gridline = new THREE.LineBasicMaterial({ color: 0xf2f2f2 })
  for (var i = 0; i <= 50; i++) {
    var line = new THREE.Line(line_g, gridline)
    line.position.z = i * 120 - 3000
    line.position.y = -20
    scene.add(line)
    var line = new THREE.Line(line_g, gridline)
    line.position.x = i * 120 - 3000
    line.position.y = -20
    line.rotation.y = (90 * Math.PI) / 180
    scene.add(line)
  }

  CreatSky()

  function CreatSky() {
    msgbox.innerHTML = '正在创建天空'

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
      cubeMap.images[0] = getSide(2, 1)
      cubeMap.images[1] = getSide(0, 1)
      cubeMap.images[2] = getSide(3, 0)
      cubeMap.images[3] = getSide(3, 2)
      cubeMap.images[4] = getSide(1, 1)
      cubeMap.images[5] = getSide(3, 1)
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
      var skyBox = new THREE.Mesh(new THREE.BoxGeometry(20000, 20000, 20000), skyBoxMaterial)
      skyBox.position.y = 9000
      scene.add(skyBox)
      loadstep++
      CreatFarm()
    })
  }

  function CreatFarm() {
    msgbox.innerHTML = '正在创建基础农田'

    var loader = new THREE.MTLLoader()
    loader.load('models/farm.mtl', function (materials) {
      materials.preload()
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load('models/farm.obj', function (object) {
        scene.add(object)
        farm = object
        loadstep++
        CreatRiver()
      })
    })
  }

  function CreatRiver() {
    msgbox.innerHTML = '正开挖河道'

    var water_mt = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: cubeMap, refractionRatio: 0.95 })
    var loader = new THREE.OBJLoader()
    loader.load('models/water.obj', function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = water_mt
        }
      })
      scene.add(object)
      water = object
      loadstep++
      CreatBuilding()
    })
  }

  function CreatBuilding() {
    msgbox.innerHTML = '正在建造泵房'

    var loader = new THREE.MTLLoader()
    loader.load('models/building.mtl', function (materials) {
      materials.preload()
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load('models/building.obj', function (object) {
        object.traverse(function (child) {
          if (child.material != undefined) {
            if (child.material.length == undefined) {
              child.material.transparent = true
            }
          }
        })
        scene.add(object)
        building = object
        loadstep++
        CreatPipe()
      })
    })
  }

  function CreatPipe() {
    msgbox.innerHTML = '正在铺设管道'

    var loader = new THREE.OBJLoader()
    loader.load('models/pipe.obj', function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = pvm
          pipe.push(child)
        }
      })
      scene.add(object)
      pipeall = object
      pipeall.visible = 0
      loadstep++
      CreatPump()
    })
  }

  function CreatPump() {
    msgbox.innerHTML = '正在安装水泵'

    var imgLoader = new THREE.ImageLoader()
    imgLoader.load('textures/fana.jpg', function (img) {
      btexture.image = img
      btexture.needsUpdate = true
      bvm.map = btexture

      var tloader = new THREE.OBJLoader()
      tloader.load('models/pumpt.obj', function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = btm
          }
        })
        scene.add(object)
        pumpt = object
        pumpt.visible = 0
      })

      var loader = new THREE.OBJLoader()
      loader.load('models/pump.obj', function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = bvm
            pump.push(child)
          }
        })
        pump[1].visible = 0
        scene.add(object)
        pumpall = object
        pumpall.visible = 0
        loadstep++
        CreatTree()
      })
    })
  }

  function CreatTree() {
    msgbox.innerHTML = '正在种植树木'

    var imgLoader = new THREE.ImageLoader()
    imgLoader.load('textures/tree.png', function (img) {
      var texture = new THREE.Texture()
      texture.image = img
      texture.needsUpdate = true
      var wMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      var loader = new THREE.OBJLoader()
      loader.load('models/tree.obj', function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = wMaterial
          }
        })
        scene.add(object)
        tree = object
        loadstep++
        CreatWheat()
      })
    })
  }

  function CreatWheat() {
    msgbox.innerHTML = '正在生长庄稼'

    var imgLoader = new THREE.ImageLoader()
    imgLoader.load('textures/xm.png', function (img) {
      var texture = new THREE.Texture()
      texture.image = img
      texture.needsUpdate = true
      var wMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      var loader = new THREE.OBJLoader()
      loader.load('models/wheat.obj', function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = wMaterial
          }
        })
        scene.add(object)
        wheat = object
        loadstep++
        AllCreated()
      })
    })
  }

  function AllCreated() {
    msgbox.innerHTML = '正在进行最后准备'

    msgbox.style.display = 'none'
    bbar.style.display = 'block'

    setTimeout(function () {
      PlayAni = 1
      new TWEEN.Tween(camera.position)
        .to({ x: camerapi[0], y: camerapi[1], z: camerapi[2] }, td_start)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
      document.getElementById('yun').classList.add('yun_ani')
      bpic[0].style.display = 'block'
    }, 1000)

    setTimeout(function () {
      PlayAni = 0
      controls.enablePan = false
      controls.minDistance = 500
      controls.maxDistance = 3600
      controls.maxPolarAngle = Math.PI * 0.4
      //controls.minPolarAngle = Math.PI * 0.2;
      document.getElementById('btnwarp').style.display = 'block'
      document.getElementById('switchbar').style.display = 'block'
      document.getElementById('main3d_mask').style.display = 'none'
    }, td_start + 1000)

    for (i = 0; i < vg_pi.length; i++) {
      var vgs_g = new THREE.CubeGeometry(60, 60, 60)
      var vgs = new THREE.Mesh(vgs_g, vg_mt)
      vgs.position.set(vg_pi[i][0], 40, vg_pi[i][1])
      vgs.visible = 0
      scene.add(vgs)
      VG.push(vgs)
    }

    for (i = 0; i < pvg_pi.length; i++) {
      var ppt = []
      for (j = 0; j < pvg_pi[i].length; j++) {
        var vgs_g = new THREE.CubeGeometry(30, 30, 30)
        var vgs = new THREE.Mesh(vgs_g, vg_mt)
        vgs.position.set(pvg_pi[i][j][0], 10, pvg_pi[i][j][1])
        vgs.visible = 0
        scene.add(vgs)
        ppt.push(vgs)
      }
      PVG.push(ppt)
    }

    //创建田间水位计
    for (i = 0; i < swvg_pi.length; i++) {
      var vgs_g = new THREE.CubeGeometry(6, 20, 6)
      var vgs = new THREE.Mesh(vgs_g, sw_mt)
      vgs.position.set(swvg_pi[i][0], 10, swvg_pi[i][1])
      vgs.visible = 0
      scene.add(vgs)
      SWVG.push(vgs)
    }

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    window.addEventListener('resize', onWindowResize, false)
    document.addEventListener('mousemove', onMouseMove, false)
    container.addEventListener('click', onMouseDown, false)
  }
}

function animate(time) {
  //自动旋转状态
  if (RotateScene) {
    camera.position.x = Math.cos(time * 0.0002) * 1600
    camera.position.y = 650
    camera.position.z = Math.sin(time * 0.0002) * 1600
  }

  //纹理动画
  if (Cur_ID == 3) {
    ptexture.offset.y = (time * 0.001 * 3) % 1
    bdx += 0.1
    if (bdx > 1) bdx = 0
    btexture.offset.x = bdx
  }

  //交互监测
  if (MouseMoving && !PlayAni && !ShowB) {
    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(scene.children)
    if (INTERSECTED != -1) {
      fltbox.style.display = 'none'
      ppbox.style.display = 'none'
      INTERSECTED = -1
    }
    if (intersects.length > 0) {
      if (Cur_ID == 0) {
        //建筑交互
        for (i = 0; i < VG.length; i++) {
          if (intersects[0].object == VG[i]) {
            INTERSECTED = i
            fltbox.style.display = 'block'
            if (INTERSECTED < 2) {
              fltbox.innerHTML = INTERSECTED + 1 + '号泵站'
            } else {
              fltbox.innerHTML = INTERSECTED + 2 + '号泵站'
            }
            fltbox.style.left = ScrPos(VG[i], camera)[0] - 40 + 'px'
            fltbox.style.top = ScrPos(VG[i], camera)[1] - 30 + 'px'
            break
          }
        }
      }
    }
  }

  //绑定标签与柱
  if (Cur_ID) {
    for (i = 0; i < zinfo.length; i++) {
      zinfo[i].style.left = ScrPos(CurZVG[i], camera)[0] - zinfo[i].offsetWidth / 2 + 'px'
      zinfo[i].style.top = ScrPos(CurZVG[i], camera)[1] + 'px'
    }
  }

  //基本刷新
  if (PlayAni) TWEEN.update() //播放动画
  controls.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

//窗体改变事件
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
}

//光标移动事件
function onMouseMove(event) {
  MouseMoving = 1
  event.preventDefault()
  mouse.x = ((event.clientX - container.offsetLeft) / container.offsetWidth) * 2 - 1
  mouse.y = -((event.clientY - container.offsetTop) / container.offsetHeight) * 2 + 1
}

//光标点击事件
function onMouseDown(event) {
  if (!Cur_ID && INTERSECTED != -1) {
    SetView()

    ShowB = 1
    controls.enabled = false
    fltbox.style.display = 'none'

    MoveCameraToCur()

    setTimeout(function () {
      PlayAni = 0
      controls.enabled = false
      document.getElementById('buwarp').style.display = 'block' //显示建筑信息面板
      SetBuInfoCon()
    }, 1000)
  }
}

//为切换条添加事件
for (i = 0; i < swtbar.length; i++) {
  ;(function (j) {
    swtbar[i].onclick = function () {
      swtbar[Cur_ID].classList.remove('active')
      bpic[Cur_ID].style.display = 'none'

      DeleteZ()

      switch (j) {
        case 0: //灌区展示
          showb()
          SetOpt(1)
          MoveCamera(camerapi[0], camerapi[1], camerapi[2])
          for (i = 0; i < VG.length; i++) {
            scene.add(VG[i])
          }
          break

        case 1: //电量信息
          showz()
          SetOpt(0.4)
          MoveCamera(showzpi[0], showzpi[1], showzpi[2])
          CreateZhu(j)
          break

        case 2: //水量信息
          showz()
          SetOpt(0.4)
          MoveCamera(showzpi[0], showzpi[1], showzpi[2])
          CreateZhu(j)
          break

        case 3: //灌溉时长
          showp()
          MoveCamera(showzpi[0], showzpi[1], showzpi[2])
          CreateArZhu(j)
          break

        case 4: //水位信息
          shows()
          SetOpt(0.4)
          MoveCamera(showzpi[0], showzpi[1], showzpi[2])
          CreateSwZhu(j)
          break

        case 5: //视频监控
          showz()
          break
      }

      function showb() {
        building.visible = 1
        wheat.visible = 1
        pumpt.visible = 0
        pumpall.visible = 0
        pipeall.visible = 0
        bbar.style.display = 'block'
        btnbox.style.bottom = '206px'
        document.getElementById('testbtn').style.display = 'none' //这个testbtn是控制水泵运转停止的，正式版时去掉
      }

      function showp() {
        building.visible = 0
        wheat.visible = 0
        pumpt.visible = 1
        pumpall.visible = 1
        pipeall.visible = 1
        bbar.style.display = 'none'
        btnbox.style.bottom = '0px'
        //document.getElementById('testbtn').style.display = 'block'; //这个testbtn是控制水泵运转停止的，正式版时去掉
      }

      function showz() {
        building.visible = 1
        wheat.visible = 0
        pumpt.visible = 0
        pumpall.visible = 0
        pipeall.visible = 0
        bbar.style.display = 'block'
        btnbox.style.bottom = '206px'
        document.getElementById('testbtn').style.display = 'none' //这个testbtn是控制水泵运转停止的，正式版时去掉
      }

      function shows() {
        building.visible = 0
        wheat.visible = 0
        pumpt.visible = 0
        pumpall.visible = 0
        pipeall.visible = 0
        bbar.style.display = 'block'
        btnbox.style.bottom = '206px'
        document.getElementById('testbtn').style.display = 'none' //这个testbtn是控制水泵运转停止的，正式版时去掉
      }

      swtbar[j].classList.add('active')
      bpic[j].style.display = 'block'
      Cur_ID = j
    }
  })(i)
}

//创建水电柱组
function CreateZhu(j) {
  var zmax = Math.max.apply(null, zdata[j - 1])
  for (i = 0; i < zdata[j - 1].length; i++) {
    var h = (zdata[j - 1][i] / zmax) * 400
    if (h <= 20) h = 20 //得有点高度，不然就完全看不见了
    var vgs_g = new THREE.CubeGeometry(20, h, 20)
    var vgs = new THREE.Mesh(vgs_g, zmt[j - 1])
    vgs.position.set(vg_pi[i][0], h / 2, vg_pi[i][1])
    scene.add(vgs)
    CurZ.push(vgs)

    var vv_g = new THREE.CubeGeometry(20, 20, 20)
    var vv = new THREE.Mesh(vv_g, vg_mt)
    vv.position.set(vg_pi[i][0], h, vg_pi[i][1])
    vv.visible = 0
    scene.add(vv)
    CurZVG.push(vv)

    var div = document.createElement('div')
    div.setAttribute('class', 'zinfo')
    div.style.color = YS[j - 1]
    if (i < 2) {
      div.innerHTML = i + 1 + '号泵站<br>' + zdata[j - 1][i] + '<span>' + DW[j - 1] + '</span>'
    } else {
      div.innerHTML = i + 2 + '号泵站<br>' + zdata[j - 1][i] + '<span>' + DW[j - 1] + '</span>'
    }
    document.body.appendChild(div)
    zinfo.push(div)
  }
}

//创建水位柱组
function CreateSwZhu(j) {
  var zmax = Math.max.apply(null, zdata[j - 1])
  for (i = 0; i < zdata[j - 1].length; i++) {
    var h = (zdata[j - 1][i] / zmax) * 200
    if (h <= 20) h = 20 //得有点高度，不然就完全看不见了
    var vgs_g = new THREE.CubeGeometry(20, h, 20)
    var vgs = new THREE.Mesh(vgs_g, zmt[j - 1])
    vgs.position.set(swvg_pi[i][0], h / 2, swvg_pi[i][1])
    scene.add(vgs)
    CurZ.push(vgs)

    var vv_g = new THREE.CubeGeometry(20, 20, 20)
    var vv = new THREE.Mesh(vv_g, vg_mt)
    vv.position.set(swvg_pi[i][0], h, swvg_pi[i][1])
    vv.visible = 0
    scene.add(vv)
    CurZVG.push(vv)

    var div = document.createElement('div')
    div.setAttribute('class', 'zinfo')
    div.style.color = YS[j - 1]
    div.innerHTML = i + 1 + '号水位计<br>' + zdata[j - 1][i] + '<span>' + DW[j - 1] + '</span>'
    document.body.appendChild(div)
    zinfo.push(div)
  }
}

//创建灌溉时长柱组
function CreateArZhu(k) {
  var ta = []
  for (i = 0; i < zdata[k - 1].length; i++) {
    for (j = 0; j < zdata[k - 1][i].length; j++) {
      ta.push(zdata[k - 1][i][j])
    }
  }
  var zmax = Math.max.apply(null, ta)
  for (i = 0; i < zdata[k - 1].length; i++) {
    for (j = 0; j < zdata[k - 1][i].length; j++) {
      var h = (zdata[k - 1][i][j] / zmax) * 400
      if (h <= 20) h = 20 //得有点高度，不然就完全看不见了
      var vgs_g = new THREE.CubeGeometry(20, h, 20)
      var vgs = new THREE.Mesh(vgs_g, zmt[k - 1])
      vgs.position.set(pvg_pi[i][j][0], h / 2 + 40, pvg_pi[i][j][1])
      scene.add(vgs)
      CurZ.push(vgs)

      var vv_g = new THREE.CubeGeometry(20, 20, 20)
      var vv = new THREE.Mesh(vv_g, vg_mt)
      vv.position.set(pvg_pi[i][j][0], h + 40, pvg_pi[i][j][1])
      vv.visible = 0
      scene.add(vv)
      CurZVG.push(vv)

      var div = document.createElement('div')
      div.setAttribute('class', 'zinfo')
      div.style.color = YS[k - 1]
      if (i < 2) {
        div.innerHTML =
          i + 1 + '号泵站<br>' + (j + 1) + '号水泵<br>' + zdata[k - 1][i][j] + '<span>' + DW[k - 1] + '</span>'
      } else {
        div.innerHTML =
          i + 2 + '号泵站<br>' + (j + 1) + '号水泵<br>' + zdata[k - 1][i][j] + '<span>' + DW[k - 1] + '</span>'
      }
      pccc.push(i)
      document.body.appendChild(div)
      zinfo.push(div)
    }
  }
}

//删除当前柱组
function DeleteZ() {
  for (i = 0; i < CurZ.length; i++) {
    scene.remove(CurZ[i])
    delete CurZ[i]
    document.body.removeChild(zinfo[i])
  }
  for (i = 0; i < CurZVG.length; i++) {
    scene.remove(CurZVG[i])
    delete CurZVG[i]
  }
  CurZ = []
  CurZVG = []
  zinfo = []
  pccc = []
}

//恢复镜头视角按钮
document.getElementById('btn_reset').onclick = function () {
  RotateScene = 0
  document.getElementById('btn_autorotate').classList.remove('active')
  SetView()
}

//自动旋转控制
document.getElementById('btn_autorotate').onclick = function () {
  if (RotateScene) {
    RotateScene = 0
    document.getElementById('btn_autorotate').classList.remove('active')
    controls.enabled = true
  } else {
    RotateScene = 1
    document.getElementById('btn_autorotate').classList.add('active')
    controls.enabled = false
    camera.lookAt(new THREE.Vector3(contrlpi[0], contrlpi[1], contrlpi[2]))
  }
}

//点击画面任意处停止自动自动旋转
container.onmousedown = function () {
  if (RotateScene) {
    RotateScene = 0
    document.getElementById('btn_autorotate').classList.remove('active')
    controls.enabled = true
  }
}

//恢复视角
function SetView() {
  camera.position.set(camerapi[0], camerapi[1], camerapi[2])
  controls.enabled = true
}

//设置建筑的透明度
function SetOpt(opi) {
  var a = 0
  building.traverse(function (child) {
    a++
    if (child.material != undefined) {
      if (child.material.length == undefined) {
        child.material.opacity = opi
      }
    }
  })
}

//将三维坐标转为二维坐标
function ScrPos(object, camera, ohi) {
  var p = object.position.clone()
  var vector = p.project(camera)
  vector.x = Math.round(((vector.x + 1) / 2) * container.offsetWidth)
  vector.y = Math.round((-(vector.y - 1) / 2) * container.offsetHeight)
  return [vector.x, vector.y]
}

//移动镜头到目标
function MoveCamera(tx, ty, tz) {
  PlayAni = 1
  new TWEEN.Tween(camera.position).to({ x: tx, y: ty, z: tz }, td_swz).easing(TWEEN.Easing.Quadratic.Out).start()
  setTimeout(function () {
    PlayAni = 0
  }, td_swz)
}

//将镜头移至当前建筑
function MoveCameraToCur() {
  PlayAni = 1

  new TWEEN.Tween(camera.position)
    .to(
      {
        x: vg_pi[INTERSECTED][0] - 50,
        y: 20,
        z: vg_pi[INTERSECTED][1] + 300,
      },
      td_swb
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  new TWEEN.Tween(controls.target)
    .to(
      {
        x: vg_pi[INTERSECTED][0] + 70,
        y: 0,
        z: vg_pi[INTERSECTED][1] + 100,
      },
      td_swb
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
}

//向前切换建筑
document.getElementById('btn_buprev').onclick = function () {
  if (!PlayAni) {
    if (INTERSECTED > 0) {
      INTERSECTED--
      SwitchBu()
    }
  }
}

//向后切换建筑
document.getElementById('btn_bunext').onclick = function () {
  if (!PlayAni) {
    if (INTERSECTED < vg_pi.length - 1) {
      INTERSECTED++
      SwitchBu()
    }
  }
}

//执行切换建筑操作
function SwitchBu() {
  document.getElementById('bucon').style.display = 'none'
  document.getElementById('bumoving').style.display = 'block'
  MoveCameraToCur()
  setTimeout(function () {
    document.getElementById('bucon').style.display = 'block'
    document.getElementById('bumoving').style.display = 'none'
    PlayAni = 0
    SetBuInfoCon()
  }, td_swb)
}

//建筑信息面板关闭按钮
document.getElementById('buclose').onclick = function () {
  ShowB = 0 //打开选择模式
  document.getElementById('buwarp').style.display = 'none' //隐藏建筑信息面板

  PlayAni = 1
  new TWEEN.Tween(camera.position)
    .to({ x: camerapi[0], y: camerapi[1], z: camerapi[2] }, td_swb)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
  new TWEEN.Tween(controls.target)
    .to({ x: contrlpi[0], y: contrlpi[1], z: contrlpi[2] }, td_swb)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  setTimeout(function () {
    PlayAni = 0
    controls.enabled = true
  }, td_swb)
}

//已隐藏的测试按钮
document.getElementById('testbtn').onclick = function () {
  //测试---控制管道组的水流和泵的运转状态
  a = 12 // 1~12

  for (i = pindex[pccc[a - 1]]; i < pindex[pccc[a - 1] + 1]; i++) {
    pipe[i].material = pnm
  }
  pump[a - 1].material = bnm
}

/*----------------泵站具体信息开始------------------*/
function SetBuInfoCon() {
  document.getElementById('butitle').innerHTML = '第' + (INTERSECTED + 1) + '号泵站详情'

  /*** INTERSECTED是泵站的标识，从0到19，代表20个泵站 ***/
}
/*----------------泵站信息结束------------------*/
