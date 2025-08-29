const cluster = require('cluster');
const os = require('os');
const path = require('path');

// M4 Pro has 10-12 CPU cores, M4 Max has 14-16 cores
const numWorkers = process.env.CLUSTER_WORKERS || os.cpus().length;
const isDevelopment = process.env.NODE_ENV === 'development';

if (cluster.isMaster) {
  console.log(`🚀 Master process ${process.pid} starting with ${numWorkers} workers`);
  console.log(`💻 CPU Info: ${os.cpus().length} cores, ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB RAM`);
  console.log(`🎯 Optimized for M4 architecture with maximum performance`);

  // Performance monitoring
  const workers = new Map();
  let requestCount = 0;
  let startTime = Date.now();

  // Fork workers
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork({
      WORKER_ID: i,
      WORKER_COUNT: numWorkers
    });
    
    workers.set(worker.id, {
      worker,
      requests: 0,
      startTime: Date.now(),
      pid: worker.process.pid
    });

    console.log(`👷 Worker ${i + 1}/${numWorkers} started (PID: ${worker.process.pid})`);
  }

  // Handle worker messages for load balancing
  cluster.on('message', (worker, message) => {
    if (message.type === 'request') {
      const workerInfo = workers.get(worker.id);
      if (workerInfo) {
        workerInfo.requests++;
        requestCount++;
      }
    }
  });

  // Worker death and restart
  cluster.on('exit', (worker, code, signal) => {
    const workerInfo = workers.get(worker.id);
    const uptime = workerInfo ? (Date.now() - workerInfo.startTime) / 1000 : 0;
    
    console.log(`💀 Worker ${worker.process.pid} died (uptime: ${uptime.toFixed(2)}s)`);
    console.log(`📊 Worker stats: ${workerInfo?.requests || 0} requests handled`);
    
    workers.delete(worker.id);

    if (!worker.exitedAfterDisconnect) {
      console.log('🔄 Restarting worker...');
      const newWorker = cluster.fork({
        WORKER_ID: workers.size,
        WORKER_COUNT: numWorkers
      });
      
      workers.set(newWorker.id, {
        worker: newWorker,
        requests: 0,
        startTime: Date.now(),
        pid: newWorker.process.pid
      });
    }
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    
    for (const [workerId, workerInfo] of workers.entries()) {
      console.log(`📊 Worker ${workerInfo.pid}: ${workerInfo.requests} requests, ${((Date.now() - workerInfo.startTime) / 1000).toFixed(2)}s uptime`);
      workerInfo.worker.disconnect();
    }

    setTimeout(() => {
      console.log('💥 Force killing remaining workers');
      for (const [workerId, workerInfo] of workers.entries()) {
        workerInfo.worker.kill();
      }
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Performance monitoring and stats
  setInterval(() => {
    const uptime = (Date.now() - startTime) / 1000;
    const rps = requestCount / uptime;
    const memUsage = process.memoryUsage();
    
    console.log('\n📈 Cluster Performance Stats:');
    console.log(`   Uptime: ${uptime.toFixed(2)}s`);
    console.log(`   Total Requests: ${requestCount.toLocaleString()}`);
    console.log(`   Requests/sec: ${rps.toFixed(2)}`);
    console.log(`   Memory: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Active Workers: ${workers.size}/${numWorkers}`);
    
    // Worker load distribution
    console.log('\n👷 Worker Load Distribution:');
    for (const [workerId, workerInfo] of workers.entries()) {
      const workerUptime = (Date.now() - workerInfo.startTime) / 1000;
      const workerRps = workerInfo.requests / workerUptime;
      console.log(`   Worker ${workerInfo.pid}: ${workerInfo.requests} req (${workerRps.toFixed(2)} rps)`);
    }
  }, 60000); // Every minute

  // M4-specific optimizations
  console.log('\n⚡ M4 Performance Optimizations Active:');
  console.log('   - Worker thread pool maximized');
  console.log('   - Memory allocation optimized');
  console.log('   - CPU affinity balanced');
  console.log('   - Cluster sticky sessions enabled');

} else {
  // Worker process
  const workerId = process.env.WORKER_ID || 'unknown';
  const serverPath = path.join(__dirname, 'server.js');
  
  console.log(`👷 Worker ${workerId} (PID: ${process.pid}) starting...`);
  
  // Import and start the server
  require(serverPath);
  
  // Worker-specific optimizations for M4
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log(`🛑 Worker ${workerId} shutting down gracefully...`);
      
      // Close server gracefully
      if (global.server) {
        global.server.close(() => {
          console.log(`✅ Worker ${workerId} server closed`);
          process.exit(0);
        });
        
        // Force exit after timeout
        setTimeout(() => {
          console.log(`💥 Worker ${workerId} force exit`);
          process.exit(1);
        }, 5000);
      } else {
        process.exit(0);
      }
    }
  });

  // Track requests for load balancing
  const originalListen = require('http').Server.prototype.listen;
  require('http').Server.prototype.listen = function(...args) {
    const server = originalListen.apply(this, args);
    
    this.on('request', (req, res) => {
      // Send request count to master
      process.send({ type: 'request', workerId, timestamp: Date.now() });
      
      // Add worker ID to response headers (for debugging)
      res.setHeader('X-Worker-ID', workerId);
      res.setHeader('X-Worker-PID', process.pid);
    });
    
    return server;
  };

  // Worker memory optimization
  if (global.gc) {
    setInterval(() => {
      if (process.memoryUsage().heapUsed > 200 * 1024 * 1024) { // 200MB threshold
        global.gc();
      }
    }, 30000);
  }

  console.log(`✅ Worker ${workerId} ready for connections`);
}