import { Router } from 'express';
import { register, login } from '../../Controllers/userController.js';
import userAuthRouter from "./UserAuthRoutes.js";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);


userRouter.use("/auth", userAuthRouter);

export default userRouter;