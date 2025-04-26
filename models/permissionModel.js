// models/permissionModel.js
const sql = require('mssql');
const poolPromise = require('../config/db.config');

class PermissionModel {
    static async getAllPermissions(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            // Input parameters
            request.input('PageNumber', sql.Int, pageNumber);
            request.input('PageSize', sql.Int, pageSize);
            request.input('FromDate', sql.DateTime, fromDate);
            request.input('ToDate', sql.DateTime, toDate);

            const result = await request.execute('GetAllPermissions');

            // The stored procedure returns two recordsets:
            // 1. Paginated permission data
            // 2. Total count
            if (!result.recordsets || result.recordsets.length < 2) {
                throw new Error('Invalid response from stored procedure');
            }

            const permissions = result.recordsets[0] || [];
            const totalCount = result.recordsets[1][0]?.TotalRecords || 0;

            return {
                result: 0,
                message: 'Permissions retrieved successfully',
                data: permissions,
                totalRecords: totalCount,
                pageNumber: pageNumber,
                pageSize: pageSize
            };
            }
         catch (err) {
            throw new Error(`Error fetching permissions: ${err.message}`);
        }
    }


    static async executeManagePermission(action, params) {
        try {
            let pool = await poolPromise;
            let request = pool.request();
            
            // Input parameters
            request.input('Action', sql.NVarChar(10), action);
            if (params.PermissionID) request.input('PermissionID', sql.Int, params.PermissionID);
            if (params.PermissonName) request.input('PermissonName', sql.NVarChar(50), params.PermissonName);
            if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);
            // if (params.DeletedByID) request.input('DeletedByID', sql.Int, params.DeletedByID);
            
            // Output parameters
            request.output('Result', sql.Int);
            request.output('Message', sql.NVarChar(500));

            let result = await request.execute('ManagePermission');
            
            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset
            };
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }
}
module.exports = PermissionModel;