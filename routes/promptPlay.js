const router = require("express").Router();
const QRcode = require("qrcode")
const generatePayload = require("promptpay-qr")
const _ = require("lodash")

router.post("/payment", (req, res) => {
    const amount = parseFloat(_.get(req,["body", "amount"]));
    const mobileNumber = "0955747406";
    const payload = generatePayload(mobileNumber, {amount});
    const option = {
        color: {
            dark: "#000",
            light: "#fff"
        }
    }
    QRcode.toDataURL(payload, option, (err, url) => {
        if(err) {
            console.log("generate qr code fail")
            return res.status(400).json({
                RespCode: 400,
                RespMessage: "bad: " + err
            })
        }else {
            return res.status(200).json({
                RespCode: 200,
                RespMessage: "good",
                Result: url

            })
        }
    })
  });
  
  module.exports = router;