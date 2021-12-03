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
                    <td class="modifyCategory" onclick="setValuesBeforeUpdateCategory('${result.categories[i].categoryNo}', '${result.categories[i].categoryName}')">수정</td>
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
    if (confirm("정말 삭제하시겠습니까?") == true) { // 카테고리 삭제 확인
        $.ajax({
            type: 'GET',
            url: 'admin/deleteCategory/'+categoryNo,
            success: function (result) {
                if (result.code == 200)
                    alert('삭제되었습니다.');
                else if (result.code == 204) {
                    alert('빈 카테고리만 삭제할 수 있습니다.')
                }
                location.href="/manage_category";
            }
        });
    } else {// 카테고리 삭제 취소
        location.href="/manage_category";
        return;
    }
}

function setValuesBeforeUpdateCategory(categoryNo, categoryName) {
    modal('modifyCategoryModal');

    $('#category_no').val(categoryNo);
    $('#category_name').val(categoryName);
}

function updateCategory() {
    let categoryNo = $('#category_no').val();
    let categoryName = $('#category_name').val();

    if(!categoryName) {
        alert('미입력');
        location.href="/manage_category";
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'admin/updateCategory',
        contentType: 'application/json', 
        data: JSON.stringify({'category_name': categoryName, 'category_no': categoryNo}),
        success: function (result) {
            if (result.code == 200)
                alert('수정되었습니다.');
            else
                alert('수정 실패');
            location.href="/manage_category";
        }
    });
}