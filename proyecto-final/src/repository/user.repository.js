export class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getAll() {
    return await this.dao.getAll();
  }
  async getById({ id }) {
    return await this.dao.getById({ id });
  }
  async update(product) {
    return await this.dao.update(product);
  }
  async delete({ id }) {
    return await this.dao.delete({ id });
  }
}
