exports.addOrder = async (req, res) => {
  try {
    const { user, products } = req.body;
   
    for (let item of products) {
      const product = await Products.findById(item.Product);
      if (!product) {
        return res
          .status(404)
          .send({ Msg: `Product with ID ${item.Product} not found` });
      }
     
    }
    const NewOrder = new Orders({ user, products, total });
    const userFound = await Users.findById(user);
    if (userFound) {
      await NewOrder.save();
      await NewOrder.populate("user");
      await NewOrder.populate("products.Product");
      userFound.Orders.push(NewOrder);
      await userFound.save();
    }
    res.status(201).send({ Msg: "Order Made Successfully", Orders: NewOrder });
  } catch (error) {
    res.status(500).send({ Msg: "Failed to toder" });
  }
};
