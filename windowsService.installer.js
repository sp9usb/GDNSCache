var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object
var svc = new Service({
  name:'GDNSCache',
  description: 'The DNS cache server',
  script: path.join(__dirname, 'server.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();