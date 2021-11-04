// 메뉴 관리
// Author : Sumin, Created : 2021.10.27
$(document).ready(function () {
    getAllMenus();
    getAllCategoryNames();
})

function getAllMenus() {
    $('#menuList').empty();
    $('#menuList').append(
        `<th>메뉴 번호</th>
        <th>카테고리</th>
        <th>이름</th>
        <th>가격</th>
        <th>상세 정보</th>
        <th></th>
        <th></th>`
    )
    // 전체 메뉴 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllMenus',
        success: function (result) {
            for (let i=0; i<result.menus.length; i++) {
                let menuNo=i+1;
                $('#menuList').append(
                    `<tr class="menu">
                    <td>`+menuNo+`</td>
                    <td>${result.menus[i].categoryName}</td>
                    <td>${result.menus[i].menuName}</td>
                    <td>${result.menus[i].menuPrice}</td>
                    <td class="menuDetail" onclick="getMenuDetail('${result.menus[i].menuNo}', '${result.menus[i].categoryName}', '${result.menus[i].menuName}', '${result.menus[i].menuPrice}', '${result.menus[i].menuDetail}')">${result.menus[i].menuDetail}</td>
                    <td class="modifyMenu" onclick="setValuesBeforeUpdateMenu('${result.menus[i].menuNo}', '${result.menus[i].menuName}', '${result.menus[i].menuPrice}', '${result.menus[i].menuDetail}')">수정</td>
                    <td class="deleteMenu" onclick="deleteMenu('${result.menus[i].menuNo}')">삭제</td>
                    </tr>`
                )
            }
        }
    })    
}

function getAllCategoryNames() {
    $('#category').empty();
    $('#selectCategory').empty();
    $.ajax({
        type: 'GET',
        url: '/admin/getAllCategoryNames',
        success: function (result) {
            for (let i=0; i<result.categories.length; i++) {
                $('#categoryList').append(
                    `<p class="category" onclick="getMenusByCategory('${result.categories[i].categoryName}')">${result.categories[i].categoryName}</p>`
                )
                $('#selectCategory').append(
                    `<option value="${result.categories[i].categoryName}">${result.categories[i].categoryName}</option>`
                )

                $('#select_category').append(
                    `<option value="${result.categories[i].categoryName}">${result.categories[i].categoryName}</option>`
                )
            }
        }
    })
}

function getMenusByCategory(categoryName) {
    $('#menuList').empty();
    $('#menuList').append(
        `<th>메뉴 번호</th>
        <th>카테고리</th>
        <th>이름</th>
        <th>가격</th>
        <th>상세 정보</th>
        <th></th>
        <th></th>`
    )
    // 카테고리별 메뉴 조회 서버와 통신
    $.ajax({
        type: 'POST',
        url: 'admin/getMenusByCategory',
        contentType: 'application/json', 
        data: JSON.stringify({'categoryName': categoryName}),
        success: function (result) {
            for (let i=0; i<result.menus.length; i++) {
                let menuNo=i+1;
                $('#menuList').append(
                    `<tr class="menu">
                    <td>`+menuNo+`</td>
                    <td>${result.menus[i].categoryName}</td>
                    <td>${result.menus[i].menuName}</td>
                    <td>${result.menus[i].menuPrice}</td>
                    <td class="menuDetail" onclick="getMenuDetail('${result.menus[i].menuNo}', '${result.menus[i].categoryName}', '${result.menus[i].menuName}', '${result.menus[i].menuPrice}', '${result.menus[i].menuDetail}')">${result.menus[i].menuDetail}</td>
                    <td class="modifyMenu" onclick="setValuesBeforeUpdateMenu('${result.menus[i].menuNo}', '${result.menus[i].menuName}', '${result.menus[i].menuPrice}', '${result.menus[i].menuDetail}')">수정</td>
                    <td class="deleteMenu" onclick="deleteMenu('${result.menus[i].menuNo}')">삭제</td>
                    </tr>`
                )
            }
        }
    });
}

function getMenuDetail(menuNo, categoryName, menuName, menuPrice, menuDetail) {
    modal('menuDetailModal');

    $.ajax({
        url:`/admin/getMenuImg/`+menuNo,
        cache:false,
        xhr:function(){
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'blob'
            return xhr;
        },
        success: function(data){
            var url = window.URL || window.webkitURL;
            var src = url.createObjectURL(data);
            $('#menuFormArea').empty(); // 초기화
            $('#menuFormArea').append(
                `<img src="`+src+`" class="menu_img">
                <span class="detailList">카테고리</span><span class="category_no">`+categoryName+`</span><br><br><br><br>
                <span class="detailList">이름</span><span class="menu_name">`+menuName+`</span><br><br><br><br>
                <span class="detailList">가격</span><span class="menu_price">`+menuPrice+`</span><br><br><br><br>
                <span class="detailList">상세 정보</span><span class="menu_detail">`+menuDetail+`</span>`
            )
        }
    });

    
}

function menuImgPreview(id, file) {
    id.src=URL.createObjectURL(file);
}

function addMenu() {
    /*if (!$('#add_menu_form')) {
        alert('미입력');
        return;
    }*/ // 미입력 처리 필요

    var form = $('#add_menu_form')[0];
    var formData = new FormData(form);

    $.ajax({
        type: 'post',
        url: 'admin/addMenu',
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.code == 200)
                alert('메뉴 추가 성공');
            else
                alert('메뉴 추가 실패');
            location.href="/manage_menu";
        }
    });
}

function deleteMenu(menuNo) {
    if (confirm("정말 삭제하시겠습니까?") == true) { // 메뉴 삭제 확인
        $.ajax({
            type: 'POST',
            url: 'admin/deleteMenu',
            contentType: 'application/json', 
            data: JSON.stringify({'menuNo': menuNo}),
            success: function (result) {
                if (result.code == 200)
                    alert('삭제되었습니다.');
                location.href="/manage_menu";
            }
        });
    } else {// 메뉴 삭제 취소
        location.href="/manage_menu";
        return;
    }
    
}

function setValuesBeforeUpdateMenu(menuNo, menuName, menuPrice, menuDetail) {
    modal('modifyMenuModal');

    $('#menu_no').val(menuNo);
    $('#menu_name').val(menuName);
    $('#menu_price').val(menuPrice);
    $('#menu_detail').val(menuDetail);

    /*$.ajax({
        url:`/admin/getMenuImg/`+menuNo,
        cache:false,
        xhr:function(){
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'blob'
            return xhr;
        },
        success: function(data){
            var img = document.getElementById('img');
            var url = window.URL || window.webkitURL;
            img.src = url.createObjectURL(data);

            
        }
    });*/

}

function updateMenu() {
    var form = $('#modify_menu_form')[0];
    var formData = new FormData(form);

    $.ajax({
        type: 'post',
        url: 'admin/updateMenu',
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.code == 200)
                alert('메뉴 수정 성공');
            else
                alert('메뉴 수정 실패');
            location.href="/manage_menu";
        }
    });
}