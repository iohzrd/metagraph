const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => console.log(`listening... http://127.0.0.1:${port}`));