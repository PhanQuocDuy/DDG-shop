// Biến khởi tạo
var timeOut_modalCart;
var viewout = true;
var check_show_modal = true;
var htmlQvApp = "",
  htmlCombo = "";
var dataItemsCombo = [];
const img_gift =
  "https://file.hstatic.net/1000308580/file/icon-gifbox_21127e78739a40a28f058e5e123d41b1.png";

//Delay action
function delayTime(func, wait) {
  return function () {
    var that = this,
      args = [].slice(arguments);
    clearTimeout(func._throttleTimeout);
    func._throttleTimeout = setTimeout(function () {
      func.apply(that, args);
    }, wait);
  };
}

function render_img(result, aIdCombo) {
  var htmlImg = "";
  var numIdCombo = aIdCombo.length - 1;
  htmlImg += '<div class="combo-content--images">';
  $.each(aIdCombo, function (i, v) {
    htmlImg +=
      '<a href="' +
      result[v].url +
      '" title="' +
      result[v].title +
      '" class="image ">';
    htmlImg +=
      '<img src="' +
      Haravan.resizeImage(result[v].img, "medium") +
      '" alt="' +
      result[v].title +
      '">';
    htmlImg += "</a>";
    if (i < numIdCombo) {
      htmlImg += '<p class="plus">+</p>';
    }
  });
  htmlImg += "</div>";
  return htmlImg;
}

function render_price(result, dtCombo) {
  var dt_of_combo = {},
    price_combo = 0;

  if (!dtCombo.is_apply_by_variant) {
    dt_of_combo.quantity = dtCombo.quantity;
    switch (dtCombo.type) {
      case 1:
        price_combo = result.price - dtCombo.promotion_value;
        break;
      case 2:
        price_combo =
          result.price - result.price * (dtCombo.promotion_value / 100);
        break;
      default:
        price_combo = dtCombo.promotion_value;
    }
    dt_of_combo.price = price_combo;
  } else {
    $.each(dtCombo.apply_productvariants, function (i, v) {
      if (v != null) {
        dt_of_combo.quantity = v.qty;
        switch (v.type) {
          case 1:
            price_combo = result.variants[v.id].price - v.promotion_value;
            break;
          case 2:
            price_combo =
              result.variants[v.id].price -
              result.variants[v.id].price * (v.promotion_value / 100);
            break;
          default:
            price_combo = v.promotion_value;
        }
        dt_of_combo.price = price_combo;
      }
    });
  }
  return dt_of_combo;
}

function render_detail(result, iCombo, nCombo, currentId) {
  var htmlDetail = '<div class="combo-content--detail">';
  htmlDetail += "<ul>";
  var totalPriceCombo = 0;
  $.each(nCombo, function (i, v) {
    /* Xử lý giá trị từ app */
    var dtCombo = render_price(result[v], dataItemsCombo[iCombo][v]);
    /* End Xử lý */
    var dtPrice = $.isEmptyObject(dtCombo) ? result[v].price : dtCombo.price;
    var dtQty = $.isEmptyObject(dtCombo) ? 1 : dtCombo.quantity;
    totalPriceCombo += dtPrice * dtQty;
    if (v == currentId) {
      htmlDetail += '<li class="item-force">';
      htmlDetail += '<label for="item-force">';
      htmlDetail +=
        '<input type="checkbox" id="item-force" class="force" name="combo-option" value="' +
        result[v].first_available +
        '"  data-combo="' +
        dtPrice +
        '" data-quantity="' +
        dtQty +
        '" data-origin="' +
        result[v].price +
        '"  checked/>';
    } else {
      htmlDetail += "<li><label>";
      htmlDetail +=
        '<input type="checkbox" name="combo-option" value="' +
        result[v].first_available +
        '" data-combo="' +
        dtPrice +
        '" data-quantity="' +
        dtQty +
        '" data-origin="' +
        result[v].price +
        '"  checked/>';
    }
    htmlDetail += "</label>";
    htmlDetail +=
      '<p class="combo-item--title">' +
      (v == currentId ? "<strong>Bạn đang xem: </strong> " : "") +
      dtQty +
      " x " +
      result[v].title;
    htmlDetail +=
      "<span><b>" +
      Haravan.formatMoney(result[v].price * 100, formatMoney) +
      "</b>" +
      (result[v].price < result[v].compare_at_price
        ? "<del>" +
          Haravan.formatMoney(result[v].compare_at_price * 100, formatMoney) +
          "</del>"
        : "") +
      "</span>";
    htmlDetail += "</p>";
    htmlDetail +=
      '<p class="combo-item--price">' +
      Haravan.formatMoney(dtPrice * dtQty * 100, formatMoney) +
      (result[v].price > dtPrice
        ? "<del>" +
          Haravan.formatMoney(result[v].price * dtQty * 100, formatMoney) +
          "</del>"
        : "") +
      "</p>";
    htmlDetail += "</li>";
  });
  htmlDetail += "</ul>";
  htmlDetail += "</div>";
  htmlDetail += '<div class="combo-content--total">';
  htmlDetail +=
    '<p>Tổng tiền: <span class="combo-total-price">' +
    Haravan.formatMoney(totalPriceCombo * 100, formatMoney) +
    "</span></p>";
  htmlDetail +=
    '<button type="button" class="add-combo">Thêm ' +
    nCombo.length +
    " vào giỏ hàng</button>";
  htmlDetail += "</div>";
  return htmlDetail;
}

function render_items(result, iCombo, nCombo, currentId) {
  var htmlDetail = '<div class="combo-content--list">';
  htmlDetail += '<div class="list-combos">';
  var totalPriceCombo = 0;
  var totalPriceInit = 0;
  var numCombo = nCombo.length - 1;
  $.each(nCombo, function (i, v) {
    /* Xử lý giá trị từ app */
    var dtCombo = render_price(result[v], dataItemsCombo[iCombo][v]);
    /* End Xử lý */
    var dtPrice = $.isEmptyObject(dtCombo) ? result[v].price : dtCombo.price;
    var dtQty = $.isEmptyObject(dtCombo) ? 1 : dtCombo.quantity;
    totalPriceInit += result[v].price;
    totalPriceCombo += dtPrice * dtQty;

    htmlDetail +=
      '<div class="combo-item' + (v == currentId ? " item-force" : " ") + '">';
    htmlDetail += '<div class="combo-item--images">';
    htmlDetail +=
      '<a href="' +
      result[v].url +
      '" title="' +
      result[v].title +
      '" class="image ">';
    htmlDetail +=
      '<img src="' +
      Haravan.resizeImage(result[v].img, "medium") +
      '" alt="' +
      result[v].title +
      '">';
    htmlDetail += "</a>";
    htmlDetail += "</div>";
    htmlDetail += '<div class="combo-item--detail">';
    htmlDetail += '<div class="combo-item--title">';
    if (v == currentId) {
      htmlDetail +=
        '<input type="checkbox" id="item-force" class="force" name="combo-option" value="' +
        result[v].first_available +
        '"  data-combo="' +
        dtPrice +
        '" data-quantity="' +
        dtQty +
        '" data-origin="' +
        result[v].price +
        '" data-km="' +
        result[v].compare_at_price +
        '" checked/>';
    } else {
      htmlDetail +=
        '<input type="checkbox" name="combo-option" value="' +
        result[v].first_available +
        '" data-combo="' +
        dtPrice +
        '" data-quantity="' +
        dtQty +
        '" data-origin="' +
        result[v].price +
        '" data-km="' +
        result[v].compare_at_price +
        '" checked/>';
    }
    htmlDetail +=
      '<span class="combo--title">' +
      (v == currentId ? "<strong>Bạn đang xem: </strong> " : "") +
      dtQty +
      " x " +
      result[v].title;
    htmlDetail += "</span>";
    htmlDetail += "</div>";
    htmlDetail +=
      '<p class="combo-item--priceInit"><span><b>' +
      Haravan.formatMoney(result[v].price * 100, formatMoney) +
      "</b>" +
      (result[v].price < result[v].compare_at_price
        ? "<del>" +
          Haravan.formatMoney(result[v].compare_at_price * 100, formatMoney) +
          "</del>"
        : "") +
      "</span></p>";
    htmlDetail +=
      '<p class="combo-item--price"><span>Giảm còn: </span>' +
      Haravan.formatMoney(dtPrice * dtQty * 100, formatMoney) +
      (result[v].price > dtPrice
        ? "<del>" +
          Haravan.formatMoney(result[v].price * dtQty * 100, formatMoney) +
          "</del>"
        : "") +
      "</p>";
    htmlDetail += "</div>";
    htmlDetail += "</div>";
  });
  htmlDetail += "</div>";
  htmlDetail += "</div>"; //end list item

  htmlDetail += '<div class="combo-content--total">';
  htmlDetail += '<div class="wrapbox-total">';
  htmlDetail +=
    '<p class="txt1">Tổng tiền: <span class="combo-total-price">' +
    Haravan.formatMoney(totalPriceCombo * 100, formatMoney) +
    "</span></p>";
  htmlDetail +=
    '<p class="txt2">Tiết kiệm: <span class="combo-total-priceInit">' +
    Haravan.formatMoney(
      totalPriceInit * 100 - totalPriceCombo * 100,
      formatMoney
    ) +
    "</span></p>";
  htmlDetail +=
    '<button type="button" class="add-combo">Thêm ' +
    nCombo.length +
    " vào giỏ hàng</button>";
  htmlDetail += "</div>";
  htmlDetail += "</div>";
  return htmlDetail;
}

function uniques(arr) {
  var a = [];
  for (var i = 0, l = arr.length; i < l; i++)
    if (a.indexOf(arr[i]) === -1 && arr[i] !== "") a.push(arr[i]);
  return a;
}

function addCombo(indx, aItems, callback) {
  if (indx < aItems.length) {
    $.ajax({
      url: "/cart/add.js",
      type: "POST",
      data: "id=" + aItems[indx].vid + "&quantity=" + aItems[indx].qty,
      async: false,
      success: function (data) {
        indx++;
        addCombo(indx, aItems, callback);
      },
      error: function () {},
    });
  } else {
    if (typeof callback === "function") return callback();
  }
}

/* Global Event */
/*
$(document).on('change','#quick-view-modal input[name="combo-option"]:not(.force),#detail-product .combo-info input[name="combo-option"]:not(.force)',function(){
	var ind = $(this).parents('li').index();
	var total = 0;
	if(ind >= 0){
		if($(this).is(':checked')){
			$(this).parents('.combo-info--content').find('.combo-content--images a:nth-child('+(ind*2 + 1)+')').removeClass('disabled');
		}
		else{
			$(this).parents('.combo-info--content').find('.combo-content--images a:nth-child('+(ind*2 + 1)+')').addClass('disabled');
		}

		var numCombo = $(this).parents('.combo-info--content').find('input').length;
		var numCheck = $(this).parents('.combo-info--content').find('input:checked').length;
		$(this).parents('.combo-info--content').find('input').each(function(){
			var combo = parseInt($(this).attr('data-combo').trim());
			var qty = parseInt($(this).attr('data-quantity').trim());
			var origin = parseInt($(this).attr('data-origin').trim());
			if(numCombo == numCheck){
				total += combo*qty;
				var htmlDel = '';
				if(origin > combo){
					htmlDel += '<del>'+Haravan.formatMoney(origin*qty*100, formatMoney)+'</del>';
				}
				$(this).parents('li').find('.combo-item--price').html(Haravan.formatMoney(combo*qty*100, formatMoney)+htmlDel);
			}
			else{
				var origin = parseInt($(this).attr('data-origin').trim());
				$(this).parents('li').find('.combo-item--price').html(Haravan.formatMoney(origin*qty*100, formatMoney));
				if($(this).is(':checked')) total += origin*qty;
			}
		});
		$(this).parents('.combo-info--content').find('.combo-total-price').html(Haravan.formatMoney(total*100, formatMoney));
	}
	var parents = $(this).parents('.productDetail--content').attr('id');
	var checkcount = $('#'+parents+' input[name="combo-option"]:checked').length;
	$(this).parents('.combo-info--content').find('.add-combo').html('Thêm '+(checkcount == 1 ? '' : checkcount + ' ')+'vào giỏ');
});
*/
$(document).on(
  "change",
  '#quick-view-modal input[name="combo-option"]:not(.force),#detail-product .combo-info input[name="combo-option"]:not(.force)',
  function () {
    var ind = $(this).parents(".combo-item").index();
    var total = 0;
    var totalKm = 0;
    if (ind >= 0) {
      if ($(this).is(":checked")) {
        //$(this).parents('.combo-info--content').find('.combo-item:nth-child('+(ind*2 + 1)+')'+'.combo-item--images a').removeClass('disabled');
        $(this)
          .parents(".combo-info--content")
          .find(".combo-item:nth-child(" + (ind * 1 + 1) + ")")
          .removeClass("disabled");
      } else {
        $(this)
          .parents(".combo-info--content")
          .find(".combo-item:nth-child(" + (ind * 1 + 1) + ")")
          .addClass("disabled");
      }
      var numCombo = $(this)
        .parents(".combo-info--content")
        .find("input").length;
      var numCheck = $(this)
        .parents(".combo-info--content")
        .find("input:checked").length;
      $(this)
        .parents(".combo-info--content")
        .find("input")
        .each(function () {
          var combo = parseInt($(this).attr("data-combo").trim());
          var qty = parseInt($(this).attr("data-quantity").trim());
          var origin = parseInt($(this).attr("data-origin").trim());
          if (numCombo == numCheck) {
            total += combo * qty;
            totalKm += origin * qty - combo * qty;
            var htmlDel = "";
            if (origin > combo) {
              htmlDel +=
                "<del>" +
                Haravan.formatMoney(origin * qty * 100, formatMoney) +
                "</del>";
            }
            $(this)
              .parents("div.combo-item")
              .find(".combo-item--price")
              .html(
                "<span>Giảm còn: </span>" +
                  Haravan.formatMoney(combo * qty * 100, formatMoney) +
                  htmlDel
              );
          } else {
            var origin = parseInt($(this).attr("data-origin").trim());
            var priceKm = parseInt($(this).attr("data-km").trim());
            if (priceKm == 0) priceKm = origin;

            $(this)
              .parents("div.combo-item")
              .find(".combo-item--price")
              .html(Haravan.formatMoney(origin * qty * 100, formatMoney));
            $(this)
              .parents("div.combo-item")
              .find(".combo-item--price")
              .html("&nbsp");
            if ($(this).is(":checked"))
              (total += origin * qty),
                (totalKm += priceKm * qty - origin * qty);
          }
        });
      $(this)
        .parents(".combo-info--content")
        .find(".combo-total-price")
        .html(Haravan.formatMoney(total * 100, formatMoney));
      $(this)
        .parents(".combo-info--content")
        .find(".combo-total-priceInit")
        .html(Haravan.formatMoney(totalKm * 100, formatMoney));
    }
    var parents = $(this).parents(".productDetailjs").attr("id");
    var checkcount = $(
      "#" + parents + ' input[name="combo-option"]:checked'
    ).length;
    $(this)
      .parents(".combo-info--content")
      .find(".add-combo")
      .html(
        "Thêm " + (checkcount == 1 ? "" : checkcount + " ") + "vào giỏ hàng"
      );
  }
);

$(document).on("click", "#detail-product .combo-info .add-combo", function () {
  var aItems = [];
  $(this)
    .parents(".combo-info--content")
    .find("input:checked")
    .each(function () {
      var temp = {};
      temp.vid = $(this).val();
      //temp.qty = $(this).attr('data-quantity');
      temp.qty =
        parseInt($(this).attr("data-quantity")) *
        parseInt($("#quantity").val());

      aItems.push(temp);
    });
  addCombo(0, aItems, function () {
    //window.location = '/cart';
    HRT.All.getCartModal(true);
    if ($(window).width() < 992) {
      $("body").removeClass("locked-scroll").addClass("body-showcart");
      $(".siteCart-mobile").addClass("show-cart");
    }
  });
});

$(document).on("click", "#quick-view-modal .add-combo", function () {
  var aItems = [];
  $(this)
    .parents(".combo-info--content")
    .find("input:checked")
    .each(function () {
      var temp = {};
      temp.vid = $(this).val();
      //temp.qty = $(this).attr('data-quantity');

      temp.qty =
        parseInt($(this).attr("data-quantity")) *
        parseInt($("#quickview-qtyvalue").val());
      aItems.push(temp);
    });

  addCombo(0, aItems, function () {
    //window.location = '/cart';
    HRT.All.getCartModal(true);
    $("#quick-view-modal").modal("hide");
    if ($(window).width() < 992) {
      $("body").removeClass("locked-scroll").addClass("body-showcart");
      $(".siteCart-mobile").addClass("show-cart");
    }
  });
});

// Nút chỉ thêm sản phẩm hiện tại Buy X Get y
$(document).on("click", ".swal-alert-km .swal-button--confirm", function (e) {
  e.preventDefault();
  var variant_id = $("#product-select").val(),
    quantity = $("#quantity").val(),
    title = $("#detail-product .product-heading h1").html();
  var a = $(this);
  buyXgetY.addCartBuyXGetY_detail(
    true,
    variant_id,
    currentId,
    quantity,
    title,
    "normal",
    function () {
      if (a.hasClass("btn-swal-checkout")) {
        window.location = "/cart";
      } else {
        swal.close();
        HRT.All.getCartModal(true);
      }
      //$('#alert_km').modal('hide');

      //HRT.All.addItemShowModalCart($('#product-select').val());
    }
  );
});

$(document).on(
  "click",
  ".swal-alert-km-qv .swal-button--confirm",
  function (e) {
    e.preventDefault();
    var min_qty = parseInt(
      jQuery('.quickview-qtyvalue[name="quantity"]').val()
    );
    var variant_id = $("#product-select-quickview").val();
    var title = $("#detail-product-quickview .product-heading h2").html();
    var product_id = $("#detail-product-quickview #add-to-cartQuickview").attr(
      "data-pid"
    );
    buyXgetY.addCartBuyXGetY_detail(
      true,
      variant_id,
      product_id,
      min_qty,
      title,
      "quick-view",
      function () {
        swal.close();
        $("#quick-view-modal").modal("hide");
        HRT.All.getCartModal(true);
        //HRT.All.addItemShowModalCart(min_qty);
      }
    );
  }
);

var HRT = {
  init: function () {
    var that = this;
    that.initViews();
    that.Main.init();
    $.get("/cart.js").done(function (cart) {
      $(".count-holder .count").html(cart.item_count);
    });
    /*that.All.getCartModal('first');*/
  },
  initViews: function () {
    var view = window.template,
      that = this;
    switch (view) {
      case "index":
      case "index.header-style-01":
      case "index.header-style-02":
      case "index.header-style-03":
        that.Index.init();
        that.Quickview.init();
        break;
      case "collection":
        that.Collection.init();
        that.Quickview.init();
        break;
      case "product":
      case "product.style-01":
      case "product.style-02":
      case "product.style-03":
      case "product.style-04":
        that.Product.init();
        that.Quickview.init();
        break;
      case "product.quickview":
        that.Quickview.init();
        break;
      case "search":
        that.Quickview.init();
        break;
      case "blog":
        break;
      case "article":
        that.Article.init();
        break;
      case "page.contact":
        break;
      case "page":
      case "page.about-01":
      case "page.about-02":
      case "page.about-03":
      case "page.stores":
        that.Page.init();
        break;
      case "customers[order]":
        break;
      case "cart":
        HRT.Cart.init();
        break;
      case "page.landing-page-01":
        that.Ldpage01.init();
        that.Quickview.init();
        break;
      default:
    }
  },
};

