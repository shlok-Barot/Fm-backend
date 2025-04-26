const sql = require('mssql');
const poolPromise  = require('../config/db.config');

class CountryOfOrigin {
    // Create a new country of origin
    static async create({ countryOfOrigin, createdById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'INSERT')
                .input('CountryOfOrigin', sql.NVarChar, countryOfOrigin)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCountryOfOrigin');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error creating country of origin: ${err.message}`);
        }
    }

    // Get country of origin(s)
    static async get(countryOfOriginId = null) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'SELECT')
                .input('CountryOfOriginID', sql.Int, countryOfOriginId)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCountryOfOrigin');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving country of origin: ${err.message}`);
        }
    }

    // Get all countries of origin with pagination
    static async getAll(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('PageNumber', sql.Int, pageNumber)
                .input('PageSize', sql.Int, pageSize)
                .input('FromDate', sql.Date, fromDate)
                .input('ToDate', sql.Date, toDate)
                .execute('GetCountryOfOrigin');

            return {
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving countries of origin: ${err.message}`);
        }
    }

    // Update a country of origin
    static async update({ countryOfOriginId, countryOfOrigin, createdById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'UPDATE')
                .input('CountryOfOriginID', sql.Int, countryOfOriginId)
                .input('CountryOfOrigin', sql.NVarChar, countryOfOrigin)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCountryOfOrigin');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error updating country of origin: ${err.message}`);
        }
    }

    // Delete (soft delete) a country of origin
    static async delete({ countryOfOriginId, deletedById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'DELETE')
                .input('CountryOfOriginID', sql.Int, countryOfOriginId)
                .input('DeletedByID', sql.Int, deletedById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCountryOfOrigin');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error deleting country of origin: ${err.message}`);
        }
    }
}

module.exports = CountryOfOrigin;