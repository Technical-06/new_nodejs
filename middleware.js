import jsonWebToken from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jsonWebToken.verify(token, "my_key");
        req.userData = data;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed.",
        });
    }
};