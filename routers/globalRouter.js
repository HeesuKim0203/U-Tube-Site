import express from 'express' ;
import routes from '../routes' ;
import passport from 'passport' ;
import { home, search } from '../controllers/videoController';
import { 
    getJoin, 
    postLogin, 
    logout, 
    postJoin,
     getLogin, 
     githubLogin, 
     postGithubLogin, 
     getMe,
     kakaoLogin,
     postkakaoLogin } from '../controllers/userController';
import { onlyPublic, onlyPrivate } from '../middlewares' ;

const globalRouter = express.Router() ;

globalRouter.get(routes.global.JOIN, onlyPublic, getJoin) ;
globalRouter.post(routes.global.JOIN, postJoin, postLogin) ;

globalRouter.get(routes.global.LOGIN, getLogin) ;
globalRouter.post(routes.global.LOGIN, postLogin) ;

globalRouter.get(routes.global.HOME, home) ;
globalRouter.get(routes.global.SEARCH, search) ;
globalRouter.get(routes.global.LOGOUT, onlyPrivate, logout) ;

globalRouter.get(routes.github.github_go, githubLogin) ;
globalRouter.get(routes.github.github_callBack, 
    passport.authenticate('github',
    { failureRedirect : routes.global.LOGIN }),
    postGithubLogin 
) ;

globalRouter.get(routes.kakao.kakao_go, kakaoLogin) ;
globalRouter.get(routes.kakao.kakao_back, 
    passport.authenticate('kakao',
    { failureRedirect : routes.global.LOGIN }),
    postkakaoLogin
) ;

globalRouter.get(routes.user.ME, getMe) ;

export default globalRouter ;