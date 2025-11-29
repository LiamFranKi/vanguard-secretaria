const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const isWindows = process.platform === 'win32';

async function killProcesses() {
  console.log('🛑 Deteniendo servidores...\n');

  try {
    if (isWindows) {
      const commands = [
        'netstat -ano | findstr :3000',
        'netstat -ano | findstr :5000'
      ];

      const pids = new Set();

      for (const cmd of commands) {
        try {
          const { stdout } = await execAsync(cmd);
          const lines = stdout.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              pids.add(pid);
            }
          }
        } catch (error) {
          // Puerto no en uso
        }
      }

      if (pids.size > 0) {
        for (const pid of pids) {
          try {
            await execAsync(`taskkill /F /PID ${pid}`);
            console.log(`✅ Proceso ${pid} terminado`);
          } catch (error) {
            // Proceso ya terminado
          }
        }
      } else {
        console.log('ℹ️  No se encontraron procesos corriendo en los puertos 3000 y 5000');
      }
    } else {
      const commands = [
        "lsof -ti:3000 | xargs kill -9 2>/dev/null || true",
        "lsof -ti:5000 | xargs kill -9 2>/dev/null || true"
      ];

      for (const cmd of commands) {
        try {
          await execAsync(cmd);
        } catch (error) {
          // Puerto no en uso
        }
      }
    }

    console.log('\n✅ Servidores detenidos');
  } catch (error) {
    console.error('❌ Error al detener servidores:', error.message);
    process.exit(1);
  }
}

killProcesses();

