export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async create({ tokenData }) {
    return await this.dao.create({ tokenData });
  }
  async getById({ id }) {
    return await this.dao.getById({ id });
  }
  async delete({ id }) {
    return await this.dao.delete({ id });
  }
  async addProduct({ tokenData, body }) {
    return await this.dao.addProduct({ tokenData, body });
  }
  async removeProduct({ params }) {
    return await this.dao.removeProduct({ params });
  }
  async purchase({ id }) {
    return await this.dao.purchase({ id });
  }
}
