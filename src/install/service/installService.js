var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var uuid = require('node-uuid');

exports.getAllChannel = getAllChannel;
exports.addChannel = addChannel;
exports.deleteChannel = deleteChannel;
exports.getCountChannel = getCountChannel;
exports.getPersonByChannelId = getPersonByChannelId;
exports.getCountPersonByChannelId = getCountPersonByChannelId;
exports.deletePerson = deletePerson;
exports.addPerson = addPerson;
exports.updatePerson = updatePerson;
exports.installRecord = installRecord;

//获取渠道列表
function getAllChannel(req, res, next){
    var pageSize = parseInt(req.query.pageSize) || 10;
    var currentPage = parseInt(req.query.currentPage) || 1;
    var startIndex = (currentPage - 1) * pageSize;
    var sql = "select * from channels limit :startIndex,:pageSize";
    dbHelper.execSql(sql, {startIndex: startIndex,pageSize: pageSize}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//获取渠道总数
function getCountChannel(req, res, next){
    var sql = "select count(1) 'count' from channels";
    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result[0]);
    });
}

//增加渠道
function addChannel(req, res, next){
    var name = req.body.name;
    var id = uuid.v1();
    var sql = "insert into channels values(:id,:name)";
    dbHelper.execSql(sql, {id: id,name: name}, function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, {id: id,name: name});
    });
}

//删除渠道
function deleteChannel(req, res, next){
    var id = req.query.id;
    var sql = "delete from channels where id = :id";
    dbHelper.execSql(sql, {id: id}, function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, {message: "ok"});
    });
}

//根据渠道id查询专员
function getPersonByChannelId(req, res, next){
    var channel_id = req.query.channel_id;
    var pageSize = parseInt(req.query.pageSize) || 10;
    var currentPage = parseInt(req.query.currentPage) || 1;
    var startIndex = (currentPage - 1) * pageSize;
    var sql = "select * from channel_persons where channel_id = :channel_id limit :startIndex,:pageSize";
    dbHelper.execSql(sql, {channel_id: channel_id,startIndex: startIndex,pageSize: pageSize}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//根据渠道id统计专员数量
function getCountPersonByChannelId(req, res, next){
    var channel_id = req.query.channel_id;
    var sql = "select count(1) 'count' from channel_persons where channel_id = :channel_id";
    dbHelper.execSql(sql, {channel_id: channel_id}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result[0]);
    });
}

//删除专员
function deletePerson(req, res, next){
    var id = req.query.id;
    var sql = "delete from channel_persons where id = :id";
    dbHelper.execSql(sql, {id: id}, function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, {message: "ok"});
    });
}

//增加专员
function addPerson(req, res, next){
    var id = uuid.v1();
    var channel_id = req.body.channelId;
    var name = req.body.name;
    getInstallCode(function(err, code){
        if(err){
            return next(err);
        }
        var sql = "insert into channel_persons(id,channel_id,name,install_code) values(:id,:channel_id,:name,:install_code)";
        dbHelper.execSql(sql, {id: id,channel_id: channel_id,name: name,install_code: code}, function(err){
            if(err){
                return next(err);
            }
            doResponse(req, res, {id: id,channel_id: channel_id,name: name,install_code: code});
        });
    });
}

//内部接口，获取非重复推荐码
function getInstallCode(callback){
    var sql = "select count(1) 'count' from channel_persons where install_code = :code";
    var code = Math.round(900000 * Math.random() + 100000);
    dbHelper.execSql(sql, {code: code}, function(err, result){
        if(err){
            return callback(err);
        }
        //重复继续生成新的推荐码
        if(result && result[0] && result[0].count > 0){
            return getInstallCode(callback);
        }
        callback(null, code);
    });
}

//更新专员
function updatePerson(req, res, next){
    var sql = "update channel_persons set channel_id = :channel_id,name = :name where id = :id";
    dbHelper.execSql(sql, req.body, function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, {message: "ok"});
    });
}

//推荐码入库
function installRecord(req, res, next){
    //判断此账号是否已推荐
    var account_id = req.body.uid;
    var sql = "select count(1) 'count' from install_records where account = :account_id";
    dbHelper.execSql(sql, {account_id: account_id}, function(err, result){
        if(err){
            return next(err);
        }
        if(result && result[0] && result[0].count > 0){
            return next({code: 1,message: "此账号已推荐"});
        }
        //推荐码入库
        var code = req.body.content;
        var sql = "select id from channel_persons where install_code = :code";
        dbHelper.execSql(sql, {code: code}, function(err, result){
            if(err){
                return next(err);
            }
            if(result && result[0] && result[0].id){
                var sql = "insert into install_records(id,person_id,device_id,account,install_date) " +
                    "values(:id,:person_id,:device_id,:account,:install_date)";
                var param = {
                    id: uuid.v1(),
                    person_id: result[0].id,
                    account: account_id,
                    device_id: null,
                    install_date: new Date().getTime()
                };
                dbHelper.execSql(sql, param, function(err){
                    if(err){
                        return next(err);
                    }
                    doResponse(req, res, {message: "ok"});
                });
            }else{
                next({code: 1,message: "推荐码无效"});
            }
        });
    });
}