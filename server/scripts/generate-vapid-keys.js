import webpush from 'web-push';

console.log('🔑 Generando claves VAPID...\n');

try {
  const vapidKeys = webpush.generateVAPIDKeys();

  console.log('✅ Claves VAPID generadas exitosamente!\n');
  console.log('📋 Copia estas claves a tu archivo .env:\n');
  console.log('─'.repeat(60));
  console.log('VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
  console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
  console.log('VAPID_SUBJECT=mailto:tu-email@ejemplo.com');
  console.log('─'.repeat(60));
  console.log('\n⚠️  IMPORTANTE:');
  console.log('1. Reemplaza "tu-email@ejemplo.com" con tu email real');
  console.log('2. Mantén VAPID_PRIVATE_KEY en secreto (nunca lo compartas)');
  console.log('3. VAPID_PUBLIC_KEY es seguro de compartir (se usa en el frontend)');
  console.log('\n✅ Listo! Reinicia el servidor después de agregar estas variables.\n');
} catch (error) {
  console.error('❌ Error generando claves VAPID:', error);
  process.exit(1);
}

