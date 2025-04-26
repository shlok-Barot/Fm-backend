const User = require('../models/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const poolPromise = require('../config/db.config');
const sql = require('mssql');

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

class AuthController {
  static async adminSignup(req, res) {
    const { FirstName, MiddleName, LastName, EmailID, LoginID, Password, RoleID, CompanyID } = req.body;
    try {
      if (!FirstName || !LastName || !EmailID || !LoginID || !Password || !RoleID || !CompanyID) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      if (RoleID !== 2) {
        return res.status(403).json({ message: 'Only admin role (RoleID 2) is allowed for admin signup' });
      }

      const existingUser = await User.checkExistingUser(LoginID, EmailID);
      if (existingUser) {
        return res.status(400).json({ message: 'LoginID or EmailID already exists' });
      }

      const existingAdmins = await User.getAdmins();
      
      if (!existingAdmins || existingAdmins.length === 0) {
        const role = await User.getRoleById(RoleID);
        console.log(`Role fetched for RoleID ${RoleID}:`, role);
        const validRoleNames = ['admin', 'administrator'];
        if (!role || !validRoleNames.includes(role.RoleName.trim().toLowerCase())) {
          return res.status(404).json({ 
            message: 'Admin role (RoleID 2) does not exist or is invalid',
            debug: { role }
          });
        }
        const company = await User.getCompanyById(CompanyID);
        if (!company) {
          return res.status(400).json({ message: 'Invalid CompanyID' });
        }
        const hashedPassword = await bcrypt.hash(Password.trim(), 10);
        const userData = { FirstName, MiddleName, LastName, EmailID, LoginID, Password: hashedPassword, RoleID, CompanyID };
        const createdById = 1;
        const personId = await User.createUser(userData, createdById);

        const token = jwt.sign({ personId, role: 'Administrator' }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(201).json({ message: 'Admin created successfully', personId, token });
      }

      if (!req.user || req.user.role !== 'Administrator') {
        return res.status(401).json({ message: 'Authentication required as admin' });
      }
      const adminRole = await User.getRoleById(RoleID);
      console.log(`Admin role fetched for RoleID ${RoleID}:`, adminRole);
      const validRoleNames = ['admin', 'administrator'];
      if (!adminRole || !validRoleNames.includes(adminRole.RoleName.trim().toLowerCase())) {
        return res.status(404).json({ 
          message: 'Admin role (RoleID 2) does not exist or is invalid',
          debug: { adminRole }
        });
      }
      const company = await User.getCompanyById(CompanyID);
      if (!company) {
        return res.status(400).json({ message: 'Invalid CompanyID' });
      }
      const hashedPassword = await bcrypt.hash(Password.trim(), 10);
      const userData = { FirstName, MiddleName, LastName, EmailID, LoginID, Password: hashedPassword, RoleID, CompanyID };
      const createdById = req.user.personId;
      const personId = await User.createUser(userData, createdById);

      const token = jwt.sign({ personId, role: 'Administrator' }, SECRET_KEY, { expiresIn: '1h' });
      res.status(201).json({ message: 'Admin created successfully', personId, token });
    } catch (err) {
      console.error('Error in adminSignup:', err);
      res.status(500).json({ message: 'Error creating admin', error: err.message });
    }
  }

  static async createPerson(req, res) {
    const { FirstName, MiddleName, LastName, EmailID, LoginID, Password, RoleID, CompanyID } = req.body;
    
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(401).json({ message: 'Authentication required as admin' });
    }
    
    if (RoleID === 2) {
      return res.status(403).json({ message: 'Only system can create admin accounts' });
    }
    
    const createdById = req.user.personId;
    try {
      if (!FirstName || !LastName || !EmailID || !LoginID || !Password || !RoleID || !CompanyID) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      const existingUser = await User.checkExistingUser(LoginID, EmailID);
      if (existingUser) {
        return res.status(400).json({ message: 'LoginID or EmailID already exists' });
      }

      const role = await User.getRoleById(RoleID);
      if (!role) {
        return res.status(400).json({ message: 'Invalid RoleID' });
      }
      
      const adminRoleNames = ['admin', 'administrator'];
      if (adminRoleNames.includes(role.RoleName.trim().toLowerCase())) {
        return res.status(403).json({ message: 'Cannot create admin accounts through this endpoint' });
      }

      const company = await User.getCompanyById(CompanyID);
      if (!company) {
        return res.status(400).json({ message: 'Invalid CompanyID' });
      }

      const hashedPassword = await bcrypt.hash(Password.trim(), 10);

      const userData = {
        FirstName, MiddleName, LastName, EmailID, LoginID,
        Password: hashedPassword, RoleID, CompanyID
      };

      const personId = await User.createUser(userData, createdById);
      res.status(201).json({ message: 'User created successfully', personId });
    } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  }

  static async login(req, res) {
    const { LoginID, Password } = req.body;
    try {
      if (!LoginID || !Password) {
        return res.status(400).json({ message: 'LoginID and password are required' });
      }

      const pool = await poolPromise;
      const request = pool.request();
      const query = `
        SELECT p.PersonID, p.LoginID, p.Password, p.RoleID 
        FROM tblPerson p 
        JOIN tblRoles r ON p.RoleID = r.RoleID 
        WHERE p.LoginID COLLATE SQL_Latin1_General_CP1_CS_AS = @LoginID AND p.IsDeleted = 0;
      `;
      request.input('LoginID', sql.VarChar, LoginID);
      const result = await request.query(query);

      console.log('Query Result:', result.recordset);
      console.log('Query Raw:', result);

      if (result.recordset.length === 0) {
        console.log('No user found for LoginID:', LoginID, 'Case sensitive comparison:', LoginID === user?.LoginID);
        return res.status(401).json({ message: 'Invalid LoginID or password', details: 'No user found with this LoginID (case sensitive)' });
      }

      const user = result.recordset[0];
      console.log('User Data:', user);
      if (!user.Password.startsWith('$2a$') && !user.Password.startsWith('$2b$')) {
        console.log('Invalid password hash format for user:', LoginID);
        return res.status(500).json({ message: 'System error - invalid password format' });
      }
      
      const trimmedPassword = Password.trim();
      
      const isMatch = await bcrypt.compare(trimmedPassword, user.Password);
      console.log('Password Match:', isMatch);
      console.log('Input Password:', trimmedPassword);
      console.log('Stored Hash:', user.Password);

      if (!isMatch) {
        console.log('Password mismatch details:', {
          LoginID: LoginID,
          inputLength: trimmedPassword.length,
          storedLength: user.Password.length,
          inputFirstChars: trimmedPassword.substring(0, 3),
          storedFirstChars: user.Password.substring(0, 3),
          isBcryptHash: user.Password.startsWith('$2a$') || user.Password.startsWith('$2b$'),
          hashAlgorithm: user.Password.substring(0, 3)
        });
        return res.status(401).json({ 
          message: 'Invalid credentials', 
          details: 'The username or password you entered is incorrect',
          debug: {
            inputLoginID: LoginID,
            storedLoginID: user.LoginID,
            caseSensitiveMatch: LoginID === user.LoginID,
            passwordComparison: {
              inputLength: Password.length,
              storedLength: user.Password.length
            }
          }
        });
      }

      const role = await User.getRoleById(user.RoleID);
      if (!role) {
        console.log('Role not found for RoleID:', user.RoleID);
        return res.status(500).json({ message: 'Role configuration error' });
      }
      const token = jwt.sign({ personId: user.PersonID, role: role.RoleName }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.log('Error Details:', err);
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  }

  static async verifyToken(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      const isAdmin = decoded.role === 'Administrator';

      res.json({ isAdmin });
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}

module.exports = AuthController;