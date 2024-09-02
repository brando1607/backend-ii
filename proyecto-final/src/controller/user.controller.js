import { userModel } from "../model/user.model.js";
import { createHash } from "../utils/hashPassword.js";

export class UserController {
  static async getAll(req, res) {
    try {
      return res.send(await userModel.find());
    } catch (error) {
      console.error(error);
    }
  }
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      return res.status(200).send(user);
    } catch (error) {
      console.error(error);
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const body = req.body;
    const elementsToChange = Object.keys(body);

    try {
      const user = await userModel.findById(id);

      if (!user) {
        return res.status(400).send(`User not found`);
      }

      if (elementsToChange.includes("password")) {
        const newPassword = await createHash(body.password);

        await userModel.findOneAndUpdate(
          { id: id },
          {
            password: newPassword,
          }
        );
      }

      const updateElements = elementsToChange
        .filter((e) => e !== "password")
        .map(async (e) => {
          return await userModel.findByIdAndUpdate(
            { id },
            { e: `${body}[${e}]` }
          );
        });
      await Promise.all(updateElements);

      //return res.redirect("/login");
      return res.status(201).json({ message: `${elementsToChange} changed` });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  static async logout(req, res) {
    res.cookie("token", "", { expires: new Date(0) });

    // return res.redirect("/login");
    return res.status(200).send({ message: "Logged out" });
  }
  static async delete(req, res) {
    const id = req.params.id;

    const user = await userModel.findById(id);
    await user.deleteOne();
    return res.send(`user deleted`);
  }
}
