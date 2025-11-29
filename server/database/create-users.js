import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createUsers() {
  try {
    console.log('🔐 Creando usuarios de prueba...\n');

    // Generar hashes reales
    const adminPassword = 'admin123';
    const secretariaPassword = 'secretaria123';

    const adminHash = await bcrypt.hash(adminPassword, 10);
    const secretariaHash = await bcrypt.hash(secretariaPassword, 10);

    console.log('Hash Admin:', adminHash);
    console.log('Hash Secretaria:', secretariaHash);
    console.log('');

    // Insertar o actualizar admin
    const adminResult = await pool.query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) 
       DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role
       RETURNING id, email, name, role`,
      ['admin@secretariapro.com', adminHash, 'Administrador', 'ADMIN']
    );

    console.log('✅ Usuario Admin creado/actualizado:');
    console.log('   Email: admin@secretariapro.com');
    console.log('   Password: admin123');
    console.log('   ID:', adminResult.rows[0].id);
    console.log('');

    // Insertar o actualizar secretaria
    const secretariaResult = await pool.query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) 
       DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role
       RETURNING id, email, name, role`,
      ['secretaria@secretariapro.com', secretariaHash, 'Secretaria Principal', 'SECRETARIA']
    );

    console.log('✅ Usuario Secretaria creado/actualizado:');
    console.log('   Email: secretaria@secretariapro.com');
    console.log('   Password: secretaria123');
    console.log('   ID:', secretariaResult.rows[0].id);
    console.log('');

    // Verificar usuarios
    const allUsers = await pool.query('SELECT id, email, name, role FROM users');
    console.log('📋 Usuarios en la base de datos:');
    allUsers.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    console.log('\n🎉 Usuarios creados exitosamente!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUsers();

