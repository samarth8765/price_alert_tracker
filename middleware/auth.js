import jwt from "jsonwebtoken";

export function authentication(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({
            message: "Unable to authenticate",
        });

        jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
        })
    }
}