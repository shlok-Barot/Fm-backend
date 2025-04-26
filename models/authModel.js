const sql = require('mssql');
const poolPromise = require('../config/db.config');
const bcrypt = require('bcrypt');

class User {
  // Create a new user in tblPerson with all required fields
  static async createUser(userData, CreatedByID) {
    const pool = await poolPromise;
    const request = pool.request();
    const query = `
      INSERT INTO tblPerson (
        FirstName, MiddleName, LastName, EmailID, LoginID, Password, RoleID, CompanyID,
        CreatedByID, CreatedDateTime, IsDeleted
      ) VALUES (
        @FirstName, @MiddleName, @LastName, @EmailID, @LoginID, @Password, @RoleID, @CompanyID,
        @CreatedByID, GETDATE(), 0
      );
      SELECT SCOPE_IDENTITY() AS PersonID;
    `;

    // Hash the password before storing
        request.input('FirstName', sql.VarChar, userData.FirstName);
    request.input('MiddleName', sql.VarChar, userData.MiddleName || null);
    request.input('LastName', sql.VarChar, userData.LastName);
    request.input('EmailID', sql.VarChar, userData.EmailID);
    request.input('LoginID', sql.VarChar, userData.LoginID);
    request.input('Password', sql.VarChar, userData.Password);
    request.input('RoleID', sql.Int, userData.RoleID);
    request.input('CompanyID', sql.Int, userData.CompanyID);
    request.input('CreatedByID', sql.Int, CreatedByID);

    const result = await request.query(query);
    return result.recordset[0].PersonID;
  }

  // Check if a role exists
  static async getRoleById(RoleID) {
    const pool = await poolPromise;
    const request = pool.request();
    const query = `
      SELECT RoleID, RoleName 
      FROM tblRoles 
      WHERE RoleID = @RoleID AND IsDeleted = 0;
    `;
    request.input('RoleID', sql.Int, RoleID);
    const result = await request.query(query);
    return result.recordset[0];
  }

  // Check if a company exists
  static async getCompanyById(CompanyID) {
    const pool = await poolPromise;
    const request = pool.request();
    const query = `
      SELECT CompanyID 
      FROM tblCompany 
      WHERE CompanyID = @CompanyID AND IsDeleted = 0;
    `;
    request.input('CompanyID', sql.Int, CompanyID);
    const result = await request.query(query);
    return result.recordset[0];
  }

  // Check for duplicate LoginID or EmailID
  static async checkExistingUser(LoginID, EmailID) {
    const pool = await poolPromise;
    const request = pool.request();
    const query = `
      SELECT PersonID 
      FROM tblPerson 
      WHERE (LoginID = @LoginID OR EmailID = @EmailID) AND IsDeleted = 0;
    `;
    request.input('LoginID', sql.VarChar, LoginID);
    request.input('EmailID', sql.VarChar, EmailID);
    const result = await request.query(query);
    return result.recordset.length > 0;
  }

  // Get list of admins
  static async getAdmins() {
    const pool = await poolPromise;
    const request = pool.request();
    const query = `
      SELECT p.PersonID 
      FROM tblPerson p 
      INNER JOIN tblRoles r ON p.RoleID = r.RoleID 
      WHERE r.RoleName = 'Admin' AND p.IsDeleted = 0;
    `;
    const result = await request.query(query);
    return result.recordset;
  }
}

module.exports = User;