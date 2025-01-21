const { MainDB } = require("../CONFIGS/db");
const moment = require("moment");

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports.errorHandler = require("./resErrors");
module.exports.ThrowError = require("./customeError");


module.exports.saveupdateLog = async ({ module, module_key, data, transaction }) => {
  try {
    let log;
    if (transaction == null) {
      log = await MainDB.query(`INSERT INTO update_logs ( log_key, module, module_key , data , created_at) VALUES ( :log_key, :module, :module_key , :data , :created_at)`, {
        replacements: {
          log_key: uuidv4(),
          module: module,
          module_key: module_key,
          data: JSON.stringify(data),
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        type: MainDB.QueryTypes.INSERT,
      });
    } else {
      log = await MainDB.query(`INSERT INTO update_logs ( log_key, module, module_key , data , created_at) VALUES ( :log_key, :module, :module_key , :data , :created_at)`, {
        replacements: {
          log_key: uuidv4(),
          module: module,
          module_key: module_key,
          data: JSON.stringify(data),
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        type: MainDB.QueryTypes.INSERT,
        transaction: transaction,
      });
    }

    return log;
  } catch (err) {
    throw err;
  }
};
