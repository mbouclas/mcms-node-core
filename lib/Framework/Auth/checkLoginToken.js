var cookie;

if (typeof req.cookies.logintoken == 'undefined' || req.cookies.logintoken == null){
    callback(null,false);
    return;
}

try {
    cookie = JSON.parse(req.cookies.logintoken);
}
catch (e){
    callback(null,false);
    return;
}

LoginToken.findOne({
    username: cookie.username,
    series: cookie.series,
    token: cookie.token
},function(err,token){

    if (!token) {
        callback(null,false);
    }

    token.token = generateToken();
    token.save(function() {
        res.cookie('logintoken', token.cookieValue, {
            expires: new Date(Date.now() + 2 * App.Config.auth.rememberMeTTL), path: '.'
        });
        callback(null,token);
    });

});