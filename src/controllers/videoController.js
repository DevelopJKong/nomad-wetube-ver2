import Video from "../model/Video";

// Video.find({},(error,videos) =>{
//   console.log("errors",error);
//   console.log("videos",videos);
// });

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); //exec 가 되었을때는 정확히 어떤것인지 제대로 알아두어야 할거 같다
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); // 여기서는 이렇게 해주는것이 좋다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.status(404).render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); // post에서는 video가 있는지 없는지만 확인하면 되기 때문에 exist가 더 정확하다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  // here we will add a video to the videos array
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);

  //delete Video
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    // search
    videos = await Video.find({
      title: {
        $regex: new RegExp(`^${keyword}`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
