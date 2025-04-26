const sql = require('mssql');
const dbConfig = require('../config/db.config');
const SalesRFQApprovalModel = require('../models/salesRFQApprovalModel');

class SalesRFQApprovalController {
    // Get all Sales RFQ Approvals
    static async getAllApprovals(req, res) {
        try {
            const pool = await sql.connect(dbConfig);
            const approvals = await SalesRFQApprovalModel.getAll(pool);

            if (!approvals || approvals.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No Sales RFQ Approvals found'
                });
            }

            res.status(200).json({
                success: true,
                data: approvals,
                count: approvals.length
            });
        } catch (err) {
            console.error('SQL error:', err);
            if (err.message.includes('not found') || err.message.includes('has been deleted')) {
                return res.status(404).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message
            });
        }
    }

    // Get a specific Sales RFQ Approval by ID
    static async getApprovalById(req, res) {
        try {
            if (!req.params.id || isNaN(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Sales RFQ Approval ID'
                });
            }

            const pool = await sql.connect(dbConfig);
            const approval = await SalesRFQApprovalModel.getById(pool, req.params.id);

            res.status(200).json({
                success: true,
                data: approval
            });
        } catch (err) {
            console.error('SQL error:', err);
            if (err.message.includes('not found') || err.message.includes('has been deleted')) {
                return res.status(404).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message
            });
        }
    }

    // Create a new Sales RFQ Approval
    static async createApproval(req, res) {
        try {
            const data = req.body;

            // Validate required fields
            const requiredFields = ['SalesRFQID', 'ApproverID', 'ApproverStatusID', 'CreatedByID'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            const pool = await sql.connect(dbConfig);
            const newId = await SalesRFQApprovalModel.create(pool, data);
            const newApproval = await SalesRFQApprovalModel.getById(pool, newId);

            res.status(201).json({
                success: true,
                message: 'Sales RFQ Approval created successfully',
                data: newApproval
            });
        } catch (err) {
            console.error('SQL error:', err);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message
            });
        }
    }

    // Update a Sales RFQ Approval
    static async updateApproval(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Sales RFQ Approval ID'
                });
            }

            // Validate required fields
            const requiredFields = ['ApproverID', 'ApproverStatusID'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            const pool = await sql.connect(dbConfig);
            await SalesRFQApprovalModel.update(pool, id, data);
            const updatedApproval = await SalesRFQApprovalModel.getById(pool, id);

            res.status(200).json({
                success: true,
                message: 'Sales RFQ Approval updated successfully',
                data: updatedApproval
            });
        } catch (err) {
            console.error('SQL error:', err);
            if (err.message.includes('not found') || err.message.includes('has been deleted')) {
                return res.status(404).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message
            });
        }
    }

    // Delete a Sales RFQ Approval
    static async deleteApproval(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Sales RFQ Approval ID'
                });
            }

            const pool = await sql.connect(dbConfig);
            await SalesRFQApprovalModel.delete(pool, id);

            res.status(200).json({
                success: true,
                message: 'Sales RFQ Approval deleted successfully'
            });
        } catch (err) {
            console.error('SQL error:', err);
            if (err.message.includes('not found') || err.message.includes('has been deleted')) {
                return res.status(404).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message
            });
        }
    }
}

module.exports = SalesRFQApprovalController;