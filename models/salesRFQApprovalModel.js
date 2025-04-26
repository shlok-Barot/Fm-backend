const sql = require('mssql');

class SalesRFQApprovalModel {
  // Get all Sales RFQ Approvals
  static async getAll(pool) {
    try {
      const request = pool.request();
      request.input('Action', sql.NVarChar(10), 'SELECT');
      const result = await request.execute('ManageSalesRFQApproval');
      return result.recordset;
    } catch (err) {
      console.error('Error fetching all Sales RFQ Approvals:', err);
      throw new Error(`Failed to fetch all Sales RFQ Approvals: ${err.message}`);
    }
  }

  // Get Sales RFQ Approval by ID
  static async getById(pool, id) {
    try {
      const request = pool.request();
      request.input('Action', sql.NVarChar(10), 'SELECT');
      request.input('SalesRFQID', sql.Int, id);
      const result = await request.execute('ManageSalesRFQApproval');
      
      if (!result.recordset || result.recordset.length === 0) {
        throw new Error(`Sales RFQ Approval with ID ${id} not found`);
      }
      return result.recordset[0];
    } catch (err) {
      console.error(`Error fetching Sales RFQ Approval with ID ${id}:`, err);
      throw new Error(`Failed to fetch Sales RFQ Approval with ID ${id}: ${err.message}`);
    }
  }

  // Create new Sales RFQ Approval
  static async create(pool, data) {
    try {
      const request = pool.request();
      request.input('Action', sql.NVarChar(10), 'INSERT');
      request.input('SalesRFQID', sql.Int, data.SalesRFQID);
      request.input('ApproverID', sql.Int, data.ApproverID);
      request.input('ApproverStatusID', sql.Int, data.ApproverStatusID);
      request.input('ApproverDateTime', sql.DateTime, data.ApproverDateTime || new Date());
      request.input('CreatedByID', sql.Int, data.CreatedByID);

      const result = await request.execute('ManageSalesRFQApproval');
      return { success: true };
    } catch (err) {
      console.error('Error creating Sales RFQ Approval:', err);
      throw new Error(`Failed to create Sales RFQ Approval: ${err.message}`);
    }
  }

  // Update Sales RFQ Approval
  static async update(pool, id, data) {
    try {
      const request = pool.request();
      request.input('Action', sql.NVarChar(10), 'UPDATE');
      request.input('SalesRFQID', sql.Int, id);
      request.input('ApproverID', sql.Int, data.ApproverID);
      request.input('ApproverStatusID', sql.Int, data.ApproverStatusID);
      request.input('ApproverDateTime', sql.DateTime, data.ApproverDateTime || new Date());

      await request.execute('ManageSalesRFQApproval');
      return { success: true };
    } catch (err) {
      console.error(`Error updating Sales RFQ Approval with ID ${id}:`, err);
      throw new Error(`Failed to update Sales RFQ Approval with ID ${id}: ${err.message}`);
    }
  }

  // Delete Sales RFQ Approval
  static async delete(pool, id, deletedByID) {
    try {
      const request = pool.request();
      request.input('Action', sql.NVarChar(10), 'DELETE');
      request.input('SalesRFQID', sql.Int, id);
      request.input('DeletedByID', sql.Int, deletedByID);

      await request.execute('ManageSalesRFQApproval');
      return { success: true };
    } catch (err) {
      console.error(`Error deleting Sales RFQ Approval with ID ${id}:`, err);
      throw new Error(`Failed to delete Sales RFQ Approval with ID ${id}: ${err.message}`);
    }
  }
}

module.exports = SalesRFQApprovalModel;