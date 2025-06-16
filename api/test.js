const path = require('path');
console.log('Tentando encontrar routes.js em:');
console.log(path.join(__dirname, 'src', 'routes.js'));

// Verifique se o arquivo existe
const fs = require('fs');
console.log('Arquivo existe?', 
  fs.existsSync(path.join(__dirname, 'src', 'routes.js')));