require('dotenv').config()
const express = require("express");
const app = express();
const moongoose = require("mongoose");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const stripeRouth = require("./routes/stripe")
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const authRouth = require("./routes/auth")
const addressRouth = require("./routes/address")

app.use(express.urlencoded({ extended: false }));
const cors = require("cors")
app.use('/static', express.static('public/images'))

//Connect with MongoDB
moongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB conection successfull."))
.catch((err) => {
    console.log(err)
})

app.use(cors())
app.use(express.json({verify:(req, res, buffer)=> req['rawBody'] = buffer, }));

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/auth", authRouth);
app.use("/api/checkout", stripeRouth);
app.use("/api/address", addressRouth);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend sever is runing!");
    
})