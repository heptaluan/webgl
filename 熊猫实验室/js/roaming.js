var CameraAni, CtrlAni;

var IsKeydown = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var IsFlyView = false;
var IsPersonView = false;
var IsShowPP = false;
var IsDrawingPath = false;
var IsWalkingPath = false;
var IsPauseRoam = false;
var IsSelectingStart = false;
var IsCalcMP = false;


var MYType = 0; //0没漫游 1步行 2飞行
var CreatePathType = 1; //1步行 2飞行
var MYY_M = 1500;
var MYY_C = 1500;
var PathPointIndex = 0;
var PathInfo = [];
var AllPath = [];
var MYIndex = 1;
var PathPoints = [];
var PathLines = [];
var CursorX, CursorY;
var PTitle = '';
var CurrMYtype;
var CurrMYLG = 0;
var TotalMYLG = 0;
var PrevX, PrevZ;
var MYSpeed = [3,6,10,15,20];
var CurrSpeedIndex = 2;
var CurrPlayPath = null;

var PLbox = document.getElementsByClassName('pp').item(0).getElementsByClassName('pl').item(0);
var PBar = document.getElementsByClassName('pbar').item(0);

document.getElementById('btnup').onmousedown = function() {	IsKeydown = true;	moveForward = true };
document.getElementById('btnup').onmouseup = function() {	IsKeydown = false; moveForward = false };
document.getElementById('btndown').onmousedown = function() {	IsKeydown = true;	moveBackward = true };
document.getElementById('btndown').onmouseup = function() {	IsKeydown = false; moveBackward = false };
document.getElementById('btnleft').onmousedown = function() { IsKeydown = true;	moveLeft = true };
document.getElementById('btnleft').onmouseup = function() {	IsKeydown = false; moveLeft = false };
document.getElementById('btnright').onmousedown = function() { IsKeydown = true;	moveRight = true };
document.getElementById('btnright').onmouseup = function() { IsKeydown = false; moveRight = false };

//刷新帧移动
function Moving(){
    if( IsPersonView || IsFlyView ){
        var xd = ( controls.target.x - camera.position.x )*movespeed_f;
        var zd = ( controls.target.z - camera.position.z )*movespeed_f;
        var xp = ( camera.position.z - controls.target.z )*movespeed_s;
        var zp = ( controls.target.x - camera.position.x )*movespeed_s;
        if ( moveForward ){
            camera.position.x += xd;
            controls.target.x += xd;
            camera.position.z += zd;
            controls.target.z += zd;
        } else if( moveBackward ){
            camera.position.x -= xd;
            controls.target.x -= xd;
            camera.position.z -= zd;
            controls.target.z -= zd;
        } else if( moveLeft ){
            camera.position.x -= xp;
            controls.target.x -= xp;
            camera.position.z -= zp;
            controls.target.z -= zp;
        } else if ( moveRight ){
            camera.position.x += xp;
            controls.target.x += xp;
            camera.position.z += zp;
            controls.target.z += zp;
        }
    }else if(IsCalcMP){



        var cx = controls.target.x;
        var cz = controls.target.z;
        var lg = Math.sqrt(Math.pow( cx - PrevX, 2) + Math.pow( cz - PrevZ, 2));

        CurrMYLG += lg;

       // console.log(  );

        PBar.value = Math.ceil(CurrMYLG / TotalMYLG * 100);

        PrevX = cx;
        PrevZ = cz;
    }


}

//按钮_显示自定义漫游面板
document.getElementById('btn_drawpath').onclick = function() {

    dcwarp.style.display = 'none';

    IsShowPP = true;

    document.getElementById('sbtn').style.display = 'none';
    document.getElementsByClassName('topinfo').item(0).style.display = 'none';
    document.getElementsByClassName('toolbox').item(0).style.display = 'none';
    document.getElementsByClassName('pp').item(0).style.display ='block';

    var PLS = PLbox.getElementsByTagName('li');
    for(var i=0; i<PLS.length; i++){
        PLS[i].classList.remove('active');
    }

    document.getElementById('pbtn_start').classList.add('disable');
};

