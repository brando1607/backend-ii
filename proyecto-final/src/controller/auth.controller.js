import { generateToken } from "../utils/jwt.js";

export class AuthController {
  static async register(req, res) {
    // return res.redirect("/login");
    const user = req.user;

    return res.status(200).send({ message: "user registered", user });
  }
  static registerFail(req, res) {
    //return res.redirect('/registerError')
    return res.status(401).send(`Register not successul`);
  }

  static async login(req, res) {
    const user = req.user;

    const payload = {
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 3,
      httpOnly: true,
    });
    // return res.redirect("/api/auth/current");
    return res.status(200).send({ message: "Login successfull" });
    // return res.status(200).send({ message: "Logged in" });
  }
  static loginError(req, res) {
    //return res.redirect('/loginError')
    return res.status(401).send(`Login not successfull`);
  }
  static async current(req, res) {
    // return res.redirect("/current");
    const user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      age: req.user.age,
    };
    return res.status(200).send({ message: "user is logged in", user: user });
  }
}
