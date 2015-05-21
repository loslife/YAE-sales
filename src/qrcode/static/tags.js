app.controller('tagsCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {


    $scope.addTag= function(){
        var tagName = $scope.tag.name;
        if(tagName){
            var url = decodeURI("/sales/activity/addTag/" + tagName);
            $http.get(url).success(function(data){
                if(data.code == 0){
                    $(".add-tags").modal('hide');
                }
            });
        }

    };


}]);