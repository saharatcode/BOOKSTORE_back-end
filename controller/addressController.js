const Adress = require("../models/Adress");

exports.postAdress = async (req, res) => {
    const newAdress = new Adress(req.body);
    try {
        const savedAdress = await newAdress.save();
        res.status(201).json(savedAdress);
    } catch (err) {
        res.status(500).json(err)
    }
};

exports.getAdress = async (req, res) => {
    try {
        const adress = await Adress.find({
            userId: {
                $in: [req.params.id],
            },
        });
        res.status(200).json(adress);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.putAdress = async (req, res) => {
    try {
        const userAddress = await Adress.findOne({
            $and: [
                { userId: req.user.id },
                { isMainAdress: true }
            ]
        });

        if (userAddress) {
            await Adress.findByIdAndUpdate(
                userAddress._id,
                {
                    $set: { isMainAdress: false }
                },
                { new: true }
            );

            const updatedAdress = await Adress.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );

            res.status(200).json(updatedAdress);
        } else {
            const updatedAdress = await Adress.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );

            res.status(200).json(updatedAdress);
        };

        res.status(200).json(userAddress);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteAdress = async (req, res) => {
    try {
        await Adress.findByIdAndDelete(req.params.id);
        res.status(200).json("Adress has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
};