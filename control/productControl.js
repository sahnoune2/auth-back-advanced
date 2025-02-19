const { findOne } = require("../schema/codes");
const Products = require("../schema/productSchema");
const users = require("../schema/userSchema");
const orders = require("../schema/orderShema");

const addProduct = async (req, res) => {
  try {
    const newProduct = new Products(req.body);
    await newProduct.save();
    res.status(200).send({ Msg: "Product Added Successfully" });
  } catch (error) {
    res.status(500).send({ Msg: "Failed !!", error });
  }
};

const getProduct = async (req, res) => {
  try {
    const allProducts = await Products.find();
    res.status(200).send({ Msg: "This is our List of Products", allProducts });
  } catch (error) {
    res.status(500).send({ Msg: "Empty", error });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const oneProduct = await Products.findById(req.params.id);
    res.status(200).send({ Msg: "this is our Product", oneProduct });
  } catch (error) {
    res.status(500).send({ Msg: "Failed to get Product", error });
  }
};

const deleteOneProduct = async (req, res) => {
  try {
    const found = await Products.findById(req.params.id);
    console.log(found);
    if (found == null) {
      res.status(400).send("Product Not Found");
    } else {
       await Products.findByIdAndDelete(req.params.id);
      res.status(200).send({ Msg: "Product Deleted Successfully" });
    }
  } catch (error) {
    res.status(500).send({ Msg: "Failed to Delete / Not Found", error });
  }
};

const addPanier = async (req, res) => {
  const { userID, productID, quantity } = req.body;

  try {
    const userFound = await users.findById(userID);
    console.log(userFound);
    const productFound = await Products.findById(productID);
    console.log(productFound);

    if (userFound && productFound) {
      userFound.panier.push({ product: productFound._id, quantity });
      await userFound.save();
      res.status(200).send({ msg: "product added to panier " });
    }
  } catch (error) {
    res.status(500).send({ msg: "error while trying to add to panier" });
  }
};

const addOrder = async (req, res) => {
  const { userID, panier } = req.body;
  try {
    for (let item of panier) {
      console.log(item);
      const productFound = await Products.findById(item.product);
      console.log(productFound);
      if (!productFound) {
        console.log("hhhhh");
        return res
          .status(400)
          .send({ msg: `This ${item.product} is not registered` });
      }
      if (productFound.stock === "out-of-stock") {
        return res
          .status(400)
          .send({ msg: `Product ${item.product} is out of stock` });
      }
    }

    const order = new orders({ userID, panier });
    const userFound = await users.findById(userID);
    if (!userFound) {
      return res.status(400).send({ msg: "User is not found" });
    } else {
      await order.save();
      await order.populate("userID");
      await order.populate("panier.product");
      res
        .status(200)
        .send({ msg: "Success populating the order", Orders: order });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error while populating the order" });
  }
};
const removeFromPanier = async (req, res) => {
  const { userID, productID } = req.body;

  try {
    const userFound = await users.findById(userID);
    if (!userFound) {
      return res.status(400).send({ msg: "User not found" });
    }
    const productInPanier = userFound.panier.find(
      (item) => item.product.toString() === productID
    );
    if (!productInPanier) {
      return res.status(400).send({ msg: "Product not found in panier" });
    }

    const result = await users.updateOne(
      { _id: userID },
      { $pull: { panier: { product: productID } } }
    );

    res.status(200).send({ msg: "Product removed from panier" });
  } catch (error) {
    res.status(500).send({ msg: "Error while removing from panier", error });
  }
};

const clearPanier = async (req, res) => {
  const { userID } = req.body;

  try {
    const userFound = await users.findById(userID);
    if (!userFound) {
      return res.status(400).send({ msg: "User not found" });
    }

    await users.updateOne({ _id: userID }, { $set: { panier: [] } });

    res.status(200).send({ msg: "Panier cleared successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Error while clearing panier", error });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getOneProduct,
  deleteOneProduct,
  addPanier,
  addOrder,
  removeFromPanier,
  clearPanier,
};
