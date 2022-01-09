import User from "../model/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, location } = req.body;
  const usernameExists = await User.exists({ username });
  const pageTitle = "Join";
  if (usernameExists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This username is already taken",
    });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This email is already taken"
    })
  }
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};

export const edit = (req, res) => {
  return res.send("edit");
};
export const remove = (req, res) => {
  return res.send("remove");
};

export const login = (req, res) => {
  return res.send("Login");
};

export const logout = (req, res) => {
  return res.send("Logout");
};
