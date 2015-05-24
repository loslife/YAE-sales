app.controller('qrcodeCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {



    (function initData(){
        initViewData();
        initActivitiesData();
        initDelActivitiesData();
        initEntityData();
    })();

    function initViewData(){
        $scope.viewData = {
            activities: [],
            tags: [],
            entities: [],
            tag_entity:[]
        };
    }

    function initActivitiesData() {
        $scope.activitiesData = {
            activity_id: "",
            tagIds: [],
            qrcodeName: "",
            qrcodeType: "",
            qrcodeUrl: ""
        };
    }

    function initDelActivitiesData() {
        $scope.delActivitiesData = {
            name: "",
            id: ""
        };
    }

    function initEntityData() {
        $scope.entityData = {
            id: "",
            name: "",
            entity_has_tags: [],
            entity_has_tagIds: []
        };
    }

    init();

    function init(){
        var url = "/sales/activity/queryActivity";
        var tag_url = "/sales/activity/queryAllTags";
        var entity_url = "/sales/activity/queryAllEntities";
        var entity_has_tag_url = "/sales/activity/queryEntityHasTags";
        var scan_count_url = "/sales/activity/queryScanCount";
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.viewData.activities = data.result;
            }
        });
        $http.get(entity_url).success(function(result){
            if(result.code == 0){
                $scope.viewData.entities = result.result;
            }
        });
        $http.get(tag_url).success(function(data){
            if(data.code == 0){
                $scope.viewData.tags = data.result;
            }
        });
        $http.get(entity_has_tag_url).success(function(data){
            if(data.code == 0){
                $scope.viewData.tag_entity = data.result;
            }
        });
        $http.get(scan_count_url).success(function(data){
            if(data.code == 0){
                $scope.viewData.scan_record = data.result;
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
                $scope.activity = null;
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
                initDelActivitiesData();
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
                initDelActivitiesData();
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
                //$scope.viewData.entities.push(data.result);
                init();
                $(".add-qrcode").modal('hide');
                initActivitiesData();
            }
        });
    };

    $scope.translate = function(entity){
        $scope.entityData.id = entity.id;
        $scope.entityData.name = entity.name;
        $scope.entityData.entity_has_tags = _.filter($scope.viewData.tag_entity, function(obj){
            return obj.entity_id == entity.id;
        });
        $scope.entityData.entity_has_tagIds = _.pluck($scope.entityData.entity_has_tags, "tag_id");
    };
    $scope.toggleTagSelection2 = function(id){
        var idx = $scope.entityData.entity_has_tagIds.indexOf(id);
        if (idx > -1) {
            $scope.entityData.entity_has_tagIds.splice(idx, 1);
        }
        else {
            $scope.entityData.entity_has_tagIds.push(tagId);
        }
    };

    $scope.updateEntity = function(){
        var url = "/sales/activity/updateEntity/" + $scope.entityData.id;
        $http.post(url, {name:$scope.entityData.name,tags:$scope.entityData.entity_has_tagIds}).success(function(data){
            if(data.code == 0){
                init();
                $(".update-entity").modal('hide');
                initEntityData();
            }
        });
    };

    $scope.delEntity = function(){
        var url = "/sales/activity/delEntity/" + $scope.entityData.id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                init();
                $(".del-entity").modal('hide');
                initEntityData();
            }
        });
    };

   $scope.toggleTagSelection2 = function(id){
       var idx = $scope.entityData.entity_has_tagIds.indexOf(id);
       if (idx > -1) {
           $scope.entityData.entity_has_tagIds.splice(idx, 1);
       }
       else {
           $scope.entityData.entity_has_tagIds.push(id);
       }
   };


}]);
