const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const textarea = document.querySelector(".video__comment-textarea");
const submitBtn = document.querySelector(".video__comment-btn");


let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = () => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
    document.addEventListener("keypress",handleKeypressFullScreen);
    document.addEventListener("keypress",handleKeypressSpaceBar);
  } else {
    video.pause();
    document.removeEventListener("keypress",handleKeypressFullScreen);
    document.removeEventListener("keypress",handleKeypressSpaceBar);
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handlePlayEnd = () => {
  if(video.currentTime === video.duration) {
    playBtnIcon.classList = "fas fa-play";
  }
}

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted === false) {
    video.muted = false;
    //muteBtn.innerText = "Mute"; // 여기서 mute를 바꿔버리면 문제가 생긴다
  } 
  volumeValue = value;
  video.volume = value;
};
const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const handleLoadedData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
const isHeroku = process.env.NODE_ENV === "production";
if (isHeroku && video) {
  handleLoadedData();
}

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
  handlePlayEnd();
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement; //fullscreenElement 에 대해서 정확하게 알아두어야 할거같다
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }

  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });

};

const handleKeypressFullScreen = (event) => {

  const fullscreen = document.fullscreenElement;

  if (event.keyCode === 102 || event.keyCode === 70) {
    if (fullscreen) {
      document.exitFullscreen();
      fullScreenIcon.classList = "fas fa-expand";
    } else {
      videoContainer.requestFullscreen();
      fullScreenIcon.classList = "fas fa-compress";
    }
  }
};

const handleKeypressSpaceBar = (event) => {
  event.preventDefault();
  if (event.keyCode === 32) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
  }
};

const handleStopTextareaEvent = () => {
  document.removeEventListener("keypress",handleKeypressFullScreen);
  document.removeEventListener("keypress",handleKeypressSpaceBar);
}
const handleAddTextareaEvent = () => {
  document.addEventListener("keypress",handleKeypressFullScreen);
  document.addEventListener("keypress",handleKeypressSpaceBar);
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
textarea.addEventListener("click",handleStopTextareaEvent);
submitBtn.addEventListener("click",handleAddTextareaEvent);
document.addEventListener("keypress",handleKeypressFullScreen);
document.addEventListener("keypress",handleKeypressSpaceBar);


video.addEventListener("loadedmetadata", handleLoadedData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
