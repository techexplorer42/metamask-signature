const express = require("express");
const basicAuth = require("express-basic-auth");

const app = express();

const users = {
  [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS
};

app.use(
  basicAuth({
    users: users,
    challenge: true
  })
);

app.use(express.static(__dirname + "/build"));

app.listen(8182, () => {
  console.log("Example app listening on port 8182!");
});

