export default function authorization(req, res, next) {
    const apikey = req.headers.apikey;

    if (!apikey || (apikey && apikey !== process.env.API_KEY)) {
        return res.status(401).json({
            "sucess": false,
            "message": "Unauthorized User"
        });
    }
    next();
}