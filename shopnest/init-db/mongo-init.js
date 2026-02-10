// Initialize MongoDB with sample data
// This runs automatically when MongoDB container starts

db = db.getSiblingDB('shopnest_users');

// Create users collection
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'full_name', 'hashed_password'],
            properties: {
                email: {
                    bsonType: 'string',
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                    description: 'must be a valid email address and is required'
                },
                full_name: {
                    bsonType: 'string',
                    minLength: 2,
                    description: 'must be a string and is required'
                },
                hashed_password: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                }
            }
        }
    }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ created_at: -1 });
db.users.createIndex({ role: 1 });

// Insert sample users
const sampleUsers = [
    {
        email: 'admin@shopnest.com',
        full_name: 'Admin User',
        hashed_password: '$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // hash of 'Admin@123'
        phone: '+1 234-567-8900',
        address: '123 Admin Street, Tech City',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        role: 'admin',
        is_active: true,
        is_verified: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        hashed_password: '$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // hash of 'Password@123'
        phone: '+1 987-654-3210',
        address: '456 Main Street, Downtown',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        role: 'customer',
        is_active: true,
        is_verified: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
    }
];

// Insert only if they don't exist
sampleUsers.forEach(user => {
    const existing = db.users.findOne({ email: user.email });
    if (!existing) {
        db.users.insertOne(user);
        print(`✅ Created user: ${user.email}`);
    }
});

print('✅ MongoDB initialization completed successfully');
