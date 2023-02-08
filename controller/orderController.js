const Order = require("../models/Order");
exports.getOrders = async (req, res, next) => {

    const qStatus = req.query.status;
    const qnews = req.query.news;
    const qPage = req.query.page;
    let qSort = req.query.sort;

    if (qSort === "desc") {
        qSort = -1
    } else {
        qSort = 1
    }
    const qSearch = req.query.search;
    const LIMIT = req.query.limit;
    try {

        if (qSearch) {
            const startIndex = (Number(qPage ?? 1) - 1) * LIMIT;
            const orders = await Order.find({ _id: qSearch }).sort({ _id: Number(qSort) ?? -1 }).limit(LIMIT).skip(startIndex);
            const total = await Order.find({ _id: qSearch }).count()
            res.status(200).json(
                {
                    data: orders,
                    currentPage: Number(qPage ?? 1),
                    numberOfPage: Math.ceil(total / LIMIT),
                    totalProduct: total,
                }
            );
        };

        if (qStatus) {
            const startIndex = (Number(qPage ?? 1) - 1) * LIMIT;
            const orders = await Order.find({ status: qStatus }).sort({ _id: Number(qSort) ?? -1 }).limit(LIMIT).skip(startIndex);
            const total = await Order.find({ status: qStatus }).count()
            res.status(200).json(
                {
                    data: orders,
                    currentPage: Number(qPage ?? 1),
                    numberOfPage: Math.ceil(total / LIMIT),
                    totalProduct: total,
                }
            );
        };

        if (qnews) {
            const orders = await Order.find().sort({ _id: -1 }).limit(LIMIT)
            res.status(200).json(orders);
        }

        total = await Order.countDocuments({});
        const startIndex = (Number(qPage) - 1) * LIMIT;
        const orders = await Order.find().sort({ _id: Number(qSort) }).limit(LIMIT).skip(startIndex);

        res.status(200).json(
            {
                data: orders,
                currentPage: Number(qPage ?? 1),
                numberOfPage: Math.ceil(total / LIMIT),
                totalProduct: total,
            });
    } catch (err) {
        next(err)
    }
};

exports.getOrdersUser = async (req, res, next) => {
    const qSessionId = req.query.sessionId
    const qPage = req.query.page;
    const LIMIT = req.query.limit;
    const startIndex = (Number(qPage) - 1) * LIMIT;

    try {
        const total = await Order.find({ userId: req.params.id }).count()
        const orders = await Order.find({ userId: req.params.id }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        if (qSessionId) {
            const order = await Order.findOne({ $and: [{ userId: req.params.id }, { sessionId: qSessionId }] })
            res.status(200).json(order)
        };

        res.status(200).json(
            {
                data: orders,
                currentPage: Number(qPage ?? 1),
                numberOfPage: Math.ceil(total / LIMIT),
            });
    } catch (err) {
        next(err)
    }
};

exports.income = async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth },
                    ...(productId && {
                        products: { $elemMatch: { productId } },
                    }),
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(previousMonth);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.postOrder = async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.putOrder = async (req, res) => {
    try {

        if (!req.user.isAdmin) {
            //req.params.id is checkoutSessionId
            const updatedOrder = await Order.findOneAndUpdate(
                { sessionId: req.params.id },
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedOrder);
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.find({ _id: req.params.id });
        res.status(200).json(order);
      } catch (err) {
        res.status(500).json(err);
      }
}