import express from 'express' ;
import routes from '../routes' ;
import { postRegisterView, postAddcomment } from '../controllers/videoController';

const apiRouter = express.Router() ;

apiRouter.post(routes.api.REGISTER_VIEW, postRegisterView) ;
apiRouter.post(routes.comment.ADD_COMMENT, postAddcomment) ;

export default apiRouter ;