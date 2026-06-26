// Import models here!
import Test from "../../models/v1/test.js";

class TestController {
    constructor() {
        this.test = new Test();
    }

    async post(req, res) {
        try {
            const response = await this.test.create();
            res.status(200).json({
                success: true,
                data: response
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }

    async get(req, res) {
        try {
            const response = await this.test.get();
            res.status(200).json({
                success: true,
                data: response
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

export default TestController;