HRT.All = {
  checkCart: function () {
    $.ajax({
      url: "/cart.js",
      type: "GET",
      async: false,
      success: function (cart) {
        $(".count-holder .count").html(cart.item_count);
        cartGet = cart;
        if (cart.items.length > 0) {
          cart.items.map((x, i) => {
            $(
              '.proloop-actions[data-vrid="' +
                x.variant_id +
                '"] .proloop-value'
            ).val(x.quantity);
            $('.proloop-actions[data-vrid="' + x.variant_id + '"]').addClass(
              "action-count"
            );
          });
        }
      },
    });
  },
  notifyProduct: function ($info) {
    var wait = setTimeout(function () {
      $.jGrowl($info, {
        life: 2000,
      });
    });
  },
  fixHeightProduct: function (data_parent, data_target, data_image) {
    var box_height = 0;
    var box_image = 0;
    var boxtarget = data_parent + " " + data_target;
    var boximg = data_parent + " " + data_target + " " + data_image;
    jQuery(boximg).css("height", "auto");
    jQuery($(boxtarget)).css("height", "auto");
    jQuery($(boxtarget)).removeClass("fixheight");
    jQuery($(boxtarget)).each(function () {
      if (
        jQuery(this)
          .find(data_image + " .lazyloaded")
          .height() > box_image
      ) {
        box_image = jQuery(this).find($(data_image)).height();
      }
    });
    if (box_image > 0) {
      jQuery(boximg).height(box_image);
    }
    jQuery($(boxtarget)).each(function () {
      if (jQuery(this).height() > box_height) {
        box_height = jQuery(this).height();
      }
    });
    jQuery($(boxtarget)).addClass("fixheight");
    if (box_height > 0) {
      jQuery($(boxtarget)).height(box_height);
    }
    try {
      fixheightcallback();
    } catch (ex) {}
  },
  getCartModal: function (check, data) {
    function processCart(cart, xHasyPrice) {
      if (cart) {
        jQuery(".count-holder .count").html(cart.item_count);
        jQuery(".siteCart-mobile__header .p-count").html(
          cart.item_count + " sản phẩm"
        );
        if (cart.item_count == 0) {
          jQuery("#exampleModalLabel").html(
            "Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng."
          );
          jQuery(".header-action_cart .table-cart-view").html(
            '<tbody><tr class="mini-cart__empty"><td><div class="svgico-mini-cart"> <svg width="81" height="70" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg></div> Hiện chưa có sản phẩm</td></tr></tbody>'
          );
          jQuery(".siteCart-mobile .table-cart-view").html(
            '<tbody><tr class="mini-cart__empty"><td><div class="svgico-mini-cart"> <svg width="81" height="70" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg></div> Hiện chưa có sản phẩm</td></tr></tbody>'
          );
          jQuery("#cartform").hide();
          jQuery(".siteCart-mobile").removeClass("show-cart");
          jQuery(".header-action_cart").removeClass("js-action-show");
          jQuery("body")
            .removeClass("mainBody-mbcart")
            .removeClass("body-showcart");
        } else {
          //jQuery('#exampleModalLabel').html('Bạn có ' + cart.item_count + ' sản phẩm trong giỏ hàng.');
          jQuery("body").addClass("mainBody-mbcart");
          jQuery("#cartform").removeClass("d-none");
          $(".header-action_cart .table-cart-view").html("");
          $(".siteCart-mobile .table-cart-view").html("");
        }
        if (jQuery("#cart-pos-product").length > 0) {
          jQuery("#cart-pos-product span").html(cart.item_count + " sản phẩm");
        }

        // Get product for cart view
        jQuery.each(cart.items, function (i, item) {
          HRT.All.clone_item(item, i, xHasyPrice);
        });

        jQuery(".header-action_cart .total-view-cart").html(
          Haravan.formatMoney(cart.total_price, formatMoney)
        );
        jQuery(".siteCart-mobile .total-view-cart").html(
          Haravan.formatMoney(cart.total_price, formatMoney)
        );
        jQuery(".siteCart-mobile__header .p-price").html(
          Haravan.formatMoney(cart.total_price, formatMoney)
        );
        if (priceMin != "") {
          if (priceMin > cart.total_price / 100) {
            $(".linktocheckout").attr("href", "/cart");
          } else {
            $(".linktocheckout").attr("href", "/checkout");
          }
        }
      } else {
        jQuery("#exampleModalLabel").html(
          "Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng."
        );
        if (jQuery("#cart-pos-product").length > 0) {
          jQuery("#cart-pos-product span").html(cart.item_count + " sản phẩm");
        }
        jQuery(".siteCart-mobile__header .p-count").html(
          cart.item_count + " sản phẩm"
        );
        $(".header-action_cart .table-cart-view").html(
          '<div class="mini-cart__empty"><div><div class="svgico-mini-cart"> <svg width="81" height="70" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg></div> Hiện chưa có sản phẩm</div></div>'
        );
        $(".siteCart-mobile .table-cart-view").html(
          '<div class="mini-cart__empty"><div><div class="svgico-mini-cart"> <svg width="81" height="70" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg></div> Hiện chưa có sản phẩm</div></div>'
        );
        jQuery(".siteCart-mobile").removeClass("show-cart");
        jQuery("body")
          .removeClass("mainBody-mbcart")
          .removeClass("body-showcart");
      }
    }

    var cart = null;
    jQuery("#cartform").hide();
    jQuery("#myCart #exampleModalLabel").text("Giỏ hàng");
    if (data == undefined) {
      jQuery.getJSON("/cart.js", function (cart, textStatus) {
        cartGet = cart;
        var xHasyPrice = cart.items.filter(
          (x) => x.price == 0 && x.price_original > 0 && x.promotionref != null
        );
        if (xHasyPrice.length > 0) {
          xHasyPrice = xHasyPrice.map((x, i) => {
            return x.promotionby;
          });
        }
        processCart(cart, xHasyPrice);
      });
    } else {
      var xHasyPrice = data.items.filter(
        (x) => x.price == 0 && x.price_original > 0 && x.promotionref != null
      );
      if (xHasyPrice.length > 0) {
        xHasyPrice = xHasyPrice.map((x, i) => {
          return x.promotionby;
        });
      }
      processCart(data, xHasyPrice);
    }
    if (check != undefined && check == true && jQuery(window).width() > 992) {
      if (!$(".header-action_cart").hasClass("js-action-show")) {
        $("body").removeClass("locked-scroll");
        $(".header-action").removeClass("js-action-show");
      }
      if ($("#site-header").hasClass("hSticky")) {
        $("#site-header").addClass("hSticky-nav");
        setTimeout(function () {
          $("#site-header").addClass("hSticky-up");
        }, 300);
        setTimeout(function () {
          $(".header-action_cart").addClass("js-action-show");
          $("body").addClass("locked-scroll");
        }, 500);
      } else {
        $(".header-action_cart").addClass("js-action-show");
        $("body").addClass("locked-scroll");
        jQuery("html, body").animate(
          {
            scrollTop: 0,
          },
          600
        );
      }
    }
  },
  clone_item: function (product, i, xHasyPrice) {
    if ($(window).width() < 992) {
      var item_product = jQuery(
        ".siteCart-mobile .sitenav-cart .table-clone-cart"
      )
        .find(".mini-cart__item")
        .clone();
    } else {
      var item_product = jQuery(
        ".header-action_cart .sitenav-cart .table-clone-cart"
      )
        .find(".mini-cart__item")
        .clone();
    }

    if (xHasyPrice.length > 0) {
      xHasyPrice.map((x, i) => {
        if (
          x[0].variant_ids.length > 0 &&
          x[0].variant_ids.includes(product.variant_id)
        ) {
          item_product.addClass("xSpecial");
        } else if (x[0].product_id == product.product_id) {
          item_product.addClass("xSpecial");
        }
      });
    }

    item_product
      .attr("data-vid", product.variant_id)
      .attr("data-pid", product.product_id);
    //var item_product = jQuery('#clone-item-cart').find('.mini-cart__item');
    if (product.image == null) {
      item_product
        .find("img")
        .attr(
          "src",
          "//theme.hstatic.net/1000288298/1001020793/14/no_image.jpg?v=280"
        )
        .attr("alt", product.url);
    } else {
      item_product
        .find("img")
        .attr("src", Haravan.resizeImage(product.image, "small"))
        .attr("alt", product.url);
    }

    if (product.promotionby.length > 0) {
      item_product
        .find(".mini-cart__left .mnc-link")
        .append(
          '<span class="mnc-gift"><img src="' +
            img_gift +
            '" alt="icon quà tặng"></span>'
        );
    }

    item_product
      .find(".mnc-link")
      .attr("href", product.url)
      .attr("title", product.url);
    item_product.find(".mini-cart__title .mnc-title").html(product.title);
    item_product
      .find(".mini-cart__quantity .qty-value")
      .val(product.quantity)
      .attr("data-vid", product.variant_id);
    item_product
      .find(".mini-cart__price .mnc-price")
      .html(Haravan.formatMoney(product.price, formatMoney));
    if (product.price < product.price_original) {
      item_product
        .find(".mini-cart__price .mnc-ori-price")
        .html(Haravan.formatMoney(product.price_original, formatMoney));
    }
    item_product
      .find(".mini-cart__remove")
      .html(
        '<a href="javascript:void(0);" onclick="HRT.All.deleteCart(' +
          (i + 1) +
          "," +
          product.variant_id +
          ')" ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"> <g><path d="M500,442.7L79.3,22.6C63.4,6.7,37.7,6.7,21.9,22.5C6.1,38.3,6.1,64,22,79.9L442.6,500L22,920.1C6,936,6.1,961.6,21.9,977.5c15.8,15.8,41.6,15.8,57.4-0.1L500,557.3l420.7,420.1c16,15.9,41.6,15.9,57.4,0.1c15.8-15.8,15.8-41.5-0.1-57.4L557.4,500L978,79.9c16-15.9,15.9-41.5,0.1-57.4c-15.8-15.8-41.6-15.8-57.4,0.1L500,442.7L500,442.7z"/></g> </svg></a>'
      );
    var title = "";
    if (
      product.variant_options != null &&
      product.variant_options.indexOf("Default Title") == -1
    ) {
      $.each(product.variant_options, function (i, v) {
        title = title + v + " / ";
      });
      title = title + "@@";
      title = title.replace(" / @@", "");
      item_product.find(".mnc-variant").html(title);
    } else {
      item_product.find(".mnc-variant").html("");
    }
    //item_product.clone().removeClass('d-none').prependTo('.table-cart-view');
    if ($(window).width() < 992) {
      $(".siteCart-mobile .table-cart-view").append(
        item_product.removeClass("d-none")
      );
    } else {
      $(".header-action_cart .table-cart-view").append(
        item_product.removeClass("d-none")
      );
    }
    if (
      (product.price == 0 || product.promotionby.length > 0) &&
      promotionApp
    ) {
      item_product.find("button.qty-btn").hide();
      item_product.find(".qty-value").addClass("qty-value-app");
      item_product.find(".mini-cart__remove").hide();
    }
  },
  deleteCart: function (line, variant_id) {
    var params = {
      type: "POST",
      url: "/cart/change.js",
      data: "quantity=0&line=" + line,
      dataType: "json",
      success: function (cart) {
        HRT.All.getCartModal(false);
        $(
          '.proloop-actions[data-vrid="' + variant_id + '"] .proloop-value'
        ).val(0);
        $(
          '.proloop-actions[data-vrid="' + variant_id + '"] .action-boxqty'
        ).addClass("d-none");
        $('.proloop-actions[data-vrid="' + variant_id + '"]').removeClass(
          "action-count"
        );
        setTimeout(function () {
          $(
            '.proloop-actions[data-vrid="' + variant_id + '"] .action-boxqty'
          ).removeClass("d-none");
        }, 500);
      },
      error: function (XMLHttpRequest, textStatus) {
        Haravan.onError(XMLHttpRequest, textStatus);
      },
    };
    jQuery.ajax(params);
  },
  updateCart: function () {
    jQuery(document).on("click", "#update-cart-modal", function (event) {
      event.preventDefault();
      if (jQuery("#cartform").serialize().length <= 5) return;
      jQuery(this).html("Đang cập nhật");
      var params = {
        type: "POST",
        url: "/cart/update.js",
        data: jQuery("#cartform").serialize(),
        dataType: "json",
        success: function (cart) {
          if (typeof callback === "function") {
            callback(cart);
          } else {
            HRT.All.getCartModal();
          }
          jQuery("#update-cart-modal").html("Cập nhật");
        },
        error: function (XMLHttpRequest, textStatus) {
          Haravan.onError(XMLHttpRequest, textStatus);
        },
      };
      jQuery.ajax(params);
    });
  },
  addItemShowModalCart: function (id) {
    if (check_show_modal) {
      check_show_modal = false;
      timeOut_modalCart = setTimeout(function () {
        check_show_modal = true;
      }, 1000);
      if ($(".addtocart-modal").hasClass("clicked_buy")) {
        var quantity = $("#quantity").val();
      } else {
        var quantity = 1;
      }
      var params = {
        type: "POST",
        url: "/cart/add.js",
        async: false,
        data: "quantity=" + quantity + "&id=" + id,
        dataType: "json",
        success: function (line_item) {
          HRT.All.getCartModal();
          $(".addtocart-modal").removeClass("clicked_buy");
          var image = "";
          if (line_item["image"] == null) {
            image = "https://hstatic.net/0/0/global/noDefaultImage6.gif";
          } else {
            image = Haravan.resizeImage(line_item["image"], "small");
          }
          var $info =
            '<div class="row"><div class="col-md-12 col-xs-12"><p class="jGowl-text">Đã thêm vào giỏ hàng thành công!</p></div><div class="col-md-4 col-xs-4"><a href="' +
            line_item["url"] +
            '"><img width="70px" src="' +
            image +
            '" alt="' +
            line_item["title"] +
            '"/></a></div><div class="col-md-8 col-xs-8"><div class="jGrowl-note"><a class="jGrowl-title" href="' +
            line_item["url"] +
            '">' +
            line_item["title"] +
            "</a><ins>" +
            Haravan.formatMoney(line_item["price"], formatMoney) +
            "</ins></div></div></div>";
          HRT.All.notifyProduct($info);
        },
        error: function (XMLHttpRequest, textStatus) {
          alert("Sản phẩm bạn vừa mua đã vượt quá tồn kho");
        },
      };
      jQuery.ajax(params);
    }
  },
  plusQuantity: function () {
    if (jQuery('input[name="quantity"]').val() != undefined) {
      var currentVal = parseInt(jQuery('input[name="quantity"]').val());
      if (!isNaN(currentVal)) {
        jQuery('input[name="quantity"]').val(currentVal + 1);
      } else {
        jQuery('input[name="quantity"]').val(1);
      }
    } else {
      console.log(
        "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
      );
    }
  },
  minusQuantity: function () {
    if (jQuery('input[name="quantity"]').val() != undefined) {
      var currentVal = parseInt(jQuery('input[name="quantity"]').val());
      if (!isNaN(currentVal) && currentVal > 1) {
        jQuery('input[name="quantity"]').val(currentVal - 1);
      }
    } else {
      console.log(
        "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
      );
    }
  },
  buyNowProdItem: function (id) {
    var quantity = 1;
    var params = {
      type: "POST",
      url: "/cart/add.js",
      data: "quantity=" + quantity + "&id=" + id,
      dataType: "json",
      success: function (line_item) {
        if (template == "cart") {
          var x = $(".layout-cart").offset().top;
          smoothScroll(x - 100, 500);
          setTimeout(function () {
            window.location.reload();
          }, 300);
        } else {
          $.get("/cart.js").done(function (cart) {
            if (priceMin != "") {
              if (priceMin > cart.total_price / 100) {
                HRT.All.getCartModal();
              } else {
                window.location = "/checkout";
              }
            } else {
              window.location = "/checkout";
            }
          });
        }
      },
      error: function (XMLHttpRequest, textStatus) {
        Haravan.onError(XMLHttpRequest, textStatus);
      },
    };
    jQuery.ajax(params);
  },
  addCartProdItem: function (id) {
    var prolink = $(
      '.product-loop[data-id="' + id + '"] .proloop-image .proloop-link'
    ).attr("href");
    var proId = $('.product-loop[data-id="' + id + '"] .product-inner').attr(
      "data-proid"
    );
    var proTitle = $(
      '.product-loop[data-id="' + id + '"] .proloop-detail h3 a'
    ).html();

    if (promotionApp) {
      if (
        !$('.product-loop[data-id="' + id + '"]')
          .find(".gift.product_gift_label")
          .hasClass("d-none") &&
        !$('.product-inner[data-id="' + id + '"]')
          .find(".gift.product_gift_label")
          .hasClass("d-none")
      ) {
        //	window.location.href = $('.product-loop[data-id="'+id+'"]').find('a').attr('href') || $('.prodloop-block[data-id="'+id+'"]').find('a').attr('href');
        HRT.Quickview.renderQuickview(prolink, proId, proTitle);
      } else {
        var min_qty = 1;
        var variant_id = $(this).attr("data-variantid");
        var params = {
          type: "POST",
          url: "/cart/add.js",
          async: true,
          data: "quantity=" + min_qty + "&id=" + id,
          dataType: "json",
          success: function (line_item) {
            if (template.indexOf("cart") > -1) {
              window.location.reload();
            } else {
              var image = "";
              if (line_item["image"] == null) {
                image = "https://hstatic.net/0/0/global/noDefaultImage6.gif";
              } else {
                image = Haravan.resizeImage(line_item["image"], "small");
              }
              var $info =
                '<div class="row"><div class="col-md-12 col-xs-12"><p class="jGowl-text">Đã thêm vào giỏ hàng thành công!</p></div><div class="col-md-4 col-xs-4"><a href="' +
                line_item["url"] +
                '"><img width="70px" src="' +
                image +
                '" alt="' +
                line_item["title"] +
                '"/></a></div><div class="col-md-8 col-xs-8"><div class="jGrowl-note"><a class="jGrowl-title" href="' +
                line_item["url"] +
                '">' +
                line_item["title"] +
                "</a><ins>" +
                Haravan.formatMoney(line_item["price"], formatMoney) +
                "</ins></div></div></div>";
              HRT.All.notifyProduct($info);
              $('.proloop-actions[data-vrid="' + id + '"] .proloop-value').val(
                line_item.quantity
              );
              HRT.All.getCartModal(false);
            }
            $(".proloop-actions[data-vrid=" + id + "]").addClass(
              "action-count"
            );
          },
          error: function (XMLHttpRequest, textStatus) {
            Haravan.onError(XMLHttpRequest, textStatus);
          },
        };
        if (
          $('.product-loop[data-id="' + id + '"] .add-to-cart').hasClass(
            "btn-addcart-view"
          ) ||
          $(
            '.product-loop-ldpage .product-inner[data-id="' +
              id +
              '"] .add-to-cart'
          ).hasClass("btn-addcart-view")
        ) {
          HRT.Quickview.renderQuickview(prolink, proId, proTitle);
        } else {
          jQuery.ajax(params);
        }
      }
    } else {
      var min_qty = 1;
      var variant_id = $(this).attr("data-variantid");
      $(".proloop-actions[data-vrid=" + id + "] .btn-proloop-cart").addClass(
        "btnload"
      );
      var params = {
        type: "POST",
        url: "/cart/add.js",
        async: true,
        data: "quantity=" + min_qty + "&id=" + id,
        dataType: "json",
        success: function (line_item) {
          if (template.indexOf("cart") > -1) {
            window.location.reload();
          } else {
            var image = "";
            if (line_item["image"] == null) {
              image = "https://hstatic.net/0/0/global/noDefaultImage6.gif";
            } else {
              image = Haravan.resizeImage(line_item["image"], "small");
            }
            var $info =
              '<div class="row"><div class="col-md-12 col-xs-12"><p class="jGowl-text">Đã thêm vào giỏ hàng thành công!</p></div><div class="col-md-4 col-xs-4"><a href="' +
              line_item["url"] +
              '"><img width="70px" src="' +
              image +
              '" alt="' +
              line_item["title"] +
              '"/></a></div><div class="col-md-8 col-xs-8"><div class="jGrowl-note"><a class="jGrowl-title" href="' +
              line_item["url"] +
              '">' +
              line_item["title"] +
              "</a><ins>" +
              Haravan.formatMoney(line_item["price"], formatMoney) +
              "</ins></div></div></div>";
            HRT.All.notifyProduct($info);
            $('.proloop-actions[data-vrid="' + id + '"] .proloop-value').val(
              line_item.quantity
            );
            HRT.All.getCartModal(false);
          }

          setTimeout(function () {
            $(".proloop-actions[data-vrid=" + id + "]").addClass(
              "action-count"
            );
            $(
              ".proloop-actions[data-vrid=" + id + "] .btn-proloop-cart"
            ).removeClass("btnload");
          }, 400);
        },
        error: function (XMLHttpRequest, textStatus) {
          Haravan.onError(XMLHttpRequest, textStatus);
        },
      };
      if (
        $('.product-loop[data-id="' + id + '"] .add-to-cart').hasClass(
          "btn-addcart-view"
        ) ||
        $(
          '.product-loop-ldpage .product-inner[data-id="' +
            id +
            '"] .add-to-cart'
        ).hasClass("btn-addcart-view")
      ) {
        HRT.Quickview.renderQuickview(prolink, proId, proTitle);
      } else {
        jQuery.ajax(params);
      }
    }
  },
  plusQtyProdItem: function (id) {
    if (promotionApp) {
      if (
        !$('.product-loop[data-id="' + id + '"]')
          .find(".gift.product_gift_label")
          .hasClass("d-none") &&
        !$('.product-inner[data-id="' + id + '"]')
          .find(".gift.product_gift_label")
          .hasClass("d-none")
      )
        window.location.href =
          $('.product-loop[data-id="' + id + '"]')
            .find("a.proloop-link")
            .attr("href") ||
          $('.product-inner[data-id="' + id + '"]')
            .find("a.proloop-link")
            .attr("href");
      else {
        if (jQuery('input[name="proloop-quantity"]').val() != undefined) {
          var input = $(".proloop-actions[data-vrid=" + id + "]").find(
            ".actions-boxqty input"
          );
          var currentVal = parseInt(input.val());
          var newQty = 1;
          if (!isNaN(currentVal)) {
            input.val(currentVal + 1);
            newQty = currentVal + 1;
          } else {
            input.val(1);
          }
          var params = {
            type: "POST",
            url: "/cart/update.js",
            async: true,
            data: "quantity=" + newQty + "&id=" + id,
            dataType: "json",
            success: function (line_item) {
              if (template.indexOf("cart") > -1) {
                window.location.reload();
              } else {
                HRT.All.getCartModal(false);
              }
            },
            error: function (XMLHttpRequest, textStatus) {
              Haravan.onError(XMLHttpRequest, textStatus);
            },
          };
          jQuery.ajax(params);
        } else {
          console.log(
            "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
          );
        }
      }
    } else {
      if (jQuery('input[name="proloop-quantity"]').val() != undefined) {
        var input = $(".proloop-actions[data-vrid=" + id + "]").find(
          ".actions-boxqty input"
        );
        var currentVal = parseInt(input.val());
        var newQty = 1;
        if (!isNaN(currentVal)) {
          input.val(currentVal + 1);
          newQty = currentVal + 1;
        } else {
          input.val(1);
        }
        var params = {
          type: "POST",
          url: "/cart/update.js",
          async: true,
          data: "quantity=" + newQty + "&id=" + id,
          dataType: "json",
          success: function (line_item) {
            if (template.indexOf("cart") > -1) {
              window.location.reload();
            } else {
              HRT.All.getCartModal(false);
            }
          },
          error: function (XMLHttpRequest, textStatus) {
            Haravan.onError(XMLHttpRequest, textStatus);
          },
        };
        jQuery.ajax(params);
      } else {
        console.log(
          "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
        );
      }
    }
  },
  minusQtyProdItem: function (id) {
    if (promotionApp) {
      if (
        !$('.product-loop[data-id="' + id + '"]')
          .find(".gift.product_gift_label")
          .hasClass("d-none") &&
        !$('.product-inner[data-id="' + id + '"]')
          .find(".gift.product_gift_label")
          .hasClass("d-none")
      )
        window.location.href =
          $('.product-loop[data-id="' + id + '"]')
            .find("a.proloop-link")
            .attr("href") ||
          $('.product-inner[data-id="' + id + '"]')
            .find("a.proloop-link")
            .attr("href");
      else {
        if (jQuery('input[name="proloop-quantity"]').val() != undefined) {
          var input = $(".proloop-actions[data-vrid=" + id + "]").find(
            ".actions-boxqty input"
          );
          var currentVal = parseInt(input.val());
          var newQty = 1;
          if (!isNaN(currentVal) && currentVal >= 1) {
            input.val(currentVal - 1);
            newQty = currentVal - 1;
            var params = {
              type: "POST",
              url: "/cart/update.js",
              async: true,
              data: "quantity=" + newQty + "&id=" + id,
              dataType: "json",
              success: function (line_item) {
                if (template.indexOf("cart") > -1) {
                  window.location.reload();
                } else {
                  HRT.All.getCartModal(false);
                  if (newQty <= 0) {
                    $(
                      '.proloop-actions[data-vrid="' + id + '"] .action-boxqty'
                    ).addClass("d-none");
                    $('.proloop-actions[data-vrid="' + id + '"]').removeClass(
                      "action-count"
                    );
                    setTimeout(function () {
                      $(
                        '.proloop-actions[data-vrid="' +
                          id +
                          '"] .action-boxqty'
                      ).removeClass("d-none");
                    }, 500);
                  }
                }
              },
              error: function (XMLHttpRequest, textStatus) {
                Haravan.onError(XMLHttpRequest, textStatus);
              },
            };
            jQuery.ajax(params);
          }
        } else {
          console.log(
            "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
          );
        }
      }
    } else {
      if (jQuery('input[name="proloop-quantity"]').val() != undefined) {
        var input = $(".proloop-actions[data-vrid=" + id + "]").find(
          ".actions-boxqty input"
        );
        var currentVal = parseInt(input.val());
        var newQty = 1;
        if (!isNaN(currentVal) && currentVal >= 1) {
          input.val(currentVal - 1);
          newQty = currentVal - 1;
          var params = {
            type: "POST",
            url: "/cart/update.js",
            async: true,
            data: "quantity=" + newQty + "&id=" + id,
            dataType: "json",
            success: function (line_item) {
              if (template.indexOf("cart") > -1) {
                window.location.reload();
              } else {
                HRT.All.getCartModal(false);
                if (newQty <= 0) {
                  $(
                    '.proloop-actions[data-vrid="' + id + '"] .action-boxqty'
                  ).addClass("d-none");
                  $('.proloop-actions[data-vrid="' + id + '"]').removeClass(
                    "action-count"
                  );
                  setTimeout(function () {
                    $(
                      '.proloop-actions[data-vrid="' + id + '"] .action-boxqty'
                    ).removeClass("d-none");
                  }, 500);
                }
              }
            },
            error: function (XMLHttpRequest, textStatus) {
              Haravan.onError(XMLHttpRequest, textStatus);
            },
          };
          jQuery.ajax(params);
        }
      } else {
        console.log(
          "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
        );
      }
    }
  },
  boxAccount: function (type) {
    $(
      ".sitenav-account .site_account_panel_list .site_account_panel "
    ).removeClass("is-selected");
    var newheight = $(
      ".sitenav-account .site_account_panel_list .site_account_panel#" + type
    )
      .addClass("is-selected")
      .height();
    if ($(".site_account_panel").hasClass("is-selected")) {
      $(".site_account_panel_list").css("height", newheight);
    }
  },
  smoothScroll: function (a, b) {
    $("body,html").animate(
      {
        scrollTop: a,
      },
      b
    );
  },
  checkemail: function (email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  FilterInput: function (event) {
    var keyCode = "which" in event ? event.which : event.keyCode;
    isNotWanted = keyCode == 69 || keyCode == 190 || keyCode == 189;
    return !isNotWanted;
  },
};

HRT.Main = {
  init: function () {
    var that = this;
    that.topbarSlideText();
    that.topbarHidden();
    that.scrollFixedHeader();
    that.searchAutoHeader();
    that.toggleFooter();
    //that.fixHeightProductResize();
    that.addThisIconShare();
    that.menuSidebar();
    that.mainMenuMobile();
    that.clickIconsHeader();
    that.inventoryLocation();
    that.boxAcountHeader();
    that.formAccountHeader();
    that.updateMiniCart();
    that.newsletterForm();
    that.copyCodeProdCoupon();
    that.prodPopoverCoupon();
    that.modalLive();
    that.hiddenBtnLive();
    that.iconMenuParent();
    that.setHeightMenu();
  },
  topbarSlideText: function () {
    if ($(".topbar-slideText").length > 0) {
      var checkItem = $(".topbar-slideText .discount").length;
      $(".topbar-slideText").owlCarousel({
        items: 1,
        dots: false,
        nav: checkItem > 1 ? true : false,
        loop: checkItem > 1 ? true : false,
        autoplay: true,
        autoplayTimeout: 5000,
        slideSpeed: 4000,
        animateIn: "flipInX",
      });
      $(".topbar-slideText").find(".owl-next").html("");
      $(".topbar-slideText").find(".owl-prev").html("");
    }
  },
  topbarHidden: function () {
    $(".topbar-banner svg").click(function () {
      var hTopbar = $(".topbar-banner").outerHeight();
      var hHeader = $(".mainHeader--height").outerHeight();
      $(".topbar-banner").hide();
      $(".mainHeader--height").css("min-height", hHeader - hTopbar);
    });
  },
  scrollFixedHeader: function () {
    var $parentHeader = $(".mainHeader--height");
    var parentHeight = $parentHeader.find(".mainHeader").outerHeight();
    var $header = $(".mainHeader");
    var sliderHeight = $(".block-slider").outerHeight();
    if (sliderHeight == 0 || sliderHeight == undefined) sliderHeight = 150;
    //console.log(sliderHeight)
    var offset_sticky_header = $header.outerHeight() + sliderHeight;
    var offset_sticky_down = 0;
    $parentHeader.css("min-height", parentHeight);
    var resizeTimer = false,
      resizeWindow = $(window).prop("innerWidth");
    $(window).on("resize", function () {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function () {
        var newWidth = $(window).prop("innerWidth");
        if (resizeWindow != newWidth) {
          $header
            .removeClass("hSticky-up")
            .removeClass("hSticky-nav")
            .removeClass("hSticky");
          $parentHeader.css("min-height", "");
          resizeTimer = setTimeout(function () {
            parentHeight = $parentHeader.find(".mainHeader").outerHeight();
            $parentHeader.css("min-height", parentHeight);
          }, 50);
          resizeWindow = newWidth;
        }
      }, 200);
    });
    setTimeout(function () {
      $parentHeader.css("min-height", "");
      parentHeight = $parentHeader.find(".mainHeader").outerHeight();
      $parentHeader.css("min-height", parentHeight);
      jQuery(window).scroll(function () {
        /* scroll header */
        if (
          jQuery(window).scrollTop() > offset_sticky_header &&
          jQuery(window).scrollTop() > offset_sticky_down
        ) {
          if (jQuery(window).width() > 991) {
            $("body").removeClass("locked-scroll");
            $(".header-action-item").removeClass("js-action-show");
          }

          $header.addClass("hSticky");
          $(".sidebar-menu").removeClass("active-menu");
          if (jQuery(window).scrollTop() > offset_sticky_header + 150) {
            $header.removeClass("hSticky-up").addClass("hSticky-nav");
            $("body").removeClass("scroll-body-up");
            if (jQuery(window).width() > 991) {
              if (
                $(".header-action-item.header-action_locale").hasClass(
                  "js-action-show"
                )
              ) {
                $("body").removeClass("locked-scroll");
                $(".header-action-item").removeClass("js-action-show");
              }
            }
          }
        } else {
          if (
            jQuery(window).scrollTop() > offset_sticky_header &&
            jQuery(window).scrollTop() + 450 + jQuery(window).height() <
              $(document).height()
          ) {
            $header.addClass("hSticky-up");
            $("body").addClass("scroll-body-up");
          }
        }
        if (
          jQuery(window).scrollTop() <= offset_sticky_down &&
          jQuery(window).scrollTop() <= offset_sticky_header
        ) {
          $header.removeClass("hSticky-up").removeClass("hSticky-nav");
          $("body").removeClass("scroll-body-up");
          if (jQuery(window).width() > 991) {
            $(".sidebar-menu").removeClass("show-menu");
          }
          if (jQuery(window).scrollTop() <= offset_sticky_header - 100) {
            $header.removeClass("hSticky");
          }
        }
        offset_sticky_down = jQuery(window).scrollTop();
      });
    }, 300);
  },
  searchAutoHeader: function () {
    $(".ultimate-search").submit(function (e) {
      e.preventDefault();
      var q = $(this).find("input[name=q]").val();
      if (q.indexOf("script") > -1 || q.indexOf(">") > -1) {
        alert(
          "Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại từ khóa khác"
        );
        $(this).find("input[name=q]").val("");
      } else {
        var q_follow = "product";
        var query = encodeURIComponent(q);
        if (!q) {
          window.location = "/search?type=" + q_follow + "&q=";
          return;
        } else {
          window.location = "/search?type=" + q_follow + "&q=" + query;
          return;
        }
      }
    });
    var $input = $('.ultimate-search input[type="text"]');
    $input.bind(
      "keyup change paste propertychange",
      delayTime(function () {
        var key = $(this).val(),
          $parent = $(this).parents(".wpo-wrapper-search"),
          $results = $(this)
            .parents(".wpo-wrapper-search")
            .find(".smart-search-wrapper");
        if (key.indexOf("script") > -1 || key.indexOf(">") > -1) {
          alert(
            "Từ khóa của bạn có chứa mã độc hại! Vui lòng nhập lại từ khóa khác"
          );
          $(this).val("");
          $('.ultimate-search input[type="text"]').val("");
        } else {
          if (key.length > 0) {
            $(this).attr("data-history", key);
            $('.ultimate-search input[type="text"]').val($(this).val());
            var q_follow = "product",
              str = "";
            str = "/search?type=product&q=" + key + "&view=ultimate-product";
            $.ajax({
              url: str,
              type: "GET",
              async: true,
              success: function (data) {
                $results
                  .find(".resultsContent")
                  .html(data)
                  .addClass("resultsdata");
              },
            });
            if (!$(".header-action_search").hasClass("js-action-show")) {
              $("body").removeClass("locked-scroll");
              $(".header-action-item").removeClass("js-action-show");
            }
            $(".ultimate-search").addClass("expanded");
            $results.fadeIn();
          } else {
            $('.ultimate-search input[type="text"]').val($(this).val());
            $(".ultimate-search").removeClass("expanded");
            if ($(".search-suggest").length > 0) {
              $results.fadeIn();
              $results
                .find(".resultsContent")
                .html("")
                .removeClass("resultsdata");
            } else {
              $results.find(".resultsContent").html("");
              $results.fadeOut();
            }
          }
        }
      }, 500)
    );
    $("body").click(function (evt) {
      var target = evt.target;
      if (
        target.id !== "ajaxSearchResults" &&
        target.id !== "inputSearchAuto"
      ) {
        $("#ajaxSearchResults").hide();
      }
      if (
        target.id !== "ajaxSearchResults-mb" &&
        target.id !== "inputSearchAuto-mb"
      ) {
        $("#ajaxSearchResults-mb").hide();
      }
      if (
        target.id !== "ajaxSearchResults-3" &&
        target.id !== "inputSearchAuto-3"
      ) {
        $("#ajaxSearchResults-3").hide();
        $(".ajaxSearchResults")
          .find(".search-suggest")
          .removeClass("show-suggest");
      }
    });
    $("body").on("click", '.ultimate-search input[type="text"]', function () {
      if ($(".search-suggest").length > 0) {
        $(".ajaxSearchResults").show();
        $(".ajaxSearchResults")
          .find(".search-suggest")
          .addClass("show-suggest");
      } else {
        if ($(this).is(":focus")) {
          if ($(this).val() != "") {
            $(".ajaxSearchResults").show();
          }
        }
      }
    });
    $("body").on("click", ".ultimate-search .search-close", function (e) {
      e.preventDefault();
      $(".ajaxSearchResults").hide();
      $(".ultimate-search").removeClass("expanded");
      $(".ultimate-search").find("input[name=q]").val("");
    });
  },
  toggleFooter: function () {
    $(".footer-expand-title").on("click", function () {
      jQuery(this)
        .toggleClass("active")
        .parent()
        .find(".footer-expand-collapsed")
        .stop()
        .slideToggle("medium");
    });
    $(".title-footer").on("click", function () {
      if ($(window).width() < 991) {
        jQuery(this)
          .toggleClass("opened")
          .parent()
          .find(".block-collapse")
          .stop()
          .slideToggle("medium");
      }
    });
  },
  fixHeightProductResize: function () {
    var wdWidth = $(window).outerWidth();
    document.addEventListener("lazyloaded", function (e) {
      HRT.All.fixHeightProduct(
        ".listProduct-resize",
        ".product-resize",
        ".image-resize"
      );
      jQuery(window).resize(function () {
        var wdOldWidth = $(window).prop("innerWidth");
        if (wdOldWidth != wdWidth) {
          HRT.All.fixHeightProduct(
            ".listProduct-resize",
            ".product-resize",
            ".image-resize"
          );
          wdOldWidth = wdWidth;
        }
      });
    });
  },
  addThisIconShare: function () {
    /* addthis-sharing */
    if ($(".addThis_listSharing").length > 0) {
      $(
        ".addThis_iconContact .item-contact,.addThis_listSharing .addThis_close"
      ).on("click", function (e) {
        if ($(".addThis_listSharing").hasClass("active")) {
          $(".addThis_listSharing").removeClass("active");
          $(".addThis_listSharing").fadeOut(150);
        } else {
          $(".addThis_listSharing").fadeIn(100);
          $(".addThis_listSharing").addClass("active");
        }
      });
      $(".listSharing_overlay").on("click", function (e) {
        $(".addThis_listSharing").removeClass("active");
        $(".addThis_listSharing").fadeOut(150);
      });
      $(".body-popupform form.contact-form").submit(function (e) {
        var self = $(this);
        if ($(this)[0].checkValidity() == true) {
          e.preventDefault();
          grecaptcha.ready(function () {
            grecaptcha
              .execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", {
                action: "submit",
              })
              .then(function (token) {
                self.find('input[name="g-recaptcha-response"]').val(token);
                $.ajax({
                  type: "POST",
                  url: "/contact",
                  data: $(".body-popupform form.contact-form").serialize(),
                  success: function (data) {
                    $(".modal-contactform.fade.show").modal("hide");
                    setTimeout(function () {
                      $(".modal-succesform").modal("show");
                      setTimeout(function () {
                        $(".modal-succesform.fade.show").modal("hide");
                      }, 5000);
                    }, 300);
                  },
                });
              });
          });
        }
      });
      $(".modal-succesform").on("hidden.bs.modal", function () {
        location.reload();
      });
    }
    if ($(".layoutProduct_scroll").length > 0) {
      if (jQuery(window).width() < 768) {
        var curScrollTop = 0;
        $(window).scroll(function () {
          var scrollTop = $(window).scrollTop();
          if (scrollTop > curScrollTop && scrollTop > 200) {
            $(".layoutProduct_scroll")
              .removeClass("scroll-down")
              .addClass("scroll-up");
          } else {
            if (
              scrollTop > 200 &&
              scrollTop + $(window).height() + 150 < $(document).height()
            ) {
              $(".layoutProduct_scroll")
                .removeClass("scroll-up")
                .addClass("scroll-down");
            }
          }
          if (scrollTop < curScrollTop && scrollTop < 200) {
            $(".layoutProduct_scroll")
              .removeClass("scroll-up")
              .removeClass("scroll-down");
          }
          curScrollTop = scrollTop;
        });
      }
    }
  },
  menuSidebar: function () {
    $(".plus-nClick1").click(function (e) {
      e.preventDefault();
      $(this).parents(".level0").toggleClass("opened");
      $(this).parents(".level0").children("ul").slideToggle(200);
    });
    $(".plus-nClick2").click(function (e) {
      e.preventDefault();
      $(this).parents(".level1").toggleClass("opened");
      $(this).parents(".level1").children("ul").slideToggle(200);
    });
    jQuery(".sidebox-title .htitle").click(function () {
      $(this)
        .parents(".group-sidebox")
        .toggleClass("is-open")
        .find(".sidebox-content-togged")
        .slideToggle("medium");
    });
  },
  mainMenuMobile: function () {
    $(".list-root li.submenu a").click(function (e) {
      //if ($(this).find('i').length){
      if (jQuery(window).width() < 992) {
        e.preventDefault();
        var menu_child_id = $(this).parent().data("menu-root");
        $(".list-root").addClass("mm-subopened");
        $("#" + menu_child_id).addClass("mm-opened");
      }
      //}
    });
    $(".list-child li:first-child a").click(function () {
      $(this).parents(".list-child").removeClass("mm-opened");
      $(".list-root").removeClass("mm-subopened");
    });
    $(".list-child li.level-2 a").click(function (e) {
      //console.log(1)
      //if ($(this).find('i').length){
      if (jQuery(window).width() < 992) {
        e.preventDefault();
        var menu_sub_id = $(this).parent().data("menu-root");
        $("li.level-2").addClass("mm-subopened");
        $("#" + menu_sub_id).addClass("mm-sub");
      }
      //}
    });
    $(".sub-child li:first-child a").click(function () {
      $(this).parents(".sub-child").removeClass("mm-sub");
      $(".list-child").removeClass("mm-subopened");
    });
    $(document).on("click", ".sub-child li.level-3 a", function (e) {
      if ($(this).find("i").length) {
        e.preventDefault();
        var menu_subnav_id = $(this).parent().data("menu-root");
        $("li.level-3").addClass("mm-open-3");
        $("#" + menu_subnav_id).addClass("mm-sub-3");
      }
    });
    $(document).on("click", ".sub-child-3 li:first-child a", function (e) {
      $(this).parents(".sub-child-3").removeClass("mm-sub-3");
      $(".sub-child").removeClass("mm-open-3");
    });
  },
  clickIconsHeader: function () {
    $(".header-action_clicked").click(function (e) {
      e.preventDefault();
      if ($(this).parents(".header-action-item").hasClass("js-action-show")) {
        $("body").removeClass("locked-scroll");
        $(this).parents(".header-action-item").removeClass("js-action-show");
        if ($(window).width() < 992) {
          if (
            $(this)
              .parents(".header-action-item")
              .hasClass("header-action_cart")
          ) {
            $(".siteCart-mobile__overlay").removeClass("show-cart");
            $("body").removeClass("locked-scroll").removeClass("body-showcart");
          }
        }
      } else {
        $("body").removeClass("locked-scroll-menu");
        $(".header-action-item").removeClass("js-action-show");
        $(".sidebar-menu").removeClass("show-menu").removeClass("active-menu");
        $(".header-bottom").removeClass("show");
        $("body").addClass("locked-scroll");
        $(this).parents(".header-action-item").addClass("js-action-show");
        if ($(window).width() < 992) {
          if (
            $(this)
              .parents(".header-action-item")
              .hasClass("header-action_cart")
          ) {
            $(".siteCart-mobile").addClass("show-cart");
            $("body").removeClass("locked-scroll").addClass("body-showcart");
          }
        }
      }
    });
    $(".siteCart-mobile__header").click(function () {
      if ($(this).parents(".siteCart-mobile").hasClass("show-cart")) {
        $(this).parents(".siteCart-mobile").removeClass("show-cart");
        $("body").removeClass("locked-scroll").removeClass("body-showcart");
        $(".header-action-item.header-action_cart").removeClass(
          "js-action-show"
        );
      } else {
        $("body").addClass("body-showcart");
        $(this).parents(".siteCart-mobile").addClass("show-cart");
      }
    });
    $(".siteCart-mobile__overlay").on("click", function (e) {
      $(this).parents(".siteCart-mobile").removeClass("show-cart");
      $("body").removeClass("locked-scroll").removeClass("body-showcart");
      $(".header-action-item.header-action_cart").removeClass("js-action-show");
    });
    $("body").on("click", "#sitenav-overlay", function (e) {
      $("body").removeClass("locked-scroll");
      $(".header-action-item").removeClass("js-action-show");
      $(".sidebar-menu").removeClass("show-menu").removeClass("active-menu");
      $(".header-bottom").removeClass("show");
    });
    $("body").on(
      "click",
      "#sitenav-overlay,.sitenav-content .btnclose",
      function (e) {
        $("body")
          .removeClass("locked-scroll")
          .removeClass("locked-scroll-menu");
        $(".header-action-item").removeClass("js-action-show");
      }
    );
  },
  inventoryLocation: function () {
    if (
      $(".header-action_locale").length > 0 ||
      $(".header-market").length > 0
    ) {
      if (
        localStorage.my_location != null &&
        localStorage.my_location != undefined
      ) {
        $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).text(localStorage.my_location);
        $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).attr("data-id", localStorage.location_id);
        $(".locationContainer .header-action__link .shiptoHere").html(
          '<span class="txt-overflow">' + localStorage.my_location + "</span>"
        );

        if (cartGet != null && cartGet.location_id == null) {
          $.post("/location.js?locationId=" + localStorage.location_id).done(
            function (data) {
              if (data.error == false) {
                window.location.reload();
              }
            }
          );
        }
      } else {
        var txtAddress = $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).text();
        var idAddress = $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).data("id");
        var provinceAddress = $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).data("province");

        $(".locationContainer .header-action__link .shiptoHere").html(
          '<span class="txt-overflow">' + txtAddress + "</span>"
        );
        $(".header-market .store-name span").html(
          '<span class="txt-overflow">' + txtAddress + "</span>"
        );

        if (locationHeader) {
          $("body").addClass("location-noscroll");
          $(".header-action_locale .header-action_text").addClass("overlays");
          setTimeout(function () {
            $("#site-locale-handle").trigger("click");
          }, 600);
        } else {
          localStorage.my_location = txtAddress;
          localStorage.location_id = idAddress;
          localStorage.location_province = provinceAddress;
          $.post("/location.js?locationId=" + localStorage.location_id).done(
            function (data) {
              if (data.error == false) {
                window.location.reload();
              }
            }
          );
        }
      }
    }
    $(document).on(
      "click",
      ".listprov li,.location-stores .listshop li",
      function () {
        var mylocation = $(this).text(),
          mylocation_id = $(this).data("id"),
          mylocation_province = $(this).data("province");
        localStorage.my_location = mylocation;
        localStorage.location_id = mylocation_id;
        localStorage.location_province = mylocation_province;
        $(".header-action_locale .header-action_text").removeClass("overlays");
        $("body").removeClass("location-noscroll");
        $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).text(mylocation);
        $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).attr("data-id", mylocation_id);
        $(
          ".locationContainer .header-action_dropdown .chooseLocation span"
        ).attr("data-province", mylocation_province);
        $(".locationContainer .header-action__link .shiptoHere")
          .removeClass("hidden")
          .html('<span class="txt-overflow">' + mylocation + "</span>");
        $("#site-locale-handle").trigger("click");
        $.post("/location.js?locationId=" + localStorage.location_id).done(
          function (data) {
            if (data.error == false) {
              window.location.reload();
            }
          }
        );
      }
    );
    if ($(".sitenav-locate .boxfilter").length > 0) {
      var option_province = '<option value="null">- Chọn Tỉnh/Thành -</option>';
      var option_district = '<option value="null">- Chọn Quận/Huyện -</option>';
      $.each(newStore, function (i, v) {
        option_province += '<option value="' + i + '">' + i + "</option>";
      });
      $(".filter-province").html(option_province);
      $(".filter-district").html(option_district);
      $(".filter-province").change(function () {
        var province = $(this).val();
        var option_province_new =
          '<option value="null">- Chọn Quận/Huyện -</option>';
        if (province != "null" && province != "") {
          $('.listprov li[data-province!="' + province + '"]').hide();
          $('.listprov li[data-province="' + province + '"]').show();
          //localStorage.setItem('location_province',province);
          if (newStore[province]) {
            $.each(newStore[province], function (i, v) {
              option_province_new +=
                '<option value="' + i + '">' + i + "</option>";
            });
            $(".filter-district").html(option_province_new);
          }
        } else {
          $(".listprov li").show();
        }
      });
      $(".filter-district").change(function () {
        var district = $(this).val();
        var province = $(".filter-province").val();
        if (district != "null" && district != "") {
          //localStorage.setItem('location_district',province);
          $('.listprov li[data-district!="' + district + '"]').hide();
          $('.listprov li[data-district="' + district + '"]').show();
        } else {
          if (province != "null" && province != "") {
            $('.listprov li[data-province!="' + province + '"]').hide();
            $('.listprov li[data-province="' + province + '"]').show();
          } else {
            $(".listprov li").show();
          }
        }
      });
      if (
        localStorage.location_province != null &&
        localStorage.location_province != undefined
      ) {
        $(".filter-province").val(localStorage.location_province).change();
      }
    }
  },
  boxAcountHeader: function () {
    $("body").on("click", ".js-link", function (e) {
      e.preventDefault();
      HRT.All.boxAccount($(this).attr("aria-controls"));
    });
    $(".sitenav-account input").blur(function () {
      var tmpval = $(this).val();
      if (tmpval == "") {
        $(this).removeClass("is-filled");
      } else {
        $(this).addClass("is-filled");
      }
    });
  },
  formAccountHeader: function () {
    /* submit recapcha form */
    if ($("#header-login-panel").length > 0) {
      $("#header-login-panel form#customer_login").submit(function (e) {
        var self = $(this);
        if ($(this)[0].checkValidity() == true) {
          e.preventDefault();
          grecaptcha.ready(function () {
            grecaptcha
              .execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", {
                action: "submit",
              })
              .then(function (token) {
                self.find('input[name="g-recaptcha-response"]').val(token);
                self.unbind("submit").submit();
              });
          });
        }
      });
    }
    if ($("#header-recover-panel").length > 0) {
      $("#header-recover-panel form").submit(function (e) {
        var self = $(this);
        if ($(this)[0].checkValidity() == true) {
          e.preventDefault();
          grecaptcha.ready(function () {
            grecaptcha
              .execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", {
                action: "submit",
              })
              .then(function (token) {
                self.find('input[name="g-recaptcha-response"]').val(token);
                self.unbind("submit").submit();
              });
          });
        }
      });
    }
  },
  updateMiniCart: function () {
    $(document).on("click", ".mini-cart__quantity .mnc-plus", function (e) {
      e.preventDefault();
      var line = $(this).parents(".mini-cart__item").index() + 1;
      var currentQty = parseInt(
        $(this).parents(".mini-cart__item").find("input").val()
      );
      var newQty = currentQty + 1;
      $(this).parents(".mini-cart__item").find("input").val(newQty);
    });

    $(document).on("click", ".mini-cart__quantity .mnc-minus", function (e) {
      e.preventDefault();
      var line = $(this).parents(".mini-cart__item").index() + 1;
      var currentQty = parseInt(
        $(this).parents(".mini-cart__item").find("input").val()
      );
      if (currentQty > 1) {
        var newQty = currentQty - 1;
        $(this).parents(".mini-cart__item").find("input").val(newQty);
      }
    });

    $(document).on(
      "click",
      ".mini-cart__quantity .mnc-plus",
      delayTime(function () {
        //debugger
        var line = $(this).parents(".mini-cart__item").index() + 1;
        var vId = $(this)
          .parents(".mini-cart__item")
          .find("input")
          .attr("data-vid");
        var pId = $(this).parents(".mini-cart__item").attr("data-pid");
        var currentQty = parseInt(
          $(this).parents(".mini-cart__item").find("input").val()
        );
        var updates = [];
        var qtyGift = 0;
        var updateNormal = true;
        if (promotionApp) {
          if (promotionApp_name == "app_buyxgety") {
            updateNormal = false;
            var old_promotion_variant_id = buyXgetY.getPromotionStorage(vId);
            if (old_promotion_variant_id !== undefined) {
              var gOSP = 0, //Gift other but same main product
                gOPR = 0, //Gift priority but same main product
                gCurrent = null;

              var giftExistInCart = true,
                qtyGiftNotInCart = 0;
              if (old_promotion_variant_id != undefined) {
                $.each(old_promotion_variant_id, function (vIdGift, infoGift) {
                  var filterGiftInCart = cartGet.items.filter(
                    (x) =>
                      x.variant_id == vIdGift &&
                      x.promotionby.length > 0 &&
                      x.promotionby[0].product_id == pId
                  );
                  if (
                    infoGift.priority == false &&
                    filterGiftInCart.length > 0
                  ) {
                    gOSP += filterGiftInCart[0].quantity;
                  }

                  if (infoGift.priority == true) {
                    if (filterGiftInCart.length > 0) {
                      gOPR += filterGiftInCart[0].quantity;
                    } else {
                      giftExistInCart = false;
                    }
                    gCurrent = infoGift;
                    gCurrent.vId = vIdGift;
                  }
                });

                if (giftExistInCart == false) {
                  qtyGift =
                    ((currentQty - gOSP) / gCurrent.count_buy) *
                    gCurrent.count_gift;
                }
              }

              cartGet.items.map((item, index) => {
                if (item.variant_id == vId) {
                  updates[index] = currentQty;
                } else {
                  if (
                    item.promotionby.length > 0 &&
                    item.promotionby[0].product_id == pId
                  ) {
                    if (gCurrent != null) {
                      if (
                        gCurrent.priority == true &&
                        gCurrent.vId == item.variant_id
                      ) {
                        var haohut = currentQty - (gOSP + gOPR);
                        qtyGift =
                          ((item.quantity + haohut) / gCurrent.count_buy) *
                          gCurrent.count_gift;
                        updates[index] = qtyGift;
                      } else {
                        updates[index] = item.quantity;
                      }
                    }
                  } else {
                    updates[index] = item.quantity;
                  }
                }
              });

              var params = {
                type: "POST",
                url: "/cart/update.js",
                data: {
                  "updates[]": updates,
                },
                async: false,
                dataType: "json",
                success: function (data) {
                  cartItem = {};
                  cartGet = data;
                  for (i = 0; i < data.items.length; i++) {
                    var id = data.items[i].variant_id;
                    cartItem[data.items[i].variant_id] = data.items[i].quantity;
                    $('.mini-cart__item input[data-vid="' + id + '"]').val(
                      data.items[i].quantity
                    );
                    $('.proloop-actions[data-vrid="' + id + '"]')
                      .find(".proloop-boxqty input")
                      .val(data.items[i].quantity);
                    $(
                      '.proloop-actions[data-vrid="' + id + '"] .proloop-value'
                    ).val(data.items[i].quantity);
                  }

                  if (giftExistInCart) {
                    HRT.All.getCartModal(false);
                  } else {
                    if (gCurrent.vId == "not_gift") {
                      HRT.All.getCartModal(false);
                    } else {
                      $.post(
                        "/cart/add.js",
                        "id=" + gCurrent.vId + "&quantity=" + qtyGift
                      ).done(function () {
                        HRT.All.getCartModal(false);

                        /*
									var total_price = Haravan.formatMoney(data.total_price,formatMoney);
									$('.total-view-cart,.boxinfo.p-price,.mnc-total-price').html(total_price);
									$('.count-holder .count').html(data.item_count);
									$('.boxinfo.p-count').html(data.item_count + ' sản phẩm');
									*/
                      });
                    }
                  }
                },
                error: function (XMLHttpRequest, textStatus) {
                  Haravan.onError(XMLHttpRequest, textStatus);
                },
              };
              jQuery.ajax(params);
            } else {
              var params = {
                type: "POST",
                url: "/cart/change.js",
                data: "quantity=" + currentQty + "&line=" + line,
                async: false,
                dataType: "json",
                success: function (data) {
                  cartItem = {};
                  cartGet = data;
                  for (i = 0; i < data.items.length; i++) {
                    var id = data.items[i].variant_id;
                    cartItem[data.items[i].variant_id] = data.items[i].quantity;
                    $('.mini-cart__item input[data-vid="' + id + '"]').val(
                      data.items[i].quantity
                    );
                    $('.proloop-actions[data-vrid="' + id + '"]')
                      .find(".proloop-boxqty input")
                      .val(data.items[i].quantity);
                  }

                  HRT.All.getCartModal(false);
                },
                error: function (XMLHttpRequest, textStatus) {
                  Haravan.onError(XMLHttpRequest, textStatus);
                },
              };
              jQuery.ajax(params);
            }
          }
        }
        if (updateNormal) {
          var params = {
            type: "POST",
            url: "/cart/change.js",
            data: "quantity=" + currentQty + "&line=" + line,
            async: false,
            dataType: "json",
            success: function (data) {
              cartItem = {};
              cartGet = data;
              for (i = 0; i < data.items.length; i++) {
                var id = data.items[i].variant_id;
                cartItem[data.items[i].variant_id] = data.items[i].quantity;
                $('.mini-cart__item input[data-vid="' + id + '"]').val(
                  data.items[i].quantity
                );
                $('.proloop-actions[data-vrid="' + id + '"]')
                  .find(".proloop-boxqty input")
                  .val(data.items[i].quantity);
                $(
                  '.proloop-actions[data-vrid="' + id + '"] .proloop-value'
                ).val(data.items[i].quantity);
              }
              HRT.All.getCartModal(false);
              var total_price = Haravan.formatMoney(
                data.total_price,
                formatMoney
              );
              $(".total-view-cart,.boxinfo.p-price,.mnc-total-price").html(
                total_price
              );
              $(".count-holder .count").html(data.item_count);
              $(".boxinfo.p-count").html(data.item_count + " sản phẩm");
            },
            error: function (XMLHttpRequest, textStatus) {
              Haravan.onError(XMLHttpRequest, textStatus);
            },
          };
          jQuery.ajax(params);
        }
      }, 300)
    );

    $(document).on(
      "click",
      ".mini-cart__quantity .mnc-minus",
      delayTime(function () {
        //var isXhasSpecialY = $(this).parents('.mini-cart__item').hasClass('xSpecial');
        var updates = [];
        var line = $(this).parents(".mini-cart__item").index() + 1;
        var vId = $(this)
          .parents(".mini-cart__item")
          .find("input")
          .attr("data-vid");
        var pId = $(this).parents(".mini-cart__item").attr("data-pid");
        var currentQty = parseInt(
          $(this).parents(".mini-cart__item").find("input").val()
        );
        if (currentQty > 0) {
          var updateNormal = true;
          if (promotionApp) {
            if (promotionApp_name == "app_buyxgety") {
              updateNormal = false;
              var old_promotion_variant_id = buyXgetY.getPromotionStorage(vId);
              if (old_promotion_variant_id !== undefined) {
                var gOSP = 0, //Gift other but same main product
                  gOPR = 0, //Gift priority but same main product
                  gCurrent = null;

                if (old_promotion_variant_id != undefined) {
                  $.each(
                    old_promotion_variant_id,
                    function (vIdGift, infoGift) {
                      var filterGiftInCart = cartGet.items.filter(
                        (x) =>
                          x.variant_id == vIdGift &&
                          x.promotionby.length > 0 &&
                          x.promotionby[0].product_id == pId
                      );
                      if (
                        infoGift.priority == false &&
                        filterGiftInCart.length > 0
                      ) {
                        gOSP += filterGiftInCart[0].quantity;
                      }
                      if (
                        infoGift.priority == true &&
                        filterGiftInCart.length > 0
                      ) {
                        gOPR +=
                          (filterGiftInCart[0].quantity * infoGift.count_buy) /
                          infoGift.count_gift;
                        gCurrent = infoGift;
                        gCurrent.vId = vIdGift;
                      }
                    }
                  );
                }

                cartGet.items.map((item, index) => {
                  if (item.variant_id == vId) updates[index] = currentQty;
                  else {
                    if (
                      item.promotionby.length > 0 &&
                      item.promotionby[0].product_id == pId
                    ) {
                      if (
                        gCurrent != null &&
                        gCurrent.priority == true &&
                        gCurrent.vId == item.variant_id
                      ) {
                        var haohut = gOSP + gOPR - currentQty;
                        var qtyGift =
                          item.quantity -
                          (haohut / gCurrent.count_buy) * gCurrent.count_gift;
                        updates[index] = qtyGift;
                      } else {
                        updates[index] = item.quantity;
                      }
                    } else {
                      updates[index] = item.quantity;
                    }
                  }
                });

                var params = {
                  type: "POST",
                  url: "/cart/update.js",
                  data: {
                    "updates[]": updates,
                  },
                  async: false,
                  dataType: "json",
                  success: function (data) {
                    cartItem = {};
                    cartGet = data;
                    for (i = 0; i < data.items.length; i++) {
                      var id = data.items[i].variant_id;
                      cartItem[data.items[i].variant_id] =
                        data.items[i].quantity;
                      $('.mini-cart__item input[data-vid="' + id + '"]').val(
                        data.items[i].quantity
                      );
                      $('.proloop-actions[data-vrid="' + id + '"]')
                        .find(".proloop-boxqty input")
                        .val(data.items[i].quantity);
                    }

                    HRT.All.getCartModal(false);

                    var total_price = Haravan.formatMoney(
                      data.total_price,
                      formatMoney
                    );
                    $(
                      ".total-view-cart,.boxinfo.p-price,.mnc-total-price"
                    ).html(total_price);
                    $(".count-holder .count").html(data.item_count);
                    $(".boxinfo.p-count").html(data.item_count + " sản phẩm");
                  },
                  error: function (XMLHttpRequest, textStatus) {
                    Haravan.onError(XMLHttpRequest, textStatus);
                  },
                };
                jQuery.ajax(params);
              } else {
                var params = {
                  type: "POST",
                  url: "/cart/change.js",
                  data: "quantity=" + currentQty + "&line=" + line,
                  async: false,
                  dataType: "json",
                  success: function (data) {
                    cartItem = {};
                    cartGet = data;
                    for (i = 0; i < data.items.length; i++) {
                      var id = data.items[i].variant_id;
                      cartItem[data.items[i].variant_id] =
                        data.items[i].quantity;
                      $('.mini-cart__item input[data-vid="' + id + '"]').val(
                        data.items[i].quantity
                      );
                      $('.proloop-actions[data-vrid="' + id + '"]')
                        .find(".proloop-boxqty input")
                        .val(data.items[i].quantity);
                      $(
                        '.proloop-actions[data-vrid="' +
                          id +
                          '"] .proloop-value'
                      ).val(data.items[i].quantity);
                    }

                    HRT.All.getCartModal(false);

                    var total_price = Haravan.formatMoney(
                      data.total_price,
                      formatMoney
                    );
                    $(
                      ".total-view-cart,.boxinfo.p-price,.mnc-total-price"
                    ).html(total_price);
                    $(".count-holder .count").html(data.item_count);
                    $(".boxinfo.p-count").html(data.item_count + " sản phẩm");
                  },
                  error: function (XMLHttpRequest, textStatus) {
                    Haravan.onError(XMLHttpRequest, textStatus);
                  },
                };
                jQuery.ajax(params);
              }
            }
          }
          if (updateNormal) {
            var params = {
              type: "POST",
              url: "/cart/change.js",
              data: "quantity=" + currentQty + "&line=" + line,
              async: false,
              dataType: "json",
              success: function (data) {
                cartItem = {};
                cartGet = data;
                for (i = 0; i < data.items.length; i++) {
                  var id = data.items[i].variant_id;
                  cartItem[data.items[i].variant_id] = data.items[i].quantity;
                  $('.mini-cart__item input[data-vid="' + id + '"]').val(
                    data.items[i].quantity
                  );
                  $('.proloop-actions[data-vrid="' + id + '"]')
                    .find(".proloop-boxqty input")
                    .val(data.items[i].quantity);
                  $(
                    '.proloop-actions[data-vrid="' + id + '"] .proloop-value'
                  ).val(data.items[i].quantity);
                }

                HRT.All.getCartModal(false);

                var total_price = Haravan.formatMoney(
                  data.total_price,
                  formatMoney
                );
                $(".total-view-cart,.boxinfo.p-price,.mnc-total-price").html(
                  total_price
                );
                $(".count-holder .count").html(data.item_count);
                $(".boxinfo.p-count").html(data.item_count + " sản phẩm");
              },
              error: function (XMLHttpRequest, textStatus) {
                Haravan.onError(XMLHttpRequest, textStatus);
              },
            };
            jQuery.ajax(params);
          }
        }
      }, 300)
    );
  },
  newsletterForm: function () {
    if ($(".newsletter-form").length > 0) {
      $(".newsletter-form form.contact-form").submit(function (e) {
        var self = $(this);
        if ($(this)[0].checkValidity() == true) {
          e.preventDefault();
          grecaptcha.ready(function () {
            grecaptcha
              .execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", {
                action: "submit",
              })
              .then(function (token) {
                self.find('input[name="g-recaptcha-response"]').val(token);
                $.ajax({
                  type: "POST",
                  url: "/account/contact",
                  data: $(".newsletter-form form.contact-form").serialize(),
                  success: function (data) {
                    if ($(data).find("#success_customer").length > 0) {
                      $(".newsletter-form .newsletter-error").html("");
                      swal({
                        icon: "success",
                        className: "newsletter-form-success",
                        title: "Đăng kí thông tin thành công",
                        text: "Thông báo sẽ tự động tắt sau 5 giây...",
                        button: false,
                        timer: 5000,
                      });
                      e.target.reset();
                    } else {
                      $(".newsletter-form .newsletter-error")
                        .addClass("error")
                        .html("Địa chỉ email không hợp lệ");
                    }
                  },
                });
              });
          });
        }
      });
    }
  },
  copyCodeProdCoupon: function () {
    $(document).on("click", ".coupon-item .cp-btn", function (e) {
      e.preventDefault();
      $(".coupon-item .cp-btn").html("Sao chép mã").removeClass("disabled");
      var copyText = $(this).attr("data-coupon");
      var el = document.createElement("textarea");
      el.value = copyText;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      $(this).html("Đã sao chép").addClass("disabled");
    });
  },
  prodPopoverCoupon: function () {
    var popover = '.cp-icon[data-toggle="popover"]';
    $(popover).popover({
      html: true,
      animation: true,
      sanitize: false,
      placement: function (popover, trigger) {
        var placement = jQuery(trigger).attr("data-placement");
        var dataClass = jQuery(trigger).attr("data-class");
        jQuery(trigger).addClass("is-active");
        jQuery(popover).addClass(dataClass);
        if (jQuery(trigger).offset().top - $(window).scrollTop() > 280) {
          return "top";
        }
        return placement;
      },
      content: function () {
        var elementId = $(this).attr("data-popover-content");
        return $(elementId).html();
      },
      delay: { show: 60, hide: 40 },
    });
    function eventPopover() {
      if ($(window).width() >= 768) {
        $(popover)
          .on("mouseenter", function () {
            var self = this;
            jQuery(this).popover("show");
            jQuery(".popover.coupon-popover").on("mouseleave", function () {
              jQuery(self).popover("hide");
            });
          })
          .on("mouseleave", function () {
            var self = this;
            setTimeout(function () {
              if (!jQuery(".popover.coupon-popover:hover").length) {
                jQuery(self).popover("hide");
              }
            }, 300);
          });
      } else {
        $(popover).off("mouseenter mouseleave");
      }
    }
    eventPopover();
    $(window).resize(function () {
      eventPopover();
    });
    $(popover)
      .popover()
      .on("hide.bs.popover", function () {
        $(".modal-coupon--backdrop").removeClass("js-modal-show");
      });
    $(popover)
      .popover()
      .on("show.bs.popover", function () {
        $(".modal-coupon--backdrop").addClass("js-modal-show");
      });
    $(popover)
      .popover()
      .on("shown.bs.popover", function () {
        $(".btn-popover-close,.modal-coupon--backdrop").click(function () {
          $(popover).not(this).popover("hide");
          var $this = $(this);
          $this.popover("hide");
        });
      });
    $("body").on("hidden.bs.popover", function (e) {
      $(e.target).data("bs.popover").inState = {
        click: false,
        hover: false,
        focus: false,
      };
    });
    $(document).on("click", ".cpi-trigger", function (e) {
      e.preventDefault();
      var btnPopover = $(this).attr("data-coupon");
      $(".coupon-item .cp-btn[data-coupon=" + btnPopover + "]").click();
    });
    $(document).on(
      "click",
      ".popover-content__coupon .btn-popover-code",
      function (e) {
        e.preventDefault();
        var btnPopover = $(this).attr("data-coupon");
        $(".coupon-item .cp-btn[data-coupon=" + btnPopover + "]").click();
        $(this).html("Đã sao chép").addClass("disabled");
      }
    );
  },
  modalLive: function () {
    $(".box-live .btn-live").click(function () {
      $(".modal-live").toggleClass("opened");
    });
    $(".box-live-mb .btn-live").click(function () {
      $(".modal-live").toggleClass("opened");
    });
    $(".box-close").click(function () {
      $(".modal-live").removeClass("opened");
    });
  },
  hiddenBtnLive: function () {
    setTimeout(function () {
      $(".box-live-mb").removeClass("hidden");
    }, 500);

    $(".btn-close").click(function () {
      $(".box-live-mb").addClass("hidden");
    });
  },
  iconMenuParent: function () {
    $(".menu-clicked").click(function () {
      $(".sidebar-menu").toggleClass("active-menu");
    });
    $(".site-overlay").click(function () {
      $(".header-action-item").removeClass("js-action-show");
      $(".sidebar-menu").removeClass("show-menu");
      $(".sidebar-menu").removeClass("active-menu");
      if ($(window).width() < 992) {
        $("body").removeClass("locked-scroll");
      }
    });
    $(".menu-parent__clicked").click(function () {
      if ($(this).parents(".header-action-item").hasClass("js-action-show")) {
        $("body").removeClass("locked-scroll");
        $(this).parents(".header-action-item").removeClass("js-action-show");
        $(".sidebar-menu").removeClass("show-menu").removeClass("active-menu");
        $(".header-bottom").removeClass("show");
      } else {
        $("body").removeClass("locked-scroll-menu");
        $(".header-bottom").removeClass("show");
        $(".header-action-item").removeClass("js-action-show");
        $("body").addClass("locked-scroll");
        $(".sidebar-menu").removeClass("show-menu").removeClass("active-menu");
        $(this).parents(".header-action-item").addClass("js-action-show");
        $(".sidebar-menu").removeClass("d-none").addClass("show-menu");
        $(".header-bottom").addClass("show");
        if ($(window).width() < 992) {
          $(".mainMenujs .item").removeClass("dnone");
          $("body").addClass("locked-scroll");
          if (
            $(this)
              .parents(".header-action-item")
              .hasClass("header-action_cart")
          ) {
            $(".siteCart-mobile").addClass("show-cart");
            $("body").removeClass("locked-scroll").addClass("body-showcart");
          }
        }
      }
    });
  },
  setHeightMenu: function () {
    $(".mainMenujs").addClass("setHeight");
    var numb = Number($(".item.load-more").attr("data-limit")) + 1;
    $(".item.load-more").on("click", function () {
      if ($(".item.load-more").hasClass("isopen")) {
        $(".mainMenujs").removeClass("more");
        $(this).removeClass("isopen").find("span").html("Xem thêm");
        $(".item:nth-child(n+" + numb + "):not(.load-more)")
          .fadeOut(50)
          .addClass("dnone");
      } else {
        $(".mainMenujs").addClass("more");
        $(".item:nth-child(n+" + numb + "):not(.load-more)")
          .fadeIn(500)
          .removeClass("dnone");
        $(this).addClass("isopen").find("span").html("Ẩn bớt");
      }
    });
  },
};

