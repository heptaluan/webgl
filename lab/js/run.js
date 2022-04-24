
var camera, scene, renderer, controls;

var container = document.getElementById('container');
var msgbox = document.getElementById('loadinginfo');
var dpwarp = document.getElementById('dpanel');
var dptitle = document.getElementById('dpt');
var dpbox = document.getElementById('dpf');
var dcwarp = document.getElementById('dcamera');
var dctitle = document.getElementById('dct');
var dcbox = document.getElementById('dcf');

var tlbox = document.getElementsByClassName('toolbox').item(0);
var ftbox = document.getElementById('ftbox').getElementsByTagName('div');
var tipsbox = document.getElementsByClassName('tips').item(0);

var camerapi = [101000,194000,-241000];
var camerapi_bf = [91000,90000,-183000];
var contrlpi = [18000,0,-9000];
var contrlpi_bf = [28000,-1400,-7000];
var anitime = 1000;
var bhi = 84000;



var waterspeed = 0.2;

var CurrVW = 0; //当前视图: 0外观 1管道 2泵房
var CurrZone = -1; //当前区域
var CurrBF = -1; //当前泵房

var CurrIc = new THREE.Group(); //当前用于监测交互的设备物体组

var BUILDING, PIPE_A, PIPE_B, PIPE_C, BaseMat, ZoneBorder, ChosenRing,ChosenRingS, WaterTexture, ptexture, skyBox, GridGround,CurrBFC,CurrBFO,CurrWall,
	mt_gop, mt_gop1, mt_gop2, mt_gop3, mt_gridline, mt_pipe_a, mt_pipe_b, mt_opipe, FBF, PBF, mt_cement, mt_pumpdevice, mt_metal, mt_pumpblue, mt_pumpblack, mt_pumpred,
	mt_pumpgray,mt_transparent,mt_tpo, mt_bfwall, mt_bfdoor, mt_waterbody, mt_watersurface, mt_anipipe, mt_tpmetal, pytexture, pgtexture,
	mt_anipipey, mt_anipipeg, mt_zpipeg, movespeed_f, movespeed_s, mt_PL, mt_highlightbf, mt_ctc, ctctexture;

var IsZoomedToBF=false;
var IsPlayFlow=false;
var IsZooming=false;


var CurrLockTarget;
var CurrFTbox;
var DIVS = [];

var bfname = ['池水提升泵房','净水系统','A-01集成(C)型','A-03集成(B)型','A-04集成(A)型','A-06AAD(B)型','A-07AAD(D)型','A-08AAD(B)型',
	'B-00AAD(C)型','B-02AAD(A)型','B-03AAD(B)型','B-04AAD(A)型','B-05AAD(A)型','B-06AAD(A)型','B-07AAD(A)型',
	'D-00集成(D)型','D-03AAD(B)型','E-01集成(B)型','E-03AAD(A)型','E-04集成(A)型','河水提升泵房','新泵房ABC'];
var buname = [
	'东门','北门','熊猫智慧水务基地','水表生产车间','自动化集成制造车间','熊猫智慧水务实践基地','原水沉淀池','生物净化池','西门'
	,'池水提升','A00','A01','A03','A04','A06','A07','A08','B00','B02','B03','B04','B05','B06','B07','D00','D03','E01','E03','E04','河水提升','新泵房'
	,'G区','A区','B区','D区','E区','F区'
	,'视频监控单元1','视频监控单元2','视频监控单元3','视频监控单元4','视频监控单元5','视频监控单元6'
	,'视频监控单元7','视频监控单元8','视频监控单元9','视频监控单元10','视频监控单元11','视频监控单元12'
];
var ViewName = ['实验室园区','管路布置','泵房分布'];
var ZoneName = [['G区','html_zones/info_zoneg.html'],['A区','html_zones/info_zonea.html'],['B区','html_zones/info_zoneb.html'],['D区','html_zones/info_zoned.html'],['E区','html_zones/info_zonee.html'],['F区','html_zones/info_zonef.html']];
var DvName = [['MA','仪表类型A'],['MB','仪表类型B'],['MC','仪表类型C']];
var DVFile = ['ep_csts','ep_a00','ep_a01','ep_a03','ep_a04','ep_a06','ep_a07','ep_a08','ep_b00','ep_b02','ep_b03','ep_b04','ep_b05','ep_b06','ep_b07','ep_d00','ep_d03','ep_e01','ep_e03','ep_e04','ep_hsts','ep_x'];
var BFDVname = [
	['泵频率：','液位：','今日电量：'] //池水提升
	,['絮凝系统','石英砂过滤装置','活性炭过滤装置','消毒装置','反冲洗泵','进口累计：/瞬时：','出口累计：/瞬时：','PH：/余氯：/浊度：','今日电量：'] //A00
	,['出口压力：','出口瞬时流量：','液位：','今日电量：'] //A01
	,['出口压力：','出口瞬时流量：','今日电量：'] //A03
	,['出口压力：','出口瞬时流量：','今日电量：','液位：'] //A04
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口压力：','进口流量：'] //A06
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','末梢压力：','进口压力：','末梢流量：','水龄：'] //A07
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口压力：','进口流量：'] //A08
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','末梢压力：','进口压力：','末梢流量：','水龄：'] //B00
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','末梢压力：','进口压力：','末梢流量：','水龄：'] //B02
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','末梢压力：','进口压力：','末梢流量：','水龄：'] //B03
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','末梢压力：','进口压力：','末梢流量：','水龄：'] //B04
	,['出口压力：','出口瞬时流量：','今日电量：','液位：'] //B05
	,['出口压力：','出口瞬时流量：','今日电量：','液位：'] //B06
	,['出口压力：','出口瞬时流量：','今日电量：','液位：'] //B07
	,['出口压力：','出口瞬时流量：','今日电量：'] //D00
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','进口压力：','末梢流量：','末梢压力：'] //D03
	,['出口压力：','出口瞬时流量：','今日电量：'] //E01
	,['出口压力：','出口瞬时流量：','今日电量：','液位：','进口流量：','末梢压力：','进口压力：','末梢流量：','水龄：'] //E03
	,['出口压力：','出口瞬时流量：','今日电量：'] //E04
	,['泵频率：','液位：','今日电量：'] //河水提升
	,['末梢压力：','出口瞬时流量：','今日电量：'] //X
];

if ( ! Detector.webgl ) {
	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = '';
	msgbox.innerHTML = '当前浏览器不支持WebGL';
}else{
	init();
}

var VBox = new THREE.Object3D;
var PosPlane = new THREE.Object3D;
var GT = new THREE.Object3D;



var CurrGDD = 0;
var YB = new THREE.Object3D;
var DYL = new THREE.Object3D;
var DLL = new THREE.Object3D;
var DSZ = new THREE.Object3D;
var CTC = new THREE.Object3D;

var DTF = new THREE.Object3D;
var DRG = new THREE.Object3D;

var Dinfo_YL = ['0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01','0.01'];
var Dinfo_LL = [['F-91','1.00'],['F-73','1.00'],['F-82','1.00'],['F-114','1.00'],['F-666','8.88']];
var Dinfo_SZ = [['A00水质','0.00','0.00','0.00'],['D03水质','0.00','0.00','0.00'],['E04水质','0.00','0.00','0.00']];


var CurrBFD = 1;

//泵房状态, 运行状态:0正常 1故障 2离线  |  是否为调峰 0普通 1调峰  |   是否为二供 0普通 1二供 |  默认数据  |  调峰数据   |   泵房类型: ys原水 sc水厂 jc集成 tf调峰 jy加压
var bfsta = [
	[0,0,0,'','','ys'] //池水提升
	,[0,0,0,'','','sc'] //A00
	,[0,1,0,'','40','jy'] //A01
	,[1,1,1,'2.01','40','jc'] //A03
	,[0,1,1,'2.25','40','jc'] //A04
	,[0,1,1,'2.25','40','tf'] //A06
	,[1,1,1,'2.25','40','tf'] //A07
	,[0,1,1,'2.25','40','tf'] //A08
	,[0,1,0,'','40','tf'] //B00
	,[2,1,0,'','40','tf'] //B02
	,[0,1,0,'','40','tf'] //B03
	,[0,1,0,'','40','tf'] //B04
	,[0,1,0,'','40','tf'] //B05
	,[0,1,0,'','40','tf'] //B06
	,[1,1,0,'','40','tf'] //B06
	,[0,0,1,'2.25','','jc'] //D00
	,[0,1,1,'2.25','40','tf'] //D03
	,[2,0,1,'2.25','','jc'] //E01
	,[0,1,0,'','40','tf'] //E03
	,[0,0,1,'2.25','','jc'] //E04
	,[0,0,0,'','','ys'] //河水提升
];

var manager = new THREE.LoadingManager();
function onProgress( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		msgbox.innerHTML = '模型加载 ' +parseInt(percentComplete) + '%';
	}
}

