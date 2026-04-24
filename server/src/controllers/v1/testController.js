import TestModel from "../../models/v1/testModel.js";

class TestController {
    constructor() {
        this.test = new TestModel();
    }

    async create(req, res) {
        try {
            const { name } = req.body || {};

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Request field is required!"
                });
            }

            const response = await this.test.create(name);

            return res.status(200).json({
                success: true,
                data: response
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async get(req, res) {
        try {
            const response = await this.test.getAll();
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default TestController;