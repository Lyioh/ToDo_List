const users = require("./users.js");

module.exports = router => {
  users(router);
  return router;
};
