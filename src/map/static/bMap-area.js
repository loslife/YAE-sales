// 百度地图API功能
var map = new BMap.Map("map");

var index = 0;
var saveCount = 0;
var getCount = 0;
var myGeo = new BMap.Geocoder();
var startDraw;
var stopDraw;
var clearDraw;
var backDraw;
var makeSure;

//获取地址解析成百度地图上的点，再显示出来
var nailStoreAddress = [];
var nailStoreName = [];
var storeMessage = [];
var mapData;
var mapArea;
var regionName = [];

function init(){
    mapData = JSON.parse(replaceSpecialChar(pageData));

    //创建控件
    var drawCtr = new drawController();
    map.addControl(drawCtr);

    storeMessage = mapData.store
    mapArea = mapData.area || "南京";

    if(storeMessage){
        for(var i = 0; i < storeMessage.length; i++){
            nailStoreAddress.push(storeMessage[i].address);
            nailStoreName.push(storeMessage[i].name);
        }
    }

    if(mapData.regionPoints){
        show(mapData.regionPoints);
    }

    if(mapData.regionName){
        regionName = mapData.regionName;
        getCount = mapData.regionName.length;
        var showCircle = "";
        for(var i = 0; i < getCount; i++){
            var str = (i + 1) +"." +mapArea + "区域" + regionName[i] + "战地<br/><br/>";
            showCircle += str;
        }

        document.getElementById("allList").innerHTML = showCircle;
    }

    var mapLevel = mapData.level || 13;

    map.centerAndZoom(mapArea, mapLevel);
    map.enableScrollWheelZoom(true);
    map.enableDragging();

    showNailStore();
}

function replaceSpecialChar(string) {
    return string.replace(/\n/g, "\\n").replace(/\n\r/g, "\\n\\r");
}

function showNailStore(){
    var addPoint = nailStoreAddress[index];
    var storeName = nailStoreName[index];
    geocodeSearch(addPoint, storeName);
    index++;
}

function geocodeSearch(addPoint, storeName){
    if(index < nailStoreAddress.length){
        setTimeout(window.showNailStore,50);
    }

    myGeo.getPoint(addPoint, function(point){
        if (point) {
            var address = new BMap.Point(point.lng, point.lat);
            addMarker(address, storeName, addPoint);
        }
    }, mapData.area);
}

// 编写自定义函数,创建标注
function addMarker(point, name, add){
    var marker = new BMap.Marker(point);
    marker.addEventListener("click", function(e){
        openInfo(add, name, e);
    });
    map.addOverlay(marker);
}

