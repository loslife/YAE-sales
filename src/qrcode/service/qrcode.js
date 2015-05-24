var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var uuid = require('node-uuid');
var request = require('request');
var qr = require('qr-image');
var fs = require('fs');
var ossClient = require(FRAMEWORKPATH + "/utils/ossClient");
var path = require("path");

exports.queryActivity = queryActivity;
exports.addActivity = addActivity;
exports.addTag = addTag;
exports.wxScan = wxScan;
exports.queryAllTags = queryAllTags;
exports.addEntities = addEntities;
exports.queryAllEntities = queryAllEntities;
exports.delActivity = delActivity;
exports.updateActivity = updateActivity;
exports.updateEntity = updateEntity;
exports.delEntity = delEntity;
exports.updateTag = updateTag;
exports.delTag = delTag;
exports.queryEntityHasTags = queryEntityHasTags;
exports.queryScanCount = queryScanCount;

function queryScanCount(req, res, next){
    var sql = "select * from scan_records";
    dbHelper.execSql(sql, {}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, data)
    });
}

function queryActivity(req, res, next){
    var sql = "select * from activities";
    dbHelper.execSql(sql, {}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, data)
    });
}

function addActivity(req, res, next){
    var activity_name = req.params["activityName"];
    var id = uuid.v1();
    var sql = "insert into activities (id,name) values (:id,:name)";
    dbHelper.execSql(sql, {id:id, name:activity_name},function(error,data){
        if(error){
            return next(error);
        }
        doResponse(req, res, {id:id, name:activity_name});
    });
}

function delActivity(req, res, next){
    var id = req.params["id"];
    var sql = "delete from activities where id=:id";
    dbHelper.execSql(sql, {id:id}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, "ok");
    });
}

function updateActivity(req, res, next){
    var id = req.params["id"];
    var name = req.body.name;
    var sql = "update activities set name=:name where id=:id";
    dbHelper.execSql(sql, {name:name,id:id}, function(error, data){
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

function addEntities(req, res, next){
    var id = uuid.v1();
    var activity_id = req.body.activity_id;
    var name = req.body.qrcodeName;
    var tags = req.body.tagIds;
    var sql = "insert into channel_entities (id,activity_id,name,qrcode_url) values (:id,:activity_id,:name,:qrcode_url)";
    var tag_sql = "insert into entities_has_tags (id,entity_id,tag_id) values (:id,:entity_id,:tag_id)";
    switch (req.body.qrcodeType){
        case "meiguanjia":
            var url = "http://wx.yilos.com/svc/wsite/meiyeguanjia/createQrcode";
            var options = {
                method: "POST",
                uri: url,
                body:{app_id:"wxd37396c2dc23ba21",secret:"9600186549bc52bdf0d2d7390b05fd2c",sceneId:id},
                json:true
            };
            request(options, function(error, response, body){
                if(error){
                    return next(error);
                }
                if(body.code == 0){
                    dbHelper.execSql(sql, {id:id, activity_id:activity_id, name:name, qrcode_url: body.result}, function(err, data){
                        if(err){
                            return next(err);
                        }
                        for(var i=0;i<tags.length;i++){
                            var id_for_tag = uuid.v1();
                            dbHelper.execSql(tag_sql, {id:id_for_tag, entity_id:id, tag_id:tags[i]}, function(e, data){
                               if(e){
                                   console.log(e);
                                   return;
                               }
                            });
                        }
                        doResponse(req, res, {id:id, activity_id:activity_id, name:name, qrcode_url:body.result});
                    });
                }
            });
            break;
        default :
            var qrcode_url = req.body.qrcodeUrl;
            var qr_png = qr.image(qrcode_url, {type: 'png', margin: 2});
            qr_png.pipe(fs.createWriteStream(path.join(__dirname,'qrcode.png')));
            qr_png.on("end", function(){
                ossClient.putImageObjectToOss("qrcode/"+id, path.join(__dirname,"qrcode.png"), function(error){
                    if(error){
                        return next(error);
                    }
                    var qrUrl = "http://client-images.oss-cn-hangzhou.aliyuncs.com/qrcode/" + id;

                    dbHelper.execSql(sql, {id:id, activity_id:activity_id, name:name, qrcode_url: qrUrl}, function(err, data){
                        if(err){
                            return next(err);
                        }
                        for(var i=0;i<tags.length;i++){
                            var id_for_tag = uuid.v1();
                            dbHelper.execSql(tag_sql, {id:id_for_tag, entity_id:id, tag_id:tags[i]}, function(e, result){
                                if(e){
                                    console.log(e);
                                    return;
                                }
                            });
                        }
                        doResponse(req, res, {id:id, activity_id:activity_id, name:name, qrcode_url:qrUrl});
                    });
                });
            });
    }

}

function addTag(req, res, next){
    var tag_name = req.params["tagName"];
    var id = uuid.v1();
    var sql = "insert into tags (id,name) values (:id,:name)";
    dbHelper.execSql(sql, {id:id, name:tag_name}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, {id:id,name:tag_name});
    });
}

function updateTag(req, res, next){
    var id = req.params["id"];
    var name = req.body.name;
    var sql = "update tags set name=:name where id=:id";
    dbHelper.execSql(sql, {id:id,name:name},function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, "ok");
    });
}

function delTag(req, res, next){
    var id = req.params["id"];
    var sql = "delete from tags where id=:id ";
    dbHelper.execSql(sql, {id:id}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, "ok");
    });
}

function queryAllTags(req, res, next){
    var sql = "select * from tags";
    dbHelper.execSql(sql, {}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, data)
    });
}

function queryAllEntities(req, res, next){
    var sql = "select * from channel_entities";
    dbHelper.execSql(sql, {}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, data)
    });
}

function delEntity(req, res, next){
    var id = req.params["id"];
    var sql = "delete from channel_entities where id=:id ";
    dbHelper.execSql(sql, {id:id}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, "ok");
    });

}

function updateEntity(req, res, next){
    var id = req.params["id"];
    var name = req.body.name;
    var tags = req.body.tags;
    var sqlArray = [];
    sqlArray.push({
        statement: "update channel_entities set name=:name where id=:id",
        value: {id:id,name:name}
    });
    sqlArray.push({
        statement: "delete from entities_has_tags where entity_id=:id",
        value: {id:id}
    });
    for(var i=0;i<tags.length;i++){
        var uuids = uuid.v1();
        sqlArray.push({
            statement: "insert into entities_has_tags (id,entity_id,tag_id) values (:id,:entity_id,:tag_id)",
            value: {id:uuids, entity_id:id, tag_id:tags[i]}
        });
    }
    dbHelper.bacthSeriesExecSql(sqlArray, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, "ok");
    });
}

function queryEntityHasTags(req, res, next){
    var sql = "select * from entities_has_tags";
    dbHelper.execSql(sql, {}, function(error, data){
        if(error){
            return next(error);
        }
        doResponse(req, res, data)
    });
}