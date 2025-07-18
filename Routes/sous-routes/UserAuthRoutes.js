import { Router } from 'express';
import {addMoney, deleteMyData, getMyData, transfer} from "../../Controllers/UserAuth.js";
import {verifyToken} from "../../utils/AuthMiddleware.js";

const userAuthRouter = Router();

userAuthRouter.get('/getMyData', verifyToken, getMyData)
userAuthRouter.delete('/delete', verifyToken, deleteMyData)
userAuthRouter.post('/transfer', verifyToken, transfer)
userAuthRouter.post('/addMoney', verifyToken, addMoney)

export default userAuthRouter;