// 百度地图API功能
var map = new BMap.Map("map");
map.centerAndZoom("深圳", 13);
map.enableScrollWheelZoom(true);
map.enableDragging();
var index = 0;
var showPoints = [];
var myGeo = new BMap.Geocoder();
var adds = [
     "深圳大学",
     "宝安区流塘新村流塘小学",
     "深圳宝体中心",
     "地王大厦",
     "海岸城",
     "宝安机场",
     "布吉",
     "南头",
     "中山公园",
     "深圳西站",
     "莲花山",
     "西丽",
     "南油",
     "欢乐谷",
     "世界之窗",
     "锦绣中华"
];
var shows = [];
var showsPointMessage = [];
function bdGEO(){
    var add = adds[index];
    geocodeSearch(add);
    index++;
}
function geocodeSearch(add){
    if(index < adds.length){
        setTimeout(window.bdGEO,50);
    }

    myGeo.getPoint(add, function(point){
        if (point) {
            var address = new BMap.Point(point.lng, point.lat);
            showsPointMessage.push([point.lng, point.lat, add]);
            showPoints.push();
            addMarker(address, add);
        }
    }, "深圳市");
}

// 编写自定义函数,创建标注
function addMarker(point,add){
    var marker = new BMap.Marker(point);
    marker.addEventListener("click", function(e){
         openInfo(add, e);
    });
    map.addOverlay(marker);
}

//显示的窗口大小
var opts = {
    width: 120,
    height: 20,
    title: "信息窗口",
    enableMessage: true
};

function openInfo(content,e){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow("地址：" + content,opts);  // 创建信息窗口对象
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	}

var overlays = [];
var overlaycomplete = function(e){
    overlays.push(e.overlay);
    showPoints.push(e.overlay.W);
};
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}

//实例化鼠标绘制工具
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: true, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});

//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);
function clearAll() {
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }

    overlays.length = 0
}

//显示线
function show() {
    if(!showPoints || showPoints.length <= 0){
        return ;
    }

    var point = [];
    for(var i = 0; i < showPoints.length; i++){
        var tempPoint = showPoints[i];
        if(tempPoint){
            for(var j = 0; j < tempPoint.length; j++){
                point[j] = new BMap.Point(tempPoint[j].lng, tempPoint[j].lat);
            }
            var polyline = new BMap.Polyline(point, {strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.8});
            map.addOverlay(polyline);
            point = [];
        }
    }
}

window.onload = bdGEO;

