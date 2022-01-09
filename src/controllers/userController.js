import User from "../model/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password,password2, location } = req.body;
  
  if(password !== password2) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });
  const pageTitle = "Join";
  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
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
