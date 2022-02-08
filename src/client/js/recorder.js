import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream; // 기존에는 init 함수 안에 stream을 const로 선언을 했는데 이렇게 하면
// 서로 공유를 하지 못하기 때문에 이렇게 밖으로 빼서 let으로 선언하였습니다
let recorder;
let videoFile;

const handleDownload = async () => {
  //ffmpeg에서 파일을 생성하기
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  //ffmpeg에서 파일"을 실행하기
  //"-r" "60" 영상 초당 60프레임으로 인코딩
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  // "-i" 은 input 입니다 "-ss"는 영상 특정시간으로 가게 해줍니다
  // "-frames:v" "1" 영상의 첫 프레임의 사진을 찍어줍니다
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thmubnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4"; //download에 대해서 제대로 알아두어야 할거 같습니다
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg"; //download에 대해서 제대로 알아두어야 할거 같습니다
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(mp4URL);
  URL.revokeObjectURL(thumbUrl); // 해당 객체를 메모리에서 지우고 싶다는 것
  URL.revokeObjectURL(videoFile);
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Record";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  console.log(recorder);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);

    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

startBtn.addEventListener("click", handleStart);

init();
