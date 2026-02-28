const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Company = require('./models/Company');
const User = require('./models/User');
const Registration = require('./models/Registration');

const companies = [
    {
        name: 'Tech Innovations Co.',
        address: '123 Silicon Valley Rd, San Francisco, CA 94105',
        website: 'https://techinnovations.com',
        description: 'A leading technology company specializing in AI and machine learning solutions for enterprise clients.',
        tel: '0812345678'
    },
    {
        name: 'Green Energy Solutions',
        address: '456 Eco Park Ave, Austin, TX 78701',
        website: 'https://greenenergysolutions.com',
        description: 'Providing sustainable energy solutions including solar panels and wind turbines for residential and commercial use.',
        tel: '0823456789'
    },
    {
        name: 'HealthBridge Medical',
        address: '789 Medical Center Dr, Boston, MA 02115',
        website: 'https://healthbridgemedical.com',
        description: 'A healthcare technology firm developing innovative digital health platforms and telemedicine services.',
        tel: '0834567890'
    },
    {
        name: 'FinTech Capital Group',
        address: '101 Wall Street, New York, NY 10005',
        website: 'https://fintechcapital.com',
        description: 'Financial technology company offering cutting-edge payment processing, digital banking, and investment platforms.',
        tel: '0845678901'
    },
    {
        name: 'LogiFlow Logistics',
        address: '202 Warehouse Blvd, Chicago, IL 60601',
        website: 'https://logiflow.com',
        description: 'End-to-end supply chain and logistics management company serving clients across Southeast Asia and beyond.',
        tel: '0856789012'
    },
    {
        name: 'EduTech Academy',
        address: '303 Learning Lane, Seattle, WA 98101',
        website: 'https://edutechacademy.com',
        description: 'Online education platform offering professional development courses, coding bootcamps, and university partnerships.',
        tel: '0867890123'
    },
    {
        name: 'CloudSphere Systems',
        address: '404 Cloud Computing Way, Denver, CO 80201',
        website: 'https://cloudspheresystems.com',
        description: 'Enterprise cloud infrastructure provider delivering scalable hosting, DevOps, and cybersecurity services.',
        tel: '0878901234'
    },
    {
        name: 'Retail Nexus Group',
        address: '505 Shopping Center Rd, Miami, FL 33101',
        website: 'https://retailnexus.com',
        description: 'E-commerce and retail technology company building omnichannel solutions for modern retail businesses.',
        tel: '0889012345'
    },
    {
        name: 'AutoDrive Technologies',
        address: '606 Motor City Ave, Detroit, MI 48201',
        website: 'https://autodrivetechnologies.com',
        description: 'Autonomous vehicle software company developing advanced driver assistance systems and self-driving car platforms.',
        tel: '0890123456'
    },
    {
        name: 'BioGen Research Labs',
        address: '707 Science Park Dr, San Diego, CA 92121',
        website: 'https://biogenresearchlabs.com',
        description: 'Biotechnology research company focused on genomics, drug discovery, and personalized medicine solutions.',
        tel: '0801234567'
    }
];

// tel must match /^0[689]{1}\d{8}$/  (06x, 08x, 09x followed by 8 digits)
const usersData = [
    {
        name: 'Admin User',
        tel: '0611111111',
        email: 'admin@dbraja.com',
        role: 'admin',
        password: 'password123'
    },
    // {
    //     name: 'Alice Johnson',
    //     tel: '0622222222',
    //     email: 'alice.johnson@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Bob Smith',
    //     tel: '0633333333',
    //     email: 'bob.smith@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Carol White',
    //     tel: '0644444444',
    //     email: 'carol.white@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'David Brown',
    //     tel: '0655555555',
    //     email: 'david.brown@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Eva Martinez',
    //     tel: '0666666666',
    //     email: 'eva.martinez@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Frank Lee',
    //     tel: '0677777777',
    //     email: 'frank.lee@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Grace Kim',
    //     tel: '0688888888',
    //     email: 'grace.kim@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Henry Chen',
    //     tel: '0699999999',
    //     email: 'henry.chen@example.com',
    //     role: 'user',
    //     password: 'password123'
    // },
    // {
    //     name: 'Iris Nguyen',
    //     tel: '0610101010',
    //     email: 'iris.nguyen@example.com',
    //     role: 'user',
    //     password: 'password123'
    // }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear all collections
        await Registration.deleteMany();
        await User.deleteMany();
        await Company.deleteMany();
        console.log('All collections cleared');

        // Insert companies
        const insertedCompanies = await Company.insertMany(companies);
        console.log(`${insertedCompanies.length} companies inserted`);

        // Insert users via create() to trigger the bcrypt pre-save hook
        const insertedUsers = await User.create(usersData);
        console.log(`${insertedUsers.length} users inserted`);

        // Build registrations using real IDs
        // Dates must be between 2022-05-10 and 2022-05-13
        const registrations = [
            // { apptDate: new Date('2022-05-10'), user: insertedUsers[1]._id, company: insertedCompanies[0]._id },
            // { apptDate: new Date('2022-05-10'), user: insertedUsers[2]._id, company: insertedCompanies[1]._id },
            // { apptDate: new Date('2022-05-11'), user: insertedUsers[3]._id, company: insertedCompanies[2]._id },
            // { apptDate: new Date('2022-05-11'), user: insertedUsers[4]._id, company: insertedCompanies[3]._id },
            // { apptDate: new Date('2022-05-11'), user: insertedUsers[5]._id, company: insertedCompanies[4]._id },
            // { apptDate: new Date('2022-05-12'), user: insertedUsers[6]._id, company: insertedCompanies[5]._id },
            // { apptDate: new Date('2022-05-12'), user: insertedUsers[7]._id, company: insertedCompanies[6]._id },
            // { apptDate: new Date('2022-05-12'), user: insertedUsers[8]._id, company: insertedCompanies[7]._id },
            // { apptDate: new Date('2022-05-13'), user: insertedUsers[9]._id, company: insertedCompanies[8]._id },
            // { apptDate: new Date('2022-05-13'), user: insertedUsers[1]._id, company: insertedCompanies[9]._id },
        ];

        const insertedRegistrations = await Registration.insertMany(registrations);
        console.log(`${insertedRegistrations.length} registrations inserted`);

        console.log('\nSeed complete!');
        console.log('Admin credentials -> email: admin@dbraja.com | password: password123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Registration.deleteMany();
        await User.deleteMany();
        await Company.deleteMany();
        console.log('All data deleted');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}
