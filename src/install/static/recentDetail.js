app.controller('FlotChartCtrl', ['$rootScope', '$scope', '$http','$location','$stateParams','$state', function ($rootScope, $scope, $http,$location,$stateParams,$state) {

    $scope.getDataAsync = function(){
        var url = "/sales/install/recentInstallRecord?id=" + $stateParams.id;
        $http.get(url).success(function (data) {
            $scope.setPagingData(data.result);
        });
    };

    $scope.setPagingData = function(result){
        if(result){
            _.each(result, function(item){
                var a = [item.days, item.count];
                $scope.data.push(a);
            });
        }
    };

    (function init(){
        $scope.data = [];
        $scope.getDataAsync();
    })();
}]);