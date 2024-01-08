import JWT from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    //get
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        next('Auth Failed1');

    }
    // get token
    // to protect route
    const token = authHeader.split(" ")[1];
    try {
        // all data are in payload
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        next('Auth Failed');
    }

};
export default userAuth;