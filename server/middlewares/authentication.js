import jwt, { decode } from "jsonwebtoken";


export default function authentication(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            "success": false,
            "message": "Unauthenticated User"
        })
    }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                "success": false,
                "message": "Invalid Token"
            })
        }

        // TODO: Need to add data here from token payload >.<

        next();
    })
}