//按钮_关闭自定义漫游面板
document.getElementsByClassName('pp').item(0).getElementsByClassName('dpbtn').item(0).getElementsByTagName('span').item(0).onclick = function() {
    IsShowPP = false;

    document.getElementById('sbtn').style.display = 'block';
    document.getElementsByClassName('topinfo').item(0).style.display = 'block';
    document.getElementsByClassName('toolbox').item(0).style.display = 'block';
    document.getElementsByClassName('pp').item(0).style.display ='none';
    ClearPathPL();
};

//按钮_飞行漫游
document.getElementById('btn_flyview').onclick = function() {

    dcwarp.style.display = 'none';

    if( !IsFlyView ){

        IsSelectingStart = true;

        document.getElementById('sbtn').style.display = 'none';
        document.getElementsByClassName('topinfo').item(0).style.display = 'none';
        document.getElementsByClassName('toolbox').item(0).style.display = 'none';

        document.getElementsByClassName('ptip').item(0).style.display ='block';
        document.getElementsByClassName('ptip').item(0).innerHTML = '请在场景中点击，以选择漫游开始位置。';



        MYType = 2;

    }else{
        ResetViewFromPV();
    }
};

//按钮_步行漫游
document.getElementById('btn_personview').onclick = function() {

    dcwarp.style.display = 'none';

    if( !IsPersonView ){

        IsSelectingStart = true;

        document.getElementById('sbtn').style.display = 'none';
        document.getElementsByClassName('topinfo').item(0).style.display = 'none';
        document.getElementsByClassName('toolbox').item(0).style.display = 'none';

        document.getElementsByClassName('ptip').item(0).style.display ='block';
        document.getElementsByClassName('ptip').item(0).innerHTML = '请在场景中点击，以选择漫游开始位置。';


        MYType = 1;

    }else{
        ResetViewFromPV();
    }
};

