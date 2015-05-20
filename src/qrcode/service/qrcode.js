var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var uuid = require('node-uuid');

exports.addActivity = addActivity;
exports.wxScan = wxScan;

function addActivity(req, res, next){
    var activity_name = req.params["activityName"];
    var id = uuid.v1();
    var sql = "insert into activities (id,name) values (:id,:name)";
    dbHelper.execSql(sql, {id:id, name:activity_name},function(error,data){
        if(error){
            return next(error);
        }
        doResponse(req, res, "ok");
    });
}


function wxScan(req, res, next){
    var id = req.body.id;
    var scene_id = req.body.scene_id;
    var scan_date = req.body.scan_date;
    var open_id = req.body.open_id;
    var sql1 = "select * from scan_records where open_id=:open_id";
    var sql2 = "insert into scan_records (id,entity_id,scan_date,open_id) values (:id,:scene_id,:scan_date,:open_id)";
    dbHelper.execSql(sql1, {open_id:open_id}, function(error, result){
        if(error){
            return next(error);
        }
        if(result.length == 0){
            dbHelper.execSql(sql2 ,{id:id, scene_id:scene_id, scan_date:scan_date, open_id:open_id}, function(err, data){
                if(err){
                    return next(err);
                }
                doResponse(req, res, "wxScan_Insert_Success");
            });
        }
    });
}

function createEntities(req, res, next){

}