import { Router } from 'express';
import {deleteMyData, getMyData} from "../../Controllers/UserAuth.js";
import {verifyToken} from "../../utils/AuthMiddleware.js";

const userAuthRouter = Router();

userAuthRouter.get('/getMyData', verifyToken, getMyData)
userAuthRouter.delete('/delete', verifyToken, deleteMyData)

export default userAuthRouter;