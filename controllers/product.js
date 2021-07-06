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
  const { productId, review, currentUser: user } = req.body;

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
