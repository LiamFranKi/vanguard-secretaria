import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function initConfig() {
  try {
    console.log('⚙️  Inicializando configuración del sistema...\n');

    // Verificar si ya existe
    const check = await pool.query('SELECT id FROM system_config WHERE id = 1');
    
    if (check.rows.length > 0) {
      console.log('✅ La configuración ya existe');
      const config = await pool.query('SELECT * FROM system_config WHERE id = 1');
      console.log('Configuración actual:', config.rows[0]);
      await pool.end();
      process.exit(0);
    }

    // Crear configuración inicial
    const result = await pool.query(
      `INSERT INTO system_config (
        id, nombre_sistema, titulo, descripcion_sistema, 
        color_primario, color_secundario
      ) VALUES (
        1, 
        'SecretariaPro', 
        'Sistema de Gestión Administrativa Profesional',
        'Plataforma integral para la gestión de tareas, contactos, documentos y eventos',
        '#7c3aed',
        '#4f46e5'
      ) RETURNING *`
    );

    console.log('✅ Configuración inicial creada:');
    console.log('   Nombre:', result.rows[0].nombre_sistema);
    console.log('   Título:', result.rows[0].titulo);
    console.log('   Color Primario:', result.rows[0].color_primario);
    console.log('   Color Secundario:', result.rows[0].color_secundario);
    console.log('\n🎉 Configuración inicializada exitosamente!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initConfig();

