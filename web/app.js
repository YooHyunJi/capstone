const express = require('express')
const morgan = require('morgan'); // dev log
var robot = require("robotjs");
var io = require('socket.io')(server);
var session = require('express-session');

const port = 3000;
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// 라우터 가져오기
// 관리자 시스템
const signupRouter = require('./routes/admin/signup'); // 회원가입 라우터
const loginRouter = require('./routes/admin/login'); // 로그인 라우터
const findidRouter = require('./routes/admin/findid'); // 아이디찾기 라우터
const findpwRouter = require('./routes/admin/findpw'); // 비밀번호찾기 라우터
const deleteUserRouter = require('./routes/admin/deleteUser'); // 회원탈퇴 라우터
const addCategoryRouter = require('./routes/admin/addCategory'); // 카테고리 등록 라우터
const deleteCategoryRouter = require('./routes/admin/deleteCategory'); // 카테고리 삭제 라우터
const updateCategoryRouter = require('./routes/admin/updateCategory'); // 카테고리 수정 라우터
const addMenuRouter = require('./routes/admin/addMenu'); // 메뉴 등록 라우터
const deleteMenuRouter = require('./routes/admin/deleteMenu'); // 메뉴 삭제 라우터
const updateMenuRouter = require('./routes/admin/updateMenu'); // 메뉴 수정 라우터
const getOrderInfoRouter = require('./routes/admin/getOrderInfo'); // 주문내역 조회 라우터
const cancelOrderRouter = require('./routes/admin/cancelOrder'); // 주문취소 라우터
const getCategoriesRouter = require('./routes/admin/getCategories'); // 전체 카테고리 조회 라우터
const getMenusRouter = require('./routes/admin/getMenus'); // 전체 메뉴 조회 라우터
const getMenusByCategoryRouter = require('./routes/admin/getMenusByCategory'); // 카테고리별 메뉴 조회 라우터

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션
app.use(session({
  key: "user",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// 라우터 로드 및 경로 지정
app.use('/admin', signupRouter);
app.use('/admin', loginRouter);
app.use('/admin', findidRouter);
app.use('/admin', findpwRouter);
app.use('/admin', deleteUserRouter);
app.use('/admin', addCategoryRouter);
app.use('/admin', deleteCategoryRouter);
app.use('/admin', updateCategoryRouter);
app.use('/admin', addMenuRouter);
app.use('/admin', deleteMenuRouter);
app.use('/admin', updateMenuRouter);
app.use('/admin', getOrderInfoRouter);
app.use('/admin', cancelOrderRouter);
app.use('/admin', getCategoriesRouter);
app.use('/admin', getMenusRouter);
app.use('/admin', getMenusByCategoryRouter);

// 메인
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/main.html")
});

// 미디어파이프 제스처 인식 테스트
app.get('/test', (req, res) => {
  res.sendFile(__dirname + "/public/test.html")
});
app.get('/test/:id', (req, res) => {
  // node 실행하여 테스트가 필요한 경우 추가

  switch (req.params.id) {
    case 'mouse_cursor':
      res.sendFile(__dirname + "/test/mouse_cursor.html")
      break;
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
app.get('/user', (req, res) => {
  res.sendFile(__dirname + "/js/user.js")
})
app.get('/menu', (req, res) => {
  res.sendFile(__dirname + "/public/admin/menu.html")
})

// socket & robotjs 마우스 커서 조작
io.on('connection', (socket) => { // 소켓 연결이 들어오면 실행
  // 클라이언트에서 수신받은 정보
  socket.on('location', (msg) => {
      // console.log('Message received: ' + msg);

      var screenSize = robot.getScreenSize();
      var height = (screenSize.height / 2) - 10;
      var width = screenSize.width;

      // 마우스 좌표
      var x = (width - msg[0] * width); // 좌우반전
      var y = msg[1] * height;

      robot.moveMouse(x, y);
  });
});

server.listen(3000, function() {
  console.log(`Server is Running! http://localhost:${port}`);
});

// test
module.exports = app;