//初始化
function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x01091e );
	scene.fog = new THREE.Fog( 0x779d49, 500000, 1300000 );

	camera = new THREE.PerspectiveCamera( 26,container.offsetWidth / container.offsetHeight, 0.5, 3000000 );
	controls = new THREE.OrbitControls( camera, container );
	//controls.enablePan = false;
	controls.maxDistance = 700000;
	//controls.minDistance = minDT;
	controls.maxPolarAngle = Math.PI * 0.48;
	//controls.minPolarAngle = minSA;

	camera.position.x = camerapi[0];
	camera.position.y = 49000;
	camera.position.z = camerapi[2];

	localPlane = new THREE.Plane( new THREE.Vector3( 0, -bhi, 0 ), 1 );


	controls.target.set( contrlpi[0], contrlpi[1], contrlpi[2] );

	scene.add( new THREE.AmbientLight( 0xffffff, 0.6 ) );

	var light_A = new THREE.DirectionalLight(0xffffff, 0.6);
	light_A.position.x=-50000;
	light_A.position.y=100000;
	light_A.position.z=-100000;
	light_A.castShadow = true;
	light_A.shadow.camera.near = -1000000;
	light_A.shadow.camera.far = 500000;
	light_A.shadow.camera.right = 600000;
	light_A.shadow.camera.left = - 600000;
	light_A.shadow.camera.top	= 300000;
	light_A.shadow.camera.bottom = -400000;
	light_A.shadow.bias = 0.1;
	light_A.shadow.mapSize.width = 1024;
	light_A.shadow.mapSize.height = 1024;
	scene.add(light_A);

	//var helper_A = new THREE.DirectionalLightHelper(light_A);
	//scene.add(helper_A);
	//var helper_A = new THREE.CameraHelper(light_A.shadow.camera );
	//scene.add(helper_A);



	var light_B = new THREE.DirectionalLight(0xffffff, 0.4);
	light_B.position.x=9000;
	light_B.position.y=10000;
	light_B.position.z=2000;
	scene.add(light_B);



	//创建选中光环材质和选中光环
	var Ccanvas = document.createElement('canvas');
	Ccanvas.width = 128;
	Ccanvas.height = 128;
	var Cctx = Ccanvas.getContext('2d');
	Cctx.beginPath();
	Cctx.arc(64,64,40,0, 2*Math.PI);
	Cctx.lineWidth = 5;
	Cctx.strokeStyle = '#12a3ff';
	Cctx.stroke();
	Cctx.beginPath();
	Cctx.arc(64,64,34,0, 2*Math.PI);
	Cctx.lineWidth = 13;
	Cctx.strokeStyle = 'rgba(18,163,255,0.4)';
	Cctx.stroke();
	var Ctexture = new THREE.Texture(Ccanvas);
	Ctexture.needsUpdate = true;
	var Cmaterial = new THREE.SpriteMaterial({
		map: Ctexture,
		depthTest:false,
		transparent: true
	});
	ChosenRing = new THREE.Sprite(Cmaterial);
	ChosenRing.scale.set(2000,2000,2000);
	ChosenRing.renderOrder = 1;
	ChosenRingS = new THREE.Sprite(Cmaterial);
	ChosenRingS.scale.set(600,600,600);
	ChosenRingS.renderOrder = 1;

	BUILDING = [];
	BaseMat = new Array(40);
	for(var i=0; i<40; i++){ //暂定30个部分
		var bu = new THREE.Group();
		BUILDING.push(bu);
	}

	ZoneBorder = new THREE.Group();

	var reflectbox = new THREE.CubeTexture( [] );
	reflectbox.format = THREE.RGBFormat;
	reflectbox.needsUpdate = true;

	var treetexture = new THREE.Texture();
	var grasstexture = new THREE.Texture();
	var groundtexture = new THREE.Texture();
	var buildingwalltexture = new THREE.Texture();
	var glass1texture = new THREE.Texture();
	var stela1texture = new THREE.Texture();
	var stela2texture = new THREE.Texture();
	var obtexture;
	var rbtexture = new THREE.Texture();
	var luweitexture = new THREE.Texture();
	var mptexture = new THREE.Texture();
	var xmtexture = new THREE.Texture();
	var kjtexture = new THREE.Texture();

	CreateEnv();
	//AllCreated();

	function CreateEnv() {
		msgbox.innerHTML = '正在创建环境';

		GridGround = new THREE.Group();

		var w=1800000;
		var t=200;
		var n=44;
		var k=28;
		var d=100;

		var line_g = new THREE.Geometry();
		line_g.vertices.push( new THREE.Vector3( -w/2, d, 0 ) );
		line_g.vertices.push( new THREE.Vector3( w/2, d, 0 ) );
		mt_gridline = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.1} );
		var sline_g;


		for ( var i = 0; i <= t; i ++ ) {
			if( i>t/2-k/2 && i<t/2+k/2){

				sline_g = new THREE.Geometry();
				sline_g.vertices.push( new THREE.Vector3( -w/2, d, w/t*(n/2)-(i-(t/2-n/2))*w/t ) );
				sline_g.vertices.push( new THREE.Vector3( -w/t*n/2, d, w/t*(n/2)-(i-(t/2-n/2))*w/t ) );
				var sline = new THREE.Line( sline_g, mt_gridline );
				GridGround.add(sline);

				sline_g = new THREE.Geometry();
				sline_g.vertices.push( new THREE.Vector3( w/2, d, w/t*(n/2)-(i-(t/2-n/2))*w/t ) );
				sline_g.vertices.push( new THREE.Vector3( w/t*n/2, d, w/t*(n/2)-(i-(t/2-n/2))*w/t ) );
				sline = new THREE.Line( sline_g, mt_gridline );
				GridGround.add(sline);

			}else{
				var gline = new THREE.Line( line_g, mt_gridline );
				gline.position.z = ( i * w/t ) - w/2;
				GridGround.add(gline);
			}

			if( i>t/2-n/2 && i<t/2+n/2){

				sline_g = new THREE.Geometry();
				sline_g.vertices.push( new THREE.Vector3( w/t*(k/2)-(i-(t/2-k/2))*w/t, d, w/2 ) );
				sline_g.vertices.push( new THREE.Vector3( w/t*(k/2)-(i-(t/2-k/2))*w/t, d, w/t*k/2 ) );
				sline = new THREE.Line( sline_g, mt_gridline );
				GridGround.add(sline);

				sline_g = new THREE.Geometry();
				sline_g.vertices.push( new THREE.Vector3( w/t*(k/2)-(i-(t/2-k/2))*w/t, d, -w/2 ) );
				sline_g.vertices.push( new THREE.Vector3( w/t*(k/2)-(i-(t/2-k/2))*w/t, d, -w/t*k/2 ) );
				sline = new THREE.Line( sline_g, mt_gridline );
				GridGround.add(sline);

			}else{
				gline = new THREE.Line( line_g, mt_gridline );
				gline.position.x = ( i * w/t ) - w/2;
				gline.rotation.y = Math.PI / 2;
				GridGround.add(gline);
			}
		}

		scene.add(GridGround);


		var imagelist=['skybox.jpg','reflectsky.jpg','trees.png','grass.jpg','dm.jpg','waternormals.jpg','dw.jpg','bl1.jpg','tt1.jpg','tt2.jpg','snha.jpg','cement.jpg','device.jpg','reflectmetal.jpg','wall.jpg','door.jpg','luwei.png','mp.jpg','kjbf.jpg'];
		var ImageArray=[];

		LoadImage();
		//AllCreated();

		function LoadImage(){
			msgbox.innerHTML = '正在加载贴图';

			var iloader = new THREE.ImageLoader();
			iloader.load( 'textures/'+imagelist[ImageArray.length], function ( image ) {
				ImageArray.push(image);
				if(ImageArray.length<imagelist.length){
					LoadImage();
				}else{
					LoadImageComplete();
				}
			});
		}


		function LoadImageComplete(){



			//天空盒子
			function getSide( x, y, size, tm ){
				var canvas = document.createElement( 'canvas' );
				canvas.width = size;
				canvas.height = size;
				var context = canvas.getContext( '2d' );
				context.drawImage( tm, - x * size, - y * size );
				return canvas;
			}
			var getimgx = [[2,1],[0,1],[3,0],[3,2],[1,1],[3,1]];

			var cubemap = new THREE.CubeTexture( [] );
			cubemap.format = THREE.RGBFormat;
			cubemap.needsUpdate = true;
			for(var i=0; i<6; i++){
				cubemap.images[ i ] = getSide( getimgx[i][0], getimgx[i][1] ,1024, ImageArray[0]);
			}
			var cubeShader = THREE.ShaderLib[ 'cube' ];
			cubeShader.uniforms[ 'tCube' ].value = cubemap;
			var skyBoxMaterial = new THREE.ShaderMaterial( {
				fragmentShader: cubeShader.fragmentShader,
				vertexShader: cubeShader.vertexShader,
				uniforms: cubeShader.uniforms,
				depthWrite: false,
				side: THREE.BackSide
			} );
			skyBox = new THREE.Mesh( new THREE.BoxGeometry( 2000000, 2000000, 2000000 ), skyBoxMaterial);
			scene.add( skyBox );

			//反射盒子
			for(i=0; i<6; i++){
				reflectbox.images[ i ] = getSide( getimgx[i][0], getimgx[i][1] ,256, ImageArray[1]);
			}

			//树木
			treetexture.image = ImageArray[2];
			treetexture.needsUpdate = true;

			//草地
			grasstexture.image = ImageArray[3];
			grasstexture.wrapS = grasstexture.wrapT = THREE.RepeatWrapping;
			grasstexture.needsUpdate = true;

			//地面
			groundtexture.image = ImageArray[4];
			groundtexture.wrapS = groundtexture.wrapT = THREE.RepeatWrapping;
			groundtexture.needsUpdate = true;

			//水面
			var waterNormals = new THREE.Texture();
			waterNormals.image = ImageArray[5];
			waterNormals.needsUpdate = true;
			waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
			WaterTexture = new THREE.Water( renderer, camera, scene, {
				textureWidth: 128,
				textureHeight: 128,
				waterNormals: waterNormals,
				alpha: 0.7,
				sunDirection: new THREE.Vector3( 3, 2.5, 0 ),
				waterColor: 0x5aa3e0,
				distortionScale: 30
			});

			//墙面
			buildingwalltexture.image = ImageArray[6];
			buildingwalltexture.wrapS = buildingwalltexture.wrapT = THREE.RepeatWrapping;
			buildingwalltexture.needsUpdate = true;

			//一个楼特定的玻璃
			glass1texture.image = ImageArray[7];
			glass1texture.wrapS = glass1texture.wrapT = THREE.RepeatWrapping;
			glass1texture.needsUpdate = true;

			//竖立的碑
			stela1texture.image = ImageArray[8];
			stela1texture.wrapS = stela1texture.wrapT = THREE.RepeatWrapping;
			stela1texture.needsUpdate = true;

			//横着的碑
			stela2texture.image = ImageArray[9];
			stela2texture.wrapS = stela2texture.wrapT = THREE.RepeatWrapping;
			stela2texture.needsUpdate = true;

			//其他的建筑
			var gtx = document.createElement('canvas').getContext('2d');
			gtx.canvas.width = 96;
			gtx.canvas.height = 96;
			var gradient = gtx.createLinearGradient( 0, 0, 96, 96 );
			gradient.addColorStop(0, 'rgba(255,255,255,1)');
			gradient.addColorStop(1, 'rgba(255,255,255,0.3)');
			gtx.fillStyle = gradient;
			gtx.fillRect(0, 0, 96, 96);
			gtx.fillStyle = 'rgba(255,255,255,.6)';
			gtx.fillRect(0, 10, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.55)';
			gtx.fillRect(0, 20, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.5)';
			gtx.fillRect(0, 30, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.45)';
			gtx.fillRect(0, 40, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.4)';
			gtx.fillRect(0, 50, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.35)';
			gtx.fillRect(0, 60, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.3)';
			gtx.fillRect(0, 70, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.25)';
			gtx.fillRect(0, 80, 96, 4);
			gtx.fillStyle = 'rgba(255,255,255,.2)';
			gtx.fillRect(0, 90, 96, 4);
			obtexture = new THREE.CanvasTexture(gtx.canvas);
			obtexture.wrapS = obtexture.wrapT = THREE.RepeatWrapping;


			//其他的建筑
			gtx = document.createElement('canvas').getContext('2d');
			gtx.canvas.width = 96;
			gtx.canvas.height = 96;
			gradient = gtx.createLinearGradient( 0, 0, 96, 96 );
			gradient.addColorStop(0, 'rgba(0,146,212,1)');
			gradient.addColorStop(1, 'rgba(43,174,180,1)');
			gtx.fillStyle = gradient;
			gtx.fillRect(0, 0, 96, 96);
			xmtexture = new THREE.CanvasTexture(gtx.canvas);
			xmtexture.wrapS = xmtexture.wrapT = THREE.RepeatWrapping;

			//河岸
			rbtexture.image = ImageArray[10];
			rbtexture.wrapS = rbtexture.wrapT = THREE.RepeatWrapping;
			rbtexture.needsUpdate = true;

			//泵房设备_水泥地面
			var ctexture = new THREE.Texture();
			ctexture.image = ImageArray[11];
			ctexture.wrapS = ctexture.wrapT = THREE.RepeatWrapping;
			ctexture.needsUpdate = true;
			mt_cement = new THREE.MeshLambertMaterial( { map:ctexture, depthWrite: false } );

			//泵房设备_非金属
			var fmtexture = new THREE.Texture();
			fmtexture.image = ImageArray[12];
			fmtexture.needsUpdate = true;
			mt_pumpdevice = new THREE.MeshPhongMaterial( { map:fmtexture } );

			//泵房设备_金属
			var reflectmetal = new THREE.CubeTexture( [] );
			reflectmetal.format = THREE.RGBFormat;
			reflectmetal.needsUpdate = true;
			for(i=0; i<6; i++){
				reflectmetal.images[ i ] = getSide( getimgx[i][0], getimgx[i][1] ,200, ImageArray[13]);
			}
			mt_metal = new THREE.MeshPhongMaterial( {  envMap: reflectmetal });
			mt_pumpblue = new THREE.MeshPhongMaterial( { color: 0x13509a } );
			mt_pumpblack = new THREE.MeshPhongMaterial( { color: 0x222222,  specular: 0x999999, shininess:10 } );
			mt_pumpred = new THREE.MeshPhongMaterial( { color: 0xb42c2c } );
			mt_pumpgray = new THREE.MeshPhongMaterial( { color: 0x6a6c75 } );
			mt_tpmetal = new THREE.MeshPhongMaterial( {  envMap: reflectmetal, transparent: true, opacity: 0.4, side: THREE.DoubleSide });

			//泵房内墙
			var wtexture = new THREE.Texture();
			wtexture.image = ImageArray[14];
			wtexture.wrapS = ctexture.wrapT = THREE.RepeatWrapping;
			wtexture.needsUpdate = true;
			mt_bfwall = new THREE.MeshLambertMaterial( { map:wtexture, depthWrite: false } );

			//泵房门
			var dtexture = new THREE.Texture();
			dtexture.image = ImageArray[15];
			dtexture.needsUpdate = true;
			mt_bfdoor = new THREE.MeshLambertMaterial( { map:dtexture } );

			//有水流的管道
			var ptx = document.createElement('canvas').getContext('2d');
			ptx.canvas.width = 64;
			ptx.canvas.height = 64;
			ptx.fillStyle = 'rgba(132,137,146,1)';
			ptx.fillRect(0, 0, 64, 64);
			ptx.translate(32, 32);
			ptx.rotate(Math.PI);
			ptx.fillStyle = 'rgb(0,91,185)';
			ptx.textAlign = 'center';
			ptx.textBaseline = 'middle';
			ptx.font = '60px sans-serif';
			ptx.fillText('▲', 0, 0);
			ptexture = new THREE.CanvasTexture(ptx.canvas);
			ptexture.wrapS = THREE.RepeatWrapping;
			ptexture.wrapT = THREE.RepeatWrapping;
			ptexture.repeat.x = 3;
			ptexture.repeat.y = 50;
			mt_anipipe = new THREE.MeshPhongMaterial({ map: ptexture, envMap: reflectmetal, reflectivity: 0.8 });

			//原水管道
			ptx = document.createElement('canvas').getContext('2d');
			ptx.canvas.width = 64;
			ptx.canvas.height = 64;
			ptx.fillStyle = 'rgba(175,75,0,1)';
			ptx.fillRect(0, 0, 64, 64);
			ptx.translate(32, 32);
			ptx.rotate(Math.PI);
			ptx.fillStyle = 'rgb(255,255,255)';
			ptx.textAlign = 'center';
			ptx.textBaseline = 'middle';
			ptx.font = '60px sans-serif';
			ptx.fillText('▲', 0, 0);
			pytexture = new THREE.CanvasTexture(ptx.canvas);
			pytexture.wrapS = THREE.RepeatWrapping;
			pytexture.wrapT = THREE.RepeatWrapping;
			pytexture.repeat.x = 3;
			pytexture.repeat.y = 50;
			mt_anipipey = new THREE.MeshPhongMaterial({ map: pytexture });

			//给水管道
			ptx = document.createElement('canvas').getContext('2d');
			ptx.canvas.width = 64;
			ptx.canvas.height = 64;
			ptx.fillStyle = 'rgba(4,43,171,1)';
			ptx.fillRect(0, 0, 64, 64);
			ptx.translate(32, 32);
			ptx.rotate(Math.PI);
			ptx.fillStyle = 'rgb(255,255,255)';
			ptx.textAlign = 'center';
			ptx.textBaseline = 'middle';
			ptx.font = '60px sans-serif';
			ptx.fillText('▲', 0, 0);
			pgtexture = new THREE.CanvasTexture(ptx.canvas);
			pgtexture.wrapS = THREE.RepeatWrapping;
			pgtexture.wrapT = THREE.RepeatWrapping;
			pgtexture.repeat.x = 3;
			pgtexture.repeat.y = 50;
			mt_anipipeg = new THREE.MeshPhongMaterial({ map: pgtexture });

			//给水支管
			mt_zpipeg = new THREE.MeshPhongMaterial({ color: 0x042bab });

			//池到池
			ptx = document.createElement('canvas').getContext('2d');
			ptx.canvas.width = 64;
			ptx.canvas.height = 64;
			ptx.translate(32, 32);
			ptx.rotate(Math.PI);
			ptx.fillStyle = 'rgb(0,178,214)';
			ptx.textAlign = 'center';
			ptx.textBaseline = 'middle';
			ptx.font = '60px sans-serif';
			ptx.fillText('▲', 0, 0);
			ctctexture = new THREE.CanvasTexture(ptx.canvas);
			ctctexture.wrapS = THREE.RepeatWrapping;
			ctctexture.wrapT = THREE.RepeatWrapping;
			ctctexture.repeat.x = 3;
			ctctexture.repeat.y = 50;
			mt_ctc = new THREE.MeshPhongMaterial({ map: ctctexture, transparent: true });

			//芦苇
			luweitexture.image = ImageArray[16];
			luweitexture.needsUpdate = true;

			//门牌
			mptexture.image = ImageArray[17];
			mptexture.needsUpdate = true;

			//科技感的泵房
			kjtexture.image = ImageArray[18];
			kjtexture.needsUpdate = true;

			CreateBuilding();
		}


	}

	function CreateBuilding(){
		msgbox.innerHTML = '正在创建建筑本体';

		var mt_grass = new THREE.MeshLambertMaterial( { map:grasstexture } );
		var mt_road = new THREE.MeshLambertMaterial( { color: 0x393939 } );
		var mt_ground = new THREE.MeshLambertMaterial( { map:groundtexture } );
		var mt_water = [
			WaterTexture.material,
			new THREE.MeshBasicMaterial( {  color: 0x2571d9, transparent: true, opacity: 0.6 } ),
			new THREE.MeshBasicMaterial( { envMap: reflectbox, transparent: true, opacity: 0.2 } )
		];
		mt_watersurface = [
			WaterTexture.material,
			new THREE.MeshBasicMaterial( {  color: 0x2571d9, transparent: true, opacity: 0.3 } )
			//new THREE.MeshBasicMaterial( { envMap: reflectbox, transparent: true, opacity: 0.2 } )
		];
		var mt_roadborder = new THREE.MeshLambertMaterial( { color: 0x999999 } );
		var mt_buildingwall = new THREE.MeshLambertMaterial( { map:buildingwalltexture } );
		var mt_glasswindow = [
			new THREE.MeshLambertMaterial( { color: 0x2e5391 } ),
			new THREE.MeshBasicMaterial( { envMap: reflectbox, transparent: true, opacity: 0.4 } )
		];
		var mt_glass1 = new THREE.MeshLambertMaterial( { map:glass1texture } );
		var mt_roof = new THREE.MeshLambertMaterial( { color: 0x666666 } );
		var mt_windowborder = new THREE.MeshLambertMaterial( { color: 0x444444 } );
		var mt_canopy = new THREE.MeshLambertMaterial( { color: 0x3363b4 } );
		var mt_sliverborder = new THREE.MeshLambertMaterial( { color: 0x999999 } );
		var mt_bridge = new THREE.MeshLambertMaterial( { color: 0x999999 } );
		var mt_stela1 = new THREE.MeshLambertMaterial( { map:stela1texture } );
		var mt_stela2 = new THREE.MeshLambertMaterial( { map:stela2texture } );
		var mt_cement = new THREE.MeshLambertMaterial( { color: 0x999999 } );
		var mt_device = new THREE.MeshLambertMaterial( { color: 0x999999 } );
		var mt_otherbuilding = new THREE.MeshLambertMaterial( { map: obtexture, transparent: true } );
		var mt_tree = new THREE.MeshLambertMaterial( { map: treetexture, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.6 } );
		var mt_text = new THREE.MeshBasicMaterial( { color: 0x666666 } );
		var mt_ctext = new THREE.MeshBasicMaterial( { color: 0xffffff,transparent: true, opacity: 0.7 } );
		var mt_xm = new THREE.MeshPhongMaterial( { map:xmtexture } );
		var mt_riverbank = new THREE.MeshLambertMaterial( { map: rbtexture } );
		var mt_zoneout = new THREE.MeshBasicMaterial( { color: 0x1d8dff } );
		var mt_zoneinner = new THREE.MeshBasicMaterial( { color: 0x1d8dff,transparent: true, opacity: 0.5 } );
		var mt_zonetext = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		var mt_bars = new THREE.MeshLambertMaterial( { color: 0x333333 } );
		var mt_roadline = new THREE.MeshBasicMaterial( { color: 0x888888 } );
		var mt_yellowline = new THREE.MeshBasicMaterial( { color: 0xccca12 } );
		var mt_luwei = new THREE.MeshLambertMaterial( { map: luweitexture, transparent: true, side: THREE.DoubleSide, depthWrite: false } );
		var mt_redbrigde = new THREE.MeshLambertMaterial( { color: 0x653a30 } );
		var mt_mp = new THREE.MeshLambertMaterial( { map:mptexture } );
		var mt_mkdz = new THREE.MeshLambertMaterial( { color: 0xffdd22, envMap: reflectbox, reflectivity: .6 } );
		var mt_kjbf = new THREE.MeshPhongMaterial( { map:kjtexture } );
		var mt_cgan = new THREE.MeshLambertMaterial( { color: 0xbbbbbb } );
		var mt_ctou = new THREE.MeshLambertMaterial( { color: 0x333333 } );

		mt_highlightbf= new THREE.MeshLambertMaterial( { color: 0x0799ff, transparent: true, opacity: 0.7 } );
		mt_gop = new THREE.MeshLambertMaterial( { color: 0x79adc5, transparent: true, opacity: 0.1 } );
		mt_gop1 = new THREE.MeshLambertMaterial( { color: 0x79adc5, transparent: true, opacity: 0.08 } );
		mt_gop2 = new THREE.MeshLambertMaterial( { color: 0x79adc5, transparent: true, opacity: 0.05 } );
		mt_gop3 = new THREE.MeshLambertMaterial( { color: 0x79adc5, transparent: true, opacity: 0.3 } );
		mt_opipe = new THREE.MeshPhongMaterial( { color: 0x56aaff, transparent: true, opacity: 0.3 } );
		mt_pipe_a = new THREE.MeshPhongMaterial( { color: 0x1b5fcf } );
		mt_pipe_b = new THREE.MeshPhongMaterial( { color: 0xda8d48 } );

		mt_PL = new THREE.MeshBasicMaterial( { color:0xff0000, transparent: true, depthWrite: false, depthTest: false, opacity: 0.6 } );

		var mt_pipe_pe = new THREE.MeshPhongMaterial( { color: 0x333333 } );

		mt_transparent = new THREE.MeshLambertMaterial( { color: 0x999999, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false } );
		mt_tpo = new THREE.MeshLambertMaterial( { color: 0x999999, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false } );
		mt_waterbody = new THREE.MeshLambertMaterial( { color: 0x2373d6,  transparent: true, opacity: 0.6 } );




		var loader = new THREE.OBJLoader(manager);
		loader.load( 'models/yuanqu.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					var ot=child.name.substr(0,2);

					if(ot==='CD'){ //草地
						child.material = mt_grass;
						child.receiveShadow = true;
						BUILDING[0].add(child.clone());
						BaseMat[0]=child.material;
					}else if(ot==='LU'){ //道路
						child.material = mt_road;
						child.receiveShadow = true;
						BUILDING[1].add(child.clone());
						BaseMat[1]=child.material;
					}else if(ot==='DZ'){ //铺了地砖的地面
						child.material = mt_ground;
						child.receiveShadow = true;
						BUILDING[2].add(child.clone());
						BaseMat[2]=child.material;
					}else if(ot==='HE'){ //河水
						BUILDING[3].add( new THREE.SceneUtils.createMultiMaterialObject(child.geometry, mt_water ) );
					}else if(ot==='HA'){ //河岸
						child.material = mt_riverbank;
						child.receiveShadow = true;
						BUILDING[4].add(child.clone());
						BaseMat[4]=child.material;
					}else if(ot==='LY'){ //路沿
						child.material = mt_roadborder;
						BUILDING[5].add(child.clone());
						BaseMat[5]=child.material;
					}else if(ot==='SC'){ //葫芦形水池
						BUILDING[6].add( new THREE.SceneUtils.createMultiMaterialObject(child.geometry, mt_water ) );
					}else if(ot==='AQ'){ //矮墙
						child.material = mt_roadborder;
						BUILDING[7].add(child.clone());
						BaseMat[7]=child.material;
					}else if(ot==='WL'){ //建筑外墙
						child.material = mt_buildingwall;
						child.castShadow = true;
						BUILDING[8].add(child.clone());
						BaseMat[8]=child.material;
					}else if(ot==='BL'){ //一般玻璃
						var glass = new THREE.SceneUtils.createMultiMaterialObject(child.geometry, mt_glasswindow );
						glass.castShadow = true;
						BUILDING[9].add(glass);
					}else if(ot==='BT'){ //带贴图的玻璃
						child.material = mt_glass1;
						child.castShadow = true;
						BUILDING[10].add(child.clone());
						BaseMat[10]=child.material;
					}else if(ot==='WD'){ //屋顶
						child.material = mt_roof;
						child.castShadow = true;
						BUILDING[11].add(child.clone());
						BaseMat[11]=child.material;
					}else if(ot==='BK'){ //窗框
						child.material = mt_windowborder;
						BUILDING[12].add(child.clone());
						BaseMat[12]=child.material;
					}else if(ot==='WY'){ //屋檐
						child.material = mt_canopy;
						child.castShadow = true;
						BUILDING[13].add(child.clone());
						BaseMat[13]=child.material;
					}else if(ot==='BB'){ //银色边框
						child.material = mt_sliverborder;
						child.castShadow = true;
						BUILDING[14].add(child.clone());
						BaseMat[14]=child.material;
					}else if(ot==='QA'){ //桥
						child.material = mt_bridge;
						BUILDING[15].add(child.clone());
						BaseMat[15]=child.material;
					}else if(ot==='RA'){ //竖着的碑
						child.material = mt_stela2;
						child.castShadow = true;
						BUILDING[16].add(child.clone());
						BaseMat[16]=child.material;
					}else if(ot==='RB'){ //竖着的碑
						child.material = mt_stela1;
						child.castShadow = true;
						BUILDING[17].add(child.clone());
						BaseMat[17]=child.material;
					}else if(ot==='SN'){ //一般的水泥地
						child.material = mt_cement;
						BUILDING[18].add(child.clone());
						BaseMat[18]=child.material;
					}else if(ot==='ZJ'){ //闸机
						child.material = mt_device;
						BUILDING[19].add(child.clone());
						BaseMat[19]=child.material;
					}else if(ot==='BU'){ //预设的建筑
						child.material = mt_otherbuilding;
						BUILDING[20].add(child.clone());
						BaseMat[20]=child.material;
					}else if(ot==='BF'){ //泵房
						child.material = mt_metal;
						child.castShadow = true;
						BUILDING[21].add(child.clone());
						BaseMat[21]=child.material;
					}else if(ot==='TR'){ //树木
						child.material = mt_tree;
						child.castShadow = true;
						BUILDING[22].add(child.clone());
						BaseMat[22]=child.material;
					}else if(ot==='TX'){ //路名
						child.material = mt_text;
						BUILDING[23].add(child.clone());
						BaseMat[23]=child.material;
					}else if(ot==='TL'){ //铁栏杆
						child.material = mt_bars;
						BUILDING[24].add(child.clone());
						BaseMat[24]=child.material;
					}else if(ot==='RL'){ //路上的线
						child.material = mt_roadline;
						BUILDING[25].add(child.clone());
						BaseMat[25]=child.material;
					}else if(ot==='LW'){ //芦苇
						child.material = mt_luwei;
						BUILDING[26].add(child.clone());
						BaseMat[26]=child.material;
					}else if(ot==='LM'){ //栏杆
						child.material = mt_sliverborder;
						BUILDING[27].add(child.clone());
						BaseMat[27]=child.material;
					}else if(ot==='ZZ'){ //门口的大金字
						child.material = mt_mkdz;
						BUILDING[28].add(child.clone());
						BaseMat[28]=child.material;
					}else if(ot==='HQ'){ //红褐色的桥
						child.material = mt_redbrigde;
						BUILDING[29].add(child.clone());
						BaseMat[29]=child.material;
					}else if(ot==='IG'){ //不锈钢管道
						child.material = mt_metal;
						BUILDING[30].add(child.clone());
						BaseMat[30]=child.material;
					}else if(ot==='IP'){ //PE管道
						child.material = mt_pipe_pe;
						BUILDING[31].add(child.clone());
						BaseMat[31]=child.material;
					}else if(ot==='ZP'){ //门牌
						child.material = mt_mp;
						BUILDING[32].add(child.clone());
						BaseMat[32]=child.material;
					}else if(ot==='XM'){ //熊猫标志
						child.material = mt_xm;
						BUILDING[33].add(child.clone());
						BaseMat[33]=child.material;
					}else if(ot==='BS'){ //科技感的泵房
						child.material = mt_kjbf;
						child.castShadow = true;
						BUILDING[34].add(child.clone());
						BaseMat[34]=child.material;
					}else if(ot==='RY'){ //路上的黄线
						child.material = mt_yellowline;
						BUILDING[35].add(child.clone());
						BaseMat[35]=child.material;
					}else if(ot==='CX'){ //池子的字
						child.material = mt_ctext;
						BUILDING[36].add(child.clone());
						BaseMat[36]=child.material;
					}else if(ot==='AG'){ //摄像头杆子
						child.material = mt_cgan;
						BUILDING[37].add(child.clone());
						BaseMat[37]=child.material;
					}else if(ot==='AT'){ //摄像头镜头
						child.material = mt_ctou;
						BUILDING[38].add(child.clone());
						BaseMat[38]=child.material;
					}else if(ot==='XB'){ //显示建筑标签的虚拟物体
						VBox.add(child.clone());
					}else if(ot==='GG'){ //管道净水
						child.material = mt_anipipeg;
						PIPE_A = child.clone();
					}else if(ot==='GY'){ //管道原水
						child.material = mt_anipipey;
						PIPE_B = child.clone();
					}else if(ot==='GO'){ //管道净水支管
						child.material = mt_zpipeg;
						PIPE_C = child.clone();
					}else if (ot === 'CC') { //池到池
						child.material = mt_ctc;
						CTC = child.clone();
					}else if(ot==='OO'){ //区域框外圈
						child.material = mt_zoneout;
						ZoneBorder.add(child.clone());
					}else if(ot==='OI'){ //区域框内圈
						child.material = mt_zoneinner;
						ZoneBorder.add(child.clone());
					}else if(ot==='OT'){ //区域字
						child.material = mt_zonetext;
						ZoneBorder.add(child.clone());
					}else if(ot==='MA'||ot==='MB'||ot==='MC'){ //仪表
						child.material = mt_pumpdevice;
						YB.add(child.clone());
					}else if(ot==='GT'){ //杆塔
						child.material = mt_sliverborder;
						GT.add(child.clone());
					}else if(ot==='AY'){ //压力点
						DYL.add(child.clone());
					}else if(ot==='AL'){ //流量点
						DLL.add(child.clone());
					}else if(ot==='AZ'){ //水质点
						DSZ.add(child.clone());
					}else if(ot==='VT'){ //调峰点
						DTF.add(child.clone());
					}else if(ot==='VR'){ //二供点
						DRG.add(child.clone());
					}else if(ot==='QX'){ //受点面
						PosPlane.add(child.clone());
					}


					child.geometry.dispose();
					child.material.dispose();
				}

			});

			scene.add(ZoneBorder);
			scene.add(GT);

			CurrIc=VBox;

			CreateDIVs(VBox);


			for (i = 0; i < BUILDING.length; i++) {
				scene.add(BUILDING[i]);
			}

			AllCreated();
		}, onProgress);
	}


	function AllCreated() {
		msgbox.innerHTML = '正在进行最后准备';

		renderer = new THREE.WebGLRenderer({
			antialias:true,
			logarithmicDepthBuffer:true
		});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.offsetWidth, container.offsetHeight );
		renderer.localClippingEnabled = true;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );
		container.addEventListener('click',onMouseClick, false );
		document.addEventListener('mousemove',onMouseMove, false );
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );


		animate();

		new TWEEN.Tween( camera.position ).to( { y:camerapi[1] }, anitime ).easing( TWEEN.Easing.Quadratic.Out).start().onComplete(function() {
			controls.enabled = true;
			msgbox.style.display = 'none';
			SetDP();
		});

	}

}

