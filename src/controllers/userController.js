export const getJoin = (req,res) => {
    return res.render("join",{pageTitle:"Join"});
}

export const postJoin = (req,res) => {
    return res.redirect("/");
}

export const edit = (req,res) => {
    return res.send("edit");
}
export const remove = (req,res) => {
    return res.send("remove");
}

export const login = (req,res) => {
    return res.send("Login");
}

export const logout = (req,res) => {
    return res.send("Logout");
}