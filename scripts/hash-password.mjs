import bcrypt from 'bcryptjs';
const pw = process.argv[2];
if (!pw) { console.error('usage: npm run hash-password -- "password"'); process.exit(1); }
const hash = bcrypt.hashSync(pw, 10);
// Emit base64 so the "$" characters in bcrypt hashes are never mangled by env loaders.
console.log(`ADMIN_PASSWORD_HASH=b64:${Buffer.from(hash).toString('base64')}`);