//刷新动画
function animate(time) {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	renderer.render( scene, camera );

	WaterTexture.material.uniforms.time.value += waterspeed;
	WaterTexture.render();

	if(IsPlayFlow){
		ptexture.offset.y = (time*0.003 % 1);
		pgtexture.offset.y = (time*0.003 % 1);
		pytexture.offset.y = (time*0.003 % 1);
		ctctexture.offset.y = (time*0.0015 % 1);
	}

	Moving();

	if(!IsWalkingPath && !IsZooming && !IsPersonView && !IsFlyView){
		CurrLockTarget.traverse( function ( child ) {
			if (child.isMesh) {
				var sn = child.name.split('_');
				var id = parseInt(sn[1])-1;

				DIVS[id].style.left = ScrPos(child, camera)[0] - DIVS[id].offsetWidth/2 +'px';
				DIVS[id].style.top = ScrPos(child, camera)[1] - DIVS[id].offsetHeight +'px';
			}
		});
	}

}


//窗体改变事件
function onWindowResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( container.offsetWidth, container.offsetHeight );
}

//交互射线
function IntX(event) {
	var Sx = event.clientX;
	var Sy = event.clientY;
	var x = ( Sx / container.offsetWidth ) * 2 - 1;
	var y = -( Sy / container.offsetHeight ) * 2 + 1;
	var standardVector  = new THREE.Vector3(x, y, 0.5);
	var worldVector = standardVector.unproject(camera);
	var ray = worldVector.sub(camera.position).normalize();
	var raycaster = new THREE.Raycaster(camera.position, ray);
	var meshChildren = CurrIc.children;
	var intersects = raycaster.intersectObjects(meshChildren);
	var result = null;
	if (intersects.length > 0) {
		result = intersects[0].object;
	}
	return(result);
}

