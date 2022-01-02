let videos = [
  {
    id: 1,
    title: "Frist Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
  },
  {
    id: 2,
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
  }, 
  {
    id: 3,
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "home",videos,video});
};

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id-1];
  return res.render("watch", { pageTitle: `Watching ${video.title}` });
};

export const edit = (req, res) => {
  return res.render("edit", { pageTitle: "edit" });
};

export const search = (req, res) => {
  return res.send("Search");
};

export const upload = (req, res) => {
  return res.send("Upload");
};

export const deleteVideo = (req, res) => {
  res.send("Delete Video");
};