HRT.Index = {
  init: function () {
    var that = this;
    that.sliderBannerTop();
    that.sliderBannerRight();
    that.sliderCollection_1();
    that.sliderCollection_2();
    that.collectionTab1();
    that.sliderCollection_3();
    that.sliderLatestBlog();
    that.hiddenSeeMore();
  },
  sliderBannerTop: function () {
    if ($("#home-slider").length > 0) {
      $("#home-slider .owl-carousel").owlCarousel({
        items: 1,
        nav: true,
        dots: true,
        lazyLoad: true,
        loop: $("#home-slider .slider-item").length > 1 ? true : false,
        autoplay: true,
        autoplayTimeout: 8000,
        slideSpeed: 4000,
        animateIn: "fadeIn",
        animateOut: "fadeOut",
        responsive: {
          0: {
            nav: false,
          },
          768: {
            nav: true,
          },
        },
        onChanged: function (event) {
          setTimeout(function () {
            $("#home-slider")
              .find(".owl-dot")
              .each(function (index) {
                $(this).attr("aria-label", index + 1);
              });
          }, 400);
        },
      });
      $("#home-slider .owl-carousel").find(".owl-next").html("");
      $("#home-slider .owl-carousel").find(".owl-prev").html("");
    }
  },
  sliderBannerRight: function () {
    var owlBanner = $("#group-banner-right");
    function carouselBannerRight() {
      if ($(window).width() < 992) {
        if (!owlBanner.hasClass("owl-carousel")) {
          owlBanner.addClass("owl-carousel").owlCarousel({
            items: 1,
            nav: true,
            dots: false,
            lazyLoad: true,
            loop: true,
            autoplay: true,
            autoplayTimeout: 8000,
            slideSpeed: 4000,
            animateIn: "slideInRight",
            animateOut: "fadeOut",
            margin: 0,
          });
        }
      } else if (owlBanner.hasClass("owl-carousel")) {
        owlBanner.trigger("destroy.owl.carousel");
        owlBanner.removeClass("owl-carousel owl-loaded owl-drag");
      }
    }
    carouselBannerRight();
    $(window).resize(function () {
      carouselBannerRight();
    });
  },
  sliderLatestBlog: function () {
    $("#owlBlog-latest").owlCarousel({
      items: 4,
      nav: true,
      dots: false,
      loop: false,
      smartSpeed: 1200,
      autoplayTimeout: 1500,
      navText: [themeAssets.arrowRight, themeAssets.arrowRight],
      responsive: {
        0: {
          items: 1,
          stagePadding: 45,
        },
        768: {
          items: 3,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
          touchDrag:
            $("#owlBlog-latest .article-item").length > 4 ? true : false,
          mouseDrag:
            $("#owlBlog-latest .article-item").length > 4 ? true : false,
        },
      },
    });
  },
  sliderCollection_1: function () {
    $(".home-collection-1 .owl-carousel").owlCarousel({
      items: prodItem_desk,
      loop: false,
      nav: true,
      dots: false,
      lazyLoad: true,
      navText: [themeAssets.arrowRight, themeAssets.arrowRight],
      responsive: {
        0: {
          items: 2,
          dots: false,
          nav: false,
          stagePadding: 15,
        },
        768: {
          items: 2,
          nav: false,
        },
        992: {
          items: prodItem_desk,
        },
        1200: {
          items: prodItem_desk,
          touchDrag:
            $(".home-collection-1 .product-loop").length > prodItem_desk
              ? true
              : false,
          mouseDrag:
            $(".home-collection-1 .product-loop").length > prodItem_desk
              ? true
              : false,
        },
      },
      onChanged: function (event) {
        setTimeout(function () {
          $(".home-collection-1")
            .find(".owl-dots button")
            .each(function (index) {
              $(this).attr("aria-label", index + 1);
            });
        }, 400);
      },
    });
  },
  sliderCollection_2: function () {
    $(".home-collection-2 .owl-carousel").owlCarousel({
      items: prodItem_desk,
      loop: false,
      nav: true,
      dots: false,
      dotsEach: true,
      navText: [themeAssets.arrowRight, themeAssets.arrowRight],
      responsive: {
        0: {
          items: 2,
          dots: false,
          nav: false,
          stagePadding: 15,
        },
        768: {
          items: 2,
          nav: false,
        },
        992: {
          items: prodItem_desk,
        },
        1200: {
          items: prodItem_desk,
          touchDrag:
            $(".home-collection-2 .product-loop").length > prodItem_desk
              ? true
              : false,
          mouseDrag:
            $(".home-collection-2 .product-loop").length > prodItem_desk
              ? true
              : false,
        },
      },
      onChanged: function (event) {
        setTimeout(function () {
          $(".home-collection-2")
            .find(".owl-dots button")
            .each(function (index) {
              $(this).attr("aria-label", index + 1);
            });
        }, 400);
      },
    });
  },
  sliderCollection_3: function () {
    $(".home-collection-3 .owl-carousel").owlCarousel({
      items: 3,
      loop: false,
      nav: true,
      dots: false,
      dotsEach: true,
      smartSpeed: 1000,
      margin: 20,
      navText: [themeAssets.arrowRight, themeAssets.arrowRight],
      responsive: {
        0: {
          items: 1,
          stagePadding: 30,
          margin: 8,
          nav: false,
        },
        768: {
          items: 2,
        },
        992: {
          items: 2,
        },
        1200: {
          items: 4,
          touchDrag:
            $(".home-collection-3 .row-product").length > 4 ? true : false,
          mouseDrag:
            $(".home-collection-3 .row-product").length > 4 ? true : false,
        },
      },
      onChanged: function (event) {
        setTimeout(function () {
          $(".home-collection-3")
            .find(".owl-dots button")
            .each(function (index) {
              $(this).attr("aria-label", index + 1);
            });
        }, 400);
      },
    });
  },
  scrollCenterFlashSale: function (parent, elem, speed) {
    var active = jQuery(parent).find(elem);
    var activeWidth = active.width() / 2;
    var pos = jQuery(parent).find(elem).position().left + activeWidth;
    var elpos = jQuery(parent).scrollLeft();
    var elW = jQuery(parent).width();
    pos = pos + elpos - elW / 2;
    jQuery(parent).animate(
      {
        scrollLeft: pos,
      },
      speed == undefined ? 1000 : speed
    );
    return this;
  },
  collectionTab1: function () {
    var limitProd = $(".home-productTabs .collection-navtabs-title").attr(
      "data-limit"
    );
    $(".home-productTabs").each(function () {
      var sectionCurrent = $(this);
      $(this)
        .find('.collection-navtabs-title a[data-toggle="tab"]')
        .on("shown.bs.tab", function () {
          var handle = $(this).attr("data-handle");
          var tprod = $(this)
            .parents(".home-productTabs")
            .find(
              ".collection-tabs-ajax .tab-pane.active .listProduct-row .product-loop:not(.product-loadding)"
            ).length;
          var indexTab = $(this).parent().index();
          var title = $(this).html();
          var countProd = $(this).attr("data-count");
          var sectionIndex = $(this)
            .parents(".collection-navtabs-title")
            .attr("data-index");

          sectionCurrent.find(".wrapbox--btn a").attr("href", handle);
          sectionCurrent.find(".wrapbox--btn a strong").html(title);
          if (Number(countProd) > Number(limitProd)) {
            sectionCurrent.find(".wrapbox--btn").removeClass("d-none");
          } else {
            sectionCurrent.find(".wrapbox--btn").addClass("d-none");
          }

          if (jQuery(window).width() < 768) {
            var $parentScroll = sectionCurrent.find(
              ".collection-navtabs-title"
            );
            HRT.Index.scrollCenterFlashSale($parentScroll, ".active", 500);
          }
          if (tprod == 0) {
            if (handle == "") {
              $.ajax({
                url: "/collections/all?view=home-product-data-no",
                success: function (data) {
                  setTimeout(function () {
                    sectionCurrent
                      .find(
                        ".collection-tabs-ajax .tab-pane.active .listProduct-row"
                      )
                      .html("");
                    sectionCurrent
                      .find(
                        ".collection-tabs-ajax .tab-pane.active .listProduct-row"
                      )
                      .append(data);
                    sectionCurrent
                      .find(".home-productTabs .wrapbox--btn")
                      .addClass("d-none");
                  }, 350);
                },
              });
            } else {
              $.ajax({
                url: handle + "?view=home-product-data",
                success: function (data) {
                  setTimeout(function () {
                    data = data.replace(
                      /navTabColl__loop_/g,
                      "section_" +
                        sectionIndex +
                        "_tab_" +
                        (indexTab + 1) +
                        "_loop_"
                    );
                    sectionCurrent
                      .find(
                        ".collection-tabs-ajax .tab-pane.active .listProduct-row"
                      )
                      .html("");
                    sectionCurrent
                      .find(
                        ".collection-tabs-ajax .tab-pane.active .listProduct-row"
                      )
                      .append(data);
                    if (productReviewsApp && productReviewsProloop) {
                      ProductReviews.init();
                    }
                    if (promotionApp) {
                      if (promotionApp_name == "app_combo") {
                        comboApp.showGiftLabel();
                      } else {
                        buyXgetY.showGiftLabel();
                      }
                    }
                  }, 350);
                },
              });
            }
          }
        });
    });
  },
  hiddenSeeMore: function () {
    if ($(window).width() > 992) {
      if ($(".home-collection-1 .product-loop").length > prodItem_desk) {
        $(".home-collection-1 .box-link").show();
      } else {
        $(".home-collection-1 .box-link").hide();
      }
    }
  },
};

