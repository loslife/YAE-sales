// 百度地图API功能
var map = new BMap.Map("map");

var index = 0;
var getCount = 0;
var myGeo = new BMap.Geocoder();

//获取地址解析成百度地图上的点，再显示出来
var nailStoreAddress = [];
var nailStoreName = [];
var storeMessage = [];
var mapData;
var mapArea;

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
        getCount = mapData.regionPoints.length;
        var showCircle = "";
        for(var i = 0; i < getCount; i++){
            var str = (i + 1) +"." +mapArea + "区" + (i + 1) + "号战地<br/><br/>";
            showCircle += str;
        }

        document.getElementById("allList").innerHTML = showCircle;
        show(mapData.regionPoints);
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


