app.controller('qrcodeCtrl', ['$rootScope', '$scope', '$http','$location','$stateParams', function ($rootScope, $scope, $http,$location,$stateParams) {


    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Accordion group header - #1',
            content: 'Dynamic group body - #1'
        },
        {
            title: 'Accordion group header - #2',
            content: 'Dynamic group body - #2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.addActivity = function(){
        var activityName = $scope.activity.name;
        var url = decodeURI("/sales/activity/addActivity/" + activityName);
        $http.get(url).success(function(data){
            if(data.code == 0){
                alert("success");
            }
        });
    };

}]);
