const btn = document.querySelectorAll('.btn-proloop-cart.add-to-cart')
btn.forEach(function (button, index) {
    button.addEventListener("click", function (event) {
        {
            var parentElement = this.closest('.product-loop');
            var productIMG = parentElement.querySelector('img').src
            var productName = parentElement.querySelector('H3').innerText
            var productPrice = parentElement.querySelector('span').innerText
            addcart(productIMG,productName,productPrice);
        }
    })

})

function addcart(productIMG,productName,productPrice){
    var addtr = document.createElement("tr")
    var trcontent = '<tr style="font-family: Arial, sans-serif; font-size: 14px;"><td style="padding: 10px;"><img src="'+productIMG+'" alt="" style="width: 100%; height: auto;"></td><td style=";">'+productName+'<br>PC ZOTAC GAMING TYPE2 SUPER</td><td style="padding: 10px;">'+productPrice+'</td></tr>'
    addtr.innerHTML = trcontent
    var cartTable = document.querySelector('table.table-cart-view')
    // console.log(cartTable)
    cartTable.append(addtr)
}