function login() {
    let storeId = $('#storeId').val();
    let storePw = $('#storePw').val();
    if (!storeId || !storePw) { // 아이디, 패스워드 입력했는지 확인
        alert('아이디 또는 패스워드를 입력하세요.');
        return;
    }
    // 로그인 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/login',
        contentType: 'application/json',
        data: JSON.stringify({'storeId': storeId, 'storePw': storePw}),
        success: function (json) {
            if (json.code == 208 || json.code == 204)
                alert('아이디 또는 패스워드가 맞지 않습니다.');
            else if (json.code == 200) {
                alert(json.storeId + '님 ' + '환영합니다!');
                location.href="/menu";
            }
        }
    })
}