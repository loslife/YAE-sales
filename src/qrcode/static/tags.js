app.controller('tagsCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {



    $scope.viewData = {
        tags: []
    };
    init();
    function init(){
        var tag_url = "/sales/activity/queryAllTags";
        $http.get(tag_url).success(function(data){
            if(data.code == 0){
                $scope.viewData.tags = data.result;
            }
        });
    }
    $scope.addTag= function(){
        var tagName = $scope.tag.name;
        if(tagName){
            var url = decodeURI("/sales/activity/addTag/" + tagName);
            $http.get(url).success(function(data){
                if(data.code == 0){
                    $scope.viewData.tags.push(data.result);
                    $(".add-tags").modal('hide');
                }
            });
        }

    };

    $scope.translateData = function(tagObj,index){
        $scope.handleData = tagObj;
        $scope.index = index;
    };

    $scope.delTag = function(){
        var url = "/sales/activity/delTag/" + $scope.handleData.id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.viewData.tags.splice($scope.index,1);
                $(".tag-detail").modal('hide');
            }
        });
    };

    $scope.updateTag = function(){
        var url = "/sales/activity/updateTag/" + $scope.handleData.id;
        $http.post(url,{name:$scope.handleData.name}).success(function(data){
            if(data.code == 0){
                $scope.viewData.tags.splice($scope.index,1,{id:$scope.handleData.id,name:$scope.handleData.name});
                $(".tag-detail").modal('hide');
            }
        });
    };


}]);