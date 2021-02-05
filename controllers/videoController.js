import routes from '../routes' ;
import Video from '../models/Videos' ;
import Comment from '../models/Commemnt' ;
import User from '../models/User' ;

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id : -1 }) ;
        res.render('home', { pageTitle : 'Home', videos }) ;
    }catch(error) {
        console.log(error) ;
        res.render('home', { pageTitle : 'Home', videos : [] }) ;
    }
}
export const search = async (req, res) => { 
    const { 
        query : { term : searchingBy } 
    } = req ;
    try {
        const video = await Video.find({ 
            title : {
                $regex : searchingBy, 
                $options : "i"
            } 
        }) ;
        res.render('search', { pageTitle : 'Search', searchingBy, video }) ;
    }catch(error) {
        res.redirect(routes.global.HOME) ;
    }
} ; 

export const getUpload = (req, res) => {
    res.render('upload', { pageTitle : 'Upload'}) ;
}
export const postUpload = async (req, res) => {
    const {
        body : { title, description }, 
        file : { path }
    } = req ;

    const newVideo = await Video.create({
        fileUrl : path,
        title,
        description,
        creator : req.user.id
    }) ;
    req.user.videos.push(newVideo._id) ;
    req.user.save() ;
    res.redirect("/videos" + routes.video.VIDEO_DETAIL(newVideo.id)) ;
}

export const videoDetail = async (req, res) => {
    const {
        params : { id }
    } = req ;

    try {
        const video = await Video.findById(id)
            .populate('creator')
            .populate('comments') ;
        res.render('videoDetail', { pageTitle : video.title, video }) ;
    } catch(error) {
        console.log(error) ;
        res.redirect(routes.global.HOME) ;
    }
} ;
export const getEditVideo = async (req, res) => {
    const {
        params : { id }
    } = req ;
    try {
        const video = await Video.findById(id) ;
        if(String(req.user._id) == String(video.creator)) {
            res.render('editVideo', { pageTitle : `Edit ${video.title}`, video}) ;
        }else {
            throw Error() ;
        }
    }catch(error) {
        console.log(error) ;
        res.redirect(routes.global.HOME) ;
    }
} ;
export const postEditVideo = async (req, res) => {
    const {
        params : { id },
        body : { title, description }
    } = req ;
    try {
        await Video.findOneAndUpdate({ _id : id }, { title, description })
        res.redirect(`/videos${routes.video.VIDEO_DETAIL(id)}`) ;
    }catch(error) {
        console.log(error) ;
        res.redirect(routes.global.HOME) ;
    }
} ;
export const deleteVideo = async (req, res) => {
    const {
        params : { id }
    } = req ;
    try {
        const video = await Video.findById(id) ;
        if(String(req.user._id) == String(video.creator)) {
            await Video.findByIdAndRemove( { _id : id } ) ;
        }else {
            throw Error() ;
        }
    }catch(error) {
        console.log(error) ;
    }
    res.redirect(routes.global.HOME) ;
} ;

export const postRegisterView = async (req, res) => {
    const {
        params : { id }
    } = req ;

    try {
        const video = await Video.findById(id) ;
        video.views += 1 ;
        video.save() ;
        res.status(200) ;
    } catch(error) {
        res.status(400) ;
    } finally {
        res.end() ;
    }
}

export const postAddcomment = async (req, res) => {
    const {
        params : { id },
        body : { comment },
        user
    } = req ;

    try {
        const findUser = await User.findById(user._id) ;
        const video = await Video.findById(id) ;
        const newComment = await Comment.create({
            text : comment,
            creator : user._id
        }) ;
        findUser.comments.push(newComment.id) ;
        video.comments.push(newComment.id) ;
        video.save() ;
        findUser.save() ;
        res.status(200) ;
        res.render('videoDetail', { pageTitle : video.title, video }) ;
    }catch(error) {
        res.status(400) ;
    }finally {
        res.end() ;
    }
}
