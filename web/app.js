const express = require('express')
const morgan = require('morgan'); // dev log
const app = express()
const port = 3000;

app.use(morgan('dev'));

// 메인
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/main.html")
});

// 웹 서버에서 테스트
app.get('/test', (req, res) => {
  res.sendFile(__dirname + "/public/test.html")
});
app.get('/test/:id', (req, res) => {
  var id = req.params.id;
  // node 실행하여 테스트가 필요한 경우 추가
  switch (id) {
    case 'handpose':
      res.sendFile(__dirname + "/public/test/handpose.html")
      break;
    case 'mp':
      res.sendFile(__dirname + "/public/test/mp.html");
      break;
    
    // case
  }
})

// 관리 시스템
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + "/public/admin/main.html")
})
// 주문 시스템
app.get('/order', (req, res) => {
  res.sendFile(__dirname + "/public/order/main.html")
})

app.listen(port, () => {
  console.log(`Server is Running! http://localhost:${port}`)
});

// test
module.exports = app;