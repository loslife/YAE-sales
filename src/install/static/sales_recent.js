app.controller('SalesRecentCtrl', ['$rootScope', '$scope', '$http','$location', function ($rootScope, $scope, $http,$location) {

    function getRecentRecord(){
        var url = "/sales/install/getRecentRecord";
        $.get(url, function(data){
            if(data && data.result){
                var rs = [];
                data.result.forEach(function(item){
                    rs.push([item.days, item.count]);
                });
                drawRecentChart(rs);
            }
        });
    }

    function drawRecentChart(rs){
        $.jqplot ('recent_chart', [rs], {
            title: '一周详情',
            seriesDefaults: {
                pointLabels: {
                    show: true,//数据点标签
                    // edgeTolerance:1
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    tickOptions: {
                        //formatString: '%b&nbsp;%#d'
                    }
                },
                yaxis: {
                    tickOptions: {
                        // formatString: '$%.2f'
                    }
                }
            },
            highlighter: {
                show: true,
                sizeAdjust: 5,  // 当鼠标移动到数据点上时，数据点扩大的增量
                fadeTooltip: true,// 设置提示信息栏出现和消失的方式（是否淡入淡出）
                //lineWidthAdjust: 2.5,   //当鼠标移动到放大的数据点上时，设置增大的数据点的宽度
                tooltipOffset: 2,       // 提示信息栏据被高亮显示的数据点的偏移位置，以像素计
                //tooltipLocation: 'nw' // 提示信息显示位置（英文方向的首写字母）: n, ne, e, se, s, sw, w, nw.
            },
            cursor: {
                show: false,
                showTooltip: true,    // 是否显示提示信息栏
                followMouse: true,     //光标的提示信息栏是否随光标（鼠标）一起移动
                //tooltipLocation: 'se', // 光标提示信息栏的位置设置。如果followMouse=true,那么该位置为
                //提示信息栏相对于光标的位置。否则，为光标提示信息栏在图标中的位置
                // 该属性可选值： n, ne, e, se, etc.
                tooltipOffset: 6,     //提示信息栏距鼠标(followMouse=true)或坐标轴（followMouse=false）的位置
            }
        });
    }

    (function(){
        getRecentRecord();
    })();
}]);