//取得模型内部元素的位置
function GetChildPos(child) {
	var cg = child.geometry;
	cg.computeBoundingBox();
	var centroid = new THREE.Vector3();
	centroid.addVectors( cg.boundingBox.min, cg.boundingBox.max );
	centroid.multiplyScalar( 0.5 );
	return(centroid);
}

//坐标转换
function ScrPos(obj,camera) {
	var p = GetChildPos(obj);
	var vector = p.project(camera);
	vector.x =Math.round( ( vector.x + 1 ) / 2 * container.offsetWidth);
	vector.y =Math.round( -( vector.y - 1 ) / 2 * container.offsetHeight);
	return[vector.x,vector.y];
}

//移动镜头
function MoveCamera(cx,cy,cz,tx,ty,tz){
	new TWEEN.Tween( camera.position ).to( { x: cx,  y: cy, z: cz}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start();
	new TWEEN.Tween( controls.target ).to( { x: tx,  y: ty, z: tz}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start();
}

//光标点击事件
function onMouseClick(event){

	//alert('camera:'+camera.position.x+'_'+camera.position.y+'_'+camera.position.z+'****controls:'+controls.target.x+'_'+controls.target.y+'_'+controls.target.z);

	MakeRoamPoint();

	dcwarp.style.display = 'none';

	if(!IsDrawingPath && !IsSelectingStart && !IsFlyView){
		var obj = IntX(event);
		if (obj) {
			var cp = GetChildPos(obj);
			var sn= obj.name.split('_');

			if(sn[0]==='XB' && !IsWalkingPath){
				var xi = parseInt(sn[1]);
				if(xi>9 && xi<32){ //如果点击的是泵房
					if(!IsPersonView){
						SetDP(obj);
					}
					ZoomToBF(obj);
				}else if(xi>37 && xi<50){ //如果点击的是摄像头杆
					dcwarp.style.display = 'block';
					SetCP(obj);
				}

			}else if(sn[0]==='MA'||sn[0]==='MB'||sn[0]==='MC') { //如果点击的是仪表
				SetDP(obj);
				scene.remove(ChosenRing);
				ChosenRing.position.set(cp.x, cp.y, cp.z);
				scene.add(ChosenRing);
			}else if(sn[0]==='VB') { //如果点击的是泵房里的设备
				//SetDP(obj);
				scene.remove(ChosenRingS);
				ChosenRingS.position.set(cp.x, cp.y, cp.z);
				scene.add(ChosenRingS);
			}

		}
	}


}

//光标移动事件
function onMouseMove(event) {
	if((CurrVW===0 || CurrVW===2) && !IsDrawingPath && !IsFlyView && !IsZoomedToBF){
		if(CurrFTbox){
			CurrFTbox.style.display='none';
		}
		var obj = IntX(event);
		if (obj) {

			var sn= obj.name.split('_');
			var cp = ftbox[parseInt(sn[1])-1];

			cp.style.display='block';
			cp.style.left = ScrPos(obj, camera)[0] - cp.offsetWidth/2 +'px';
			cp.style.top = ScrPos(obj, camera)[1] - cp.offsetHeight +'px';

			CurrFTbox = cp;
		}
	}
}

//镜头缩放到泵房并加载设备
function ZoomToBF(obj) {

	IsZooming = true;
	IsZoomedToBF = true;

	ClearDIVs();
	CurrFTbox.style.display='none';


	var BFCP = [[104469,7503,-57076],[35580,4464,-79028],[33565,5900,-66747],[32737,6537,-67445],
		[30498,6445,-59073],[31080,8900,-57627],[30897,9000,-38102],[27737,9950,-42837],
		[7536,11355,-9534],[6650,10676,-3318],[7350,10586,1362],[6654,10195,7285],[10838,13201,14611],
		[7313,14083,34233],[7707,10523,26808],[7190,9692,61411],[-6809,8990,86210],
		[50410,10000,58044],[47304,9613,48851],[50461,10040,62972],[77245,9931,41850],[63255,15276,4043]
	];


	waterspeed = 0.05;

	var sn = obj.name.split('_');
	var id = parseInt(sn[1])-10;

	CurrBF = id;

	var cp = GetChildPos(obj);


	function LoadBF(){

		msgbox.style.display = 'block';
		msgbox.innerHTML = '正在加载泵房设备';

		CurrBFC = new THREE.Object3D; //泵房里有交互事件的设备
		CurrBFO = new THREE.Object3D; //泵房里的其他设备
		CurrWall = new THREE.Object3D; //泵房的墙

		var loader = new THREE.OBJLoader(manager);
		loader.load( 'models/'+DVFile[id]+'.obj', function ( object ) {

			var sp;

			object.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					var ot = child.name.split('_');

					if(ot[0]==='VB'){ //虚拟反应盒子
						CurrBFC.add(child.clone());
					}else if(ot[0]==='DV'||ot[0]==='QJ'){ //有贴图的
						child.material = mt_pumpdevice;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='BB'){ //蓝色的
						child.material = mt_pumpblue;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='KK'){ //黑色的
						child.material = mt_pumpblack;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='RR'){ //红色的
						child.material = mt_pumpred;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='GG'){ //灰色的
						child.material = mt_pumpgray;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='TP'){ //半透明的
						child.material = mt_transparent;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='OP'){ //透明度比较低的半透明
						child.material = mt_tpo;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='CE'){ //水泥地
						child.material = mt_cement;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='BW'){ //内墙
						child.material = mt_bfwall;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='DR'){ //门
						child.material = mt_bfdoor;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='PQ'){ //用于定位的
						sp = GetChildPos(child);
					}else if(ot[0]==='ST'){ //水体
						child.material = mt_waterbody;
						CurrBFO.add(child.clone());
					}else if(ot[0]==='SM'){ //水面
						CurrBFO.add( new THREE.SceneUtils.createMultiMaterialObject(child.geometry, mt_watersurface ) );
					}else if(ot[0]==='CS'){ //有动画的水管
						child.material = mt_anipipe;
						CurrBFO.add(child.clone());
						IsPlayFlow = true;
					}else if(ot[0]==='WT'||ot[0]==='WX'){ //半透明金属外箱
						child.material = mt_tpmetal;
						CurrWall.add(child.clone());
					}else{ //其他都是不锈钢
						child.material = mt_metal;
						CurrBFO.add(child.clone());
					}

					child.geometry.dispose();
					child.material.dispose();
				}
			});

			if(!IsPersonView){
				CurrIc=CurrBFC;
			}else{
				scene.add(CurrWall);
			}

			scene.add(CurrBFO);

			if(!IsPersonView){
				CreateDIVs(CurrBFC);
			}

			IsZooming = false;


			msgbox.style.display = 'none';
		}, onProgress);

	}


	if(IsPersonView){
		DestoryBF();
		LoadBF();

		mt_bfwall.depthWrite = true;


		scene.remove(BUILDING[21]);
		scene.remove(FBF);
		FBF = new THREE.Object3D;
		BUILDING[21].traverse( function ( child ) {
			if (child.name !== '') {
				var sn = child.name.split('_');
				if(parseInt(sn[1])!==id){
					FBF.add(child.clone());
				}

			}
		});
		scene.add(FBF);

		scene.remove(BUILDING[32]);
		scene.remove(PBF);
		PBF = new THREE.Object3D;
		BUILDING[32].traverse( function ( child ) {
			if (child.name !== '') {
				var sn = child.name.split('_');
				if(parseInt(sn[1])!==id){
					PBF.add(child.clone());
				}

			}
		});
		scene.add(PBF);

	}else{
		if(CurrVW===0){
			CurrVW = 2;
			CtrlOverview();
			CurrVW = 0;
			scene.remove(GT);
		}

		mt_bfwall.depthWrite = false;

		scene.remove(PIPE_A);
		scene.remove(PIPE_B);
		scene.remove(PIPE_C);
		scene.remove(FBF);
		scene.remove(PBF);
		scene.remove(BUILDING[21]);
		scene.remove(BUILDING[30]);
		scene.remove(BUILDING[31]);
		scene.remove(BUILDING[32]);
		scene.remove(BUILDING[0]);
		scene.remove(BUILDING[2]);
		scene.remove(ZoneBorder);

		dpwarp.style.display = 'block';
		document.getElementById('sbtn').style.display = 'none';
		document.getElementById('rbtn').style.display = 'block';
		document.getElementById('btn_bf').style.display = 'none';
		tlbox.style.display = 'none';

		new TWEEN.Tween( camera.position ).to( { x: BFCP[id][0], y: BFCP[id][1], z: BFCP[id][2]}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start();
		new TWEEN.Tween( controls.target ).to( { x: cp.x, y:0, z: cp.z}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start().onComplete(LoadBF);
	}




}

//摧毁当前泵房设备
function DestoryBF(){
	if(CurrBFO){
		scene.remove(CurrBFC);
		scene.remove(CurrBFO);
		scene.remove(CurrWall);
		CurrBFC.traverse( function ( child ) {
			if(child.name!==''){
				child.geometry.dispose();
				var m = child.material.length;
				if(m){
					for(var i=0; i<m; i++ ){
						child.material[i].dispose();
					}
				}
			}
		});
		CurrBFO.traverse( function ( child ) {
			if(child.name!==''){
				child.geometry.dispose();
				var m = child.material.length;
				if(m){
					for(var i=0; i<m; i++ ){
						child.material[i].dispose();
					}
				}
			}
		});
		CurrWall.traverse( function ( child ) {
			if(child.name!==''){
				child.geometry.dispose();
				var m = child.material.length;
				if(m){
					for(var i=0; i<m; i++ ){
						child.material[i].dispose();
					}
				}
			}
		});
	}
	CurrBFO = new THREE.Object3D;
	CurrBFC = new THREE.Object3D;
	CurrWall = new THREE.Object3D;
}

//点击外观按钮
document.getElementById('sb_overview').onclick = function() {
	if(CurrVW!==0){


		dpwarp.style.display = 'none';

		MoveCamera(camerapi[0],camerapi[1],camerapi[2],contrlpi[0],contrlpi[1],contrlpi[2]);

		this.classList.add('active');
		document.getElementById('sb_pipe').classList.remove('active');
		document.getElementById('sb_pump').classList.remove('active');
		document.getElementById('pipemark').style.display = 'none';
		document.getElementById('btn_gd').style.display = 'none';
		document.getElementById('btn_bf').style.display = 'none';
		document.getElementById('btn_drawpath').style.display = 'inline-block';
		document.getElementById('btn_flyview').style.display = 'inline-block';
		document.getElementById('btn_personview').style.display = 'inline-block';

		CurrVW = 0;
		CtrlOverview();

		CreateDIVs(VBox);

		CurrIc=VBox;

		IsPlayFlow = false;


		scene.remove(PIPE_A);
		scene.remove(PIPE_B);
		scene.remove(PIPE_C);
		scene.remove(CTC);
		scene.remove(YB);
		scene.remove(ChosenRing);
		scene.remove(ChosenRingS);
		scene.add(ZoneBorder);
		scene.add(GT);
		scene.add(BUILDING[30]);
		scene.add(BUILDING[31]);
		scene.remove(FBF);
		scene.remove(PBF);
		scene.add(BUILDING[21]);
		scene.add(BUILDING[32]);

		SetDP();
	}
};

//点击管道按钮
document.getElementById('sb_pipe').onclick = function() {
	if(CurrVW!==1){

		dpwarp.style.display = 'block';
		dcwarp.style.display = 'none';

		MoveCamera(camerapi[0],camerapi[1],camerapi[2],contrlpi[0],contrlpi[1],contrlpi[2]);

		document.getElementById('btn_gd_yl').classList.add('active');
		document.getElementById('btn_gd_ll').classList.remove('active');
		document.getElementById('btn_gd_sz').classList.remove('active');
		CurrGDD = 0;

		this.classList.add('active');
		document.getElementById('sb_overview').classList.remove('active');
		document.getElementById('sb_pump').classList.remove('active');
		document.getElementById('pipemark').style.display = 'block';
		document.getElementById('btn_gd').style.display = 'block';
		document.getElementById('btn_bf').style.display = 'none';
		document.getElementById('btn_drawpath').style.display = 'none';
		document.getElementById('btn_flyview').style.display = 'none';
		document.getElementById('btn_personview').style.display = 'none';

		CurrVW = 1;
		CtrlOverview();

		CreateDIVs(DYL);

		CurrBFD = 3;

		FilterBF();


		CurrIc=YB;

		IsPlayFlow = true;

		scene.add(PIPE_A);
		scene.add(PIPE_B);
		scene.add(PIPE_C);
		scene.add(CTC);

		scene.add(YB);
		scene.remove(GT);
		scene.remove(ZoneBorder);
		scene.remove(ChosenRing);
		scene.remove(ChosenRingS);
		scene.remove(BUILDING[30]);
		scene.remove(BUILDING[31]);

		SetDP();
	}
};

//点击泵房按钮
document.getElementById('sb_pump').onclick = function() {
	if(CurrVW!==2){

		dpwarp.style.display = 'block';
		dcwarp.style.display = 'none';

		MoveCamera(camerapi_bf[0],camerapi_bf[1],camerapi_bf[2],contrlpi_bf[0],contrlpi_bf[1],contrlpi_bf[2]);

		this.classList.add('active');
		document.getElementById('sb_pipe').classList.remove('active');
		document.getElementById('sb_overview').classList.remove('active');
		document.getElementById('pipemark').style.display = 'none';
		document.getElementById('btn_gd').style.display = 'none';
		document.getElementById('btn_bf').style.display = 'block';
		document.getElementById('btn_drawpath').style.display = 'none';
		document.getElementById('btn_flyview').style.display = 'none';
		document.getElementById('btn_personview').style.display = 'none';

		CurrVW = 2;

		CurrBFD = 1;

		document.getElementById('btn_bf_tf').classList.add('active');
		document.getElementById('btn_bf_rg').classList.remove('active');

		CtrlOverview();

		FilterBF();

		CreateDIVs(DTF);



		CurrIc=VBox;
		IsPlayFlow = true;


		scene.add(PIPE_A);
		scene.add(PIPE_B);
		scene.add(PIPE_C);
		scene.add(CTC);


		scene.remove(YB);
		scene.remove(GT);
		scene.remove(ZoneBorder);
		scene.remove(ChosenRing);
		scene.remove(ChosenRingS);
		scene.add(BUILDING[30]);
		scene.add(BUILDING[31]);

		SetDP();
	}
};

//隐藏或显示外观
function CtrlOverview(){
	if(CurrVW===0){
		scene.fog = new THREE.Fog( 0x779d49, 500000, 1300000 );
		mt_gridline.opacity = 0.1;
		scene.add(skyBox);
		for(var i=0; i<BUILDING.length; i++ ){
			if(i===3||i===5||i===6||i===9||i===22||i===26){
				scene.add(BUILDING[i]);
			}else{
				BUILDING[i].traverse( function ( child ) {
					if (child.name !== '') {
						child.material = BaseMat[i];
					}
				});
				if(i===0||i===1||i===2||i===4){
					BUILDING[i].traverse( function ( child ) {
						if (child.name !== '') {
							child.receiveShadow = true;
						}
					});
				}
			}
		}
	}else{
		scene.fog = new THREE.Fog( 0x01091e, 500000, 1300000 );
		mt_gridline.opacity = 0.05;
		scene.remove(skyBox);
		for(i=0; i<BUILDING.length; i++ ){
			if(i===3||i===5||i===6||i===9||i===22||i===26){
				scene.remove(BUILDING[i]);
			}else{
				BUILDING[i].traverse( function ( child ) {
					if (child.name !== '') {
						if(i===1){
							child.material = mt_gop2;
						}else if(i===2){
							child.material = mt_gop1;
						}else if(i===36){
							child.material = mt_gop3;
						}else{
							child.material = mt_gop;
						}

					}
				});
				if(i===0||i===1||i===2||i===4){
					BUILDING[i].traverse( function ( child ) {
						if (child.name !== '') {
							child.receiveShadow = false;
						}
					});

				}
			}
		}
	}

}

//从各个界面恢复视角
document.getElementById('rbtn').onclick = function() {

	DestoryBF();

	scene.remove(ChosenRing);
	scene.remove(ChosenRingS);

	//alert(IsZoomedToBF);

	if(CurrVW===0){ //从外观区域界面恢复

		MoveCamera(camerapi[0],camerapi[1],camerapi[2],contrlpi[0],contrlpi[1],contrlpi[2]);

		CreateDIVs(VBox);

		document.getElementById('sbtn').style.display = 'block';
		document.getElementById('rbtn').style.display = 'none';
		CtrlOverview();
		CurrBF = -1;
		scene.add(GT);

		tlbox.style.display = 'block';
		dpwarp.style.display = 'none';

		scene.remove(FBF);
		scene.remove(PBF);
		scene.add(BUILDING[21]);
		scene.add(ZoneBorder);

		IsPlayFlow = false;

	}else if(CurrVW===2){ //从泵房界面恢复视角

		MoveCamera(camerapi_bf[0],camerapi_bf[1],camerapi_bf[2],contrlpi_bf[0],contrlpi_bf[1],contrlpi_bf[2]);

		if(CurrBFD===1){
			CreateDIVs(DTF);
		}else if(CurrBFD===2){
			CreateDIVs(DRG);
		}

		CurrBF = -1;

		document.getElementById('sbtn').style.display = 'block';
		document.getElementById('rbtn').style.display = 'none';
		document.getElementById('btn_bf').style.display = 'block';
		tlbox.style.display = 'block';

		scene.add(FBF);
		scene.add(PIPE_A);
		scene.add(PIPE_B);
		scene.add(PIPE_C);

		IsPlayFlow = true;
	}

	CurrIc=VBox;

	scene.add(BUILDING[0]);
	scene.add(BUILDING[2]);
	scene.add(BUILDING[30]);
	scene.add(BUILDING[31]);
	scene.add(BUILDING[32]);




	IsZoomedToBF = false;


	waterspeed = 0.2;

	SetDP();

};

//设置数据面板
function SetDP(obj) {

	var dpc, url;

	if(obj){//根据设备设置
		var sn = obj.name.split('_');

		if(CurrVW===0) { //外观界面下，点的是泵房
			dpc = bfname[parseInt(sn[1])-10];
			url = 'html_bfs/'+DVFile[parseInt(sn[1])-10]+'.html';
			if(IsZoomedToBF){
				dpc = obj.name;
				url = 'info_data.html';
			}

		}else if(CurrVW===1){ //管道界面下，点的是仪表
			for(var i=0; i<DvName.length; i++){
				if(sn[0]===DvName[i][0]){
					var DvTitle = DvName[i][1];
				}
			}
			dpc = DvTitle+'_'+sn[1];
			url = 'info_data.html';
		}else if(CurrVW===2){ //泵房界面下
			if(CurrBF===-1){ //没有选择泵房，点的是泵房
				dpc = bfname[parseInt(sn[1])-10];
				url = 'html_bfs/'+DVFile[parseInt(sn[1])-10]+'.html';
			}else{ //已选择泵房，点的是泵房里的设备
				dpc = obj.name;
				url = 'info_data.html';
			}
		}

		SetDPHeight();

	}else{//根据建筑位置设置
		if(CurrZone===-1){ //没有选择区域
			dpc = ViewName[CurrVW];
			if(CurrVW===1){
				if(CurrGDD===0){
					dpc = '压力监控';
					url = 'html_zones/info_gd_yl.html';
					SetDPHeight(380);
				}else if(CurrGDD===1){
					dpc = '流量监控';
					url = 'html_zones/info_gd_ll.html';
					SetDPHeight(500);
				}else if(CurrGDD===2){
					dpc = '水质监控';
					url = 'html_zones/info_gd_sz.html';
					SetDPHeight(720);
				}
			}else if(CurrVW===2){
				if(CurrBFD===1){
					dpc = '调峰监控';
					url = 'html_zones/info_bf_tf.html';
					SetDPHeight();
				}else if(CurrBFD===2){
					dpc = '能耗分析';
					url = 'html_zones/info_bf_rg.html';
					SetDPHeight();
				}
			}
		}else{
			dpc = ZoneName[CurrZone][0];
			url = ZoneName[CurrZone][1];
		}
	}

	dptitle.innerHTML = dpc;

	if(url){
		dpbox.src = url;
	}else{
		//dpbox.src = 'info_building.html';
	}

	function SetDPHeight(h) {
		if(h){
			dpwarp.style.bottom = document.body.offsetHeight - h - 150 + 'px';
		}else{
			dpwarp.style.bottom = '150px';
		}



	}


}

//设置摄像头面板
function SetCP(obj){
	var sn = obj.name.split('_');
	dctitle.innerHTML = buname[parseInt(sn[1])-1];
	var para = parseInt(sn[1])-37;
	dcbox.src = 'html_cameras/info_camera.html?para='+para;
}

//刷新面板
document.getElementById('btn_refresh').onclick = function() {
	dpbox.contentWindow.location.reload(true);
};

//按钮_单纯恢复视角
document.getElementById('btn_resetview').onclick = function() {

	dcwarp.style.display = 'none';

	if(CurrVW===2){
		MoveCamera(camerapi_bf[0],camerapi_bf[1],camerapi_bf[2],contrlpi_bf[0],contrlpi_bf[1],contrlpi_bf[2]);
	}else{
		MoveCamera(camerapi[0],camerapi[1],camerapi[2],contrlpi[0],contrlpi[1],contrlpi[2]);
	}

	if(IsPersonView||IsFlyView){
		ResetViewFromPV();
	}

};

//按钮_压力
document.getElementById('btn_gd_yl').onclick = function() {
	document.getElementById('btn_gd_yl').classList.add('active');
	document.getElementById('btn_gd_ll').classList.remove('active');
	document.getElementById('btn_gd_sz').classList.remove('active');
	CurrGDD = 0;

	CreateDIVs(DYL);
	SetDP();

};

//按钮_流量
document.getElementById('btn_gd_ll').onclick = function() {
	document.getElementById('btn_gd_ll').classList.add('active');
	document.getElementById('btn_gd_yl').classList.remove('active');
	document.getElementById('btn_gd_sz').classList.remove('active');
	CurrGDD = 1;

	CreateDIVs(DLL);
	SetDP();
};

//按钮_水质
document.getElementById('btn_gd_sz').onclick = function() {
	document.getElementById('btn_gd_sz').classList.add('active');
	document.getElementById('btn_gd_ll').classList.remove('active');
	document.getElementById('btn_gd_yl').classList.remove('active');
	CurrGDD = 2;

	CreateDIVs(DSZ);
	SetDP();
};

//按钮_调峰
document.getElementById('btn_bf_tf').onclick = function() {
	document.getElementById('btn_bf_tf').classList.add('active');
	document.getElementById('btn_bf_rg').classList.remove('active');
	CurrBFD = 1;

	FilterBF();
	SetDP();
	CreateDIVs(DTF);

};

//按钮_二供
document.getElementById('btn_bf_rg').onclick = function() {
	document.getElementById('btn_bf_rg').classList.add('active');
	document.getElementById('btn_bf_tf').classList.remove('active');
	CurrBFD = 2;

	FilterBF();
	SetDP();
	CreateDIVs(DRG);

};

//根据条件显示泵房
function FilterBF() {

	scene.remove(BUILDING[21]);
	scene.remove(FBF);
	FBF = new THREE.Object3D;


	if(CurrBFD===1){ //调峰
		//alert(324);

		BUILDING[21].traverse( function ( child ) {
			if (child.name !== '') {
				var sn = child.name.split('_');
				child.material = mt_gop;

				if(bfsta[parseInt(sn[1])][1]){


					child.material = mt_highlightbf;


				}

				FBF.add(child.clone());

			}
		});

		scene.add(FBF);


	}else if(CurrBFD===2){ //二供

		BUILDING[21].traverse( function ( child ) {
			if (child.name !== '') {
				var sn = child.name.split('_');
				child.material = mt_gop;

				if(bfsta[parseInt(sn[1])][2]){
					child.material = mt_highlightbf;

				}

				FBF.add(child.clone());

			}
		});

		scene.add(FBF);
	}else if(CurrBFD===3){ //水压,流量,水质

		BUILDING[21].traverse( function ( child ) {
			if (child.name !== '') {
				var sn = child.name.split('_');

				if(parseInt(sn[1])===0||parseInt(sn[1])===1||parseInt(sn[1])===20){
					child.material = mt_highlightbf;
					FBF.add(child.clone());
				}

			}
		});

		scene.add(FBF);
	}

}

//点击BI按钮
document.getElementById('sb_bi').onclick = function() {
	window.location.href='jm.html';
};

//关闭摄像头面板
document.getElementById('btn_close').onclick = function() {
	dcwarp.style.display = 'none';
};

//清空DIV
function ClearDIVs() {
	for(var i=0; i<DIVS.length; i++){
		tipsbox.removeChild(DIVS[i]);
	}
	DIVS = [];
}

//创建系列DIV
function CreateDIVs(arr) {

	ClearDIVs();

	CurrLockTarget = arr;

	var div;

	if(arr===DYL){ //压力
		for(var i=0; i<Dinfo_YL.length; i++){
			div = document.createElement('div');
			div.setAttribute('class','yl');
			div.innerHTML = '<div class="c"><b>'+Dinfo_YL[i]+'</b>MPa</div>';
			tipsbox.appendChild(div);
			DIVS.push(div);
		}
	}else if(arr===DLL){ //流量
		for(i=0; i<Dinfo_LL.length; i++){
			div = document.createElement('div');
			div.setAttribute('class','ll');
			div.innerHTML = '<div class="t">'+ Dinfo_LL[i][0]+'</div><div class="c"><b>'+Dinfo_LL[i][1]+'</b>MPa</div>';
			tipsbox.appendChild(div);
			DIVS.push(div);
		}
	}else if(arr===DSZ){ //水质
		for(i=0; i<Dinfo_SZ.length; i++){
			div = document.createElement('div');
			div.setAttribute('class','sz');
			div.innerHTML = '<div class="t">'+ Dinfo_SZ[i][0]+'</div><div class="c p1">'+Dinfo_SZ[i][1]+'</div><div class="c p2">'+Dinfo_SZ[i][2]+'</div><div class="c p3">'+Dinfo_SZ[i][3]+'</div>';
			tipsbox.appendChild(div);
			DIVS.push(div);
		}
	}else if(arr===DTF){ //调峰

		var tfbf = [];
		for(i=0; i<bfsta.length; i++){
			if(bfsta[i][1]) {
				tfbf.push(bfsta[i]);
			}
		}

		DTF.traverse( function ( child ) {
			if (child.isMesh) {
				var sn = child.name.split('_');
				var id = parseInt(sn[1])-1;
				div = document.createElement('div');

				if(tfbf[id][0]===1){
					div.setAttribute('class','bf gz');
				}else if(tfbf[id][0]===2){
					div.setAttribute('class','bf lx');
				}else{
					div.setAttribute('class','bf');
				}

				div.style.zIndex = 99 - id;

				div.innerHTML = '<div class="c"><b>'+ tfbf[id][4] +'</b>m³</div>';

				tipsbox.appendChild(div);
				DIVS[id] = div;


			}
		});
	}else if(arr===DRG){ //二供

		tfbf = [];
		for(i=0; i<bfsta.length; i++){
			if(bfsta[i][2]) {
				tfbf.push(bfsta[i][3]);
			}
		}


		DRG.traverse( function ( child ) {
			if (child.isMesh) {
				var sn = child.name.split('_');
				var id = parseInt(sn[1])-1;
				div = document.createElement('div');

				if(id<3){
					div.setAttribute('class','sz');
					div.innerHTML = '<div class="t">'+ Dinfo_SZ[id][0]+'</div><div class="c p1">'+Dinfo_SZ[id][1]+'</div><div class="c p2">'+Dinfo_SZ[id][2]+'</div><div class="c p3">'+Dinfo_SZ[id][3]+'</div>';
				}else{
					div.setAttribute('class','yl');
					div.innerHTML = '<div class="c"><b>'+ tfbf[id-3] +'</b>MPa</div>';
				}
				tipsbox.appendChild(div);
				DIVS[id] = div;


			}
		});
	}else if(arr===VBox){ //首页

		VBox.traverse( function ( child ) {
			if (child.isMesh) {
				var sn = child.name.split('_');
				var id = parseInt(sn[1])-1;
				div = document.createElement('div');

				if(id > 8 && id <30){
					if(bfsta[id-9][0]===1){
						div.setAttribute('class','sb gz');
					}else if(bfsta[id-9][0]===2){
						div.setAttribute('class','sb lx');
					}else{
						div.setAttribute('class','sb');
					}


					div.style.zIndex = 88-id;
					div.innerHTML = '<img src="imgs/icon_'+bfsta[id-9][5]+'.png">';
				}else if(id <= 8 && id!==6 && id !== 7){
					div.setAttribute('class','bq');
					div.innerHTML = buname[id];
				}


				tipsbox.appendChild(div);
				DIVS[id] = div;

			}
		});

	}else if(arr===CurrBFC){ //泵房里的设备

		CurrBFC.traverse( function ( child ) {
			if (child.isMesh) {

				var sn = child.name.split('_');
				var id = parseInt(sn[1])-1;
				div = document.createElement('div');

				div.setAttribute('class','bq');
				div.innerHTML = BFDVname[CurrBF][id];

				tipsbox.appendChild(div);
				DIVS[id] = div;

			}
		});

	}


}



























