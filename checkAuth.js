const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
    const head = req.headers["cookie"];
    let token;
    if(head) {
        token = head.split("=")[1]
        console.log(token)
    } else {
        token = null
    }
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, "AAABBBADA", (err, user) => {
        if(err) return res.sendStatus(401)
        req.user = user;
        next();
    })
    console.log(head)
}