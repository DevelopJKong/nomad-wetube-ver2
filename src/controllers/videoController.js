const fakeUser = {
  username: "Jeong",
  loggedIn: false,
};

export const trending = (req, res) => {
  const videos = [
    {
      title: "Frist Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
    },
    {
      title: "Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
    },
  ];
  return res.render("home", { pageTitle: "home", fakeUser, videos });
};

export const see = (req, res) => {
  return res.render("watch", { pageTitle: "Watch" });
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
