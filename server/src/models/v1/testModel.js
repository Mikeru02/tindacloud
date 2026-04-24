import connection from "../../core/database.js";

class TestModel {
    constructor() {
        this.db = connection;
    }

    async create(name) {
        const result = await this.db.query(
            `INSERT INTO test_table (name, created_at, updated_at)
            VALUES ($1, NOW(), NOW())
            RETURNING *`,
            [name]
        );

        return result.rows[0];
    }

    async getAll() {
        const result = await this.db.query(
            `SELECT * FROM test_table ORDER BY id DESC`
        );

        return result.rows;
    }

    async update(id, name) {
        const result = await this.db.query(
            `UPDATE test_table
            SET name = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *`,
            [name, id]
        );

        return result.rows[0];
    }

    async delete(id) {
        const result = await this.db.query(
            `DELETE FROM test_table
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        return result.rows[0];
    }
}

export default TestModel;