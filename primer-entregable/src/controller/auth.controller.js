import { generateToken } from "../utils/jwt.js";

export class AuthController {
  static async login(req, res) {
    const payload = {
      email: req.user.email,
      role: req.user.role,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 3,
      httpOnly: true,
    });
    // return res.redirect("/api/auth/current");
    return res.status(200).send({ message: "Logged in" });
  }
  static loginError(req, res) {
    //return res.redirect('/loginError')
    return res.status(401).send(`Login not successul`);
  }
  static async current(req, res) {
    // return res.redirect("/current");
    return res.status(200).send({ message: "user logged in", user: req.user });
  }

  static async logout(req, res) {
    res.cookie("token", "", { expires: new Date(0) });

    // return res.redirect("/login");
    return res.status(200).send({ message: "Logged out" });
  }
}
