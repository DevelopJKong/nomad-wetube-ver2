const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  //if the video is playing pause it
  if (video.paused) {
    video.play();
  } else {
    //else play the video
    video.pause();
  }
  playBtn.innerText = playBtn.video.paused ? "Play" : "Pause";
};
const handlePause = () => {
  playBtn.innerText = "Play";
};
const handlePlay = () => {
  playBtn.innerText = "Pause";
};
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if(video.muted){
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

playBtn.addEventListener("click", handlePlayClick);
//muteBtn.addEventListener("click", handleMute);
//video.addEventListener("pause",handlePause);
video.addEventListener("play", handlePlay);
volumeRange.addEventListener("input", handleVolumeChange);
