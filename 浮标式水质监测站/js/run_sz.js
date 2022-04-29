var IsSZPage = true

// 取得所有切换按钮
var swtbar = document.getElementById('zonelist').getElementsByTagName('li') 

var CurZone

for (i = 0; i < swtbar.length; i++) {
  ;(function (j) {
    swtbar[i].onclick = function () {
      if (CurZone) {
        scene.remove(CurZone)
      }

      scene.add(Zone[j])
      CurZone = Zone[j]

      CameraAni = new TWEEN.Tween(camera.position)
        .to({ x: XZ_Info[j][0], y: 30000, z: XZ_Info[j][1] + 40000 }, td_swb)
        .start()
      CtrlAni = new TWEEN.Tween(controls.target)
        .to({ x: XZ_Info[j][0], y: 0, z: XZ_Info[j][1] }, td_swb)
        .start()
        .onComplete(function () {})
    }
  })(i)
}
