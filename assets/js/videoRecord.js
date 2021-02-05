const recorderContainer = document.getElementById('jsRrecordContainer') ;
const recorederButton = document.getElementById('jsRecordButton') ;
const videoPreview     = document.getElementById('jsVideoPreview') ;

let mediaStream ;
let videoRecorder ;

const handleVideoData = (e) => {
    const { data : videoFile } = e ;
    const link = document.createElement('a') ;
    link.href = URL.createObjectURL(videoFile) ;
    link.download = 'recorded.webm' ;
    document.body.appendChild(link) ;
    link.click() ;
} ;

const startRecording = () => {
    videoRecorder = new MediaRecorder(mediaStream) ; 
    videoRecorder.start() ;
    videoRecorder.ondataavailable =  handleVideoData ;
    recorederButton.addEventListener('click', stopRecording, false) ;
} ;

const stopRecording = () => {
    videoRecorder.stop() ;
    recorederButton.removeEventListener('click', stopRecording, false) ;
    recorederButton.addEventListener('click', getVideo, false) ;
    recorederButton.innerHTML = 'Start Recording' ;
} ;

const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : true,
        }) ;
        videoPreview.srcObject = stream ;
        videoPreview.muted = true ;
        videoPreview.play() ;
        recorederButton.innerHTML = "Stop Recording" ;
        mediaStream = stream ;
        startRecording() ;
    } catch(error) {
        console.log(error) ;
        recorederButton.innerHTML = "Can't Record" ;
    } finally {
        recorederButton.removeEventListener('click', getVideo, false) ;
    }
}

function init() {
    recorederButton.addEventListener('click', getVideo, false) ;
}

if(recorderContainer) {
    init() ;
}