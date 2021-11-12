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
const logoutRouter = require('./routes/admin/logout'); // 로그아웃 라우터
const findidRouter = require('./routes/admin/findid'); // 아이디찾기 라우터
const findpwRouter = require('./routes/admin/findpw'); // 비밀번호찾기 라우터
const deleteUserRouter = require('./routes/admin/deleteUser'); // 회원탈퇴 라우터
const addCategoryRouter = require('./routes/admin/addCategory'); // 카테고리 등록 라우터
const deleteCategoryRouter = require('./routes/admin/deleteCategory'); // 카테고리 삭제 라우터
const updateCategoryRouter = require('./routes/admin/updateCategory'); // 카테고리 수정 라우터
const addMenuRouter = require('./routes/admin/addMenu'); // 메뉴 등록 라우터
const deleteMenuRouter = require('./routes/admin/deleteMenu'); // 메뉴 삭제 라우터
const updateMenuRouter = require('./routes/admin/updateMenu'); // 메뉴 수정 라우터
const getAllOrdersRouter = require('./routes/admin/getAllOrders'); // 주문내역 조회 라우터
const cancelOrderRouter = require('./routes/admin/cancelOrder'); // 주문취소 라우터
const getAllCategoriesRouter = require('./routes/admin/getAllCategories'); // 전체 카테고리 조회 라우터
const getAllMenusRouter = require('./routes/admin/getAllMenus'); // 전체 메뉴 조회 라우터
const getMenusByCategoryRouter = require('./routes/admin/getMenusByCategory'); // 카테고리별 메뉴 조회 라우터
const updateUserInfoRouter = require('./routes/admin/updateUserInfo'); // 회원정보수정 라우터
const changeOrderStatusRouter = require('./routes/admin/changeOrderStatus'); // 주문상태변경 라우터

const orderViewRouter = require('./routes/order/views.js'); // 주문 시스템 VIEWS 라우터
const orderApiRouter = require('./routes/order'); // 주문 시스템 API 라우터 index.js
const sensApiRouter = require('./routes/sens'); // NCP SENS API 라우터 index.js

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
// 관리자 시스템
app.use('/admin', signupRouter);
app.use('/admin', loginRouter);
app.use('/admin', logoutRouter);
app.use('/admin', findidRouter);
app.use('/admin', findpwRouter);
app.use('/admin', deleteUserRouter);
app.use('/admin', addCategoryRouter);
app.use('/admin', deleteCategoryRouter);
app.use('/admin', updateCategoryRouter);
app.use('/admin', addMenuRouter);
app.use('/admin', deleteMenuRouter);
app.use('/admin', updateMenuRouter);
app.use('/admin', getAllOrdersRouter);
app.use('/admin', cancelOrderRouter);
app.use('/admin', getAllCategoriesRouter);
app.use('/admin', getAllMenusRouter);
app.use('/admin', getMenusByCategoryRouter);
app.use('/admin', updateUserInfoRouter);
app.use('/admin', changeOrderStatusRouter);

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
  res.sendFile(__dirname + "/public/admin/main_logout.html");
});

/**
 * 테스트페이지
 */
app.get('/test', (req, res) => {
  res.sendFile(__dirname + "/public/test.html")
});
app.get('/test/:id/:name', (req, res) => {
  // node 실행하여 테스트가 필요한 경우 추가
  console.log(req.params.id);
  switch (req.params.id) {
    case 'mouse_cursor':
      res.sendFile(__dirname + "/test/mouse_cursor.html")
      break;
    case 'click':
      switch(req.params.name) {
        case 'juran':
          res.sendFile(__dirname + "/test/mouse-click/juran.html")
          break;
        case 'hyunji':
          res.sendFile(__dirname + "/test/mouse-click/hyunji.html")
          break;
        case 'sumin':
          res.sendFile(__dirname + "/test/mouse-click/sumin.html")
          break;
      }
  }
})

app.get('/join', (req, res) => {
  res.sendFile(__dirname + "/public/admin/join.html")
})
app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/public/admin/login.html")
})
app.get('/mainLogin', (req, res) => {
  res.sendFile(__dirname + "/public/admin/main_login.html")
})
app.get('/mainLogout', (req, res) => {
  res.sendFile(__dirname + "/public/admin/main_logout.html")
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
app.get('/test2', (req, res) => { // 임시
  res.sendFile(__dirname + "/public/admin/test.html")
})

// socket & robotjs 마우스 커서 조작
io.on('connection', (socket) => { // 소켓 연결이 들어오면 실행
  // 클라이언트에서 수신받은 정보

  /**
   * 이부분은 건들지 말아주세용!
   */
  // 미디어파이프 8번 손가락(검지) 위치 정보 
  socket.on('location', (msg) => {
      var x = msg[0];
      var y = msg[1];

      robot.moveMouse(x, y);
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

  // 소켓 이용 (현지ver)
  socket.on('hyunji', (msg) => {
    // console.log('hyunji!');
    var x = msg[0];
    var y = msg[1];

    robot.moveMouse(x, y);
});

// 소켓 이용 (수민ver)
socket.on('sumin', (msg) => {
  // console.log('sumin!');
  var x = msg[0];
  var y = msg[1];

  robot.moveMouse(x, y);
});


  // 주문 완료 시
  socket.on('orderInfo', (msg) => {
    io.emit('orderInfo', msg);
  });

});

server.listen(port, function() {
  console.log(`Server is Running! http://localhost:${port}`);
});

// test
module.exports = app;