var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var async = require("async");
var uuid = require('node-uuid');
var _ = require("underscore");
var sqlHelper = require(FRAMEWORKPATH + "/db/sqlHelper");

exports.showArea = showArea;
exports.showRegion = showRegion;
exports.postPins = postPins;

var data = [];
var store = [];
var area = "";
var areaRegions = [];
var areaRegionsPoints = [];
var areaRegionName = [];

function showArea(req, res, next){
    var areaDefault;
    var isExist = "NO";
    area = req.params["area"];

    async.series([getArea, checkAreaExist, getStores, getAreaRegions, getAreaRegionPoints], function(err){
        if(err === "addArea"){
            area = "nanjing";
            res.render("area", {layout: false, area: data.center, level: data.level ,store: store, regionPoints: areaRegionsPoints, regionName: areaRegionName, isExist: isExist});
            areaRegionsPoints = [];
            areaRegionName = [];
            areaDefault = "";
            return ;
        }

        if(err){
            return;
        }

        res.render("area", {layout: false, area: data.center, level: data.level,store: store, regionPoints: areaRegionsPoints, regionName: areaRegionName, isExist: isExist});
        areaRegionsPoints = [];
        areaRegionName = [];
    });

    function getArea(callback){
        var sql = "select * from areas where name = :name;";

        dbHelper.execSql(sql, {name: area}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            data = result[0];
            if(!data){
                areaDefault = "nanjing";
                callback(null);
                return ;
            }

            isExist = "YES";
            callback(null);
            return ;
        });
    }

    function checkAreaExist(callback) {
        if(areaDefault != "nanjing") {
            callback(null);
            return ;
        }

        async.series([getDefault, setDefault], function(error, result) {
            if(error) {
                if(error === "defaultExist") {
                    callback(null);
                } else {
                    callback(error);
                }

                return ;
            }

            callback("addArea");
            return ;
        });

        function getDefault(callback) {
            var sql = "select * from areas where name = :name;";

            dbHelper.execSql(sql, {name: areaDefault}, function (error, result) {
                if(error) {
                    callback(error);
                    return;
                }

                if(result[0]) {
                    data = result[0];
                    area = "nanjing";
                    callback("defaultExist");
                    return ;
                }

                callback(null);
                return ;
            });
        }

        function setDefault (callback) {
            var sql = "insert into areas (id, name, center, level) values (:id, :name, :center, :level);";
            var uid = uuid.v1();

            dbHelper.execSql(sql, {id: uid, name: "nanjing", center: "南京", level: 13}, function(error, result) {
                if(error) {
                    callback(error);
                    return ;
                }

                data = {id: uid, name: "nanjing", center: "南京", level: 13};
                callback(null);
                return ;
            });
        }
    }

    function getStores(callback){
        var sql = "select * from pins where area_id = :area_id;";

        dbHelper.execSql(sql, {area_id: data.id}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            store = result;
            callback(null);
        });
    }

    function getAreaRegions(callback){
        var sql = "select * from regions where area_id = :area_id order by create_date asc;";

        dbHelper.execSql(sql, {area_id: data.id}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            _.each(result, function(item){
                areaRegions.push(item.id);
                areaRegionName.push(item.name);
            });
            callback(null);
        });
    }

    function getAreaRegionPoints(callback){
        var sql = "select * from region_points";

        dbHelper.execSql(sql, {}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            _.each(areaRegions, function(region_id){
                var regions = [];
                _.each(result, function(item){
                    if(region_id == item.region_id){
                        regions.push({lat: item.lat, lng: item.lng});
                    }
                });

                areaRegionsPoints.push(regions);
            });

            areaRegions = [];
            callback(null);
        });
    }
}

function showRegion(req, res, next){
    var areaRegion = req.params["area"];
    var region =req.params["region"];
    var regionData = [];
    var regionStores = [];
    var regionsCircle = [];
    var regionsPoints = [];

    async.series([getArea, getStores, getAreaRegions, getAreaRegionPoints], function(err, result){
        if(err === "empty"){
            area = "nanjing";
            res.render("region", {layout: false, area: "南京", level: 13,store: [], regionPoints: []});
            return ;
        }

        if(err){
            return;
        }

        res.render("region", {layout: false, area: regionData.center, level: regionData.level,store: regionStores, regionPoints: regionsPoints});
        regionsPoints = [];
    });

    function getArea(callback){
        var sql = "select * from areas where name = :name;";

        dbHelper.execSql(sql, {name: areaRegion}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            regionData = result[0];
            if(!regionData){
                callback("empty");
                return ;
            }
            callback(null);
            return ;
        });
    }

    function getStores(callback){
        var sql = "select * from pins where area_id = :area_id;";

        dbHelper.execSql(sql, {area_id: regionData.id}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            regionStores = result;
            callback(null);
        });
    }

    function getAreaRegions(callback){
        var sql = "select * from regions where area_id = :area_id and name = :name order by create_date asc;";

        dbHelper.execSql(sql, {area_id: regionData.id, name: region}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            _.each(result, function(item){
                regionsCircle.push(item.id);
            });
            callback(null);
        });
    }

    function getAreaRegionPoints(callback){
        var sql = "select * from region_points";

        dbHelper.execSql(sql, {}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            _.each(regionsCircle, function(region_id){
                var regions = [];
                _.each(result, function(item){
                    if(region_id == item.region_id){
                        regions.push({lat: item.lat, lng: item.lng});
                    }
                });

                regionsPoints.push(regions);
            });

            regionsCircle = [];
            callback(null);
        });
    }
}

function postPins(req, res, next){
    var areaPoints = req.body.areaPoints;
    var name = req.body.nickName;
    var area_id;
    var allSql = [];

    if(!areaPoints){
        doResponse(req, res, "empty");
        return ;
    }

    async.series([getAreaId, addRegions], function(err, result){
        if(err === "empty"){
            doResponse(req, res, "empty");
            return ;
        }

        if(err){
            console.log(err);
            return next(err);
        }

        doResponse(req, res, "ok");
    });

    function getAreaId(callback){
        if(data){
            area_id = data.id;
            callback(null);
            return ;
        }

        var sql = "select * from areas where name = :name;";
        dbHelper.execSql(sql, {name: area}, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            if(!result[0]){
                callback("empty");
                return ;
            }
            area_id = result[0].id;

            callback(null);
            return ;
        });
    }

    function addRegions(callback) {
        buildSql();
        dbHelper.bacthExecSql(allSql, function(error, result){
            if(error){
                callback(error);
                return ;
            }

            callback(null);
            return;
        });

        function buildSql() {
            var uids = [];
            var index = 0;
            _.each(name, function (regions) {
                var uid = uuid.v1();
                uids.push(uid);
                var date = new Date().getTime();
                allSql.push(sqlHelper.getServerInsertForMysql("", "regions", {id: uid, area_id: area_id, name: regions, create_date: date + index}, null, true));
                index++;
            });

            for(var i = 0; i < uids.length; i++){
                _.each(areaPoints[i], function(item){
                    var pointUid = uuid.v1();
                    allSql.push(sqlHelper.getServerInsertForMysql("", "region_points", {id: pointUid, region_id: uids[i], lat: item.lat, lng: item.lng}, null, true));
                });
            }
        }
    }


}
