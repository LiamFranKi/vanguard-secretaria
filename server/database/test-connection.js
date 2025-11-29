import pool from '../config/database.js';

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...\n');
    
    // Test 1: Conexión básica
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa');
    console.log('   Hora del servidor:', result.rows[0].now);
    
    // Test 2: Verificar tablas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n✅ Tablas encontradas: ${tables.rows.length}`);
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Test 3: Verificar usuarios
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n✅ Usuarios en la BD: ${users.rows[0].count}`);
    
    if (parseInt(users.rows[0].count) === 0) {
      console.log('\n⚠️  No hay usuarios. Ejecuta server/database/insert-users.sql');
    } else {
      const userList = await pool.query('SELECT id, email, name, role FROM users LIMIT 5');
      console.log('\n   Usuarios:');
      userList.rows.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }
    
    console.log('\n🎉 Base de datos lista para usar!\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nVerifica:');
    console.error('1. PostgreSQL está corriendo');
    console.error('2. Las credenciales en server/.env son correctas');
    console.error('3. La base de datos secretaria_pro existe');
    process.exit(1);
  }
}

testConnection();

