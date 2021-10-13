const express = require('express')
const morgan = require('morgan'); // dev log
const port = 3000;

// 라우터 가져오기
const signupRouter = require('./routes/signup'); // 회원가입 라우터
const loginRouter = require('./routes/login'); // 로그인 라우터
const findidRouter = require('./routes/findid'); // 아이디찾기 라우터
const findpwRouter = require('./routes/findpw'); // 비밀번호찾기 라우터
const deleteUserRouter = require('./routes/deleteUser'); // 회원탈퇴 라우터
const addCategoryRouter = require('./routes/addCategory'); // 카테고리 등록 라우터
const deleteCategoryRouter = require('./routes/deleteCategory'); // 카테고리 삭제 라우터
const updateCategoryRouter = require('./routes/updateCategory'); // 카테고리 수정 라우터
const addMenuRouter = require('./routes/addMenu'); // 메뉴 등록 라우터
const deleteMenuRouter = require('./routes/deleteMenu'); // 메뉴 삭제 라우터
const updateMenuRouter = require('./routes/updateMenu'); // 메뉴 수정 라우터
const getOrderInfoRouter = require('./routes/getOrderInfo'); // 주문내역 조회 라우터
const cancelOrderRouter = require('./routes/cancelOrder'); // 주문취소 라우터

const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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