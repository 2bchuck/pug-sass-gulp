const express = require('express');
const path = require('path');

const app = express();

const port = 8080;

app.set('views', path.join(__dirname, 'pug'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname)));

console.log(app.get('views'));

app.get('/', (_req, res) => {
  res.render('index');
});

const server = app.listen(port, () => {
  console.log(`The application started on port ${server.address().port}`);
});
