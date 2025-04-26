// controllers/permissionController.js
const PermissionModel = require('../models/permissionModel');

class PermissionController {
    static async getAllPermissions(req, res) {
        try {
            const pageNumber = parseInt(req.query.pageNumber) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
            const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

            const result = await PermissionModel.getAllPermissions(pageNumber, pageSize, fromDate, toDate);

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                pagination: {
                    totalRecords: result.totalRecords,
                    pageNumber: result.pageNumber,
                    pageSize: result.pageSize,
                    totalPages: Math.ceil(result.totalRecords / result.pageSize)
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createPermission(req, res) {
        try {
            const { PermissonName, CreatedByID } = req.body;
            if (!PermissonName) {
                return res.status(400).json({ error: 'PermissonName is required' });
            }

            const result = await PermissionModel.executeManagePermission('INSERT', {
                PermissonName,
                CreatedByID
            });

            res.status(result.result === 0 ? 201 : 400).json({
                success: result.result === 0,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updatePermission(req, res) {
        try {
            const { PermissionID, PermissonName, CreatedByID } = req.body;
            if (!PermissionID) {
                return res.status(400).json({ error: 'PermissionID is required' });
            }

            const result = await PermissionModel.executeManagePermission('UPDATE', {
                PermissionID,
                PermissonName,
                CreatedByID
            });

            res.status(result.result === 0 ? 200 : 400).json({
                success: result.result === 0,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deletePermission(req, res) {
        try {
            const { PermissionID } = req.body;
            if (!PermissionID) {
                return res.status(400).json({ error: 'PermissionID is required' });
            }

            const result = await PermissionModel.executeManagePermission('DELETE', {
                PermissionID
               
            });

            res.status(result.result === 0 ? 200 : 400).json({
                success: result.result === 0,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getPermission(req, res) {
        try {
            const { PermissionID } = req.params;
            if (!PermissionID) {
                return res.status(400).json({ error: 'PermissionID is required' });
            }

            const result = await PermissionModel.executeManagePermission('SELECT', {
                PermissionID: parseInt(PermissionID)
            });

            res.status(result.result === 0 ? 200 : 400).json({
                success: result.result === 0,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = PermissionController;