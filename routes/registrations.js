const express = require('express');
const {
    getRegistrations,
    getRegistration,
    createRegistration,
    updateRegistration,
    deleteRegistration
} = require('../controllers/registrations');

const router = express.Router();

const { protect } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - apptDate
 *         - company
 *       properties:
 *         id:
 *           type: string
 *         apptDate:
 *           type: string
 *           format: date-time
 *           description: Interview date (May 10-13, 2022)
 *         user:
 *           type: string
 *           description: User ID (auto-set from token)
 *         company:
 *           type: string
 *           description: Company ID
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /registrations:
 *   get:
 *     summary: Get all registrations (admin gets all, user gets own)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registration'
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create a new registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apptDate
 *               - company
 *             properties:
 *               apptDate:
 *                 type: string
 *                 format: date-time
 *               company:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration created successfully
 *       400:
 *         description: User already registered or bad request
 *       401:
 *         description: Not authorized
 */
router.route('/').get(protect, getRegistrations).post(protect, createRegistration);

/**
 * @swagger
 * /registrations/{id}:
 *   get:
 *     summary: Get single registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Registration not found
 *   put:
 *     summary: Update a registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       200:
 *         description: Registration updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Registration not found
 *   delete:
 *     summary: Delete a registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Registration not found
 */
router.route('/:id').get(protect, getRegistration).put(protect, updateRegistration).delete(protect, deleteRegistration);

module.exports = router;
