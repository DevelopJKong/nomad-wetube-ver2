import User from "../model/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });
  const pageTitle = "Join";
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
  const { username, password } = req.body;
  const exists = await User.exists({username});
  if(!exists) {
    return res.status(400).render("login",{
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists."
    })
  }
  return res.end();
};

export const edit = (req, res) => {
  return res.send("edit");
};
export const remove = (req, res) => {
  return res.send("remove");
};

export const logout = (req, res) => {
  return res.send("Logout");
};