HRT.Collection = {
  init: function () {
    var that = this;
    that.toggleFilterMobile();
    that.menuSidebar();
  },
  toggleFilterMobile: function () {
    $(".collection-sortby-filter .layered_filter_title").on(
      "click",
      function () {
        var layerfilter = $(this).attr("data-layered-click");
        if (jQuery(window).width() < 992) {
          if ($(this).parent().hasClass("filter_opened")) {
            $(this).parent().removeClass("filter_opened");
            $(layerfilter).slideUp(300);
          } else {
            $(".layered_filter_mobileContent").slideUp(300);
            $(".layered_filter_title").parent().removeClass("filter_opened");
            $(this).parent().addClass("filter_opened");
            $(layerfilter).slideDown(300);
          }
        }
      }
    );
    $(".filter_group-subtitle").on("click", function () {
      jQuery(this)
        .toggleClass("action-group")
        .parent()
        .find(".filter_group-content")
        .stop()
        .slideToggle("medium");
    });
  },
  menuSidebar: function () {
    $(document).on("click", ".tree-menu .tree-menu-lv1", function () {
      $this = $(this).find(".tree-menu-sub");
      $(".tree-menu .has-child .tree-menu-sub").not($this).slideUp("fast");
      $(this).find(".tree-menu-sub").slideToggle("fast");
      $(this).toggleClass("menu-collapsed");
      $(this).toggleClass("menu-uncollapsed");
      var $this1 = $(this);
      $(".tree-menu .has-child").not($this1).removeClass("menu-uncollapsed");
    });
  },
};

