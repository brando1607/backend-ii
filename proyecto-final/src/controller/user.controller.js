import { userModel } from "../model/user.model.js";
import { createHash } from "../utils/hashPassword.js";

export class UserController {
  static async register(req, res) {
    // return res.redirect("/login");
    return res.status(200).send({ message: "user created" });
  }
  static registerFail(req, res) {
    //return res.redirect('/registerError')
    return res.status(401).send(`Register not successul`);
  }

  static async delete(req, res) {
    const id = req.params.id;

    const user = await userModel.findById(id);
    await user.deleteOne();
    return res.send(`user deleted`);
  }
  static async changePassword(req, res) {
    const { password, age, email } = req.body;

    if (!password || !age) {
      return res.status(400).send(`All elements are mandatory`);
    }

    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).send(`User not found`);
      }

      const ageIsCorrect = user.age === Number(age);

      if (!ageIsCorrect) {
        return res
          .status(401)
          .send(`Age is not valid, password can't be changed.`);
      }

      const newPassword = await createHash(password);

      await userModel.findOneAndUpdate(
        { email: email },
        {
          password: newPassword,
        }
      );

      //return res.redirect("/login");
      return res.status(201).json({ message: "Password changed" });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
