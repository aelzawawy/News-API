require("./src/DB/mongoose");
const bcryptjs = require("bcryptjs");
const express = require("express");
const app = express();
const reporterRouter = require("./src/routers/repRouters"); 
const newsRouter = require("./src/routers/newsRouters"); 

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(reporterRouter);
app.use(newsRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});