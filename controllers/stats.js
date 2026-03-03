const Registration = require('../models/Registration');
const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Get admin dashboard stats
// @route   GET /api/v1/stats
// @access  Private (admin only)
exports.getDashboardStats = async (req, res, next) => {
    try {
        // ── Overview counts ──────────────────────────────────────
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalCompanies = await Company.countDocuments();
        const totalRegistrations = await Registration.countDocuments();

        // ── Most popular companies (by registration count) ───────
        const popularCompanies = await Registration.aggregate([
            {
                $group: {
                    _id: '$company',
                    registrationCount: { $sum: 1 }
                }
            },
            { $sort: { registrationCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'companies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'companyInfo'
                }
            },
            { $unwind: '$companyInfo' },
            {
                $project: {
                    _id: 0,
                    companyId: '$_id',
                    companyName: '$companyInfo.name',
                    registrationCount: 1
                }
            }
        ]);

        // ── Companies with zero registrations ────────────────────
        const companiesWithReg = popularCompanies.map(c => c.companyId.toString());
        const allCompanies = await Company.find({}, '_id name');
        const zeroRegCompanies = allCompanies
            .filter(c => !companiesWithReg.includes(c._id.toString()))
            .map(c => ({ companyId: c._id, companyName: c.name, registrationCount: 0 }));

        const allCompanyStats = [...popularCompanies, ...zeroRegCompanies];

        // ── Users with most registrations ────────────────────────
        const topUsers = await Registration.aggregate([
            {
                $group: {
                    _id: '$user',
                    registrationCount: { $sum: 1 }
                }
            },
            { $sort: { registrationCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userInfo.name',
                    userEmail: '$userInfo.email',
                    registrationCount: 1
                }
            }
        ]);

        // ── Registrations per day ─────────────────────────────────
        const registrationsByDay = await Registration.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$apptDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1
                }
            }
        ]);

        // ── Users who have NOT registered yet ────────────────────
        const usersWithReg = await Registration.distinct('user');
        const unregisteredUsersCount = await User.countDocuments({
            _id: { $nin: usersWithReg },
            role: 'user'
        });

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalCompanies,
                    totalRegistrations,
                    unregisteredUsersCount,
                    averageRegistrationsPerUser: totalUsers > 0
                        ? (totalRegistrations / totalUsers).toFixed(2)
                        : 0
                },
                popularCompanies: allCompanyStats,
                topUsers,
                registrationsByDay
            }
        });

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};