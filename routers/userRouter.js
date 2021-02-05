import express from 'express' ;
import routes from '../routes' ;
import { userDetail, getUserProfile, postUserProfile, postUserPassword, getUserPassword } from '../controllers/userController';
import { onlyPrivate, uploadAvater } from '../middlewares' ;

const userRouter = express.Router() ;

userRouter.get(routes.user.USER_PROFILE, onlyPrivate, getUserProfile) ;
userRouter.post(routes.user.USER_PROFILE, onlyPrivate, uploadAvater, postUserProfile) ;

userRouter.get(routes.user.USER_PASSWORD, onlyPrivate, getUserPassword) ;
userRouter.post(routes.user.USER_PASSWORD, onlyPrivate, postUserPassword)
userRouter.get(routes.user.USER_DETAIL(), userDetail) ;

export default userRouter ;