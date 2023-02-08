const router = require("express").Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51MOdbYGVPorzCmOi30MR95LeaSqyaqngq9ZGGzJWQxYUIcgmtx2YZRJcpaNvhT3Hn7LwNHP8cs91cbkDjA98AXY000OXNH2YH3');

router.post("/payment", async (req, res) => {

  try {
    const delivery = {
      price_data: {
        currency: 'thb',
        product_data: {
          name: req.body.transportBy,
        },
        unit_amount: Number(req.body.deliveryFee) * 100,
      },
      quantity: 1,
    }
    const products = req.body.cart.map((item) => {
      return {
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.name,
            images: [item.img],
            metadata: {
              id: item._id,
              name: item.name,
            }
          },

          unit_amount: ((item.price - (item.price * (item.discount / 100)).toFixed(2))).toFixed(2) * 100,
        },
        quantity: item.quantity,
      }
    })

    const line_items = [...products, delivery];

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment', 
      success_url: 'http://localhost:3000/success?id={CHECKOUT_SESSION_ID}',
      // cancel_url: 'http://localhost:4242/cancel',
    });

    res.send({ session: session, order: req.body });

  } catch (err) {
    console.log({ message: err.message })
  }
});

router.get('/checkout-session', async (req, res) => {
  try{
    const session = await stripe.checkout.sessions.retrieve(req.query.id, { expand: ['line_items'] } );
    res.json(session);

  }catch(err){
    res.status(401).json(err)
  }
});

module.exports = router;