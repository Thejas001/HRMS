const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@admin.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@admin.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@admin.com',
      password: 'admin123', // Plain text password as per your current setup
      role: 'Admin',
      phoneNumber: '1234567890',
      address: 'Admin Address',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('User ID:', adminUser.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run the function
createAdminUser(); 