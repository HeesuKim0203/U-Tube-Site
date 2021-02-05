import express from 'express' ;
import routes from '../routes' ;
import { deleteVideo, getEditVideo, postEditVideo, getUpload, postUpload,videoDetail } from '../controllers/videoController';
import { uploadVideo, onlyPrivate } from '../middlewares';

const videoRouter = express.Router() ;

videoRouter.get(routes.video.EDIT_VIDEO(), onlyPrivate, getEditVideo) ;
videoRouter.post(routes.video.EDIT_VIDEO(), onlyPrivate, postEditVideo) ;
videoRouter.get(routes.video.UPLOAD, onlyPrivate, getUpload) ;
videoRouter.post(routes.video.UPLOAD, onlyPrivate, uploadVideo, postUpload) ;
videoRouter.get(routes.video.VIDEO_DETAIL(), videoDetail) ;
videoRouter.get(routes.video.DELETE_VIDEO(), onlyPrivate, deleteVideo) ;

export default videoRouter ;