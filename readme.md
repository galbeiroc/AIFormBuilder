# AI Form Builder

Full-Stack AI Form Builder App Tutorial | React, Node.js, Postgres & Google Gemini.

Create strong random string

`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Run db connection

`node --input-type=module -e "import('./config/db.js').then(con => con.connectDB()).then(() => process.exit(0))"`
