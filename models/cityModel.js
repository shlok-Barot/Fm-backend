const sql = require('mssql');
const  poolPromise  = require('../config/db.config');

class City {
    // Get all cities with pagination and date filtering
    static async getAllCities(pageNumber, pageSize, fromDate, toDate) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('PageNumber', sql.Int, pageNumber)
                .input('PageSize', sql.Int, pageSize)
                .input('FromDate', sql.DateTime, fromDate)
                .input('ToDate', sql.DateTime, toDate)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('GetAllCities');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset || [],
                totalRecords: result.recordset?.length || 0,
                pageNumber: pageNumber,
                pageSize: pageSize
            };
        } catch (err) {
            throw new Error(`Error retrieving cities: ${err.message}`);
        }
    }
    // Create a new city
    static async create({ cityName, countryId, createdById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'INSERT')
                .input('CityName', sql.NVarChar, cityName)
                .input('CountryID', sql.Int, countryId)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCity');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error creating city: ${err.message}`);
        }
    }

    // Get city/cities
    static async get(cityId = null) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'SELECT')
                .input('CityID', sql.Int, cityId)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCity');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving city: ${err.message}`);
        }
    }

    // Update a city
    static async update({ cityId, cityName, countryId, createdById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'UPDATE')
                .input('CityID', sql.Int, cityId)
                .input('CityName', sql.NVarChar, cityName)
                .input('CountryID', sql.Int, countryId)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCity');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error updating city: ${err.message}`);
        }
    }

    // Delete (soft delete) a city
    static async delete({ cityId, deletedById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'DELETE')
                .input('CityID', sql.Int, cityId)
                .input('DeletedByID', sql.Int, deletedById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCity');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error deleting city: ${err.message}`);
        }
    }
}

module.exports = City;