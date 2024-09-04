export class AuthtRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async register({ user }) {
    return this.dao.register({ user });
  }
  async login({ user }) {
    return this.dao.login({ user });
  }
}
