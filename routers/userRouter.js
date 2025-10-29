import express from 'express';
import { createUser, getUser, googleLogin, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post("/",createUser);
userRouter.get("/",getUser)
userRouter.post("/login", loginUser)
userRouter.post("/google-Login",googleLogin)

export default userRouter; //tyt