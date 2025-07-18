import jwt from 'jsonwebtoken';


export const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export const getToken = (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        let token = authHeader.substring(7);

        // Supprime les guillemets si présents
        if (token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        return token;
    }

    return null;
}

export const getDate = (dateSend) => {
    const date = new Date(dateSend);
    return date.toLocaleDateString("fr-FR", {
        timeZone: "Europe/Paris",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}