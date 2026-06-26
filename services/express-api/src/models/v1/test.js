class Test {
    async post(requestBody) {
        try {
            return requestBody;
        } catch (error) {
            throw error;
        }
    }

    async get() {
        try {
            return "Hi from GET v1/test";
        } catch (error) {
            throw error;
        }
    }
}

export default Test;