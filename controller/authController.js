const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNum: req.body.phoneNum,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.login = async (req, res) => {
    try {
        //หา database ว่ามี username นี้ไหม
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json("Email is wrong!")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        OriginalPassword !== req.body.password && res.status(401).json("Password is wrong!")

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...other } = user._doc;

        res.status(200).json({ ...other, accessToken })
    } catch (err) {
        res.status(500).json(err)
    }
}