HRT.Product = {
  init: function () {
    var that = this;
    that.addCartProduct();
    //that.buyNowProduct();
    that.changeValueQuantity();
    that.backtoHistory();
    that.toggleDescProduct(".product-description--accordion");
    that.toggleShareProduct();
    that.renderCombo(currentId);
    that.sliderProductRelated("#owlProduct-related");
    //that.tooltipShare();
  },
  addCartProduct: function () {
    //$('#add-to-cart').click(function(e){
    //e.preventDefault();
    //$(this).addClass('clicked_buy');
    //HRT.All.addItemShowModalCart($('#product-select').val());
    //if($(window).width() < 768){
    //	$('.siteCart-mobile').addClass('show-cart');
    //	}
    //});
    $("#add-to-cartBottom").click(function () {
      $("#add-to-cart").trigger("click");
    });
  },
  buyNowProduct: function () {},
  changeValueQuantity: function () {
    $("#quantity").on("keyup change", function () {
      $("#quantity-bottom").val($(this).val());
    });
    $("#quantity-bottom").on("keyup change", function () {
      $("#quantity").val($(this).val());
    });
  },
  backtoHistory: function () {
    if ($("#backto-page").length > 0) {
      $(document).on("click", "#backto-page", function () {
        window.history.back();
      });
    }
  },
  toggleDescProduct: function (object) {
    $(document).on("click", object + " .panel-group .panel-title", function () {
      if ($(this).parent().hasClass("opened")) {
        $(this).parent().removeClass("opened");
        $(this).parent().find(".panel-description").slideUp();
      } else {
        $(object).find(".panel-description").slideUp();
        $(object).find(".panel-group").removeClass("opened");
        $(this).parent().addClass("opened");
        $(this).parent().find(".panel-description").slideDown();
      }
    });
  },
  toggleShareProduct: function () {
    // click icon  share social product
    $(document).on("click", ".product-sharing", function () {
      $(this).toggleClass("sharing-active");
    });
  },
  copyLinkProduct: function () {
    var copyText = document.getElementById("myInput");
    console.log(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    swal({
      icon: "success",
      className: "copy-success",
      text: "Đã sao chép",
      button: false,
      timer: 1500,
    });
  },
  sliderProductRelated: function (target) {
    if ($(target).length > 0) {
      $(target).owlCarousel({
        items: prodItem_desk,
        nav: true,
        dots: false,
        loop: false,
        lazyLoad: true,
        smartSpeed: 1500,
        autoplayTimeout: 1500,
        navText: [themeAssets.arrowRight, themeAssets.arrowRight],
        responsive: {
          0: {
            items: 2,
            stagePadding: 20,
          },
          768: {
            items: 2,
          },
          992: {
            items: prodItem_desk,
          },
          1200: {
            items: prodItem_desk,
            touchDrag:
              $(target).find(".product-loop").length > prodItem_desk
                ? true
                : false,
            mouseDrag:
              $(target).find(".product-loop").length > prodItem_desk
                ? true
                : false,
          },
        },
      });
    }
  },
  renderCombo: function (currentId, view) {
    var aIdCombo = [],
      aIdSearch = [];
    htmlQvApp = htmlCombo = "";
    dataItemsCombo = [];

    var comboDOM =
      view != undefined
        ? "#quick-view-modal .combo-info"
        : "#detail-product .combo-info";
    var parentDOM =
      view != undefined ? "#quick-view-modal" : "#detail-product .combo-info";
    $.get(
      "https://combo-omni.haravan.com/js/list_recommendeds?product_id=" +
        currentId
    ).done(function (data) {
      if (data.length > 0) {
        $.each(data, function (i, v) {
          var temp = [];
          var temp2 = {};
          $.each(v.recommendeds, function (j, k) {
            temp.push(k.product_id);
            aIdSearch.push(k.product_id);
            temp2[k.product_id] = k;
          });
          aIdCombo.push(temp);
          dataItemsCombo.push(temp2);
        });

        aIdSearch = uniques(aIdSearch);
        var str =
          "/search?q=filter=((id:product=" +
          aIdSearch.join(")||(id:product=") +
          "))";
        $.get(str + "&view=datacombo").done(function (result) {
          result = JSON.parse(result);
          $.each(aIdCombo, function (i, v) {
            var allAvailable = true;
            /* Kiểm tra có item nào trong combo ko valid thì không hiển thị */
            /* Hoặc có item nào bị ẩn thì ko hiển thị */
            $.each(v, function (j, k) {
              if (result[k]) {
                if (dataItemsCombo[i][k].is_apply_by_variant) {
                  var apply_length =
                    dataItemsCombo[i][k].apply_productvariants.length;
                  $.each(
                    dataItemsCombo[i][k].apply_productvariants,
                    function (l, m) {
                      if (!result[k].variants[m.id].available) {
                        allAvailable = false;
                        if (apply_length == 1) return false;
                        else m = null;
                      }
                    }
                  );
                } else {
                  if (!result[k].available) {
                    allAvailable = false;
                    return false;
                  }
                }
              } else {
                allAvailable = false;
                return false;
              }
            });
            /* End Kiểm tra */

            /* Nếu kiểm tra các item trong combo đều còn hàng thì render */
            if (allAvailable) {
              htmlCombo += '<div class="combo-info--content">';
              //var htmlImg = render_img(result,v);
              //var htmlDetail = render_detail(result,i,v,currentId);
              var htmlDetail = render_items(result, i, v, currentId);
              //htmlCombo += htmlImg;
              htmlCombo += htmlDetail;
              htmlCombo += "</div>";
            }
          });

          if (htmlCombo != "") {
            $(comboDOM).append(htmlCombo).removeClass("d-none");
            if (view != undefined) {
              htmlQvApp = htmlCombo;
            }
          }
        });
      } else {
        if (view == "quickview") {
          //return htmlCombo || '';
          return htmlCombo;
        }
      }
    });
  },
  tooltipShare: function () {
    if ($(window).width() > 1200) {
      $(
        '.productDetail--main .product-toshare [data-toggle="popover"]'
      ).popover({
        container: "body",
      });
    }
  },
};

HRT.Page = {
  init: function () {
    var that = this;
    that.navTabsHover();
    that.navTabsCenter();
    that.slideAbout03();
    that.slideAbout02();
    //that.scrollElement();
    //that.filterStore();
  },
  navTabsHover: function () {
    $(".nav-tabs .box-wrapper").hover(function () {
      $(".box-wrapper").removeClass("active");
      $(this).tab("show");
    });
  },
  navTabsCenter: function () {
    if (jQuery(window).width() > 767) {
      var maxHeight = 0;
      $(".box-wrapper").each(function () {
        var thisHeight = parseInt($(this).outerHeight());
        maxHeight = maxHeight >= thisHeight ? maxHeight : thisHeight;
      });
      $(".box-wrapper").css("min-height", maxHeight);
    }
  },
  slideAbout03: function () {
    $(".about-slide").owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      dots: false,
      navSpeed: 800,
      lazyLoad: true,
      touchDrag: true,
      items: 1,
      onChanged: function (event) {
        setTimeout(function () {
          $(".about-slide")
            .find(".owl-nav button")
            .each(function (index) {
              $(this).attr("aria-label", index + 1);
            });
        }, 400);
      },
    });
  },
  slideAbout02: function () {
    $("#about02-slide-client").owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      dots: true,
      navSpeed: 800,
      lazyLoad: true,
      touchDrag: true,
      items: 1,
      onChanged: function (event) {
        setTimeout(function () {
          $("#about02-slide-client")
            .find(".owl-nav button")
            .each(function (index) {
              $(this).attr("aria-label", index + 1);
            });
        }, 400);
      },
    });
  },
  scrollElement: function () {
    if ($(".section-about02-client").length > 0) {
      function progressBarScroll() {
        var $this = $(window);
        var elY = $(".section-about02-client").offset().top;
        var speed = 1;
        var winY = $this.scrollTop();
        var winH = $this.height();
        var parentH = $(".section-about02-client").innerHeight();
        var winBottom = winY + winH;
        var elPx = 0;
        if (winBottom > elY && winY < elY + parentH) {
          var Item1 = document.getElementById("item1");
          var Item2 = document.getElementById("item2");
          var Item3 = document.getElementById("item3");
          (function () {
            var throttle = function (type, name, obj) {
              var obj = obj || window;
              var running = false;
              var func = function () {
                if (running) {
                  return;
                }
                running = true;
                requestAnimationFrame(function () {
                  obj.dispatchEvent(new CustomEvent(name));
                  running = false;
                });
              };
              obj.addEventListener(type, func);
            };
            throttle("scroll", "optimizedScroll");
          })();
          /*
				window.addEventListener("optimizedScroll", function(){
					//var hOffset = window.pageYOffset - $('.section-about02-client').offset().top;
					if (winBottom > elY && winY < elY + parentH) {
						var elBottom = ((winBottom - elY) * speed);
						var elTop = winH +  parentH;
						elPx = ((((elBottom / elTop) * 100) + (50 - (speed * 50))) - 50) * -1;
					}
					Item1.style.transform = "translateY(" + Math.floor(elPx) + "px)";
					Item2.style.transform = "translateY(" + Math.floor(elPx) + "px)";
					Item3.style.transform = "translateY(" + Math.floor(elPx) + "px)";
				})
				*/
          window.addEventListener("optimizedScroll", function () {
            //console.log(window.pageYOffset - $('.section-about02-client').offset().top)
            var hOffset =
              window.pageYOffset - $(".section-about02-client").offset().top;
            Item1.style.transform = "translateY(" + hOffset * 0.1 + "px)";
            Item2.style.transform = "translateY(" + hOffset * 0.1 + "px)";
            Item3.style.transform = "translateY(" + hOffset * 0.1 + "px)";
          });
        }
      }
      $(window).scroll(progressBarScroll);
    }
  },
  filterStore: function () {
    let distObj = {};
    const spreadSheet =
      "https://docs.google.com/spreadsheets/d/1cYNslofo4tYAhd3i0PxyYqn4YT8tUtfSj1uOS3ibF8c/edit?usp=sharing";
    const id = spreadSheet.match(/(d\/)(.*)(?=\/)/gm);
    const gid = "0";
    const urlMap =
      "https://docs.google.com/spreadsheets/" +
      id +
      "/gviz/tq?tqx=out:json&tq&gid=" +
      gid;
    function getShops() {
      const params = {
        type: "GET",
        url: urlMap,
        async: false,
        dataType: "text",
        success: function (data) {
          const from = data.indexOf("{");
          const to = data.lastIndexOf("}") + 1;
          const jsonText = data.slice(from, to);
          const parsedText = JSON.parse(jsonText);
          const table = parsedText.table;
          let result = table.rows.map((item) => {
            return item.c;
          });

          //console.log(result)
          distObj = [...new Set(result.map((item) => item[0].v.trim()))].reduce(
            (obj, item) => {
              obj[item] = [];
              return obj;
            },
            {}
          );
          result.map((item) =>
            distObj[item[0].v.trim()].push({
              shop: item[1].v,
              info: item[2].v,
              map: item[3].v,
              time: item[4].v,
              phone: item[5].v,
            })
          );
          //console.log(distObj)
          let distHTML = "";
          Object.keys(distObj).map((dist) => {
            if (dist && dist !== "undefined") {
              distHTML += '<option value="' + dist + '">' + dist + "</option>";
            }
          });
          $("#filter-item-province").html(distHTML);
          $("#filter-item-province").change(function () {
            let html = "";
            distObj[$(this).val()].map((shop) => {
              shop.shop = $(
                '<option value="' + shop.shop + '">' + shop.shop + "</option>"
              ).text();
              html +=
                '<option value="' + shop.shop + '">' + shop.shop + "</option>";
            });
            if (html === "<option value=''></option>") {
              html = '<option value="">Địa chỉ cửa hàng đang cập nhật</option>';
            }
            $("#filter-store").html(html);
            $("#filter-store").val($("#filter-store option").val()).change();
          });
          $("#filter-item-province").change();
          $("#filter-store").change(function () {
            let shop = distObj[$("#filter-item-province").val()].find(
              (shop) => {
                return shop.shop === $(this).val();
              }
            );
            if (shop) {
              $(".address-store").html(shop.address);
              $(".open-time span").html(shop.time);
              $(".hotline span").html(shop.phone);
            }

            $(".box-map").html(
              shop.map
                .replace("&lt;iframe", "<iframe")
                .replace("&lt;/iframe&gt;", "</iframe>")
            );
          });
          $("#filter-store").change();
        },
        error: function () {},
      };
      jQuery.ajax(params);
    }
    getShops();
  },
};

