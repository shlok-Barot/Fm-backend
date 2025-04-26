const sql = require('mssql');
const poolPromise = require('../config/db.config');

class RolesModel {
  static async executeStoredProcedure(action, params = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (params.RoleID) request.input('RoleID', sql.Int, params.RoleID);
      if (params.RoleName) request.input('RoleName', sql.NVarChar(50), params.RoleName);
      if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);

      // Output parameters
      request.output('NewRoleID', sql.Int);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      // Execute stored procedure
      const result = await request.execute('ManageRoles');

      return {
        output: {
          NewRoleID: result.output.NewRoleID,
          Result: result.output.Result,
          Message: result.output.Message
        },
        recordset: result.recordset
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getAllRoles(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null, dateField = 'CreatedDateTime') {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      // Add input parameters
      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.Date, fromDate);
      request.input('ToDate', sql.Date, toDate);
      request.input('DateField', sql.NVarChar(50), dateField);
      
      // Add output parameters
      request.output('TotalRecords', sql.Int);
      
      // Execute stored procedure
      const result = await request.execute('FM_GetAllRoles');
      
      return {
        totalRecords: result.output.TotalRecords,
        data: result.recordset,
        pageNumber,
        pageSize
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getRoleById(id) {
    return this.executeStoredProcedure('SELECT', { RoleID: id });
  }

  static async createRole(data) {
    return this.executeStoredProcedure('INSERT', data);
  }

  static async updateRole(id, data) {
    return this.executeStoredProcedure('UPDATE', { RoleID: id, ...data });
  }

  static async deleteRole(id) {
    return this.executeStoredProcedure('DELETE', { RoleID: id });
  }
}

module.exports = RolesModel;