import jwt from "jsonwebtoken";
import prisma from "../Config/Prisma.js";
import { getToken } from "./Utils.js";

export async function verifyToken (req, res, next){

    const token = getToken(req);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Vérifie que l'utilisateur existe encore en base
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if(!user) return res.status(401).json({ error: 'Token invalide' });

        req.user = decoded;

        next();

    } catch (err) {
        console.error("Error message:", err.message);
        console.error("Error name:", err.name);

        // Plus de détails sur l'erreur JWT
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token malformé' });
        }

        res.status(403).json({ error: "Token invalide" });
    }

}