HRT.Quickview = {
  init: function () {
    var that = this;
    that.showQuickview();
    that.shareLinkQuickview();
    //HRT.Product.toggleDescProduct('.product-description--quickview');
    that.addCartProductQuickview();
    //that.closeQuickView();
    that.iconQuickView();
  },
  slideProdQuickview: function () {
    var qv_slider = $("#quickview-sliderproduct");
    var qv_thumbSlider = $("#quickview-thumbproduct");
    var qv_duration = 500;
    qv_slider.owlCarousel({
      items: 1,
      nav: true,
      dots: true,
      loop: false,
      smartSpeed: 1000,
      responsive: {
        0: {
          dots: true,
        },
        768: {
          dots: false,
        },
      },
    });
    qv_thumbSlider.on("initialized.owl.carousel", function () {
      qv_thumbSlider.find(".owl-item").eq(0).addClass("current");
    });
    qv_slider.on("changed.owl.carousel", function (e) {
      qv_thumbSlider.trigger("to.owl.carousel", [
        e.item.index,
        qv_duration,
        true,
      ]);
      qv_thumbSlider.find(".owl-item").removeClass("current");
      qv_thumbSlider
        .find(".owl-item:nth-child(" + (e.item.index + 1) + ")")
        .addClass("current");
    });
    qv_thumbSlider.owlCarousel({
      loop: false,
      nav: false,
      dots: false,
      margin: 5,
      center: false,
      responsive: {
        0: {
          items: 5,
          margin: 7,
        },
        768: {
          items: 6,
        },
        992: {
          items: 6,
        },
        1200: {
          items: 6,
        },
      },
    });
    qv_thumbSlider.on("changed.owl.carousel", function (e) {
      qv_slider.trigger("to.owl.carousel", [e.item.index, qv_duration, true]);
      qv_slider.find(".owl-item").removeClass("current");
      qv_slider
        .find(".owl-item:nth-child(" + (e.item.index + 1) + ")")
        .addClass("current");
    });
    qv_thumbSlider.on("click", ".owl-item", function (e) {
      e.preventDefault();
      qv_thumbSlider.find(".owl-item").removeClass("current");
      $(this).addClass("current");
      var number = $(this).index();
      qv_slider.data("owl.carousel").to(number, qv_duration, true);
    });
  },
  renderQuickview: function (url, id, title) {
    if (promotionApp) {
      htmlQvApp = "";
      if (promotionApp_name == "app_combo") {
        HRT.Product.renderCombo(id, "quickview");
      } else {
        buyXgetY.getQuickPromotionRecommended(id, title);
      }
    }
    jQuery.ajax({
      type: "GET",
      url: url + (url.indexOf("?") > -1 ? "&" : "?") + "view=quickview",
      async: false,
      success: function (data) {
        htmlQv = data;
        $("#quick-view-modal .wrapper-quickview").html(htmlQv);
        $("#quick-view-modal").modal("show");
        setTimeout(function () {
          HRT.Quickview.slideProdQuickview();
          if (htmlQvApp != "" && htmlQvApp != undefined) {
            if (promotionApp_name != "app_combo") {
              if (
                $("#quick-view-modal .q-selector-buyxgety").hasClass(
                  "d-none"
                ) &&
                htmlQvApp != "" &&
                $(
                  "#quick-view-modal .q-selector-buyxgety .buyxgety_lists"
                ).html() == ""
              ) {
                $(
                  "#quick-view-modal .q-selector-buyxgety .buyxgety_lists"
                ).append(htmlQvApp);
                $("#quick-view-modal .q-selector-buyxgety").removeClass(
                  "d-none"
                );
              }
            }
          }
        }, 800);
        if (htmlQvApp != "" && htmlQvApp != undefined) {
          if (promotionApp_name == "app_combo") {
            if (
              $("#quick-view-modal .combo-info").hasClass("d-none") &&
              htmlQvApp != ""
            ) {
              $("#quick-view-modal .combo-info")
                .append(htmlQvApp)
                .removeClass("d-none");
            }
          }
        }
      },
    });
    if ($("#quick-view-modal").hasClass("show")) {
      $(".mainHeader").removeClass("hSticky-up");
    }
  },
  showQuickview: function () {
    jQuery(document).on("click", ".quickview-product", function (e) {
      var id = $(this).closest(".product-loop").attr("data-id");
      var title = $(this)
        .closest(".product-loop")
        .find(".proloop-detail h3 a")
        .html();
      var prolink = $(this).attr("data-handle");
      var proId = $(this)
        .parents(".product-loop .product-inner")
        .attr("data-proid");
      //console.log(id, title, prolink, proId)
      if (jQuery(window).width() < 768) {
        if (promotionApp) {
          if (
            !$('.product-loop[data-id="' + id + '"]')
              .find(".gift.product_gift_label")
              .hasClass("d-none")
          ) {
            e.preventDefault();
            //window.location.href = $(this).closest('.product-loop').find('a').attr('href');
            HRT.Quickview.renderQuickview(prolink, proId, title);
          } else {
            e.preventDefault();
            HRT.Quickview.renderQuickview(prolink, proId, title);
          }
        } else {
          e.preventDefault();
          HRT.Quickview.renderQuickview(prolink, proId, title);
        }
      } else {
        window.location.href = $(this)
          .closest(".product-loop")
          .find("a")
          .attr("href");
      }
    });
  },
  closeQuickView: function () {
    //var proT = document.title ;/*   */
    //var proL = window.location.href;
    jQuery(window).on("popstate", function () {
      location.reload(true);
    });
    jQuery(document).on("click", ".quickview-close", function (e) {
      $("#quick-view-modal").modal("hide");
      $(".siteCart-mobile").removeClass("show-cart");
    });
  },
  shareLinkQuickview: function () {
    $(document).on("click", ".quickview-share", function () {
      var copyText = document.getElementById("myInputQuickview");
      console.log(copyText);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      swal({
        icon: "success",
        className: "copy-success",
        text: "Đã sao chép",
        button: false,
        timer: 1500,
      });
    });
  },
  addCartProductQuickview: function () {
    $(document).on("click", "#add-to-cartQuickview", function (e) {
      e.preventDefault();
      var min_qty = parseInt(
        jQuery('.quickview-qtyvalue[name="quantity"]').val()
      );
      var variant_id = $("#product-select-quickview").val();
      var product_id = $(this).attr("data-pid");
      var title = $(".modal-detailProduct h2").html();
      if ($(this).hasClass("add-xy")) {
        $(this).addClass("clicked_buy_qv");
        buyXgetY.addCartBuyXGetY_detail(
          false,
          variant_id,
          product_id,
          min_qty,
          title,
          "quick-view",
          function () {
            HRT.All.getCartModal(true);
            $("#add-to-cartQuickview").removeClass("clicked_buy_qv");
            $("#quick-view-modal").modal("hide");
            if ($(window).width() < 992) {
              $("body").removeClass("locked-scroll").addClass("body-showcart");
              $(".siteCart-mobile").addClass("show-cart");
            }
          }
        );
      } else {
        jQuery.ajax({
          type: "POST",
          url: "/cart/add.js",
          async: true,
          data: "quantity=" + min_qty + "&id=" + variant_id,
          dataType: "json",
          success: function (line_item) {
            if (template.indexOf("cart") > -1) {
              window.location.reload();
            } else {
              var image = "";
              if (line_item["image"] == null) {
                image = "https://hstatic.net/0/0/global/noDefaultImage6.gif";
              } else {
                image = Haravan.resizeImage(line_item["image"], "small");
              }
              var $info =
                '<div class="row"><div class="col-md-12 col-xs-12"><p class="jGowl-text">Đã thêm vào giỏ hàng thành công!</p></div><div class="col-md-4 col-xs-4"><a href="' +
                line_item["url"] +
                '"><img width="70px" src="' +
                image +
                '" alt="' +
                line_item["title"] +
                '"/></a></div><div class="col-md-8 col-xs-8"><div class="jGrowl-note"><a class="jGrowl-title" href="' +
                line_item["url"] +
                '">' +
                line_item["title"] +
                "</a><ins>" +
                Haravan.formatMoney(line_item["price"], formatMoney) +
                "</ins></div></div></div>";
              $("#quick-view-modal").modal("hide");
              HRT.All.notifyProduct($info);
              $(
                '.proloop-actions[data-vrid="' +
                  variant_id +
                  '"] .proloop-value'
              ).val(line_item.quantity);
              HRT.All.getCartModal();
              if ($(window).width() < 992) {
                //$('#quick-view-modal').on('hidden.bs.modal', function () {
                //	debugger
                $("body")
                  .removeClass("locked-scroll")
                  .addClass("body-showcart");
                $(".siteCart-mobile").addClass("show-cart");
                //		});
              }
            }
            $(".proloop-actions[data-vrid=" + variant_id + "]").addClass(
              "action-count"
            );
          },
          error: function (XMLHttpRequest, textStatus) {
            alert("Sản phẩm bạn vừa mua đã vượt quá tồn kho");
          },
        });
      }
    });
  },
  plusQtyView: function () {
    if (jQuery('.quickview-qtyvalue[name="quantity"]').val() != undefined) {
      var currentVal = parseInt(
        jQuery('.quickview-qtyvalue[name="quantity"]').val()
      );
      console.log(currentVal);
      if (!isNaN(currentVal)) {
        jQuery('.quickview-qtyvalue[name="quantity"]').val(currentVal + 1);
      } else {
        jQuery('.quickview-qtyvalue[name="quantity"]').val(1);
      }
    } else {
      console.log(
        "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
      );
    }
  },
  minusQtyView: function () {
    if (jQuery('.quickview-qtyvalue[name="quantity"]').val() != undefined) {
      var currentVal = parseInt(
        jQuery('.quickview-qtyvalue[name="quantity"]').val()
      );
      console.log(currentVal);
      if (!isNaN(currentVal) && currentVal > 1) {
        jQuery('.quickview-qtyvalue[name="quantity"]').val(currentVal - 1);
      }
    } else {
      console.log(
        "error: Not see elemnt " + jQuery('input[name="quantity"]').val()
      );
    }
  },
  iconQuickView: function () {
    jQuery(document).on("click", ".icon-quickview", function (e) {
      var id = $(this).closest(".product-loop").attr("data-id");
      var title = $(this)
        .closest(".product-loop")
        .find(".proloop-detail h3 a")
        .html();
      var prolink = $(this).attr("data-handle");
      var proId = $(this)
        .parents(".product-loop .product-inner")
        .attr("data-proid");

      //console.log(id, title, prolink, proId)
      if (jQuery(window).width() >= 768) {
        if (promotionApp) {
          if (
            !$('.product-loop[data-id="' + id + '"]')
              .find(".gift.product_gift_label")
              .hasClass("d-none")
          ) {
            e.preventDefault();
            //window.location.href = $(this).closest('.product-loop').find('a').attr('href');
            HRT.Quickview.renderQuickview(prolink, proId, title);
          } else {
            e.preventDefault();
            HRT.Quickview.renderQuickview(prolink, proId, title);
          }
        } else {
          e.preventDefault();
          HRT.Quickview.renderQuickview(prolink, proId, title);
        }
      } else {
        window.location.href = $(this)
          .closest(".product-loop")
          .find("a")
          .attr("href");
      }
    });
  },
};

