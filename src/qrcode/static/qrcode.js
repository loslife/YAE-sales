app.controller('qrcodeCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {


    $scope.viewData = {
        activities: [],
        tags: [],
        entities: []
    };

    $scope.activitiesData = {
        activity_id:"",
        tagIds: [],
        qrcodeName:"",
        qrcodeType:"",
        qrcodeUrl:""
    };
    $scope.delActivitiesData = {
        name:"",
        id:""
    };

    $scope.entityData = {
        id:"",
        name:""
    };

    init();

    function init(){
        var url = "/sales/activity/queryActivity";
        var tag_url = "/sales/activity/queryAllTags";
        var entity_url = "/sales/activity/queryAllEntities";
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.viewData.activities = data.result;
                $http.get(entity_url).success(function(result){
                    if(result.code == 0){
                        $scope.viewData.entities = result.result;
                    }
                });
            }
        });
        $http.get(tag_url).success(function(data){
            if(data.code == 0){
                $scope.viewData.tags = data.result;
            }
        });
    }

    $scope.addActivity = function(){
        var activityName = $scope.activity.name;
        var url = decodeURI("/sales/activity/addActivity/" + activityName);
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.viewData.activities.push(data.result);
                $(".add-activity").modal('hide');
            }
        });
    };




    $scope.sendId = function(activity){
        $scope.activitiesData.activity_id = activity.id;
        $scope.delActivitiesData.name = activity.name;
        $scope.delActivitiesData.id = activity.id;
    };

    $scope.delActivity = function(){

        var url = "/sales/activity/delActivity/" + $scope.delActivitiesData.id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                init();
                $(".del-activity").modal('hide');
            }
        });
    };

    $scope.updateActivity = function(){
        var url = "/sales/activity/updateActivity/" + $scope.delActivitiesData.id;
        var options = {
            name: $scope.delActivitiesData.name
        };
        $http.post(url, options).success(function(data){
            if(data.code == 0){
                init();
                $(".update-activity").modal('hide');
            }
        });
    };

    $scope.toggleTagSelection = function(tagId){
        var idx = $scope.activitiesData.tagIds.indexOf(tagId);

        if (idx > -1) {
            $scope.activitiesData.tagIds.splice(idx, 1);
        }
        else {
            $scope.activitiesData.tagIds.push(tagId);
        }
    };

    $scope.addQrcode = function(){
        var url = "/sales/activity/addEntities";

        $http.post(url, $scope.activitiesData).success(function(data){
            if(data.code == 0){
                $scope.viewData.entities.push(data.result);
                $(".add-qrcode").modal('hide');
            }
        });
    };

    $scope.translate = function(entity){
        $scope.entityData.id = entity.id;
        $scope.entityData.name = entity.name;
    };

    $scope.updateEntity = function(){
        var url = "/sales/activity/updateEntity/" + $scope.entityData.id;
        $http.post(url, {name:$scope.entityData.name}).success(function(data){
            if(data.code == 0){
                init();
                $(".update-entity").modal('hide');
            }
        });
    };

    $scope.delEntity = function(){
        var url = "/sales/activity/delEntity/" + $scope.entityData.id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                init();
                $(".del-entity").modal('hide');
            }
        });
    };



}]);