function ToFlyView(pos) {
    movespeed_f = 5;
    movespeed_s = 3;

    IsFlyView = true;
    IsPersonView =false;
    document.getElementById('btn_drawpath').style.display = 'none';
    document.getElementsByClassName('topinfo').item(0).style.display = 'none';
    document.getElementById('btn_flyview').style.display = 'none';
    document.getElementById('btn_personview').style.display = 'none';
    document.getElementById('sbtn').style.display = 'none';

    new TWEEN.Tween( camera.position ).to( { x: pos.x,	y:55060, z: pos.z-60}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start();
    new TWEEN.Tween( controls.target ).to( { x: pos.x,	y:55000, z: pos.z}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start().onComplete(function() {
        controls.minDistance = 1;
        controls.maxPolarAngle = Math.PI * 0.6;
        controls.minPolarAngle = 0;
        controls.enableZoom = false;
        document.getElementById('movebtn').style.display = 'block';
    });

    ClearDIVs();
    scene.remove(GridGround);

    CurrIc = null;

}

function ToPersonView(pos){
    movespeed_f = 3;
    movespeed_s = 1;

    IsFlyView = false;
    IsPersonView = true;
    document.getElementById('btn_drawpath').style.display = 'none';
    document.getElementsByClassName('topinfo').item(0).style.display = 'none';
    document.getElementById('btn_flyview').style.display = 'none';
    document.getElementById('btn_personview').style.display = 'none';
    document.getElementById('sbtn').style.display = 'none';

    new TWEEN.Tween( camera.position ).to( { x: pos.x,	y:1500, z: pos.z-60}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start();
    new TWEEN.Tween( controls.target ).to( { x: pos.x,	y:1500, z: pos.z}, anitime ).easing( TWEEN.Easing.Quadratic.Out).start().onComplete(function() {
        controls.minDistance = 1;
        controls.maxPolarAngle = Math.PI * 0.6;
        controls.minPolarAngle = Math.PI * 0.45;
        controls.enableZoom = false;
        document.getElementById('movebtn').style.display = 'block';
    });

    ClearDIVs();
    scene.remove(GridGround);

    CurrIc=VBox;

}

//鼠标按下创建路径点
function MakeRoamPoint() {

    if(IsDrawingPath){
        CursorX = event.clientX;
        CursorY = event.clientY;

        diffTapAndDbTap(funcTap, funcDoubleTap);
    }

    if(IsSelectingStart){
        CursorX = event.clientX;
        CursorY = event.clientY;

        var left = container.getBoundingClientRect().left;
        var top = container.getBoundingClientRect().top;
        var clientX = CursorX - left;
        var clientY = CursorY - top;
        var mouse = new THREE.Vector2();
        mouse.x = (clientX / container.offsetWidth) * 2 - 1;
        mouse.y = -(clientY / container.offsetHeight) * 2 + 1;
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(PosPlane.children, true);
        if(MYType===2){
            document.getElementsByClassName('ptip').item(0).innerHTML = '正在<b>飞行</b>漫游中，点击右上角复位按钮或按ESC键退出。';
            ToFlyView(intersects[0].point);
        }else if(MYType===1){
            document.getElementsByClassName('ptip').item(0).innerHTML = '正在<b>步行</b>漫游中，点击右上角复位按钮或按ESC键退出。';
            ToPersonView(intersects[0].point);
        }

        IsSelectingStart = false;

        document.getElementsByClassName('toolbox').item(0).style.display = 'block';

    }

}

//生成路径点标签和连接线
function CreatePathPoint(pos) {

    var tc = PathPointIndex+1;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.width = 90;
    canvas.height = 90;

    context.font = 'Bold 60px Arial';
    context.fillStyle = "rgba(255,0,0,1)";
    context.strokeStyle = "rgba(255,255,255,1)";
    context.lineWidth = 4;
    var metrics = context.measureText(tc);
    var textWidth = metrics.width;

    context.beginPath();
    context.arc(48,48,40,0,2*Math.PI);
    context.fillStyle="red";
    context.fill();
    context.stroke();

    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(tc, (90-textWidth)/2, 68);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({map: texture, depthTest: false});
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 1;

    sprite.scale.set(5000, 5000, 5000);
    sprite.position.set(pos.x, pos.y, pos.z);

    PathPoints.push(sprite);
    scene.add(sprite);

    if(PathPointIndex>0){

        var PAX = PathInfo[PathPointIndex-1].x;
        var PAY = -PathInfo[PathPointIndex-1].z;
        var PBX = pos.x;
        var PBY = -pos.z;
        var XJ = Math.atan2((PBY-PAY), (PBX-PAX));
        var DX = 400*Math.sin(XJ)/2;
        var DY = 400*Math.cos(XJ)/2;

        var PLPts = [];
        PLPts.push( new THREE.Vector2( PAX-DX, PAY+DY ) );
        PLPts.push( new THREE.Vector2( PBX-DX, PBY+DY ) );
        PLPts.push( new THREE.Vector2( PBX+DX, PBY-DY ) );
        PLPts.push( new THREE.Vector2( PAX+DX, PAY-DY ) );
        PLPts.push( new THREE.Vector2( PAX-DX, PAY+DY ) );
        var PLShape = new THREE.Shape( PLPts );
        var PLgeometry = new THREE.ShapeBufferGeometry( PLShape );

        var PL = new THREE.Mesh( PLgeometry, mt_PL);

        PL.rotation.x = -Math.PI/2;
        PL.position.y = 0;

        PathLines.push(PL);
        scene.add(PL);

    }


    PathInfo.push(pos);

    PathPointIndex++;

}

//按钮_创建步行或飞行切换
document.getElementsByClassName('ty').item(0).getElementsByTagName('span').item(0).onclick = function(){
    CreatePathType = 1;
    document.getElementsByClassName('ty').item(0).getElementsByTagName('span').item(0).classList.add('active');
    document.getElementsByClassName('ty').item(0).getElementsByTagName('span').item(1).classList.remove('active');
};
document.getElementsByClassName('ty').item(0).getElementsByTagName('span').item(1).onclick = function(){
    CreatePathType = 2;
    document.getElementsByClassName('ty').item(0).getElementsByTagName('span').item(0).classList.remove('active');
    document.getElementsByClassName('ty').item(0).getElementsByTagName('span').item(1).classList.add('active');
};

//按钮_开始绘制漫游路径
document.getElementsByClassName('ts').item(0).onclick = function(){
    if( !IsDrawingPath ){

        var li = PLbox.getElementsByTagName('li');
        for(var i=0; i<li.length; i++){
            li[i].classList.remove('active');
        }


        document.getElementsByClassName('pp').item(0).style.display = 'none';
        document.getElementsByClassName('ptip').item(0).style.display = 'block';

        if(CreatePathType===1){
            document.getElementsByClassName('ptip').item(0).innerHTML = '正在创建<b>步行</b>漫游路径，点击左键添加节点，双击左键结束。';
        }else if(CreatePathType===2){
            document.getElementsByClassName('ptip').item(0).innerHTML = '正在创建<b>飞行</b>漫游路径，点击左键添加节点，双击左键结束。';
        }


        //CurrIc = null;

        IsDrawingPath = true;

        ClearPathPL();
        PathPointIndex = 0;
        PathInfo = [];

    }

};

//漫游动画
function PlayPath(){
    MoveToMYP(PathInfo[MYIndex-1].x, PathInfo[MYIndex-1].z);
}

//执行移动命令
function MoveToMYP(cx,cz){
    var PAX = cx;
    var PAZ = cz;
    var PBX = PathInfo[MYIndex].x;
    var PBZ = PathInfo[MYIndex].z;
    var XJ = Math.atan2((PBZ-PAZ), (PBX-PAX));

    var atime = parseInt(Math.sqrt(Math.pow(Math.abs(PBX - PAX),2)+Math.pow(Math.abs(PBZ - PAZ),2))/MYSpeed[CurrSpeedIndex]);

    CameraAni = new TWEEN.Tween( camera.position ).to( { x:PBX-80*Math.cos(XJ), y:MYY_M, z:PBZ-80*Math.sin(XJ) }, atime ).start();
    CtrlAni = new TWEEN.Tween( controls.target ).to( { x:PBX, y:MYY_C, z:PBZ }, atime ).start().onComplete(function() {

        MYIndex++;

        if(MYIndex<PathInfo.length){

            var PAX = PathInfo[MYIndex-1].x;
            var PAZ = PathInfo[MYIndex-1].z;
            var PBX = PathInfo[MYIndex].x;
            var PBZ = PathInfo[MYIndex].z;
            var XJ = Math.atan2((PBZ-PAZ), (PBX-PAX));

            CameraAni = new TWEEN.Tween( camera.position ).to( { x:PAX-80*Math.cos(XJ), y:MYY_M, z:PAZ-80*Math.sin(XJ) }, 500 ).start().onComplete(function() {
                PlayPath();
            });

        }else{
            ResetViewFromPV();
        }

    });
}


//从漫游视角恢复
function ResetViewFromPV(){

    dcwarp.style.display = 'none';

    if(IsFlyView || IsPersonView){
        IsFlyView = false;
        IsPersonView = false;

        document.getElementById('btn_drawpath').style.display = 'inline-block';
        document.getElementById('btn_flyview').style.display = 'inline-block';
        document.getElementById('btn_personview').style.display = 'inline-block';
        document.getElementById('btn_flyview').classList.remove('active');
        document.getElementById('btn_personview').classList.remove('active');
        document.getElementById('sbtn').style.display = 'block';
        document.getElementById('movebtn').style.display = 'none';
        document.getElementsByClassName('ptip').item(0).style.display ='none';
        document.getElementsByClassName('topinfo').item(0).style.display = 'block';

    }else if(IsWalkingPath){
        IsWalkingPath = false;
        IsCalcMP = false;

        IsPauseRoam = false;
        document.getElementById('pbtn_pause').innerHTML = '暂停';

        document.getElementById('pbtn_start').classList.remove('disable');
        document.getElementById('pbtn_pause').classList.add('disable');
        document.getElementById('pbtn_stop').classList.add('disable');


        for(var i=0; i<PathPoints.length; i++){
            PathPoints[i].scale.set(5000, 5000, 5000);
        }

        PBar.value = 1;

    }




    controls.maxDistance = 700000;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = 0;
    controls.enableZoom = true;
    controls.enablePan = true;


    CurrIc=VBox;

    DestoryBF();
    scene.remove(FBF);
    scene.add(BUILDING[21]);
    scene.remove(PBF);
    scene.add(BUILDING[32]);

    CreateDIVs(VBox);

    IsZoomedToBF = false;

    scene.add(GridGround);

    //alert(234);

    MoveCamera(camerapi[0],camerapi[1],camerapi[2],contrlpi[0],contrlpi[1],contrlpi[2]);


}

//清理路径点和线
function ClearPathPL(){
    MYIndex=1;
    for(var i=0; i<PathPoints.length; i++){
        scene.remove(PathPoints[i]);
    }
    PathPoints = [];
    for(i=0; i<PathLines.length; i++){
        scene.remove(PathLines[i]);
    }
    PathLines = [];
}

function onKeyDown ( event ) {
    IsKeydown = true;
    if(IsPersonView || IsFlyView){
        switch ( event.keyCode ) {
            case 38:
            case 87:
                moveForward = true;
                break;
            case 37:
            case 65:
                moveLeft = true;
                break;
            case 40:
            case 83:
                moveBackward = true;
                break;
            case 39:
            case 68:
                moveRight = true;
                break;
            case 27:
                break;
        }
    }
}

function onKeyUp ( event ) {
    IsKeydown = false;
    if(IsPersonView || IsFlyView){
        switch( event.keyCode ) {
            case 38:
            case 87:
                moveForward = false;
                break;
            case 37:
            case 65:
                moveLeft = false;
                break;
            case 40:
            case 83:
                moveBackward = false;
                break;
            case 39:
            case 68:
                moveRight = false;
                break;
            case 27:
                ResetViewFromPV();
                break;
        }
    }
}

//单击创建路径点
var funcTap = function() {

    var left = container.getBoundingClientRect().left;
    var top = container.getBoundingClientRect().top;
    var clientX = CursorX - left;
    var clientY = CursorY - top;
    var mouse = new THREE.Vector2();
    mouse.x = (clientX / container.offsetWidth) * 2 - 1;
    mouse.y = -(clientY / container.offsetHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(PosPlane.children, true);
    if (intersects.length >= 1) {
        if (PathPointIndex < 99) {
            CreatePathPoint(intersects[0].point);
        } else {
            alert('已达最大路径点数量');
        }

    }

};

//双击结束
var funcDoubleTap = function() {

    if(PathPointIndex>1){
        PTitle = prompt("请输入路径名称");

        if(PTitle===''){
            PTitle = '未命名'+AllPath.length;
        }

        var li = document.createElement('li');
        if(CreatePathType===1){
            li.innerHTML = '<svg role=\'img\'><use xlink:href=\'imgs/vimg.svg#personview\'></use></svg>'+PTitle+'<div><svg role=\'img\'><use xlink:href=\'imgs/vimg.svg#delete\'></use></svg></div>';
        }else if(CreatePathType===2){
            li.innerHTML = '<svg role=\'img\'><use xlink:href=\'imgs/vimg.svg#flyview\'></use></svg>'+PTitle+'<div><svg role=\'img\'><use xlink:href=\'imgs/vimg.svg#delete\'></use></svg></div>';
        }
        li.setAttribute('class','active');
        PLbox.appendChild(li);

        li.addEventListener('click',function(e){
            SelectPL(e);
        });

        li.getElementsByTagName('div').item(0).addEventListener('click',function(e){
            DeletePL(e);
        });

        document.getElementsByClassName('pp').item(0).style.display = 'block';
        document.getElementsByClassName('ptip').item(0).style.display = 'none';
        IsDrawingPath = false;

        var UP =[];
        UP[0] = CreatePathType;
        UP[1] = PathInfo;

        AllPath.push(UP);

        CurrPlayPath = PathInfo;

        PathPointIndex = 0;

        CurrMYtype = CreatePathType;

        document.getElementById('pbtn_start').classList.remove('disable');

    }else{
        alert('请至少创建两个点');
    }

};

//单双击判断
var diffTapAndDbTap = (function() {
    var firstTap = 0;
    var tapLock = 0;
    var exeDbTap = 0;
    return function(funcTap, funcDoubleTap) {
        if(1 === exeDbTap) {
            firstTap = 0;
            tapLock = 0;
            exeDbTap = 0;
        }

        if(firstTap === 0) {
            firstTap = 1;
            setTimeout(function() {
                if(tapLock === 0) {
                    funcTap();
                }
                firstTap = 0;
            }, 200);
            return;
        }

        if(firstTap === 1) {
            tapLock = 1;
            funcDoubleTap();
            exeDbTap = 1;
        }
    }
})();

//选择路径列表条目
function SelectPL(e) {
    var CPL = e.target;
    var PLS = PLbox.getElementsByTagName('li');
    var id;
    for(var i=0; i<PLS.length; i++){
        PLS[i].classList.remove('active');
        if(CPL === PLS[i]){
            id=i;
        }
    }

    ClearPathPL();
    PathPointIndex = 0;
    PathInfo = [];

    PLS[id].classList.add('active');

    CurrPlayPath = AllPath[id][1];

    CurrMYtype = AllPath[id][0];

    for(i=0; i<AllPath[id][1].length; i++){
        CreatePathPoint(AllPath[id][1][i]);
    }

    document.getElementById('pbtn_start').classList.remove('disable');

}

//删除路径条目
function DeletePL(e) {
    e.cancelBubble = true;
    var CPL = e.target.parentNode;
    var PLS = PLbox.getElementsByTagName('li');
    var id;
    for(var i=0; i<PLS.length; i++){
        if(CPL === PLS[i]){
            PLbox.removeChild(PLS[i]);
            id=i;
        }
    }

    AllPath.splice(id,1);

    ClearPathPL();
    PathPointIndex = 0;
    PathInfo = [];
    document.getElementById('pbtn_start').classList.add('disable');

}


//按钮——播放选中路径
document.getElementById('pbtn_start').onclick = function() {

    this.classList.add('disable');
    document.getElementById('pbtn_pause').classList.remove('disable');
    document.getElementById('pbtn_stop').classList.remove('disable');

    IsWalkingPath = true;

    for(var i=0; i<PathInfo.length-1; i++){
        TotalMYLG += Math.sqrt(Math.pow( PathInfo[i+1].x - PathInfo[i].x, 2) + Math.pow( PathInfo[i+1].z - PathInfo[i].z, 2));
    }


    for(i=0; i<PathPoints.length; i++){
        PathPoints[i].scale.set(1000, 1000, 1000);
    }

    var PAX = PathInfo[0].x;
    var PAZ = PathInfo[0].z;
    var PBX = PathInfo[1].x;
    var PBZ = PathInfo[1].z;
    var XJ = Math.atan2((PBZ-PAZ), (PBX-PAX));

    PrevX = PAX;
    PrevZ = PAZ;

    ClearDIVs();

    if(CurrMYtype===1){
        MYY_M = 1500;
        MYY_C = 1500;
    }else if(CurrMYtype===2){
        MYY_M = 55060;
        MYY_C = 54900;
    }

    new TWEEN.Tween( camera.position ).to( { x: PAX-80*Math.cos(XJ), y:MYY_M, z:PAZ-80*Math.sin(XJ) }, anitime ).easing( TWEEN.Easing.Quadratic.Out).start();
    new TWEEN.Tween( controls.target ).to( { x: PAX, y:MYY_C, z:PAZ }, anitime ).easing( TWEEN.Easing.Quadratic.Out).start().onComplete(function() {
        controls.minDistance = 1;
        controls.maxPolarAngle = Math.PI * 0.6;

        if(CurrMYtype===1){
            controls.minPolarAngle = Math.PI * 0.45;
        }else if(CurrMYtype===2){
            controls.minPolarAngle = 0;
        }


        controls.enableZoom = false;
        controls.enablePan = false;

        IsCalcMP = true;



        PlayPath();
    });

};


//按钮——暂停播放
document.getElementById('pbtn_pause').onclick = function() {

    if(IsPauseRoam){
        CameraAni.start();
        CtrlAni.start();
        IsPauseRoam = false;
        this.innerHTML = '暂停';
    }else{
        CameraAni.stop();
        CtrlAni.stop();
        IsPauseRoam = true;
        this.innerHTML = '继续';
    }

};


//按钮——停止播放
document.getElementById('pbtn_stop').onclick = function() {

    CameraAni.stop();
    CtrlAni.stop();

    ResetViewFromPV();

    document.getElementById('pbtn_start').classList.remove('disable');
    document.getElementById('pbtn_pause').classList.add('disable');
    document.getElementById('pbtn_stop').classList.add('disable');
};


document.getElementsByClassName('pp').item(0).getElementsByTagName('select').item(0).onchange = function() {
    CurrSpeedIndex = this.value;

    if(IsWalkingPath){
        CameraAni.stop();
        CtrlAni.stop();
        MoveToMYP(controls.target.x, controls.target.z);

    }
};



























