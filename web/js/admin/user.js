// 회원 관리
// Author : Sumin, Created : 2021.10.26

let isChecked = 0;

function signup() {
    let storeId = $('#storeId').val(); // 아이디
    let storePw = $('#storePw').val(); // 비밀번호
    let storePwValid = $('#storePwValid').val(); // 비밀번호 확인
    let storeName = $('#storeName').val(); // 매장명
    let storeTel = $('#storeTel').val(); // 매장 연락처
    let storeLoc = $('#storeLoc').val(); // 매장 위치
    let crn = $('#crn').val(); // 사업자등록번호
    let managerName = $('#managerName').val(); // 점주 이름
    let managerTel = $('#managerTel').val(); // 점주 연락처

    if (!storeId || !storePw || !storePwValid || !storeName || !storeTel || !storeLoc || !crn || !managerName || !managerTel) { // 입력 확인
        alert('미입력');
        return;
    }
    if (storePw != storePwValid) {
        alert('비밀번호, 비밀번호 확인 불일치');
        return;
    }
    if (isChecked != 1) {
        alert('아이디 중복 검사를 해주세요.')
        return;
    }
    // 회원가입 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/signup',
        contentType: 'application/json',
        data: JSON.stringify({'storeId': storeId, 'storeName': storeName, 'storePw': storePw, 'storeTel': storeTel, 'storeLoc': storeLoc,'crn': crn, 'managerName': managerName, 'managerTel': managerTel}),
        success: function (result) {
            if (result.code == 204)
                alert('중복된 아이디입니다.');
            else if (result.code == 200) {
                alert('가입 성공!');
                location.href="/login";
            }
        }
    })    
}

function checkId() { // 아이디 중복 검사
    isChecked=1;
    let storeId = $('#storeId').val(); // 아이디
    if (!storeId) {
        alert('미입력');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/checkId',
        contentType: 'application/json',
        data: JSON.stringify({'storeId': storeId}),
        success: function (result) {
            if (result.code == 204)
                alert('중복된 아이디입니다.');
            else if (result.code == 200) {
                alert('가능한 아이디입니다.');
            }
        }
    })  
}

function login() {
    let storeId = $('#storeId').val();
    let storePw = $('#storePw').val();
    if (!storeId || !storePw) { // 아이디, 비밀번호 입력했는지 확인
        alert('아이디 또는 패스워드를 입력하세요.');
        return;
    }
    // 로그인 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/login',
        contentType: 'application/json',
        data: JSON.stringify({'storeId': storeId, 'storePw': storePw}),
        success: function (result) {
            if (result.code == 208 || result.code == 204)
                alert('아이디 또는 패스워드가 맞지 않습니다.');
            else if (result.code == 200) {
                alert(result.storeId + '님 ' + '환영합니다!');
                location.href="/";
            }
        }
    })
}

function logout() {
    // 로그아웃 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/logout',
        success: function (result) {
            console.log('로그아웃 성공');
            location.href="/login";
        }
    })
}

function findId() {
    let crn = $('#crn').val();
    let managerTel = $('#managerTel').val();
    if (!crn || !managerTel) { // 입력 확인
        alert('미입력');
        return;
    }
    // 아이디찾기 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/findid',
        contentType: 'application/json',
        data: JSON.stringify({'crn': crn, 'managerTel': managerTel}),
        success: function (result) {
            if (result.code == 204)
                alert('미가입 사용자입니다.');
            else if (result.code == 200)
                alert('아이디는 ' + result.storeId +' 입니다.');
            location.href="/login";
        }
    })
}

function findPw() {
    let storeId = $('#store_id').val();
    let email = $('#email').val();
    if (!storeId || !email) {
        alert('미입력');
        return;
    }
    // 비밀번호찾기 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/findpw',
        contentType: 'application/json',
        data: JSON.stringify({'storeId': storeId, 'email': email}),
        success: function (result) {
            if (result.code == 204)
                alert('해당 아이디가 없습니다.');
            else if (result.code == 404)
                alert('메일 전송 오류');
            else if (result.code == 200) { 
                alert('임시 비밀번호가 발급되었습니다.');
                location.href="/login";
            }
        }
    })
}