HRT.Cart = {
  init: function () {
    var that = this;
    if ($(".summary-picktime").length > 0) {
      that.initTimeCart();
      that.pickOptionTime();
      that.checkTimeExist();
    }
    that.clickCheckoutCart();
    that.addCartSocial();
    that.clickCheckbill();
    that.checkChangeInput();
    that.clickSaveInfoBill();
    that.sliderCoupon();
  },
  updatePriceChange: function (action, line, vId, pId, qty) {
    var updates = [];
    var qtyGift = 0;
    $(".cart-ajloading").show();
    if (promotionApp) {
      if (promotionApp_name == "app_buyxgety") {
        var old_promotion_variant_id = buyXgetY.getPromotionStorage(vId);
        var dataPost = $("#cartformpage").serialize();

        if (old_promotion_variant_id !== undefined) {
          var gOSP = 0, //Gift other but same main product
            gOPR = 0, //Gift priority but same main product
            gCurrent = null;

          var giftExistInCart = true,
            qtyGiftNotInCart = 0;
          if (old_promotion_variant_id != undefined) {
            $.each(old_promotion_variant_id, function (vIdGift, infoGift) {
              var filterGiftInCart = cartGet.items.filter(
                (x) =>
                  x.variant_id == vIdGift &&
                  x.promotionby.length > 0 &&
                  x.promotionby[0].product_id == pId
              );
              if (infoGift.priority == false && filterGiftInCart.length > 0) {
                gOSP += filterGiftInCart[0].quantity;
              }

              if (infoGift.priority == true) {
                if (vIdGift != "not_gift") {
                  if (filterGiftInCart.length > 0) {
                    if (action == "plus") {
                      gOPR += filterGiftInCart[0].quantity;
                    } else {
                      gOPR +=
                        (filterGiftInCart[0].quantity * infoGift.count_buy) /
                        infoGift.count_gift;
                    }
                  } else {
                    giftExistInCart = false;
                  }
                }
                gCurrent = infoGift;
                gCurrent.vId = vIdGift;
              }
            });

            if (
              giftExistInCart == false &&
              action == "plus" &&
              gCurrent.vId != "not_gift"
            ) {
              qtyGift =
                ((qty - gOSP) / gCurrent.count_buy) * gCurrent.count_gift;
            }
          }

          cartGet.items.map((item, index) => {
            if (item.variant_id == vId) {
              updates[index] = qty;
            } else {
              if (
                item.promotionby.length > 0 &&
                item.promotionby[0].product_id == pId
              ) {
                if (gCurrent != null) {
                  if (
                    gCurrent.priority == true &&
                    gCurrent.vId != "not_gift" &&
                    gCurrent.vId == item.variant_id
                  ) {
                    var haohut = qty - (gOSP + gOPR);
                    qtyGift =
                      ((item.quantity + haohut) / gCurrent.count_buy) *
                      gCurrent.count_gift;
                    updates[index] = qtyGift;
                  } else {
                    updates[index] = item.quantity;
                  }
                }
              } else {
                updates[index] = item.quantity;
              }
            }
          });

          dataPost = {
            "updates[]": updates,
          };
        }

        var params = {
          type: "POST",
          url: "/cart/update.js",
          data: dataPost,
          async: false,
          dataType: "json",
          success: function (data) {
            if (old_promotion_variant_id !== undefined) {
              if (giftExistInCart) {
                window.location.reload();
              } else {
                $.post(
                  "/cart/add.js",
                  "id=" + gCurrent.vId + "&quantity=" + qtyGift
                ).done(function () {
                  window.location.reload();
                });
              }
            } else {
              window.location.reload();
            }
          },
          error: function (XMLHttpRequest, textStatus) {
            Haravan.onError(XMLHttpRequest, textStatus);
          },
        };
        jQuery.ajax(params);
      } else {
      }
    } else {
      var params = {
        type: "POST",
        url: "/cart/update.js",
        data: $("#cartformpage").serialize(),
        async: false,
        dataType: "json",
        success: function (data) {
          cartItem = {};
          cartGet = data;

          $.each(data.items, function (i, v) {
            var id = v.variant_id;
            cartItem[v.variant_id] = v.quantity;
            $(".table-cart .line-item:eq(" + i + ") .line-item-total").html(
              Haravan.formatMoney(v.line_price, formatMoney)
            );
          });

          $(".summary-total span").html(
            Haravan.formatMoney(data.total_price, formatMoney)
          );
          $(".cart-total-price").html(
            Haravan.formatMoney(data.total_price, formatMoney)
          );
          $(".total_price").html(
            Haravan.formatMoney(data.total_price, formatMoney)
          );
          $(".count-cart").html(data.item_count + " sản phẩm");
          $(".count-holder .count").html(data.item_count);
          setTimeout(function () {
            $(".cart-ajloading").hide();
          }, 400);
        },
        error: function (XMLHttpRequest, textStatus) {
          Haravan.onError(XMLHttpRequest, textStatus);
        },
      };
      jQuery.ajax(params);
    }
  },
  initQuantityCart: function () {
    $(document).on("click", ".qty-click .qtyplus", function (e) {
      e.preventDefault();
      $(this).parent(".quantity-partent").find(".qtyminus").removeClass("stop");
      var input = $(this).parent(".quantity-partent").find("input");
      var currentVal = parseInt(input.val());
      if (!isNaN(currentVal)) {
        input.val(currentVal + 1);
      } else {
        input.val(1);
      }
      var line = input.attr("line");
      var vId = input.attr("variantid");
      var pId = input.attr("productid");
      var currentQty = parseInt(input.val());
      HRT.Cart.updatePriceChange("plus", line, vId, pId, currentQty);
    });

    $(document).on("click", ".qty-click .qtyminus:not(.stop)", function (e) {
      e.preventDefault();
      var input = $(this).parent(".quantity-partent").find("input");
      var currentVal = parseInt(input.val());
      if (!isNaN(currentVal) && currentVal > 1) {
        input.val(currentVal - 1);
        if (currentVal - 1 == 1) $(this).addClass("stop");
      } else {
        input.val(1);
        $(this).addClass("stop");
      }

      var line = input.attr("line");
      var vId = input.attr("variantid");
      var pId = input.attr("productid");
      var currentQty = parseInt(input.val());
      HRT.Cart.updatePriceChange("minus", line, vId, pId, currentQty);
    });
  },
  removeItemCart: function (t, url) {
    var self = $(t);
    swal({
      text: "Bạn chắc chắn muốn bỏ sản phẩm này ra khỏi giỏ hàng?",
      buttons: ["Hủy", "Đồng ý"],
      className: "swal-cart-remove",
    }).then(function () {
      $("body").on("click", ".swal-button--confirm", function () {
        jQuery.ajax({
          type: "GET",
          url: url,
          dataType: "json",
          success: function (data) {
            var elItem = self.closest(".line-item");
            elItem.css("background-color", "#fcfcfc").fadeOut();
            setTimeout(function () {
              var elParentItem = elItem.parent();
              elItem.remove();
              var itemLength = elParentItem.find(".line-item").length;
              if (itemLength == 0) {
                elParentItem.remove();
              }
            }, 200);
            window.location.reload();
            /*	if (data.item_count == 0) {
							window.location.href = '/';
							return;
						}	else{}*/
          },
          error: function (erorr) {
            console.log(error);
          },
        });
      });
    });
  },

  checkTimeExist: function () {
    $.when($.get("/cart.js")).then(function (result) {
      if (result != null && result.attributes.hasOwnProperty("Delivery Time")) {
        var now = new Date().getTime();
        var txtNow = $("#picktime_radio label[for='timeRadios-1']").text();
        if (result.attributes["Delivery Time"] == txtNow) {
          var maxExist =
            dateNowJs + " " + $("#picktime_radio").attr("data-time-start");
          maxExist = new Date(maxExist).getTime();
        } else {
          var dataTime = result.attributes["Delivery Time"].split(" ");
          var maxExist =
            dataTime[0].split("/").reverse().join("/") +
            " " +
            dataTime[dataTime.length - 1] +
            ":00";
          maxExist = new Date(maxExist).getTime();
        }
        if (now > maxExist || maxExist - now < 45 * 60 * 1000) {
          $(".txt-time span").html("Chọn thời gian");
          //delete result.attributes['Delivery Time'];
          result.attributes["Delivery Time"] = null;
          $.post("/cart/update.js", { attributes: result.attributes }).done(
            function (cart) {
              cartGet = cart;
            }
          );
        }
      }
    });
  },
  checkTimeAvailable: function (time) {
    var countDisable = 0;
    var rangeTime = $("#time_shipping option").length;
    /* Check trong ngày từ 8h đến 21h */
    var stillAvailable = true;
    /* Nếu nhập giờ bắt đầu ko nhận đơn và giờ bắt đầu mở cửa */
    var startStop = (endStop = null);

    if (
      $("#picktime_radio").attr("data-time-end") != "" &&
      $("#picktime_radio").attr("data-time-start") != ""
    ) {
      //debugger;
      var dataStart = Number(
        $("#picktime_radio").attr("data-time-start").replace(/\:/g, "")
      );
      var dataEnd = Number(
        $("#picktime_radio").attr("data-time-end").replace(/\:/g, "")
      );
      startStop = new Date(
        dateNowJs + " " + $("#picktime_radio").attr("data-time-start")
      ).getTime();
      endStop =
        new Date(
          dateNowJs + " " + $("#picktime_radio").attr("data-time-end")
        ).getTime() + (dataStart > dataEnd ? 84600000 : 0);
      if (dataStart < dataEnd) {
        if (time > startStop && time <= endStop) stillAvailable = false;
      } else {
        if (startStop < endStop && time <= endStop) stillAvailable = false;
      }
    }

    var timeOpenWork = 0;
    var newChange = false;
    $("#time_shipping option").each(function (j, t) {
      var min_time = new Date(dateNowJs + " " + $(this).attr("data-min"));
      var max_time = new Date(dateNowJs + " " + $(this).attr("data-max"));
      min_time = min_time.getTime();
      max_time = max_time.getTime();
      if (j == 0) timeOpenWork = min_time;

      var checkLimitTime = false;
      //debugger;
      if (startStop != null && endStop != null) {
        if (dataStart < dataEnd) {
          if (max_time <= endStop) checkLimitTime = true;
        } else {
          //if((min_time >= startStop && time <= endStop) || time < timeOpenWork) checkLimitTime = true;
          if ((min_time >= startStop && time <= endStop) || time < timeOpenWork)
            checkLimitTime = true;
        }
      }

      if (
        time > max_time ||
        (max_time > time &&
          time > min_time &&
          max_time - time < 45 * 60 * 1000) ||
        checkLimitTime
      ) {
        $(this).attr("disabled", true);
        countDisable++;
      } else {
        if (newChange == false) {
          $("#time_shipping").val($(this).attr("value")).change();
          newChange = true;
        }
      }
    });

    if (countDisable == rangeTime)
      $("#btn-cart-accepttime").attr("disabled", true).addClass("disabled");
    if (stillAvailable == false)
      $("#btnCart-checkout")
        .addClass("btntime-disable")
        .html("Đã ngưng nhận đơn hôm nay");
  },
  initTimeCart: function () {
    var now = new Date();
    var nowObj = {
      date: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
    dateNow =
      (nowObj.month < 10 ? "0" + nowObj.month : nowObj.month) +
      "/" +
      (nowObj.date < 10 ? "0" + nowObj.date : nowObj.date) +
      "/" +
      nowObj.year;
    dateNowVN =
      (nowObj.date < 10 ? "0" + nowObj.date : nowObj.date) +
      "/" +
      (nowObj.month < 10 ? "0" + nowObj.month : nowObj.month) +
      "/" +
      nowObj.year;
    dateNowJs =
      nowObj.year +
      "/" +
      (nowObj.month < 10 ? "0" + nowObj.month : nowObj.month) +
      "/" +
      (nowObj.date < 10 ? "0" + nowObj.date : nowObj.date);
    var time = now.getTime();
    var date1 = new Date(time + 86400000);
    var date2 = new Date(time + 2 * 86400000);
    date1 = {
      date: date1.getDate(),
      month: date1.getMonth() + 1,
      year: date1.getFullYear(),
    };
    date2 = {
      date: date2.getDate(),
      month: date2.getMonth() + 1,
      year: date2.getFullYear(),
    };
    var date1Text =
      (date1.date < 10 ? "0" + date1.date : date1.date) +
      "/" +
      (date1.month < 10 ? "0" + date1.month : date1.month) +
      "/" +
      date1.year;
    var date2Text =
      (date2.date < 10 ? "0" + date2.date : date2.date) +
      "/" +
      (date2.month < 10 ? "0" + date2.month : date2.month) +
      "/" +
      date2.year;
    var htmlDate =
      '<option value="' + date1Text + '">' + date1Text + "</option>";
    htmlDate += '<option value="' + date2Text + '">' + date2Text + "</option>";
    $("#date_shipping").append(htmlDate);
    this.checkTimeAvailable(time);
  },
  pickOptionTime: function () {
    var that = this;
    $("#picktime_radio input[name='timeRadios']").on("change", function () {
      if ($("#picktime_radio input[name='timeRadios']:checked").length == 0) {
        //$(".side-cart--time").addClass('js-opacity-time');
      } else {
        //$(".side-cart--time").removeClass('js-opacity-time');
        if (
          $("#picktime_radio input[name='timeRadios']:checked").val() ==
          "timeNow"
        ) {
          $(".picktime_selecter").slideUp(300);
          $(".boxtime-title .txt-time span").html(
            $("#picktime_radio label[for='timeRadios-1']").text()
          );

          var startStop = (endStop = null);
          var stillAvailable = true;

          var now = new Date().getTime();
          if (
            $("#picktime_radio").attr("data-time-end") != "" &&
            $("#picktime_radio").attr("data-time-start") != ""
          ) {
            var dataStart = Number(
              $("#picktime_radio").attr("data-time-start").replace(/\:/g, "")
            );
            var dataEnd = Number(
              $("#picktime_radio").attr("data-time-end").replace(/\:/g, "")
            );
            endStop =
              new Date(
                dateNowJs + " " + $("#picktime_radio").attr("data-time-end")
              ).getTime() + (dataStart > dataEnd ? 84600000 : 0);
            startStop = new Date(
              dateNowJs + " " + $("#picktime_radio").attr("data-time-start")
            ).getTime();
            if (dataStart < dataEnd) {
              if (now > startStop && now <= endStop) stillAvailable = false;
            } else {
              if (startStop < endStop && now <= endStop) stillAvailable = false;
            }
            //if(now > startStop && now <= endStop) stillAvailable = false;
          }

          if (startStop != null && endStop != null) {
            if (stillAvailable == false) {
              $("#btnCart-checkout")
                .addClass("btntime-disable")
                .html("Đã ngưng nhận đơn hôm nay");
            } else {
              cartGet.attributes["Delivery Time"] = $(
                "#picktime_radio label[for='timeRadios-1']"
              ).text();
              $.post("/cart/update.js", {
                attributes: cartGet.attributes,
              }).done(function (cart) {
                cartGet = cart;
                cartAttributes = cart.attributes;
                if (cart.total_price > 0)
                  $("#btnCart-checkout")
                    .removeClass("btntime-disable")
                    .html("Thanh toán");
              });
            }
          } else {
            cartGet.attributes["Delivery Time"] = $(
              "#picktime_radio label[for='timeRadios-1']"
            ).text();
            $.post("/cart/update.js", { attributes: cartGet.attributes }).done(
              function (cart) {
                cartGet = cart;
                cartAttributes = cart.attributes;
                if (cart.total_price > 0)
                  $("#btnCart-checkout")
                    .removeClass("btntime-disable")
                    .html("Thanh toán");
              }
            );
          }
        } else if (
          $("#picktime_radio input[name='timeRadios']:checked").val() ==
          "timeDate"
        ) {
          $(".picktime_selecter").slideDown(300);
        }
      }
    });

    $("#date_shipping").on("change", function () {
      var dateOrder = $(this).val();
      if (dateNowVN == dateOrder) {
        var now = new Date();
        var time = now.getTime();
        that.checkTimeAvailable(time);
      } else {
        $("#time_shipping option").removeAttr("disabled");
        $("#btn-cart-accepttime")
          .removeAttr("disabled")
          .removeClass("disabled");
        $("#btnCart-checkout")
          .removeClass("btntime-disable")
          .html("Thanh toán");
      }
    });

    $("#btn-cart-accepttime").on("click", function (e) {
      e.preventDefault();
      var time = $("#picktime_radio label[for='timeRadios-1']").text();
      if (
        $("#picktime_radio input[name='timeRadios']:checked").val() ==
        "timeDate"
      ) {
        time = $("#date_shipping").val() + " " + $("#time_shipping").val();
        cartGet.attributes["Delivery Time"] = time;
      }
      $(".boxtime-title .txt-time span").html(time);
      $(".picktime_selecter").slideUp(300);
      $("#picktime_radio input[value='timeDate']").prop("checked", false);
      $.post("/cart/update.js", { attributes: cartGet.attributes }).done(
        function (cart) {
          cartGet = cart;
          cartAttributes = cart.attributes;
          //debugger;
          $("#btnCart-checkout")
            .removeClass("btntime-disable")
            .html("Thanh toán");
        }
      );
    });
  },

  clickCheckoutCart: function () {
    $(document).on("click", "#btnCart-checkout:not(.disabled)", function (e) {
      e.preventDefault();
      var updateNote = $("#note").val();
      var total_price = Number(
        $(".summary-total span").html().replace(/\,/g, "").replace("₫", "")
      );
      var a = $(this);

      if (Number(priceMin) <= total_price) {
        $(".summary-alert").removeClass("inn").slideUp("200");
        if ($("#checkbox-bill").is(":checked")) {
          var a = $(this);
          swal({
            title: "Bạn có muốn xuất hóa đơn?",
            text: "Hãy kiểm tra lại thông tin hóa đơn của mình thật chính xác!",
            icon: "warning",
            buttons: ["Không", "Có"],
            className: "swal-cart-checkInvoice",
          }).then(function () {
            $("body").on("click", ".swal-button--confirm", function () {
              var f = true;
              $("#cartformpage .val-f").each(function () {
                if ($(this).val() === "") {
                  f = false;
                  if ($(this).siblings("span.text-danger").length == 0)
                    $(this).after(
                      '<span class="text-danger">Bạn không được để trống trường này</span>'
                    );
                } else {
                  $(this).siblings("span.text-danger").remove();
                }
                if (
                  $(this).hasClass("val-n") &&
                  $(this).val().trim().length < 10
                ) {
                  f = false;
                  if ($(this).siblings("span.text-danger").length == 0)
                    $(this).after(
                      '<span class="text-danger">Mã số thuế phải tối thiểu 10 ký tự</span>'
                    );
                }
                if (
                  $(this).hasClass("val-mail") &&
                  HRT.All.checkemail($(this).val()) == false
                ) {
                  if ($(this).siblings("span.text-danger").length == 0)
                    $(this).after(
                      '<span class="text-danger">Email không hợp lệ</span>'
                    );
                }
              });

              if (f) {
                var company = $(
                  'input[name="attributes[bill_order_company]"]'
                ).val();
                var address = $(
                  'input[name="attributes[bill_order_address]"]'
                ).val();
                var tax = $(
                  'input[name="attributes[bill_order_tax_code]"]'
                ).val();
                var mail = $('input[name="attributes[bill_email]"]').val();
                //var cart_info = {'company':company, 'address': address, 'tax':tax};
                //Cookies.set('cart_info', cart_info);
                //a.unbind(e).click();
                cartAttributes.invoice = "yes";
                if (
                  company == "" &&
                  cartAttributes.hasOwnProperty("bill_order_company")
                ) {
                  cartAttributes.bill_order_company = null;
                } else {
                  cartAttributes.bill_order_company = company;
                }

                if (
                  address == "" &&
                  cartAttributes.hasOwnProperty("bill_order_address")
                ) {
                  cartAttributes.bill_order_address = null;
                } else {
                  cartAttributes.bill_order_address = address;
                }

                if (
                  tax == "" &&
                  cartAttributes.hasOwnProperty("bill_order_tax_code")
                ) {
                  cartAttributes.bill_order_tax_code = null;
                } else {
                  cartAttributes.bill_order_tax_code = tax;
                }

                if (mail == "" && cartAttributes.hasOwnProperty("bill_email")) {
                  cartAttributes.bill_email = null;
                } else {
                  cartAttributes.bill_email = mail;
                }

                $.ajax({
                  url: "/cart/update.js",
                  type: "POST",
                  data: {
                    attributes: cartAttributes,
                    note: updateNote,
                  },
                  success: function (data) {
                    window.location = "/checkout";
                  },
                });
              }
              if (!f) return false;
            });
            $("body").on("click", ".swal-button--cancel", function () {
              if (cartAttributes.hasOwnProperty("invoice"))
                cartAttributes.invoice = "no";
              if (cartAttributes.hasOwnProperty("bill_order_company"))
                cartAttributes.bill_order_company = null;
              if (cartAttributes.hasOwnProperty("bill_order_address"))
                cartAttributes.bill_order_address = null;
              if (cartAttributes.hasOwnProperty("bill_order_tax_code"))
                cartAttributes.bill_order_tax_code = null;
              if (cartAttributes.hasOwnProperty("bill_email"))
                cartAttributes.bill_email = null;

              $.ajax({
                url: "/cart/update.js",
                type: "POST",
                data: {
                  attributes: cartAttributes,
                  note: updateNote,
                },
                success: function (data) {
                  window.location = "/checkout";
                },
              });
            });
          });
        } else {
          if (cartAttributes.hasOwnProperty("invoice"))
            cartAttributes.invoice = "no";
          if (cartAttributes.hasOwnProperty("bill_order_company"))
            cartAttributes.bill_order_company = null;
          if (cartAttributes.hasOwnProperty("bill_order_address"))
            cartAttributes.bill_order_address = null;
          if (cartAttributes.hasOwnProperty("bill_order_tax_code"))
            cartAttributes.bill_order_tax_code = null;
          if (cartAttributes.hasOwnProperty("bill_email"))
            cartAttributes.bill_email = null;
          $.ajax({
            url: "/cart/update.js",
            type: "POST",
            data: {
              attributes: cartAttributes,
              note: updateNote,
            },
            success: function (data) {
              window.location = "/checkout";
            },
          });
        }
      } else {
        $(".summary-alert").addClass("inn").slideDown("200");
      }
    });
  },
  addCartSocial: function () {
    var href = window.location.href;
    if (href.indexOf("?add=") != -1) {
      var splitHref = href.split("?add=")[1];
      var variantId = parseInt($.trim(splitHref.split("&ref=")[0]));
      $.ajax({
        url: "/cart/" + variantId + ":1",
        success: function (data) {
          var x = false;
          if (data.items.length > 0) {
            data.items.map(function (v, i) {
              if (v.variant_id == variantId) {
                x = true;
              }
            });
          }
          if (!x) {
            alert("Sản phẩm bạn vừa mua đã hết hàng");
          }
          window.location = "/cart";
        },
        error: function (XMLHttpRequest, textStatus) {
          Haravan.onError(XMLHttpRequest, textStatus);
        },
      });
    }
  },

  clickCheckbill: function () {
    if ($(".order-invoice-block .regular-checkbox").is(":checked")) {
      $(".bill-field").show();
    }
    $("#cartformpage .regular-checkbox").click(function () {
      if ($(this).is(":checked")) {
        $(this).siblings("#re-checkbox-bill").val("yes");
      } else {
        $(this).siblings("#re-checkbox-bill").val("no");
        $("#cartformpage .val-f").siblings("span.text-danger").remove();
      }
      $("#cartformpage .bill-field").slideToggle(300);
    });
  },
  checkChangeInput: function () {
    $(".check_change").on("change paste keyup", function () {
      jQuery(".btn-save").html("Lưu thông tin");
    });
  },
  clickSaveInfoBill: function () {
    $(".order-invoice-block .btn-save").on("click", function (e) {
      e.preventDefault();
      $("#cartformpage .val-f").each(function () {
        if ($(this).val() === "") {
          if ($(this).siblings("span.text-danger").length == 0)
            $(this).after(
              '<span class="text-danger">Bạn không được để trống trường này</span>'
            );
        } else {
          $(this).siblings("span.text-danger").remove();
          setTimeout(function () {
            jQuery(".btn-save").html("Đã lưu thông tin");
          }, 500);
        }
        if ($(this).hasClass("val-n") && $(this).val().trim().length < 10) {
          if ($(this).siblings("span.text-danger").length == 0)
            $(this).after(
              '<span class="text-danger">Mã số thuế phải tối thiểu 10 ký tự</span>'
            );
        }

        if (
          $(this).hasClass("val-mail") &&
          HRT.All.checkemail($(this).val()) == false
        ) {
          if ($(this).siblings("span.text-danger").length == 0)
            $(this).after(
              '<span class="text-danger">Email không hợp lệ</span>'
            );
        }
      });
    });
  },

  sliderCoupon: function () {
    $("#sliderCouponCart").owlCarousel({
      items: 1,
      loop: false,
      nav: true,
      dots: false,
      dotsEach: true,
      smartSpeed: 1000,
      navText: [
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path xmlns="http://www.w3.org/2000/svg" d="m22.707 11.293-7-7a1 1 0 0 0 -1.414 1.414l5.293 5.293h-17.586a1 1 0 0 0 0 2h17.586l-5.293 5.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414z" data-original="#000000" class=""></path></g></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path xmlns="http://www.w3.org/2000/svg" d="m22.707 11.293-7-7a1 1 0 0 0 -1.414 1.414l5.293 5.293h-17.586a1 1 0 0 0 0 2h17.586l-5.293 5.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414z" data-original="#000000" class=""></path></g></svg>',
      ],
      responsive: {
        0: {
          stagePadding: 20,
        },
        768: {
          items: 2,
          nav: true,
          touchDrag: false,
          mouseDrag: false,
        },
        992: {
          items: 1,
        },
      },
      onChanged: function (event) {
        setTimeout(function () {
          $("#sliderCouponCart")
            .find(".owl-dots button")
            .each(function (index) {
              $(this).attr("aria-label", index + 1);
            });
        }, 400);
      },
    });
  },
};

HRT.Article = {
  init: function () {
    this.tbOfContentsArt();
    this.sliderRelatedBlog();
  },
  tbOfContentsArt: function () {
    if ($(".article-table-contents").length > 0) {
      function urlfriendly(slug) {
        //Đổi chữ hoa thành chữ thường
        //Đổi ký tự có dấu thành không dấu
        slug = slug.toLowerCase();
        slug = slug.trim().replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
        slug = slug.replace(/đ/gi, "d");
        //Xóa các ký tự đặt biệt
        slug = slug.replace(
          /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
          "_"
        );
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "_");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, "_");
        slug = slug.replace(/\-\-\-\-/gi, "_");
        slug = slug.replace(/\-\-\-/gi, "_");
        slug = slug.replace(/\-\-/gi, "_");
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = "@" + slug + "@";
        slug = slug.replace(/\@\-|\-\@|\@/gi, "");
        //In slug ra textbox có id “slug”
        return slug;
      }
      class TableOfContents {
        constructor({ from, to }) {
          this.fromElement = from;
          this.toElement = to;
          // Get all the ordered headings.
          this.headingElements = this.fromElement.querySelectorAll(
            "h1, h2, h3,h4,h5,h6"
          );
          this.tocElement = document.createElement("div");
        }
        /*  Get the most important heading level.
        For example if the article has only <h2>, <h3> and <h4> tags
        this method will return 2.
     */
        getMostImportantHeadingLevel() {
          let mostImportantHeadingLevel = 6; // <h6> heading level
          for (let i = 0; i < this.headingElements.length; i++) {
            let headingLevel = TableOfContents.getHeadingLevel(
              this.headingElements[i]
            );
            mostImportantHeadingLevel =
              headingLevel < mostImportantHeadingLevel
                ? headingLevel
                : mostImportantHeadingLevel;
          }
          return mostImportantHeadingLevel;
        }
        static generateId(headingElement) {
          return urlfriendly(headingElement.textContent);
        }
        static getHeadingLevel(headingElement) {
          switch (headingElement.tagName.toLowerCase()) {
            case "h2":
              return 2;
            case "h3":
              return 3;
              break;
            default:
              return 4;
          }
        }
        generateTable() {
          let currentLevel = this.getMostImportantHeadingLevel() - 1,
            currentElement = this.tocElement;
          for (let i = 0; i < this.headingElements.length; i++) {
            let headingElement = this.headingElements[i],
              headingLevel = TableOfContents.getHeadingLevel(headingElement),
              headingLevelDifference = headingLevel - currentLevel,
              linkElement = document.createElement("a");
            if (!headingElement.id) {
              headingElement.id = TableOfContents.generateId(headingElement);
            }
            linkElement.href = `#${headingElement.id}`;
            linkElement.textContent = headingElement.textContent;

            if (headingLevelDifference > 0) {
              // Go down the DOM by adding list elements.
              for (let j = 0; j < headingLevelDifference; j++) {
                let listElement = document.createElement("ul"),
                  listItemElement = document.createElement("li");
                listElement.appendChild(listItemElement);
                currentElement.appendChild(listElement);
                currentElement = listItemElement;
              }
              currentElement.appendChild(linkElement);
            } else {
              // Go up the DOM.
              for (let j = 0; j < -headingLevelDifference; j++) {
                currentElement = currentElement.parentNode.parentNode;
              }
              let listItemElement = document.createElement("li");
              listItemElement.appendChild(linkElement);
              currentElement.parentNode.appendChild(listItemElement);
              currentElement = listItemElement;
            }
            currentLevel = headingLevel;
          }
          if (this.tocElement.firstChild != null) {
            this.toElement.appendChild(this.tocElement.firstChild);
          } else {
            document.getElementById("table-content-container").remove();
          }
        }
      }
      (function ($) {
        var stringtemplate = $(
          '<div id="table-content-container" class="table-of-contents"><div class="table-title"><div class="htitle">Các nội dung chính<span class="toc_toggle">[<a class="icon-list" href="javascript:void(0)">Ẩn</a>]</span></div></div></div>'
        );
        stringtemplate.insertBefore(".article-table-contents");

        new TableOfContents({
          from: document.querySelector(".article-table-contents"),
          to: document.querySelector("#table-content-container"),
        }).generateTable();
        $("#table-content-container .icon-list").click(function () {
          $(this)
            .parents("#table-content-container")
            .find("ul:first")
            .slideToggle({ direction: "left" }, 100);
          var texxx = $(this).text();
          if (texxx == "Ẩn") {
            $(this).html("Hiện");
          } else {
            $(this).html("Ẩn");
          }
        });

        var buttontable =
          '<div class="table-content-button"><button class="btn-icolist"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.994 511.994"><path d="M35.537 292.17l-.225-.863 14.613-15.857c9.495-10.333 16.006-18.227 19.544-23.47s5.3-11.326 5.3-18.148c0-10.135-3.326-18.146-9.974-23.984-6.65-5.83-15.9-8.76-27.775-8.76-11.174 0-20.15 3.467-26.923 10.412S.06 226.807.3 236.795l.15.34 24.473.002c0-4.403 1.076-8.9 3.227-12.097s5.105-4.73 8.863-4.73c4.202 0 7.355 1.26 9.457 3.73s3.152 5.8 3.152 9.955c0 2.917-1.04 6.36-3.115 10.313s-5.72 8.458-10.122 13.5L1.28 294.304v15.478h74.847v-17.6h-40.6zM51.9 127.068V37.72L1.28 45.283v17.945h24.215v63.84H1.28v19.812h74.846v-19.812zm21.156 299.964c-3.265-4.33-7.8-7.542-13.574-9.668 5.092-2.325 9.16-5.55 12.2-9.677s4.56-8.643 4.56-13.534c0-9.84-3.5-17.442-10.53-22.806s-16.4-8.046-28.1-8.046c-10.087 0-18.665 2.67-25.736 8S1.418 384.007 1.716 392.6l.15.83h24.327c0-4.403 1.233-5.774 3.707-7.654s5.34-3 8.603-3c4.154 0 7.317 1.065 9.495 3.4s3.262 5.142 3.262 8.555c0 4.3-1.2 7.868-3.632 10.3s-5.884 3.837-10.384 3.837h-11.75v17.6h11.75c4.995 0 8.863 1.475 11.608 3.872s4.117 6.358 4.117 11.597c0 3.76-1.312 6.943-3.93 9.415s-6.133 3.74-10.534 3.74c-3.857 0-7.13-1.662-9.827-4s-4.042-4.803-4.042-9.206H.16l-.147.95c-.247 10.087 3.423 18.042 11.013 23.357s16.453 8.1 26.588 8.1c11.77 0 21.435-2.765 29-8.427S77.96 452.44 77.96 442.55c0-6.033-1.63-11.195-4.894-15.523zm75.7-64.426h363.227v72.645H148.767zm0-143.09h363.227v72.645H148.767zm0-147.483h363.227v72.645H148.767z"></path></svg></button> </div><div class="table-content-fixed"><div class="table-of-header"><span class="hTitle"> Các nội dung chính</span><span class="hClose"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M284.286 256.002L506.143 34.144c7.81-7.81 7.81-20.475 0-28.285s-20.475-7.81-28.285 0L256 227.717 34.143 5.86c-7.81-7.81-20.475-7.81-28.285 0s-7.81 20.475 0 28.285L227.715 256 5.858 477.86c-7.81 7.81-7.81 20.475 0 28.285C9.763 510.05 14.882 512 20 512a19.94 19.94 0 0 0 14.143-5.857L256 284.287l221.857 221.857C481.762 510.05 486.88 512 492 512a19.94 19.94 0 0 0 14.143-5.857c7.81-7.81 7.81-20.475 0-28.285L284.286 256.002z"></path></svg></span></div><div id="clone-table" class="table-of-contents"></div></div>';
        $("#article")
          .append(buttontable)
          .ready(function () {
            var tablehtml = $("#table-content-container").html();
            $("#clone-table").html(tablehtml);
          });
      })(jQuery);

      $("body").on(
        "click",
        "#table-content-container ul li a, #clone-table  ul li a",
        function (e) {
          e.preventDefault();
          var id = $(this).attr("href");
          $("html,body").animate({ scrollTop: $(id).offset().top - 70 }, 600);
          $(".table-content-fixed").removeClass("active");
        }
      );
      $(".table-content-button .btn-icolist").on("click", function (e) {
        $(".table-content-fixed").toggleClass("active");
      });
      $(".table-content-fixed .table-of-header .hClose").on(
        "click",
        function (e) {
          $(".table-content-fixed").toggleClass("active");
        }
      );
      if ($("#table-content-container").length > 0) {
        var ofsettop_ = $(".article-table-contents").offset().top - 300;
        $(window).scroll(function () {
          if ($(window).scrollTop() > ofsettop_) {
            $(".table-content-button").addClass("active");
          } else {
            $(".table-content-button").removeClass("active");
            $(".table-content-fixed").removeClass("active");
          }
        });
      }
    }
  },
  sliderRelatedBlog: function () {
    $(".list-blogs-related.owl-carousel").owlCarousel({
      items: 3,
      nav: true,
      dots: false,
      loop: false,
      margin: 30,
      smartSpeed: 1200,
      autoplayTimeout: 1500,
      navText: [themeAssets.arrowRight, themeAssets.arrowRight],
      responsive: {
        0: {
          items: 2,
          margin: 0,
          stagePadding: 30,
        },
        768: {
          items: 3,
          margin: 15,
        },
        992: {
          items: 3,
          margin: 15,
        },
        1200: {
          items: 3,
          touchDrag:
            $(".list-blogs-related.owl-carousel").length > 3 ? true : false,
          mouseDrag:
            $(".list-blogs-related.owl-carousel").length > 3 ? true : false,
        },
      },
    });
  },
};

