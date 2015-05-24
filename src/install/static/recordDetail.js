app.controller('recordDetail', ['$rootScope', '$scope', '$http','$location','$stateParams','$state', function ($rootScope, $scope, $http,$location,$stateParams,$state) {

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 20, 50],
        pageSize: 10,
        currentPage: 1
    };

    $scope.goBackSalesperson = function(){
        $state.go('app.sales_person', {});
    };

    $scope.setPagingData = function(data){
        $scope.myData = data;
    };
    $scope.getPagedDataAsync = function (perPage, page) {
        var url = "/sales/install/getInstallRecord?id=" + $stateParams.id + "&page=" + page + "&perPage=" + perPage;
        $http.get(url).success(function (data) {
            $scope.setPagingData(data.result);
        });
    };
    $scope.getPageDataCountAsync = function () {
        var url = "/sales/install/getInstallRecordCount?id=" + $stateParams.id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.totalServerItems = data.result.count;
            }
        });
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage && newVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.columnDefs = [
        {field: 'account', displayName: '手机号码'},
        {field: 'device_id', displayName: '设备id'},
        {field: 'install_date', displayName: '装机日期',cellTemplate:"<div>{{row.entity.install_date | date:'yyyy-MM-dd HH:mm:ss'}}</div>"}
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

    //初始操作
    (function init(){
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    })();


    function getLocalTime(timeStr) {
        var d = new Date(timeStr);

        return d.getFullYear()+"年"+((d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1))+"月"+(d.getDate()<10?"0"+d.getDate():d.getDate())+
            "日 "+(d.getHours()<10?"0"+d.getHours():d.getHours())+":"+(d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes())+":"+(d.getSeconds()<10?"0"+d.getSeconds():d.getSeconds());
    }
}]);