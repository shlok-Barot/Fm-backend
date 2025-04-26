const sql = require('mssql');
const poolPromise = require('../config/db.config');

class Certification {
    // Get all certifications
    static async get(certificationId = null) {
        try {
            if (!certificationId) {
                throw new Error('CertificationID is required.');
            }
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar(10), 'SELECT')
                .input('CertificationID', sql.Int, certificationId)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCertification');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset && result.recordset.length > 0 ? result.recordset[0] : null
            };
        } catch (err) {
            throw new Error(`Error retrieving certification: ${err.message}`);
        }
    }
    
    static async getAll(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('PageNumber', sql.Int, pageNumber)
                .input('PageSize', sql.Int, pageSize)
                .input('FromDate', sql.DateTime, fromDate)
                .input('ToDate', sql.DateTime, toDate)
                .execute('GetCertification');

            return {
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving certifications: ${err.message}`);
        }
    }

    // Create a new certification
    static async create({ certificationName, createdById }) {
        try {
            if (!certificationName) {
                throw new Error('CertificationName is required.');
            }
            const pool = await poolPromise;
            const request = pool.request();
            request.input('Action', sql.NVarChar(10), 'INSERT');
            request.input('CertificationName', sql.NVarChar(50), certificationName);
            request.input('CreatedByID', sql.Int, createdById || null);
            request.input('CertificationID', sql.Int, null);
            request.output('Result', sql.Int);
            request.output('Message', sql.NVarChar(500));
            const result = await request.execute('ManageCertification');

            return {
                result: result.output.Result,
                message: result.output.Message,
                certificationId: result.output.CertificationID
            };
        } catch (err) {
            throw new Error(`Error creating certification: ${err.message}`);
        }
    }

    // Update a certification
    static async update({ certificationId, certificationName }) {
        try {
            if (!certificationId) {
                throw new Error('CertificationID is required for update.');
            }
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar(10), 'UPDATE')
                .input('CertificationID', sql.Int, certificationId)
                .input('CertificationName', sql.NVarChar(50), certificationName)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCertification');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error updating certification: ${err.message}`);
        }
    }

    // Delete a certification
    static async delete({ certificationId, deletedById }) {
        try {
            if (!certificationId) {
                throw new Error('CertificationID is required for delete.');
            }
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar(10), 'DELETE')
                .input('CertificationID', sql.Int, certificationId)
                .input('DeletedByID', sql.Int, deletedById || null)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageCertification');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error deleting certification: ${err.message}`);
        }
    }
}

module.exports = Certification;