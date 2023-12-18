const btn = document.querySelectorAll('.btn-proloop-cart.add-to-cart')
btn.forEach(function (button, index) {
    button.addEventListener("click", function (event) {
        {
            var parentElement = this.closest('.product-loop');
            var productIMG = parentElement.querySelector('img').src
            var productName = parentElement.querySelector('h3').innerText
            var productPrice = parentElement.querySelector('span').innerText
            addcart(productIMG,productName,productPrice);
        }
    })

})
function addcart(productIMG, productName, productPrice) {
    var addtr = document.createElement("tr")
    var cartItem = document.querySelectorAll(".table-cart-view tr")
    var productExistsInCart = false;

    for (var i = 0; i < cartItem.length; i++) {
        var productT = document.querySelectorAll(".nameItem")
        if (productT[i].innerHTML == productName) {
            alert("Sản phẩm của bạn đã có trong giỏ hàng")
            productExistsInCart = true;
            break;
        }
    }

    if (!productExistsInCart) {
        // Phần còn lại của hàm addcart...
        var trcontent = '<tr style="font-family: Arial, sans-serif; font-size: 14px;"><td style="display: flex; align-items: center"><img src="'+productIMG+'" style="width: 25%; height: auto;" alt=" "><h7 class="nameItem">'+productName+'</h7></td><td style="padding: 10px;"><span style="font-weight: bold; color: black;">'+productPrice+'</span></td><td style="padding: 10px; background-color: #f8f9fa; text-align: center; border: 1px solid #ced4da; border-radius: 4px;"><input type="number" value="1" min="1" style="width: 30px; outline: none;" /></td><td style="cursor: pointer; padding: 10px; background-color: #f8f9fa; text-align: center; border: 1px solid #ced4da; border-radius: 4px;"><span class="deleteItem">Xóa</span></td></tr>'
        addtr.innerHTML = trcontent
        var cartTable = document.querySelector('table.table-cart-view')
        // console.log(cartTable)
        cartTable.append(addtr)
        carttotal()
        deletecart()
        // Tìm thẻ <span> chứa số lượng giỏ hàng
        var cartQuantityElement = document.querySelector('.count-holder .count');

        // Tăng số lượng giỏ hàng lên 1
        var currentQuantity = parseInt(cartQuantityElement.textContent);
        cartQuantityElement.textContent = currentQuantity + 1;
    }
}
function carttotal(){
    var cartItem = document.querySelectorAll(".table-cart-view tr")
    var totalC = 0
    for (var i=0; i<cartItem.length;i++){
        var inputValue = cartItem[i].querySelector("input").value
        var productPrice = cartItem[i].querySelector("span").innerHTML
        // Loại bỏ dấu phẩy và chuyển đổi thành số
        productPrice = parseFloat(productPrice.replace(/,/g,''));
        totalA = inputValue * productPrice
        totalC = totalC + totalA
        // Chuyển đổi lại thành dạng có dấu phẩy
        // totalD = totalC.toLocaleString('de-DE')
    }
    var cartTotalA = document.querySelector(".total-view-cart span")
    cartTotalA.innerHTML = totalC.toLocaleString('de-DE')
    inputchane()
}
//--------Delete cart ----------//
function deletecart(){
    var cartItem = document.querySelectorAll(".table-cart-view tr")
    for (var i=0; i<cartItem.length;i++){
        var productT = document.querySelectorAll(".deleteItem")
        // Kiểm tra xem sự kiện click đã được đăng ký chưa
        if (!productT[i].hasAttribute('data-clicked')) {
            productT[i].addEventListener("click",function(event){
                var cartDelete = event.target
                var cartitemR = cartDelete.parentElement.parentElement
                cartitemR.remove()
                carttotal()

                // Tìm thẻ <span> chứa số lượng giỏ hàng
                var cartQuantityElement = document.querySelector('.count-holder .count');

                // Giảm số lượng giỏ hàng đi 1
                var currentQuantity = parseInt(cartQuantityElement.textContent);
                cartQuantityElement.textContent = currentQuantity - 1;
            })
            // Đánh dấu sự kiện click đã được đăng ký
            productT[i].setAttribute('data-clicked', 'true');
        }
    }
}

function inputchane(){
    var cartItem = document.querySelectorAll(".table-cart-view tr")
    for (var i=0; i<cartItem.length;i++){
        var inputValue = cartItem[i].querySelector("input")
        inputValue.addEventListener("change",function(){
            carttotal()
        })
    }
}