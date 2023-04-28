#! /usr/bin/env node

import getLastMail from "../getLastMail";

const email = process.argv.pop();
if (!email) {
  process.exit();
}

(async (email) => {
  console.log(await getLastMail(email));
})(email);
