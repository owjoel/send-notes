const os = require('os');

async function healthCheck(req, res) {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = 'N/A';

  // Shows first IPv4 Address and not loopback address
  for (const [name, interfaces] of Object.entries(networkInterfaces)) {
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
  } 

  res.status(200).json({
    message: 'Service is healthy.',
    service: 'orders',
    ip_address: ipAddress,
  });
};

module.exports = {
  healthCheck,
};