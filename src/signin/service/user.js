var logger = require(FRAMEWORKPATH + "/utils/logger").getLogger();
var utils = require(FRAMEWORKPATH + "/utils/utils");
var request = require('request');
var serverInfo = {
    //host: global["_g_clusterConfig"].baseurl
    oauthUrl: global["_g_topo"].clientAccess.authurl
};

exports.signin = signin;
exports.signout = signout;

function signin(req, res, next) {
    var username = req.body["username"];
    var password = req.body["password"];
    if(username == "admin" && password =="111111"){
        req.session.username = username;
        doResponse(req, res, {user: username});
    }else{
        next({errorCode: 10050001, message: "登录失败，用户名或密码错误"});
    }

}

function signout(req, res, next) {
    req.session.destroy();
    res.redirect("http://127.0.0.1:5012/framework/index.html#/signin/signin");
}
