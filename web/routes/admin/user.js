// 회원 관리 관련 라우터 목록
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var transporter = require('../../config/email_config');
var crypto = require('crypto');
var connection = config.init();
connection.connect();
var moment = require('moment');

// 1. 회원가입 라우터 
router.post('/signup', function(req, res) {
    var storeId = req.body.storeId; // 아이디
    var storeName = req.body.storeName; // 매장 이름
    var storePw = ''; // 비밀번호
    var salt = ''; // 암호화에 필요한 요소
    var storeTel = req.body.storeTel; // 매장 연락처
    var storeLoc = req.body.storeLoc; // 위치
    var crn = req.body.crn; // 사업자번호
    var managerName = req.body.managerName // 관리자 이름
    var managerTel = req.body.managerTel // 관리자 연락처
    var regDate = moment().format("YYYY-MM-DD hh:mm:ss"); // 가입 날짜, 시간
    
    var query = 'INSERT INTO store (storeId, storeName, storePw, salt, storeTel, storeLoc, crn, managerName, managerTel, regDate) VALUES (?,?,?,?,?,?,?,?,?,?)'; // 회원가입 쿼리문

    // 아이디 중복 확인
    connection.query('SELECT storeId FROM store WHERE storeId = ?', storeId, function (error, result) {
        if(result.length == 0) { // 중복된 아이디가 없을 경우
            // 비밀번호 암호화한 후 DB에 저장
            if(error) { // 에러 발생시
                console.log("error ocurred: ", error);
                res.json({"code" : 400, "result": "error ocurred"});
            } else {
                // salt 값 랜덤 생성
                crypto.randomBytes(64, (err, buf) => { 
                    salt = buf.toString('base64');
                    // 비밀번호 암호화
                    crypto.pbkdf2(req.body.storePw, salt, 100, 64, 'sha512', (err, key) => {
                        storePw = key.toString('base64');
                        // user정보 DB에 저장
                        connection.query(query, [storeId, storeName, storePw, salt, storeTel, storeLoc, crn, managerName, managerTel, regDate], function (error, result) {
                            console.log(query);
                            if (error) { // 에러 발생시
                                console.log("error ocurred: ", error);
                                res.json({ "code" : 400, "result": "error ocurred" })
                            } else { // 회원가입 성공시
                                console.log("signup success");
                                res.json({ "code": 200, "result": "signup success" });
                            }
                        }); 
                    })
                })
            }
        } else { // 중복된 아이디일 경우
            console.log("duplicated id");
            res.json({"code" : 204, "result": "duplicated id"});
        }
    }); 
});

// 2. 로그인 라우터
router.post('/login', function (req, res) {
    var storeId = req.body.storeId; // 아이디
    var storePw = req.body.storePw;  // 비밀번호
    var query = 'SELECT * FROM store WHERE storeId = ?'; // 로그인 쿼리문
    var salt = ''

    // 해당 ID가 있는지 확인 -> 있으면 salt값 가져옴
    connection.query(query, storeId, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({"code": 404, "result": "error occured"});
        } else {
            if (result.length == 0) { // ID가 다를 경우
                res.json({"code": 204, "result": "ID or password is not correct"});
            } else { // ID가 있는 경우
                salt = result[0].salt;
            }
        }
    })

    connection.query(query, storeId, function (err, result) {
        if (err) { // 에러 발생시
            console.log(err);
            res.json({'code': 404});
        } else {
            crypto.pbkdf2(storePw, salt, 100, 64, 'sha512', (err, key) => {
                var hashPw = key.toString('base64');
                if (hashPw != result[0].storePw) { // password가 다를 경우
                    res.json({'code': 208, 'result': 'Password is not correct'});
                } else {  // 로그인에 성공했을 경우
                    // 세션에 추가
                    if (req.session.user) { 
                        console.log('세션 이미 존재'); 
                    } else { 
                        req.session.user = { 
                            "storeNo": result[0].storeNo, 
                            "storeId": result[0].storeId
                        }
                        console.log('세션 저장 완료')
                    }

                    res.json({'code': 200, 'storeId': req.session.user.storeId, 'result': 'Welcome ' + result[0].storeName});
                }
            })
        }
    })
});

// 3. 로그아웃 라우터
router.get('/logout', function (req, res) {
    req.session.destroy(function(){
        req.session.user;
    });
    // req.session.destroy();
    console.log('로그아웃 성공');
});

// 4. Id찾기 라우터
router.post('/findid', function (req, res) {
    var crn = req.body.crn; // 사업자번호
    var managerTel = req.body.managerTel; // 매니저 연락처
    var query = 'SELECT storeId FROM store WHERE crn = ? AND managerTel = ?'; // 아이디찾기 쿼리문

    connection.query(query, [crn, managerTel], function(err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({"code": 404, "result": 'error occured'});
        } else {
            if (result.length == 0) {   // 가입하지 않은 사용자인 경우
                res.json({"code": 204, "result": "never registered"});
            } else { // ID를 찾은 경우
                res.json({"code": 200, "storeId": result[0].storeId});
            }
        }
    })
});

