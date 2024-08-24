export async function getUserGart(req, vToken, uModel, cModel) {
  const tokenData = vToken(req.cookies.token);
  const user = await uModel.findOne({ email: tokenData.email });
  const userCart = await cModel.findOne({ _id: user.cart });

  return userCart;
}
