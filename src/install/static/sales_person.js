app.controller('SalesPersonCtrl', ['$rootScope', '$scope', '$http','$location','$state', function ($rootScope, $scope, $http,$location,$state) {

    $scope.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

    $scope.initChannel = function(){
        var channelListUrl = "/sales/install/getAllChannelUnlimited";
        $http.get(channelListUrl).success(function (data){
            if (data.code != 0) {
                return alert("系统错误，请联系管理员");
            }
            $scope.channels = data.result;
            angular.forEach($scope.channels, function(channel){
                channel.color = $scope.colors[Math.floor((Math.random()*6))];
            });
            $scope.selectChannel($scope.channels[0]);
        });
    };

    $scope.initParent = function(){
        var parentUrl = "/sales/install/getAllParent";
        $http.get(parentUrl).success(function (data){
            if (data.code != 0) {
                return alert("系统错误，请联系管理员");
            }
            $scope.parents = data.result;
        });
    }

    $scope.selectChannel = function(channel){
        angular.forEach($scope.channels, function(channel) {
            channel.selected = false;
        });
        $scope.channel = channel;
        $scope.channel.selected = true;
        $scope.selectedChannel = channel;
        $scope.pagingOptions.currentPage = 1;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1
    };

    $scope.setPagingData = function(data){
        $scope.myData = data;
    };
    $scope.getPagedDataAsync = function (pageSize, currentPage) {
        setTimeout(function () {
            var url = '/sales/install/getPersonByChannelId?channel_id=' + $scope.selectedChannel.id + '&pageSize='+ pageSize +'&currentPage='+ currentPage;
            $http.get(url).success(function (data) {
                if(data.code != 0){
                    return alert("系统错误，请联系管理员");
                }
                $scope.setPagingData(data.result);
            });
            var url = "/sales/install/getCountPersonByChannelId?channel_id=" + $scope.selectedChannel.id;
            $http.get(url).success(function (data) {
                if(data.code != 0){
                    return alert("系统错误，请联系管理员");
                }
                $scope.totalServerItems = data.result.count;
            });
        }, 100);
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    var operation = '<span class="label bg-success" data-toggle="modal" data-target="#updata-person" ng-click="setUpdatePerson(row.entity)">编辑</span>' +
        ' <span class="label bg-danger" data-toggle="modal" data-target="#delete-person" ng-click="setDeletePerson(row.entity)">删除</span>' +
        ' <span class="label bg-info" ng-click="goRecordDetail(row.entity)">详细</span>' +
        ' <span class="label bg-info" ng-click="goRecentDetail(row.entity)">一周详情</span>' +
        ' <span class="label bg-danger" data-toggle="modal" data-target="#showUrl" ng-click="setPersonUrl(row.entity.install_code)">获取url</span>';

    $scope.columnDefs = [
        {field: 'name', displayName: '名称',width:'200px'},
        {field: 'parent', displayName: '上线',width:'200px'},
        {field: 'install_code', displayName: '推荐码',width:'120px'},
        {field: 'all', displayName: '装机数',width:'80px'},
        {field: 'app', displayName: 'app',width:'80px'},
        {field: 'weixin', displayName: '微站',width:'80px'},
        {field: '', displayName: '操作', width: '300px', cellTemplate: operation}
    ];
    $scope.gridOptions = {
        data: 'myData',
        columnDefs: $scope.columnDefs,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        rowHeight:50,
        multiSelect: false,
        i18n: 'zh_cn'
    };
    window.ngGrid.i18n['zh_cn'] = yilos_i18n.resource;

    $scope.setDeletePerson = function(data){
        $scope.person = data;
    };
    $scope.deletePerson = function(){
        var url = "/sales/install/deletePerson?id=" + $scope.person.id;
        $http.post(url).success(function (data) {
            if(data.code != 0){
                return alert("系统错误，请联系管理员");
            }
            $scope.myData = _.filter($scope.myData, function(item){
                return item.id != $scope.person.id;
            });
        });
    };

    $scope.addPerson = function(){
        //未填写名称提示
        if($scope.formData.name == undefined || $scope.formData.name == null) {
            return alert("请填写名称");
        }
        //未选择渠道提示
        if($scope.formData.channelId == undefined || $scope.formData.channelId == null) {
            return alert("请选择渠道");
        }
        var url = "/sales/install/addPerson";
        $http.post(url, $scope.formData).success(function (data) {
            if (data.code != 0) {
                return alert("系统错误，请联系管理员");
            }
            /*
            if ($scope.selectedChannel.id == data.result.channel_id) {
                $scope.myData.push(data.result);
            }
            */
            $("#add-person").modal('hide');
            $scope.formData = null;
            $scope.getPagedDataAsync();
            $scope.initParent();
        });
    };
    $scope.cancelSetAddPerson = function(){
        $scope.formData = null;
    };

    $scope.setUpdatePerson = function(data){
        $scope.formData = copyObject(data);
    };
    $scope.updatePerson = function(){
        var url = "/sales/install/updatePerson";
        $http.post(url, $scope.formData).success(function (data) {
            if(data.code != 0){
                return alert("系统错误，请联系管理员");
            }
            _.each($scope.myData, function(item){
                if(item.id == $scope.formData.id){
                    //若修改为其他渠道，删除其在当前渠道模型中的数据
                    if($scope.selectedChannel.id != $scope.formData.channel_id){
                        $scope.myData = dataFilter(item);
                        return;
                    }
                    for(var i in $scope.formData){
                        item[i] = $scope.formData[i];
                    }
                }
            });
            //$scope.formData = null;
            $("#update-person").modal('hide');
        });

        function dataFilter(item){
            var result = [];
            for(var i = 0; i < $scope.myData.length; i++){
                if($scope.myData[i].id != item.id){
                    result.push($scope.myData[i]);
                }
            }
            return result;
        }
    }

    $scope.goRecordDetail = function(data){
        $state.go('app.recordDetail', {
            id: data.id
        });
    }

    $scope.goRecentDetail = function(data){
        var chartData = [];
        var id = data.id;
        var url = "/sales/install/recentInstallRecord?id=" + id;
        $http.get(url).success(function (data) {
            if(data.result){
                var result = data.result;
                for(var i=0;i<result.length;i++){
                    var a = [result[i].days, result[i].count];
                    chartData.push(a);
                }
            }
            $state.go('app.recentDetail', {
                id: id,
                data: chartData
            });
        });
    }

    $scope.setPersonUrl = function(code){
        var loc = window.location;
        $scope.url = loc.protocol + "//" + loc.hostname + ":" + loc.port + "/framework/person.html?code=" + code;
    }

    $scope.setChannelUrl = function(){
        var id = $scope.selectedChannel.id;
        var loc = window.location;
        $scope.url = loc.protocol + "//" + loc.hostname + ":" + loc.port + "/framework/channel.html?id=" + id;
    }


    function copyObject(obj){
        var rs = {};
        for(var i in obj){
            rs[i] = obj[i];
        }
        return rs;
    }

    (function init(){
        $scope.initChannel();
        $scope.initParent();
        $scope.formData = {};
    })();

    $scope.$watch('formData.channelId', function(newVal, oldVal){
        if(newVal != oldVal){
            $scope.parents_list = [];
            _.each($scope.parents, function(item){
                if(item.channel_id == newVal){
                    $scope.parents_list.push(item);
                }
            });
            //$scope.parents_list.push({id: undefined,name: ""});
        }
    });
}]);
