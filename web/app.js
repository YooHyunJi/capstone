const express = require('express')
const morgan = require('morgan'); // dev log
const app = express()
const port = 3000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/main.html")
});
// 관리 시스템
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + "/public/admin/main.html")
})
// 주문 시스템
app.get('/order', (req, res) => {
  res.sendFile(__dirname + "/public/order/main.html")
})

app.g

app.listen(port, () => {
  console.log(`Server is Running! http://localhost:${port}`)
});

// test
module.exports = app;