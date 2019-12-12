const jwt = require('jsonwebtoken');

const jwksClient = require('jwks-rsa');
const client = jwksClient({
    jwksUri: process.env.JWKS_URI
});
const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
};

const auth = async (req, res, next) => {
    if (isNotSecurePath(req.path)) {
        next();
    } else {
        const authHeader = req.header('Authorization') || '';
        const token = authHeader.replace('Bearer ', '');

        jwt.verify(token, getKey, {algorithms: ["RS256"]}, (err, decoded) => {
            if (err) {
                res.status(401).send({error: 'Not authorized to access this resource'})
            } else {
                if (decoded['realm_access'].roles.includes('analytics')) {
                    next()
                } else {
                    res.status(401).send({error: 'Not authorized to access this resource'})
                }
            }
        });
    }
};

const isNotSecurePath = (path) => pathsExcludedFromAuth.includes(path);

const pathsExcludedFromAuth = ['/users', '/users/active', '/submissions', '/submissions/graded'];

module.exports = auth;