//id-----iat
const jwt = require("jsonwebtoken");

let onLineUsers = {};

function checkOnline(id,iat){
    if(onLineUsers[id] && onLineUsers[id] == iat) {
        return true;
    }
    return false;
}

function decodeToken(token){
    return jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            return false;
        }
        else if(checkOnline(decoded.id,decoded.iat)){
            return decoded;
        }
        return false;
    });

}

function setIdOnline(id,iat){
    onLineUsers[id] = iat;
}

//定时清理不在线的标志

module.exports = 
{
    // onLineUsers,
    decodeToken,
    setIdOnline,
}