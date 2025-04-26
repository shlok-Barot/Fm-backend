const sql = require('mssql');
const poolPromise = require('../config/db.config');

class BankAccount {
    // Get all bank accounts with pagination and date filtering
    static async getAllBankAccounts(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            request.input('PageNumber', sql.Int, pageNumber);
            request.input('PageSize', sql.Int, pageSize);
            request.input('FromDate', sql.DateTime, fromDate);
            request.input('ToDate', sql.DateTime, toDate);

            const result = await request.execute('GetBankAccount');

            return {
                success: true,
                message: '',
                data: result.recordset || [],
                totalRecords: result.recordset ? result.recordset.length : 0,
                pageNumber,
                pageSize
            };
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }
    // Get all bank accounts
    static async get(bankAccountId = null) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'SELECT')
                .input('BankAccountID', sql.Int, bankAccountId)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageBankAccount');

            return {
                result: result.output.Result,
                message: result.output.Message,
                data: result.recordset || []
            };
        } catch (err) {
            throw new Error(`Error retrieving bank account: ${err.message}`);
        }
    }

    // Create a new bank account
    static async create({
        accountName,
        accountType,
        bankName,
        branchCode,
        iban,
        ifsc,
        micra,
        accountVerified,
        isDefaultAccount,
        disabled,
        createdById
    }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'INSERT')
                .input('AccountName', sql.NVarChar, accountName)
                .input('AccountType', sql.NVarChar, accountType)
                .input('BankName', sql.NVarChar, bankName)
                .input('BranchCode', sql.NVarChar, branchCode)
                .input('IBAN', sql.NVarChar, iban)
                .input('IFSC', sql.NVarChar, ifsc)
                .input('MICRA', sql.NVarChar, micra)
                .input('AccountVerified', sql.Bit, accountVerified)
                .input('IsDefaultAccount', sql.Bit, isDefaultAccount)
                .input('Disabled', sql.Bit, disabled)
                .input('CreatedByID', sql.Int, createdById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageBankAccount');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error creating bank account: ${err.message}`);
        }
    }

    // Update a bank account
    static async update({
        bankAccountId,
        accountName,
        accountType,
        bankName,
        branchCode,
        iban,
        ifsc,
        micra,
        accountVerified,
        isDefaultAccount,
        disabled
    }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'UPDATE')
                .input('BankAccountID', sql.Int, bankAccountId)
                .input('AccountName', sql.NVarChar, accountName)
                .input('AccountType', sql.NVarChar, accountType)
                .input('BankName', sql.NVarChar, bankName)
                .input('BranchCode', sql.NVarChar, branchCode)
                .input('IBAN', sql.NVarChar, iban)
                .input('IFSC', sql.NVarChar, ifsc)
                .input('MICRA', sql.NVarChar, micra)
                .input('AccountVerified', sql.Bit, accountVerified)
                .input('IsDefaultAccount', sql.Bit, isDefaultAccount)
                .input('Disabled', sql.Bit, disabled)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageBankAccount');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error updating bank account: ${err.message}`);
        }
    }

    // Delete a bank account
    static async delete({ bankAccountId, deletedById }) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Action', sql.NVarChar, 'DELETE')
                .input('BankAccountID', sql.Int, bankAccountId)
                .input('DeletedByID', sql.Int, deletedById)
                .output('Result', sql.Int)
                .output('Message', sql.NVarChar(500))
                .execute('ManageBankAccount');

            return {
                result: result.output.Result,
                message: result.output.Message
            };
        } catch (err) {
            throw new Error(`Error deleting bank account: ${err.message}`);
        }
    }
}

module.exports = BankAccount;