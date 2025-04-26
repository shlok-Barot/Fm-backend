const sql = require('mssql');
const poolPromise = require('../config/db.config');

const PersonModel = {
  async managePerson(action, personData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (personData.PersonID) request.input('PersonID', sql.Int, personData.PersonID);
      if (personData.FirstName) request.input('FirstName', sql.NVarChar(50), personData.FirstName);
      if (personData.MiddleName) request.input('MiddleName', sql.NVarChar(50), personData.MiddleName);
      if (personData.LastName) request.input('LastName', sql.NVarChar(50), personData.LastName);
      if (personData.RoleID) request.input('RoleID', sql.Int, personData.RoleID);
      if (personData.Status) request.input('Status', sql.NVarChar(50), personData.Status);
      if (personData.Salutation) request.input('Salutation', sql.NVarChar(50), personData.Salutation);
      if (personData.Designation) request.input('Designation', sql.NVarChar(50), personData.Designation);
      if (personData.Gender) request.input('Gender', sql.NVarChar(30), personData.Gender);
      if (personData.DOB) request.input('DOB', sql.Date, personData.DOB);
      if (personData.JoiningDate) request.input('JoiningDate', sql.Date, personData.JoiningDate);
      if (personData.CompanyID) request.input('CompanyID', sql.Int, personData.CompanyID);
      if (personData.IsExternal !== undefined) request.input('IsExternal', sql.Bit, personData.IsExternal);
      if (personData.LoginID) request.input('LoginID', sql.NVarChar(50), personData.LoginID);
      if (personData.Password) request.input('Password', sql.NVarChar(255), personData.Password);
      if (personData.EmailID) request.input('EmailID', sql.NVarChar(100), personData.EmailID);
      if (personData.CreatedByID) request.input('CreatedByID', sql.Int, personData.CreatedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      // Execute stored procedure
      const result = await request.execute('ManagePerson');

      // For SELECT action, return the recordset along with output parameters
      if (action === 'SELECT') {
        return {
          result: result.output.Result,
          message: result.output.Message,
          data: result.recordset ? result.recordset[0] : null
        };
      }

      return {
        result: result.output.Result,
        message: result.output.Message
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
};

module.exports = PersonModel;