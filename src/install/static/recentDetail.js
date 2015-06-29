app.controller('RecentChartCtrl', ['$rootScope', '$scope', '$http','$location','$stateParams','$state', function ($rootScope, $scope, $http,$location,$stateParams,$state) {


    $scope.getDataAsync = function(){
        var url = "/sales/install/recentInstallRecord?id=" + $stateParams.id;
        $http.get(url).success(function (data) {
            $scope.setPagingData(data.result);
        });
    };

    $scope.setPagingData = function(result){
        if(result){
            for(var i=0;i<result.length;i++){
                var a = [result[i].days, result[i].count];
                $scope.myData.push(a);
            }
        }
    };

    //$scope.$watch(attrs.uiRefresh, function(){
    //
    //}, true);

    $scope.goBackSalesperson = function(){
        $state.go('app.sales_person', {});
    };

    if($stateParams.data) {
        $scope.myData = $stateParams.data;
    }else{
        $scope.myData = [];
        $scope.getDataAsync();
    }

}]);