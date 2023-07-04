import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const createJWT = async (user: any) => {
    const token = await jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_SECRET,
    );
    return token;
};

export const protectRoute = (req, res, next) => {
    const bearer = req.headers.authorization;
    
    if (!bearer) {
        res.status(401);
        res.send({ message: "You are not authorized to access this part of the site."});
        return;
    }

    const [, token] = bearer.split(" ");

    if (!token) {
        res.status(401);
        res.json({ message: "Invalid token for connection"});
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    } catch (e) {
        console.log(e);
        res.status(401);
        res.send({ message: "Not authorized for connection" });
        return;
    }


};
