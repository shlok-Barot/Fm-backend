const RolesModel = require('../models/rolesModel');

class RolesController {
  static async getAllRoles(req, res) {
    try {
      const { 
        pageNumber = 1, 
        pageSize = 10,
        fromDate,
        toDate,
        dateField = 'CreatedDateTime'
      } = req.query;

      const result = await RolesModel.getAllRoles(
        parseInt(pageNumber),
        parseInt(pageSize),
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null,
        dateField
      );

      res.json({
        success: true,
        totalRecords: result.totalRecords,
        data: result.data || [],
        pageNumber: result.pageNumber,
        pageSize: result.pageSize
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getRoleById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid RoleID' });
      }
      const result = await RolesModel.getRoleById(id);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      if (!result.recordset || result.recordset.length === 0) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.json({
        message: result.output.Message,
        data: result.recordset[0]
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createRole(req, res) {
    try {
      const data = req.body;
      // Basic validation
      if (!data.RoleName || !data.CreatedByID) {
        return res.status(400).json({ message: 'RoleName and CreatedByID are required' });
      }
      const result = await RolesModel.createRole(data);
      if (result.output.Result !== 0) {
        return res.status(result.output.Result (400)).json({ message: result.output.Message });
      }
      res.status(201).json({
        message: result.output.Message,
        RoleID: result.output.NewRoleID
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateRole(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid RoleID' });
      }
      const data = req.body;
      const result = await RolesModel.updateRole(id, data);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({ message: result.output.Message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteRole(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { createdByID } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid RoleID' });
      }
      // if (!createdByID) {
      //   return res.status(400).json({ message: 'CreatedByID is required for deletion' });
      // }
      const result = await RolesModel.deleteRole(id);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({ message: result.output.Message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = RolesController;