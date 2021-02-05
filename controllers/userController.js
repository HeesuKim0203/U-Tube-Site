import routes from '../routes' ;
import passport from 'passport' ;
import User from '../models/User' ;

export const getJoin = (req, res) => { 
    res.render('join', { pageTitle : 'Join'}) 
};
export const postJoin = async (req, res, next) => {
    const {
        body : { name, email, password, checkPassword }
    } = req ;
    if(password !== checkPassword) {
        res.status(400) ;
        res.render('join', { pageTitle : 'Join'}) ;
    } else {
        try {
            const user = await User({
                name,
                email,
            }) ;
            await User.register(user, password) ;
            next() ;
        } catch(error) {
            console.log(error) ;
            res.redirect(routes.global.JOIN) ;
        }
    }
} ;

export const getLogin = (req, res) => {
    res.render('login', { pageTitle : 'Login'}) ; 
} ;
export const postLogin = passport.authenticate('local', {
    successRedirect : routes.global.HOME ,
    failureRedirect  : routes.global.LOGIN 
}) ;

export const githubLogin = passport.authenticate('github') ;

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { 
        _json : { id, avatar_url, name, email } 
    } = profile ;
    try {
        const user = await User.findOne({email}) ;
        if(user) {
            user.githubId = id ;
            user.avatarUrl = avatar_url ;
            user.save() ;
            return cb(null, user) ;
        }
        const newUser = await User.create({
            email,
            name,
            githubId : id,
            avatarUrl : avatar_url 
        }) ;
        return cb(null, newUser) ;
    }catch(error) {
        return cb(error) ;
    }
    
}

export const postGithubLogin = (req, res) => {
    res.redirect(routes.global.HOME) ;
} ;

export const kakaoLogin = passport.authenticate('kakao') ;
export const kakaoCallback = async (_, __, profile, cb) => {
    const {
        _json : { 
            id, 
            properties : { nickname, profile_image },
            kakao_account : { email }
        }
    } = profile ;

    try {
        const user = await User.findOne({email}) ;
        if(user) {
            user.kakaoId = id ;
            user.avatarUrl = profile_image ;
            user.save() ;
            return cb(null, user) ;
        }
        const newUser = await User.create({
             name : nickname,
             email : email,
             avatarUrl : profile_image,
             kakaoId : id
        });
        return cb(null, newUser) ;
    } catch(error) {
        return cb(error) ;
    }
} ;

export const postkakaoLogin = (req, res) => {
    res.redirect(routes.global.HOME) ;
}

export const logout = (req, res) => {
    req.logout() ;
    res.redirect(routes.global.HOME) ;
}

export const getMe = (req, res) => {
    res.render('userDetail', { pageTitle : 'UserDetail', user : req.user}) ;
}

export const userDetail = async (req, res) => {
    const {
        params : { id }
    } = req ;
    try {
        const user = await User.findById(id).populate('videos') ;
        if(user) {
            res.render('userDetail', { pageTitle : "user Detail", user}) ;
        }else {
            res.redirect(routes.global.HOME) ;
        }
    }catch(error) {
        console.log(error) ;
        res.redirect(routes.global.HOME) ;
    }
} ;

export const getUserProfile = (req, res) => res.render('userProfile', { pageTitle : 'UserProfile'}) ;
export const postUserProfile = async (req, res) => {
    const {
        body : { name, email },
        file
    } = req ;
    try {
        await User.findByIdAndUpdate(req.user._id, {
            name,
            email,
            avatarUrl : file ? file.path : req.user.avatarUrl
        }) ;
        res.redirect(routes.user.ME) ; 
    } catch(error) {
        res.redirect(routes.user.USER_PROFILE) ;
    }
}

export const getUserPassword = (req, res) => res.render('userPassword', { pageTitle : 'UserPassword'}) ;
export const postUserPassword = async (req, res) => {
    const {
        body : { oldpassword, newpassword, newpassword1 }
    } = req ;
    try{    
        if(newpassword !== newpassword1) {
            res.status(400) ;
            res.redirect(routes.user.USER_PASSWORD) ;
            return ;
        }
        await req.user.changePassword(oldpassword, newpassword) ;
        res.redirect(routes.user.ME) ;
    }catch(error) {
        console.log(error) ;
        res.redirect(`/users${routes.user.USER_PASSWORD}`) ;
    }
}