HRT.Blog = {
  init: function () {
    var that = this;
  },
};

var lengthTab = $("#collection-navtabs-title li").length;
HRT.Ldpage01 = {
  currentPag: Array(lengthTab).fill(1),
  totalPag: Array(lengthTab).fill(null),
  init: function () {
    this.collectionTabsFlashSale();
    this.countdownBook();
    this.copyCodeBookFlashSale();
    this.fixHeightCollectionTabs();
    this.popoverCoupon();
  },

  scrollCenterFlashSale: function (parent, elem, speed) {
    var active = jQuery(parent).find(elem);
    var activeWidth = active.width() / 2;
    var pos = jQuery(parent).find(elem).position().left + activeWidth;
    var elpos = jQuery(parent).scrollLeft();
    var elW = jQuery(parent).width();
    pos = pos + elpos - elW / 2;
    jQuery(parent).animate(
      {
        scrollLeft: pos,
      },
      speed == undefined ? 1000 : speed
    );
    return this;
  },
  collectionTabsFlashSale: function () {
    var total_page = 0; //Tổng trang
    //var isloading = false;
    var html_loadmore =
      '<a class="button dark btn-loadmore" href="javascript:void(0);">Xem thêm sản phẩm</a>';

    $(".wrapper-ldpage-collection").each(function () {
      var currentHandle = $(this).find("li.active a").attr("data-handle");
      var sectionCurrent = $(this);
      $(this)
        .find('#collection-navtabs-title a[data-toggle="tab"]')
        .on("shown.bs.tab", function (event) {
          var handle = jQuery(this).attr("data-handle");
          var indexTab = Number(
            $(this).attr("href").replace("#collection-tabs-", "")
          );
          sectionCurrent
            .find(".collection-navtabs-title li a[data-toggle='tab']")
            .parent()
            .removeClass("active");
          $(this).parent().addClass("active");
          //jQuery('#collection-tabs-ajax .tab-pane.active').find('.icon-loading.tab-index').show();
          if (jQuery(window).width() < 768) {
            var $parentScroll = sectionCurrent.find(
              ".collection-navtabs-title"
            );
            HRT.Ldpage01.scrollCenterFlashSale($parentScroll, ".active", 500);
          }
          if (
            sectionCurrent.find(
              "#collection-tabs-ajax .tab-pane.active .collection-listprod .product-loop-ldpage"
            ).length == 0
          ) {
            if (handle == "") {
              jQuery.ajax({
                url: "/collections/all?view=ldpage01-noproduct",
                success: function (data) {
                  //sectionCurrent.find('#collection-tabs-ajax .tab-pane.active .icon-loading.tab-index').hide();
                  sectionCurrent
                    .find(
                      "#collection-tabs-ajax .tab-pane.active .collection-loadmore"
                    )
                    .html("");
                  setTimeout(function () {
                    sectionCurrent
                      .find("#collection-tabs-ajax .tab-pane.active")
                      .attr("data-get", "true")
                      .find(".collection-listprod")
                      .html(data);
                    setTimeout(function () {
                      jQuery(window).resize();
                    }, 350);
                  }, 350);
                },
              });
              HRT.Ldpage01.totalPag[indexTab - 1] = null;
              HRT.Ldpage01.currentPag[indexTab - 1] = null;
            } else {
              currentHandle = handle;
              if (HRT.Ldpage01.totalPag[indexTab - 1] == null) {
                var cur_page = 1;
                HRT.Ldpage01.currentPag[indexTab - 1] = 1;
                sectionCurrent
                  .find(
                    "#collection-tabs-ajax .tab-pane.active .collection-loadmore"
                  )
                  .html(html_loadmore);
                jQuery.ajax({
                  // lấy tổng số trang của kết quả filter
                  url: currentHandle + "?view=ldpage01-pagesize",
                  async: false,
                  success: function (data) {
                    HRT.Ldpage01.totalPag[indexTab - 1] = parseInt(data);
                    total_page = HRT.Ldpage01.totalPag[indexTab - 1];
                  },
                });
                jQuery.ajax({
                  url: currentHandle + "?view=ldpage01-data&page=1",
                  success: function (data) {
                    //jQuery('.tab-pane.active .icon-loading.tab-index').hide();
                    setTimeout(function () {
                      sectionCurrent
                        .find("#collection-tabs-ajax .tab-pane.active")
                        .attr("data-get", "true")
                        .find(".collection-listprod")
                        .html(data);
                      if (total_page > 0) {
                        if (cur_page == total_page) {
                          sectionCurrent
                            .find(
                              "#collection-tabs-ajax .tab-pane.active .collection-loadmore"
                            )
                            .html("");
                        } else {
                          sectionCurrent
                            .find(
                              "#collection-tabs-ajax .tab-pane.active .collection-loadmore"
                            )
                            .html(html_loadmore);
                        }
                      } else {
                        sectionCurrent
                          .find(
                            "#collection-tabs-ajax .tab-pane.active .collection-loadmore"
                          )
                          .html("");
                      }
                      setTimeout(function () {
                        jQuery(window).resize();
                      }, 350);
                    }, 350);
                  },
                });
              }
            }
          }
        });
    });
    $(document).on(
      "click",
      ".collection-loadmore .btn-loadmore",
      function (event) {
        event.preventDefault();
        //var btn = $(this);
        var idTab = $(this).parents(".tab-pane").attr("id");
        var indexTab =
          Number(
            $(this)
              .parents(".tab-pane")
              .attr("id")
              .replace("collection-tabs-", "")
          ) - 1;
        var cur_page = HRT.Ldpage01.currentPag[indexTab];
        currentHandle = $(
          '.collection-navtabs-title a[href="#' + idTab + '"]'
        ).attr("data-handle");

        if (
          HRT.Ldpage01.totalPag[indexTab] == null ||
          HRT.Ldpage01.totalPag.length == 0
        ) {
          jQuery.ajax({
            // lấy tổng số trang của kết quả filter
            url: currentHandle + "?view=ldpage01-pagesize",
            async: false,
            success: function (data) {
              HRT.Ldpage01.totalPag[indexTab] = parseInt(data);
              total_page = HRT.Ldpage01.totalPag[indexTab];
            },
          });
        } else {
          total_page = HRT.Ldpage01.totalPag[indexTab];
        }
        cur_page++;
        HRT.Ldpage01.currentPag[indexTab] = cur_page;
        if (cur_page <= total_page) {
          $(this)
            .parents(".collection-loadmore")
            .html(
              '<a class="button dark btn-loadmore btn-loading" href="javascript:void(0);">Xem thêm sản phẩm...</a>'
            );
          jQuery.ajax({
            url: currentHandle + "?view=ldpage01-data&page=" + cur_page,
            success: function (data) {
              setTimeout(function () {
                $("#" + idTab)
                  .find(".collection-listprod")
                  .append(data);
                if (productReviewsApp && productReviewsProloop) {
                  ProductReviews.init();
                }
                if (promotionApp) {
                  if (promotionApp_name == "app_combo") {
                    comboApp.showGiftLabel();
                  } else {
                    buyXgetY.showGiftLabel();
                  }
                }
                if (total_page > 0) {
                  if (cur_page == total_page) {
                    $("#" + idTab)
                      .find(".collection-loadmore")
                      .html("");
                  } else {
                    $("#" + idTab)
                      .find(".collection-loadmore")
                      .html(html_loadmore);
                  }
                } else {
                  $("#" + idTab)
                    .find(".collection-loadmore")
                    .html("");
                }
              }, 400);
            },
          });
        } else {
          $("#" + idTab)
            .find("#collection-tabs-ajax .tab-pane.active .collection-loadmore")
            .html("");
        }
      }
    );
  },
  copyCodeBookFlashSale: function () {
    $(document).on("click", ".coupon-item .cpi-button", function (e) {
      e.preventDefault();
      $(".coupon-item .cpi-button").html("Sao chép mã").removeClass("disabled");
      var copyText = $(this).attr("data-coupon");
      var el = document.createElement("textarea");
      el.value = copyText;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      $(this).html("Đã sao chép").addClass("disabled");
    });
    $(document).on(
      "click",
      ".popover-content__coupon .btn-popover-code",
      function (e) {
        e.preventDefault();
        var btnPopover = $(this).attr("data-coupon");
        $(".coupon-item .cpi-button[data-coupon=" + btnPopover + "]").click();
        $(this).html("Đã sao chép").addClass("disabled");
      }
    );
    $(document).on("click", ".cpi-trigger", function (e) {
      e.preventDefault();
      var btnPopover = $(this).attr("data-coupon");
      $(".coupon-item .cpi-button[data-coupon=" + btnPopover + "]").click();
    });
  },
  popoverCoupon: function () {
    var popover = '.cpi-tooltip .cpi-tooltip__dot[data-toggle="popover"]';
    $(popover).popover({
      html: true,
      animation: true,
      sanitize: false,
      placement: function (popover, trigger) {
        var placement = jQuery(trigger).attr("data-placement");
        var dataClass = jQuery(trigger).attr("data-class");
        jQuery(trigger).addClass("is-active");
        jQuery(popover).addClass(dataClass);
        if (jQuery(trigger).offset().top - $(window).scrollTop() > 280) {
          return "top";
        }
        return placement;
      },
      content: function () {
        var elementId = $(this).attr("data-popover-content");
        return $(elementId).html();
      },
      delay: { show: 60, hide: 40 },
    });

    function eventPopover() {
      if ($(window).width() >= 768) {
        $(popover)
          .on("mouseenter", function () {
            var self = this;
            jQuery(this).popover("show");
            jQuery(".popover.coupon-popover").on("mouseleave", function () {
              jQuery(self).popover("hide");
            });
          })
          .on("mouseleave", function () {
            var self = this;
            setTimeout(function () {
              if (!jQuery(".popover.coupon-popover:hover").length) {
                jQuery(self).popover("hide");
              }
            }, 300);
          });
      } else {
        $(popover).off("mouseenter mouseleave");
      }
    }
    eventPopover();
    $(window).resize(function () {
      eventPopover();
    });
    $(popover)
      .popover()
      .on("hide.bs.popover", function () {
        $(".modal-coupon--backdrop").removeClass("js-modal-show");
      });
    $(popover)
      .popover()
      .on("show.bs.popover", function () {
        $(".modal-coupon--backdrop").addClass("js-modal-show");
      });
    $(popover)
      .popover()
      .on("shown.bs.popover", function () {
        $(".btn-popover-close,.modal-coupon--backdrop").click(function () {
          $(popover).not(this).popover("hide");
          var $this = $(this);
          $this.popover("hide");
        });
      });
    $("body").on("hidden.bs.popover", function (e) {
      $(e.target).data("bs.popover").inState = {
        click: false,
        hover: false,
        focus: false,
      };
    });
  },

  countdownBook: function () {
    if ($(".flip-js-countdown").length > 0) {
      var element = document.getElementById("soon-espa");
      var time_start = $(".flip-js-countdown .auto-due").attr("data-start");
      var time_end = $(".flip-js-countdown .auto-due").attr("data-end");
      var beforeRun = new Date(time_start);
      beforeRun = beforeRun.getTime();
      var afterRun = new Date(time_end);
      afterRun = afterRun.getTime();
      var now = new Date();
      now = now.getTime();
      function tick(milliseconds, beforeRun) {
        if (milliseconds == 0) {
          $("#label-due").html("Ưu đãi kết thúc").removeClass("hidden");
        } else {
          $("#label-due").html("Sắp diễn ra:").removeClass("hidden");
        }
      }
      function tick2(milliseconds, afterRun) {
        if (milliseconds == 0) {
          $("#label-due").html("Ưu đãi kết thúc").removeClass("hidden");
        } else {
          $("#label-due").html("Kết thúc sau:").removeClass("hidden");
        }
      }
      function complete() {
        var today = new Date();
        var cdate = today.getTime();
        if (cdate < afterRun) {
          Soon.destroy(element);
          Soon.create(element, {
            due: time_end,
            now: null,
            layout: "group label-small",
            face: "flip color-light",
            format: "d,h,m,s",
            labelsYears: null,
            labelsDays: "Ngày",
            labelsHours: "Giờ",
            labelsMinutes: "Phút",
            labelsSeconds: "Giây",
            separateChars: false,
            scaleMax: "l",
            separator: "",
            singular: true,
            paddingDays: "00",
            eventTick: tick2,
            eventComplete: function () {
              //	$('.tabslist-product-countdown').hide();
            },
          });
        }
      }
      /*if(now < afterRun){}*/
      Soon.create(element, {
        due: time_start,
        now: null,
        layout: "group label-small",
        face: "flip color-light",
        format: "d,h,m,s",
        labelsYears: null,
        labelsDays: "Ngày",
        labelsHours: "Giờ",
        labelsMinutes: "Phút",
        labelsSeconds: "Giây",
        separateChars: false,
        scaleMax: "l",
        separator: "",
        paddingDays: "00",
        singular: true,
        eventTick: tick,
        eventComplete: complete,
      });
    }
  },
  fixHeightCollectionTabs: function () {
    var windowWidth = $(window).outerWidth();
    $(document).on("lazyloaded", function (e) {
      HRT.All.fixHeightProduct(
        "#collection-tabs-ajax .tab-pane.active .collection-listprod",
        ".product-resize",
        ".image-resize"
      );
      jQuery(window).resize(function () {
        setTimeout(function () {
          var oldWindowWidth = $(window).prop("innerWidth");
          if (oldWindowWidth != windowWidth) {
            HRT.All.fixHeightProduct(
              "#collection-tabs-ajax .tab-pane.active .collection-listprod",
              ".product-resize",
              ".image-resize"
            );
            oldWindowWidth = windowWidth;
          }
        }, 500);
      });
    });
  },
};

jQuery(document).ready(function () {
  HRT.All.checkCart();
  HRT.init();

  $(".header-action_search .header-action__link").click(function (e) {
    e.preventDefault();
    if ($(this).parents(".header-wrap-action").hasClass("show-search")) {
      $(this).parents(".mainHeader-middle").removeClass("header-is-search");
      $(this).parents(".mainHeader-middle").find(".header-wrap-search").hide();
      $(this).parents(".header-wrap-action").removeClass("show-search");
      $("body").removeClass("noscroll");
    } else {
      $(this)
        .parents(".mainHeader-middle")
        .find(".header-wrap-search")
        .fadeIn(100);
      $(this).parents(".mainHeader-middle").addClass("header-is-search");
      $(this).parents(".header-wrap-action").addClass("show-search");
      $("body").addClass("noscroll");
      setTimeout(function () {
        //	$('.mainHeader-middle .header-wrap-search .input-search').trigger("focus");
        //$('.mainHeader-middle .header-wrap-search .input-search').trigger("tap");
        //	$('.mainHeader-middle .header-wrap-search .input-search').trigger("focus");
        $(".mainHeader-middle .header-wrap-search .input-search").trigger(
          "click"
        );
      }, 200);
    }
  });
});
