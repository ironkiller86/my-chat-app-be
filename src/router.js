const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("<h1>HomePage</h1>").status(200);
});
module.exports = router;
