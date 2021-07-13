import Product from '../models/product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error(error);
  }
};

export const addProductReview = async (req, res) => {
  const productId = req.params.id;
  const { review, currentUser: user } = req.body;

  try {
    const product = await Product.findById(productId);

    const newReview = {
      userId: user._id,
      rating: review.rating,
      comment: review.comment,
      name: user.name,
    };

    product.reviews.push(newReview);

    product.rating = (
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    ).toFixed(2);

    await product.save();
    res.status(200).send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Sever Error');
  }
};

export const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id });
    if (!deletedProduct)
      return res.status(400).send("Such Product doesn't exits !!");
    res.status(200).send(deletedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).send('Internal Server Error ');
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({ ...req.body });
    await newProduct.save();
    res.status(200).send(newProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Sever Error');
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const product = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { ...product },
      { new: true }
    );
    console.log('updated Product : ', updatedProduct);
    res.status(200).send(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error !!');
  }
};