//自定义控件
function drawController() {
    //默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

//通过JavaScript的prototype属性继承于BMap.Control
drawController.prototype = new BMap.Control();

//创建DOM元素作为控件容器
drawController.prototype.initialize = function(map) {
    var div = document.createElement("div");
    startDraw = document.createElement("div");
    startDraw.appendChild(document.createTextNode("划分"));
    stopDraw = document.createElement("div");
    stopDraw.appendChild(document.createTextNode("结束"));
    clearDraw = document.createElement("div");
    clearDraw.appendChild(document.createTextNode("清除"));
    backDraw = document.createElement("div");
    backDraw.appendChild(document.createTextNode("后退"));
    makeSure = document.createElement("div");
    makeSure.appendChild(document.createTextNode("确定"));

    div.style.height = "30px";
    div.style.width = "414px";
    div.style.cursor = "pointer";
    div.style.border = "2px solid #83B447";
    div.style.backgroundColor = "#83B447";
    div.style.borderRadius = "4px";

    startDraw.style.backgroundColor = "#FFF9DD";
    startDraw.style.height = "30px";
    startDraw.style.width = "81px";
    startDraw.style.borderBottomLeftRadius = "3px";
    startDraw.style.borderTopLeftRadius = "3px";
    startDraw.style.marginLeft = "0px";
    startDraw.style.marginTop = "0px";
    startDraw.style.marginBottom = "0px";
    startDraw.style.color = "#5B4B3A";
    startDraw.style.textAlign = "center";
    startDraw.style.lineHeight = "30px";

    stopDraw.style.backgroundColor = "#FFF9DD";
    stopDraw.style.height = "30px";
    stopDraw.style.width = "81px";
    stopDraw.style.marginLeft = "83px";
    stopDraw.style.marginTop = "-30px";
    stopDraw.style.marginBottom = "-30px";
    stopDraw.style.color = "#5B4B3A";
    stopDraw.style.textAlign = "center";
    stopDraw.style.lineHeight = "30px";

    clearDraw.style.backgroundColor = "#FFF9DD";
    clearDraw.style.height = "30px";
    clearDraw.style.width = "81px";
    clearDraw.style.marginLeft = "166px";
    clearDraw.style.marginTop = "-30px";
    clearDraw.style.marginBottom = "-30px";
    clearDraw.style.color = "#5B4B3A";
    clearDraw.style.textAlign = "center";
    clearDraw.style.lineHeight = "30px";

    backDraw.style.backgroundColor = "#FFF9DD";
    backDraw.style.height = "30px";
    backDraw.style.width = "81px";
    backDraw.style.marginLeft = "249px";
    backDraw.style.marginTop = "-30px";
    backDraw.style.marginBottom = "-30px";
    backDraw.style.color = "#5B4B3A";
    backDraw.style.textAlign = "center";
    backDraw.style.lineHeight = "30px";

    makeSure.style.backgroundColor = "#FFF9DD";
    makeSure.style.height = "30px";
    makeSure.style.width = "82px";
    makeSure.style.borderBottomRightRadius = "3px";
    makeSure.style.borderTopRightRadius = "3px";
    makeSure.style.marginLeft = "332px";
    makeSure.style.marginTop = "-30px";
    makeSure.style.marginBottom = "-30px";
    makeSure.style.color = "#5B4B3A";
    makeSure.style.textAlign = "center";
    makeSure.style.lineHeight = "30px";

    div.appendChild(startDraw);
    div.appendChild(stopDraw);
    div.appendChild(clearDraw);
    div.appendChild(backDraw);
    div.appendChild(makeSure);

    //绑定事件
    startDraw.onclick = function () {
        startDrawStyle();
        openDraw();
    }

    stopDraw.onclick = function () {
        stopDrawStyle();
        closeDraw();
    }

    clearDraw.onclick = function () {
        clearDrawStyle();
        clearAll();
    }

    backDraw.onclick = function () {
        backDrawStyle();
        backStep();
    }

    makeSure.onclick = function () {
        makeSureStyle();
        makeSureDraw();
    }

    //添加DOM元素到地图中
    map.getContainer().appendChild(div);
    return div;
}

function startDrawStyle() {
    startDraw.style.backgroundColor = "#83B447";
    startDraw.style.color = "white";
    stopDraw.style.backgroundColor = "#FFF9DD";
    stopDraw.style.color = "#5B4B3A";
    clearDraw.style.backgroundColor = "#FFF9DD";
    clearDraw.style.color = "#5B4B3A";
    backDraw.style.backgroundColor = "#FFF9DD";
    backDraw.style.color = "#5B4B3A";
    makeSure.style.backgroundColor = "#FFF9DD";
    makeSure.style.color = "#5B4B3A";
}

function stopDrawStyle() {
    stopDraw.style.backgroundColor = "#83B447";
    stopDraw.style.color = "white";
    startDraw.style.backgroundColor = "#FFF9DD";
    startDraw.style.color = "#5B4B3A";
    clearDraw.style.backgroundColor = "#FFF9DD";
    clearDraw.style.color = "#5B4B3A";
    backDraw.style.backgroundColor = "#FFF9DD";
    backDraw.style.color = "#5B4B3A";
    makeSure.style.backgroundColor = "#FFF9DD";
    makeSure.style.color = "#5B4B3A";
}

function clearDrawStyle() {
    clearDraw.style.backgroundColor = "#83B447";
    clearDraw.style.color = "white";
    startDraw.style.backgroundColor = "#FFF9DD";
    startDraw.style.color = "#5B4B3A";
    stopDraw.style.backgroundColor = "#FFF9DD";
    stopDraw.style.color = "#5B4B3A";
    backDraw.style.backgroundColor = "#FFF9DD";
    backDraw.style.color = "#5B4B3A";
    makeSure.style.backgroundColor = "#FFF9DD";
    makeSure.style.color = "#5B4B3A";
}

function backDrawStyle() {
    backDraw.style.backgroundColor = "#83B447";
    backDraw.style.color = "white";
    startDraw.style.backgroundColor = "#FFF9DD";
    startDraw.style.color = "#5B4B3A";
    stopDraw.style.backgroundColor = "#FFF9DD";
    stopDraw.style.color = "#5B4B3A";
    clearDraw.style.backgroundColor = "#FFF9DD";
    clearDraw.style.color = "#5B4B3A";
    makeSure.style.backgroundColor = "#FFF9DD";
    makeSure.style.color = "#5B4B3A";
}

function makeSureStyle() {
    makeSure.style.backgroundColor = "#83B447";
    makeSure.style.color = "white";
    backDraw.style.backgroundColor = "#FFF9DD";
    backDraw.style.color = "#5B4B3A";
    startDraw.style.backgroundColor = "#FFF9DD";
    startDraw.style.color = "#5B4B3A";
    stopDraw.style.backgroundColor = "#FFF9DD";
    stopDraw.style.color = "#5B4B3A";
    clearDraw.style.backgroundColor = "#FFF9DD";
    clearDraw.style.color = "#5B4B3A";
}

function makeSureDraw() {
    closeDraw();
    var exitPoints = saveCount;
    saveCount = overlays.length;

    var areaPoints = [];
    var showCircle = "";
    for(var i = 0; i < saveCount + getCount; i++){
        var str = (i + 1) +"." +mapArea + "区域" + regionName[i] + "战地<br/><br/>";
        showCircle += str;
    }

    document.getElementById("allList").innerHTML = showCircle;

    if(exitPoints === saveCount){
        return ;
    }

    var postRegionName = [];
    for(var i = exitPoints; i < saveCount; i++){
        areaPoints.push(overlays[i].W);
        postRegionName.push(regionName[getCount + i]);
    }

    $.post('/sales/map/postPins',
        {
            areaPoints: areaPoints,
            nickName: postRegionName
        },function(data,status){
            console.log(data);
        });
}

//信息显示的窗口大小
var opts = {
    width: 120,
    height: 60,
    title: "信息窗口",
    panel: "panel",
    enableAutoPan: true,   //自动平移
    searchTypes: [
    ]
};

//信息显示窗口
function openInfo(content, name, e){
    opts.title = name;
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoMarker = new BMap.Marker(point);
    var infoWindow = new BMapLib.SearchInfoWindow (map, "地址：" + content, opts);  // 创建信息窗口对象
    infoWindow.open(infoMarker); //开启信息窗口
}

//绘画完成后调用
var overlays = [];

var overlaycomplete = function(e){
    overlays.push(e.overlay);
    stopDrawStyle();
    setAreaName();
};

//输入圈名
function setAreaName() {
    var name = prompt("请输入划分区域的别称：", "");
    if(!name){
        name = overlays.length + getCount;
    }
    regionName.push(name);
}

var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2,       //边线的宽度，以像素为单位。
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
        offset: new BMap.Size(5, 5) //偏离值
    },
    polylineOptions: styleOptions //线的样式
});

//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);
drawingManager.close();

//打开鼠标绘画模式
function openDraw() {
    drawingManager.open();
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
}

//关闭鼠标绘画模式
function closeDraw() {
    drawingManager.close();
}

//清除所有
function clearAll() {
    for(var i = saveCount; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
        regionName.pop();
    }

    overlays.length = saveCount
    closeDraw();
}

//退回上一步
function backStep() {
    if(overlays.length <= 0 || overlays.length == saveCount) {
        closeDraw();
        return ;
    }

    map.removeOverlay(overlays[overlays.length - 1]);
    regionName.pop();
    overlays.length--;
}

//显示线
function show(showPoints) {
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
            var polyline = new BMap.Polyline(point, {strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.8});
            map.addOverlay(polyline);
            point = [];
        }
    }
}

window.onload = init;


