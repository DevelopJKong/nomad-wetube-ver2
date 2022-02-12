import Video from "../model/Video";
import Comment from "../model/Comment";
import User from "../model/User";

// Video.find({},(error,videos) =>{
//   console.log("errors",error);
//   console.log("videos",videos);
// });

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments"); //exec 가 되었을때는 정확히 어떤것인지 제대로 알아두어야 할거 같다
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id); // 여기서는 이렇게 해주는것이 좋다
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You're not the owner of the video");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id); // post에서는 video가 있는지 없는지만 확인하면 되기 때문에 exist가 더 정확하다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("success", "Changes saved.");
    return res.status(403).redirect("/");
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
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;

  const isHeroku = process.env.NODE_ENV === "production";

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
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
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  //반영이 안되었던 이유는 이벤트가 끝나지 않았기 때문에 반영이 되지 않았던 것이다
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const commentUser = await User.findById(user._id);
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  commentUser.comments.push(comment._id);
  commentUser.save();
  video.comments.push(comment._id);
  video.save();
  req.session.user = commentUser; //
  return res.status(201).json({ newCommentId: comment._id });
};


export const deleteComment = async (req, res) => {
  const { params: { id },
          body: { videoId },
          session:{ user }
  } = req;
  const video = await Video.findById(videoId);
  const commentUser = await User.findById(user._id);
  if(user.comments.indexOf(id) < 0) {
      req.flash("info", "Not authorized");
      return res.sendStatus(403);
  }
  commentUser.comments.splice(commentUser.comments.indexOf(id), 1);
  video.comments.splice(video.comments.indexOf(id), 1);
  await video.save();
  await commentUser.save();   
  await Comment.findByIdAndDelete(id);

  return res.sendStatus(204);

}