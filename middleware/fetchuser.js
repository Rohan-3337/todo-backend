const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET


const fetchuser = (req,res,next) =>{
    const token = req.header("auth-token")
    if(!token){
        res.statusCode = 401;
        return res.json({error:"please validate a token"})
    }
    try {
        if(jwt){
            const data = jwt.verify(token,JWT_SECRET)
            req.user = data.user
            next()
        }
    } catch (error) {
        res.statusCode = 401;
        return res.json({error:"please validate a token"})
    }

}
module.exports = fetchuser;