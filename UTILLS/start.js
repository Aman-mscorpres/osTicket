const fs = require("fs");

// CREATE DIRECTORY IF NOT EXISTS
const dir = ["./UPLOADS"];

for (let i = 0; i < dir.length; i++) {
  if (!fs.existsSync(dir[i])) {
    fs.mkdirSync(dir[i]);
  }
}
