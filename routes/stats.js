const express = require('express');
const { getDashboardStats } = require('../controllers/stats');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: integer
 *                         totalCompanies:
 *                           type: integer
 *                         totalRegistrations:
 *                           type: integer
 *                         unregisteredUsersCount:
 *                           type: integer
 *                         averageRegistrationsPerUser:
 *                           type: string
 *                     popularCompanies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           companyName:
 *                             type: string
 *                           registrationCount:
 *                             type: integer
 *                     topUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userName:
 *                             type: string
 *                           userEmail:
 *                             type: string
 *                           registrationCount:
 *                             type: integer
 *                     registrationsByDay:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only
 */
router.get('/', protect, authorize('admin'), getDashboardStats);

module.exports = router;