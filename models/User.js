import mongoose from 'mongoose' ;
import passPort from 'passport-local-mongoose' ;

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    avatarUrl : String,
    kakaoId : Number,
    githubId : Number,
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    videos : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    }],
}) ;

userSchema.plugin(passPort, {usernameField : "email"}) ;

const model = mongoose.model('User', userSchema) ;

export default model ;