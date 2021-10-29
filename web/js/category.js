// 카테고리 관리
// Author : Sumin, Created : 2021.10.27

function getAllCategories() {
    // 전체 카테고리 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllCategories',
        success: function (result) {
            for(let i=0; i<result.categories.length; i++) {
                console.log(result.categories[i].categoryName);
            }
        }
    })  
}

function addCategory() {
    let categoryName = $('#categoryName').val();
    if (!categoryName) {
        alert('미입력');
        return;
    }
    // 카테고리 등록 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/addCategory',
        contentType: 'application/json', 
        data: JSON.stringify({'categoryName': categoryName}),
        success: function (result) {
            if (result.code == 200)
                alert('카테고리 등록 성공');
            else if (result.code == 400)
                alert('카테고리 등록 실패');
        }
    })  
}

function deleteCategory() {

}

function updateCategory() {

}