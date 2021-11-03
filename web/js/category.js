// 카테고리 관리
// Author : Sumin, Created : 2021.10.27
$(document).ready(function () {
    getAllCategories();
})

function getAllCategories() {
    // 전체 카테고리 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllCategories',
        success: function (result) {
            for(let i=0; i<result.categories.length; i++) {
                let categoryNo=i+1;
                $('#categoryList').append(
                    `<tr class="category">
                    <td>`+categoryNo+`</td>
                    <td>${result.categories[i].categoryName}</td>
                    <td class="modifyCategory">수정</td>
                    <td class="deleteCategory" onclick="deleteCategory('${result.categories[i].categoryNo}')">삭제</td>
                    </tr>`
                )
            }
        }
    })  
}

function addCategory() {
    let categoryName = $('#categoryName').val();
    if (!categoryName) {
        alert('미입력');
        location.href="/manage_category";
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
                location.href="/manage_category";
        }
    })  
}

function deleteCategory(categoryNo) {
    if (confirm("정말 삭제하시겠습니까? 해당 카테고리의 메뉴도 함께 삭제됩니다.") == true) { // 카테고리 삭제 확인
        $.ajax({
            type: 'POST',
            url: 'admin/deleteCategory',
            contentType: 'application/json', 
            data: JSON.stringify({'categoryNo': categoryNo}),
            success: function (result) {
                if (result.code == 200)
                    alert('삭제되었습니다.');
                location.href="/manage_category";
            }
        });
    } else {// 카테고리 삭제 취소
        location.href="/manage_category";
        return;
    }
}

function updateCategory() {

}