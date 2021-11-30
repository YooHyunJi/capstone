const express = require('express')
const morgan = require('morgan'); // dev log
var robot = require("robotjs");
var io = require('socket.io')(server);

const port = 3000;
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// 라우터 가져오기
// 관리자 시스템
const menuRouter = require('./routes/admin/menu');
const categoryRouter = require('./routes/admin/category');
const userRouter = require('./routes/admin/user');
const orderRouter = require('./routes/admin/order');

const orderViewRouter = require('./routes/order/views.js'); // 주문 시스템 VIEWS 라우터
const orderApiRouter = require('./routes/order'); // 주문 시스템 API 라우터 index.js
const sensApiRouter = require('./routes/sens'); // NCP SENS API 라우터 index.js

// 세션
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);
var options ={
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_SECRET,
    database: 'capstone'
};
var sessionStore = new MySQLStore(options);
app.use(session({
  secret: "12312dajfj23rj2po4$#%@#",
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 로드 및 경로 지정
// 관리자 시스템
app.use('/admin', menuRouter);
app.use('/admin', categoryRouter);
app.use('/admin', userRouter);
app.use('/admin', orderRouter);

// juran
// js & static 경로설정
app.use('/js', express.static(__dirname + '/js'));
app.use(express.static('public')); 
app.use(express.static('uploads')); 

// order view 라우터
app.use('/order', orderViewRouter);
// order API 라우터
app.use('/api/order', orderApiRouter);
// sens API 라우터
app.use('/api/sens', sensApiRouter);

// 메인페이지
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/admin/main.html");
});

/**
 * 테스트페이지
 */
app.get('/test', (req, res) => {
  res.sendFile(__dirname + "/public/test.html")
});
app.get('/test/:id/:name', async (req, res) => {
  // node 실행하여 테스트가 필요한 경우 추가
  console.log(req.params.id);
  switch (req.params.id) {
    case 'mouse_cursor':
      res.sendFile(__dirname + "/test/mouse_cursor.html")
      break;
    case 'modeling':
      res.sendFile(__dirname + "/test/modeling/" + req.params.name + ".html");
      break;
    case 'click':
      res.sendFile(__dirname + "/test/mouse-click/" + req.params.name + ".html");
  }
})

// 관리자 시스템
app.get('/join', (req, res) => {
  res.sendFile(__dirname + "/public/admin/join.html")
})
app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/public/admin/login.html")
})
app.get('/manage_order', (req, res) => {
  res.sendFile(__dirname + "/public/admin/manage_order.html")
})
app.get('/manage_store', (req, res) => {
  res.sendFile(__dirname + "/public/admin/manage_store.html")
})
app.get('/manage_category', (req, res) => {
  res.sendFile(__dirname + "/public/admin/manage_category.html")
})
app.get('/manage_menu', (req, res) => {
  res.sendFile(__dirname + "/public/admin/manage_menu.html")
})

// socket.io
io.on('connection', (socket) => { // 소켓 연결이 들어오면 실행
  // 클라이언트에서 수신받은 정보

  // 미디어파이프 8번 손가락(검지) 위치 정보 이용하여 마우스 커서 이동 
  socket.on('location', (msg) => {
      robot.moveMouse(msg[0], msg[1]);
  });

  // 주문 완료 시
  socket.on('orderInfo', (msg) => { // 주문 시스템 -주문번호-> 서버 
    io.emit('orderInfo', msg); // 서버 -주문번호-> 관리 시스템
  });

  // 동적 제스처 클릭 모션 시
  socket.on('click', (flg) => {
    robot.mouseClick("left");
  });


  /**
   * 클릭이벤트 테스트용입니당!
   */
  // 소켓 이용 (주란ver)
  socket.on('juran', (msg) => {
    // console.log('juran!');
    var x = msg[0];
    var y = msg[1];
    robot.moveMouse(x, y);
  });
  socket.on('juran_click', (flg) => {
    console.log('click!');
    robot.mouseClick("left");
  });

  // 소켓 이용 (현지ver)
  socket.on('hyunji', (msg) => {
    // console.log('hyunji!');
    var x = msg[0];
    var y = msg[1];

    robot.moveMouse(x, y);
  });
  socket.on('hyunji_click', (flg) => {
    console.log('click!');
    robot.mouseClick("left");
  });

  // 소켓 이용 (수민ver)
  socket.on('sumin', (msg) => {
    // console.log('sumin!');
    var x = msg[0];
    var y = msg[1];

    robot.moveMouse(x, y);
  });

});

server.listen(port, function() {
  console.log(`Server is Running! http://localhost:${port}`);
});

// test
module.exports = app;