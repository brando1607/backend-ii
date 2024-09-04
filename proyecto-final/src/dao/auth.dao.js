import { generateToken } from "../utils/jwt.js";

export class AuthDao {
  static async register({ user }) {
    return { message: "user created", user };
  }
  static async login({ user }) {
    const payload = {
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
    };

    const token = generateToken(payload);

    return token;
  }
}
