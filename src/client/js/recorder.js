import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

// 기존에는 init 함수 안에 stream을 const로 선언을 했는데 이렇게 하면
// 서로 공유를 하지 못하기 때문에 이렇게 밖으로 빼서 let으로 선언하였습니다
let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName; //download에 대해서 제대로 알아두어야 할거 같습니다
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {

  actionBtn.removeEventListener("click",handleDownload);
  actionBtn.innerText = "Transcoding ....";
  actionBtn.disabled = true;

  //ffmpeg에서 파일을 생성하기
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  //ffmpeg에서 파일"을 실행하기
  //"-r" "60" 영상 초당 60프레임으로 인코딩
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  // "-i" 은 input 입니다 "-ss"는 영상 특정시간으로 가게 해줍니다
  // "-frames:v" "1" 영상의 첫 프레임의 사진을 찍어줍니다
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl); // 해당 객체를 메모리에서 지우고 싶다는 것
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click",handleStart);
};


const handleStart = () => {
  actionBtn.innerText = "Stop Record";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

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
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

actionBtn.addEventListener("click", handleStart);

init();
