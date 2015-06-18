app.controller('SalesChannelCtrl', ['$rootScope', '$scope', '$http','$location', function ($rootScope, $scope, $http,$location) {

    setTimeout(init,10);
    function init(){
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    }
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
        $scope.myData = data.result;
    };
    $scope.getPagedDataAsync = function (pageSize, currentPage) {
        setTimeout(function () {
            var data_url = "/sales/install/getAllChannel?pageSize=" + pageSize + "&currentPage=" + currentPage;
            $http.get(data_url).success(function (data) {
                $scope.setPagingData(data);
            });
            var count_url = "/sales/install/getCountChannel";
            $http.get(count_url).success(function (data) {
                $scope.totalServerItems = data.result.count;
            });
        }, 100);
    };
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    var operation = '<span class="label bg-success" style="color:#fff;background-color: #19a9d5;" data-toggle="modal" data-target="#editChannel" ng-click="setEditChannel(row.entity)">修改</span>';
    operation += '&nbsp;&nbsp;<span class="label bg-success" style="color:#fff;background-color: rgb(240, 80, 80);" data-toggle="modal" data-target="#deleteChannel" ng-click="setDeleteChannel(row.entity)">删除</span>';

    $scope.columnDefs = [
        {field: 'name', displayName: '渠道名称'},
        {field: '', displayName: '操作', cellTemplate: operation}
    ];
    $scope.gridOptions = {
        data: 'myData',
        columnDefs: $scope.columnDefs,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        rowHeight:40,
        multiSelect: false,
        i18n: 'zh_cn'
    };
    window.ngGrid.i18n['zh_cn'] = yilos_i18n.resource;
    //创建渠道
    $scope.addChannel = function () {
        var url ="/sales/install/addChannel";
        $http.post(url, $scope.channel).success(function (data) {
            $scope.myData.push(data.result);
            $scope.channel = null;
        }).error(function(error) {
            
        });
    };
    $scope.cancelSetAddChannel = function(){
        $scope.channel = null;
    };
    $scope.setAddChannel = function(){
        $scope.channel = null;
    }
    //点击删除按钮弹出提示框
    $scope.setDeleteChannel = function (data) {
        $scope.channel = data;
    };
    //点击修改按钮弹出提示框
    $scope.setEditChannel = function (data) {
        $scope.channel = data;
    };
    $scope.cancelSetEditChannel = function(){
        $scope.channel = null;
    };
    //删除渠道
    $scope.deleteChannel = function () {
        var url = "/sales/install/deleteChannel?id=" +$scope.channel.id;
        $http.post(url).success(function (data) {
            $scope.myData = _.filter($scope.myData, function(item){
                return item.id != $scope.channel.id;
            });
        });
    }
    $scope.editChannel = function(){
        var url = "/sales/install/editChannel";
        $http.post(url, $scope.channel).success(function (data) {
            $scope.myData = _.map($scope.myData, function(item){
                if(item.id == $scope.channel.id){
                    item = $scope.channel;
                }
                return item;
            });
        });
    }
}]);