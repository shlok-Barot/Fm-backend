const sql = require('mssql');
const poolPromise  = require('../config/db.config');

class Currency {
    // Create a new currency
    static async create({ currencyName, createdById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'INSERT')
                .input('CurrencyName', sql.NVarChar, currencyName)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCurrency');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error creating currency: ${err.message}`);
        }
    }

    // Get all currencies with pagination and date filtering
    static async getAllCurrencies({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('PageNumber', sql.Int, pageNumber)
                .input('PageSize', sql.Int, pageSize)
                .input('FromDate', sql.DateTime, fromDate)
                .input('ToDate', sql.DateTime, toDate)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('GetAllCurrencies');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving currencies: ${err.message}`);
        }
    }

    // Get currency by ID
    static async get(currencyId = null) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'SELECT')
                .input('CurrencyID', sql.Int, currencyId)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCurrency');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving currency: ${err.message}`);
        }
    }

    // Update a currency
    static async update({ currencyId, currencyName, createdById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'UPDATE')
                .input('CurrencyID', sql.Int, currencyId)
                .input('CurrencyName', sql.NVarChar, currencyName)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCurrency');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error updating currency: ${err.message}`);
        }
    }

    // Delete (soft delete) a currency
    static async delete({ currencyId, deletedById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'DELETE')
                .input('CurrencyID', sql.Int, currencyId)
                .input('DeletedByID', sql.Int, deletedById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCurrency');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error deleting currency: ${err.message}`);
        }
    }
}

module.exports = Currency;