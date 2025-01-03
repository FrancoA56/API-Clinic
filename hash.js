const bcrypt = require('bcrypt');

const password = 'tu_contraseña_segura';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Contraseña encriptada:', hash);
});
