import prisma from '../Config/Prisma.js'
import bcrypt from 'bcrypt'
import { createToken } from "../utils/utils.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const {username, email, password} = req.body;

    try{
        const existing = await prisma.user.findFirst({
            where: {
                OR : [
                    { username },
                    { email }
                ]
            }
        });

        if (existing) return res.status(400).json({ message : "Username or email already in use."});

        const hashPassword = await bcrypt.hash(password, 10)

        //Crée l'utilisateur + assigne le rôle via UserRole
        const userCreate = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            }
        });


        if(!userCreate){
            res.status(400).json({message: "User not created"})
        }

        //Enlever le password
        const { password:_password, ...newUser } = userCreate;

        //Creer le token
        const token = createToken(newUser.id);

        res.status(200).json({token})


    }catch(err){
        console.log(err)
        res.status(400).json({message: "Error while creating user."})
    }
}

export const login = async (req, res) => {
    // console.log(req.body)
    // console.log(req.query.id)

    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Please provide username/email and password." });
    }


    const {email, password } = req.body;

    try{

        // Recherche de l'utilisateur par username ou email
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare mot de passe reçu avec hash en DB
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({token});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error server." });
    }
}