// 5. Pw찾기 라우터
router.post('/findpw', function (req, res) {
    var storeId = req.body.storeId; // 매장 아이디
    var email = req.body.email; // 이메일 주소

    // 매장 아이디 여부 확인
    connection.query('SELECT * FROM store WHERE storeId = ?', storeId, function (error, result) {
        if (error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            if (result.length == 0) { // 등록된 아이디가 없는 경우
                console.log("incorrect id");
                res.json({ "code": 204, "result": "incorrect id" });
            } else { // 등록된 아이디가 있는 경우
                // 임시 비밀번호 발급
                var arr = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
                var randomPw = createCode(arr, 10);

                //비밀번호 랜덤 생성 함수
                function createCode(objArr, iLength) {
                    var arr = objArr;
                    var randomStr = "";
                    for (var j = 0; j < iLength; j++) {
                        randomStr += arr[Math.floor(Math.random() * arr.length)];
                    }
                    return randomStr
                }

                // 새로운 비밀번호 생성하는 부분
                // salt 값 랜덤 생성
                crypto.randomBytes(64, (err, buf) => {
                    var salt = buf.toString('base64');
                    // 비밀번호 암호화
                    crypto.pbkdf2(randomPw, salt, 100, 64, 'sha512', (err, key) => {
                        var storePw = key.toString('base64');
                        // 새로운 비밀번호 DB에 저장
                        connection.query('UPDATE store SET storePw = ?, salt = ? WHERE storeId = ?', [storePw, salt, storeId], function (error, result) {
                            if (error) { // 에러 발생시
                                console.log("error ocurred: ", error);
                                res.json({ "code": 400, "result": "error ocurred" })
                            } else { // 비밀번호 저장 성공시
                                console.log("update new password success");
                            }
                        });
                    })
                })
                /*var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'airosk.official@gmail.com',
                      pass: process.env.EMAIL_SECRET
                    }
                  });*/

                // 메일 양식
                let mail = {
                    from: 'airosk.official@gmail.com', // 보내는 사람 이메일
                    to: email, // 받는 사람 이메일
                    subject: '에어로스크 임시 비밀번호 정보입니다', // 메일 제목
                    text: '안녕하세요. 에어로스크 입니다.\n임시비밀번호는 ' + randomPw + '입니다.' // 메일 내용
                }

                // 메일 전송
                transporter.sendMail(mail, function (error) {
                    if (error) { // 에러 발생시
                        console.log("error ocurred: ", error);
                        res.json({ "code": 404, "result": "error ocurred" });
                    }
                    else { // 메일 전송 성공시
                        console.log("findpw success");
                        res.json({ "code": 200, "result": "findpw success" });
                    }
                });
            }
        }
    });
});

// 6. 회원탈퇴 라우터
router.post('/deleteUser', function (req, res) {
    var storePw = req.body.storePw; // 비밀번호
    var query = `SELECT storePw, salt FROM store WHERE storeNo = "${req.session.user.storeNo}"`;

    connection.query(query, function (err, result) {
        var salt = result[0].salt;
        if (err) { // 에러 발생시
            console.log(err);
            res.json({'code': 404});
        } else {
            crypto.pbkdf2(storePw, salt, 100, 64, 'sha512', (err, key) => {
                var hashPw = key.toString('base64');
                if (hashPw != result[0].storePw) { // password가 다를 경우
                    res.json({'code': 208, 'result': 'Password is not correct'});
                }
                else { // password 옳게 입력한 경우 회원탈퇴 진행
                    // res.json({'code': 200, 'result': 'Password is correct'});
                    query = `DELETE FROM store WHERE storeId = "${req.session.user.storeId}"` // 회원탈퇴 쿼리문
                    connection.query(query, function (err, result) {
                        if(err) { // 에러 발생시
                            console.log("error ocurred: ", err);
                            res.json({ "code": 400, "result": "error ocurred" })
                        } else {
                            console.log("delete user success");
                            res.json({"code": 200, "result": "delete user success"})
                        }
                    })
                }
            })
        }
    })

});

// 7. 회원정보조회 라우터
router.get('/getUserInfo', function (req, res) {
    var query = `SELECT storeName, storeTel, storeLoc, crn, managerName, managerTel FROM store WHERE storeNo=${req.session.user.storeNo}`; // 메뉴 수정 쿼리문

    // DB에서 메뉴 정보 수정
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get userinfo success");
            res.json({"code": 200, "result": "get userinfo success", "userInfo": result})
        }
    })

});

// 8. 회원정보수정 라우터
router.post('/updateUserInfo', function (req, res) {
    var storePw = ''; // 비밀번호
    var salt = ''; // 비밀번호 암호화 요소
    var storeName = req.body.storeName; // 매장명
    var storeTel = req.body.storeTel; // 매장 연락처
    var storeLoc = req.body.storeLoc; // 매장 주소
    var crn = req.body.crn; // 사업자등록번호
    var managerName = req.body.managerName; // 매니저명
    var managerTel = req.body.managerTel; // 매니저 연락처
    var query = `UPDATE store SET storePw = ?, salt = ?, storeName = ?, storeTel = ?, storeLoc = ?, crn = ?, managerName = ?, managerTel = ? WHERE storeNo = ${req.session.user.storeNo}`; // 회원정보수정 쿼리문

     // salt 값 랜덤 생성
     crypto.randomBytes(64, (err, buf) => { 
        salt = buf.toString('base64');
        // 비밀번호 암호화
        crypto.pbkdf2(req.body.storePw, salt, 100, 64, 'sha512', (err, key) => {
            storePw = key.toString('base64');

            // DB에서 회원정보수정
            connection.query(query, [storePw, salt, storeName, storeTel, storeLoc, crn, managerName, managerTel], function (err, result) {
                if(err) { // 에러 발생시
                    console.log("error ocurred: ", err);
                    res.json({ "code": 400, "result": "error ocurred" })
                } else {
                    console.log("update userinfo success");
                    res.json({"code": 200, "result": "update userinfo success"})
                }
            })
        })
    })
});

module.exports = router;