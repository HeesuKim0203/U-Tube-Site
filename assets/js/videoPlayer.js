
const videoContainer = document.getElementById('jsVideoPlayer');
const videoPlayer = document.querySelector('#jsVideoPlayer video');
const playButton = document.getElementById('jsPlayButton');
const volumeButton = document.getElementById('jsVolumeButton') ;
const screenButton = document.getElementById('jsPullScreen') ;
const currentTime = document.getElementById('currentTime') ;
const totalTime = document.getElementById('totalTime') ;
const jsVolume = document.getElementById('jsVolume') ;

const registerView = () => {
  const id = window.location.href.split('/')[4] ;

  fetch(`/api/${id}/view`, {
    method : 'POST'
  }) ;
}

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>' ;
  } else {
    videoPlayer.pause();
    playButton.innerHTML = '<i class="fas fa-play"></i>' ;
  }
}

function goFullScreen() {
   videoPlayer.webkitRequestFullscreen() ;
}

const formatData = seconds => {
  const secondsNumber = parseInt(seconds, 10) ;
  let hours = Math.floor(secondsNumber / 3600) ;
  let minutes = Math.floor((secondsNumber - hours * 3600 ) / 60) ;

  let totalSeconds = 0 ;

  if(hours >= 1 && hours < 10) {
    totalSeconds = secondsNumber - hours * 3600 ;
    hours = '0' + hours ;      
  }else {
    hours = '00' ;
  }

  if(minutes >= 1 && minutes < 10) {
    totalSeconds = totalSeconds - minutes * 60 ;
    minutes = '0' + minutes ;
  }else {
    minutes = '00' ;
  }
  
  if(hours == 0 && minutes == 0) {
    totalSeconds = secondsNumber ;
    
    if (totalSeconds < 10)
      totalSeconds = '0' + totalSeconds ;
  } 
    return `${hours}:${minutes}:${totalSeconds}` ;
}

function setTotalTime() {
  const totalTimeString = formatData(videoPlayer.duration) ;
  totalTime.innerHTML = totalTimeString ;

  playButton.removeEventListener('click', setTotalTime, false) ;
  
  const clear = setInterval(() => {
    const current = formatData(Math.floor(videoPlayer.currentTime)) ;
    currentTime.innerHTML = current ;
    if(currentTime.innerHTML === totalTimeString) {
      clearInterval(clear) ;
    }
  }, 1000) ;
}

function handleEnded() {
  registerView() ;
  playButton.innerHTML = '<i class="fas fa-play"></i>' ;
  playButton.addEventListener('click', setTotalTime, false) ;
}

function handleInput(event) {
  const {
    target : { value }
  } = event ;
  if(value == 0) {
    videoPlayer.muted = true ; 
    volumeButton.innerHTML = '<i class="fas fa-volume-off"></i>' ;
  }else {
    videoPlayer.muted = false ;
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>' ;
  }
  videoPlayer.volume = value ;
}

function volumeHandle() {
  if(jsVolume.style.opacity == 0) {
    jsVolume.style.opacity = 1 ;
  }else {
    jsVolume.style.opacity = 0 ;
  }
}

function init() {
  videoPlayer.volume = 0.5 ;
  setTotalTime() ;
  volumeButton.addEventListener('click', volumeHandle, false) ;
  playButton.addEventListener('click', handlePlayClick, false) ;
  screenButton.addEventListener('click', goFullScreen, false) ;
  videoPlayer.addEventListener('ended', handleEnded, false) ;
  jsVolume.addEventListener('input', handleInput, false) ;
}

window.onload = function() {
  if (videoContainer)
    init();
} ;
