import { GetRepositories } from "../repository/index.repository.js";

export class AuthController {
  static async register(req, res) {
    // return res.redirect("/login");
    const user = req.user;
    // return res.status(200).send({ message: "user created", user: req.user });
    const userRegistered = GetRepositories.authRepository.register({ user });
    return res.status(200).send({ message: "user registered", userRegistered });
  }
  static registerFail(req, res) {
    //return res.redirect('/registerError')
    return res.status(401).send(`Register not successul`);
  }

  static async login(req, res) {
    const user = req.user;

    const userLogin = await GetRepositories.authRepository.login({ user });

    res.cookie("token", userLogin, {
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
    return res
      .status(200)
      .send({ message: "user is logged in", user: req.user });
  }
}
