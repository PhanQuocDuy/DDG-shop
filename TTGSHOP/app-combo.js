(function($){
	var appUrl = 'https://combo-omni.haravan.com';
	function _call(method, path, data, successcallback, errorcallback, alwayscallback) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, appUrl + path);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.onload = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				if (Object.prototype.toString.call(successcallback) === '[object Function]') successcallback(JSON.parse(xhr.responseText));
			} else {
				if (Object.prototype.toString.call(errorcallback) === '[object Function]') errorcallback();
			}
		};
		xhr.onloadend = function() {
			if (Object.prototype.toString.call(alwayscallback) === '[object Function]') alwayscallback();
		};
		xhr.send(data);
	};
	function checkRecommendeds(product_id, successcallback, errorcallback, alwayscallback) {
		if (Object.prototype.toString.call(product_id) === '[object Array]') _call('GET', '/js/check_list_recommendeds?product_ids=' + product_id, {}, successcallback, errorcallback, alwayscallback);
	};
	comboApp = {
		checkCombo: false,
		init: function(idProduct, idTitle){
			window.HaravanPromotionAsyncInit = function() {
				comboApp.showGiftLabel();
			}
			var self = this;
			if(typeof idProduct != 'undefined' && idProduct != '' && idProduct != null ){

				self.comboCall('GET', 'https://combo-omni.haravan.com/js/list_recommendeds?product_id=' + idProduct, {}, function(data){
					// success
					if(data.length > 0){
						self.checkCombo = true;
						self.comboRender(data, idProduct, idTitle);
					}
				}, function(){
					//error
				}, function(){
					//always
				});
			}
		},
		comboCall: function(method, path, data, successcallback, errorcallback, alwayscallback){
			var xhr = new XMLHttpRequest();
			xhr.open(method, path);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					if (Object.prototype.toString.call(successcallback) === '[object Function]') successcallback(JSON.parse(xhr.responseText));
				}
				else {
					if (Object.prototype.toString.call(errorcallback) === '[object Function]') errorcallback();
				}
			};
			xhr.onloadend = function () {
				if (Object.prototype.toString.call(alwayscallback) === '[object Function]') alwayscallback();
			};
			xhr.send(data);
		},
		comboRender: function(result, id, title){
			var giftHtml = '';
			var titleHtml = '';
			$.each(result, function(key, value){
				var noti = '';
				var itemCombo = '';
				$.each(value.recommendeds, function(i,v){
					noti += '<span> <b>'+v.quantity +'</b></span><span> '+ (v.product_name).split('|')[0]+'</span> +';
				});
				$.each(value.recommendeds, function(i,v){
					var typeHtml = '';
					var xprice = 0;
					var imm = "https://hstatic.net/0/0/global/noDefaultImage6_large.gif";
					var variant = null;
					var pid = null;
					var is_none_promotion = v.none_promotion;
					var is_apply_variant = v.is_apply_by_variant;//Thêm 

					$.ajax({
						type: 'GET',
						url: v.product_url+'.js',
						dataType: 'json',
						async: false,
						success:function(response){
							xprice = parseInt(response.price)/100;
							imm = (response.featured_image != null)?Haravan.resizeImage(response.featured_image, 'small'):'https://hstatic.net/0/0/global/noDefaultImage6_large.gif';
							variant = is_apply_variant?v.apply_productvariants[0].id :response.variants[0].id; //Fix
							pid = response.id;
						}
					});

					if(is_none_promotion == false){
						if(v.type === 1 ){
							var fixedPrice = xprice - v.promotion_value;
						}
						else{
							if(v.type == 4){
								fixedPrice = v.promotion_value;
							}
							else{
								var fixedPrice = (xprice*(100-v.promotion_value))/100;
							}
						}
						if(fixedPrice == xprice){
							typeHtml += "<p><b>"+ (v.product_name).split('|')[0] + "</b></p><p class='discount-promotion-price'><b>"+(fixedPrice).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "₫"+"</b></p>";
						}
						else{
							typeHtml += "<p><b>"+ (v.product_name).split('|')[0] + "</b></p><p class='discount-promotion-price'><b>"+(fixedPrice).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "₫"+"</b><del>"+(xprice).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "₫"+"</del></p>";
						}
					}
					else{
						var fixedPrice = xprice;
						typeHtml += "<p><b>"+ (v.product_name).split('|')[0] + "</b></p><p class='discount-promotion-price'><b>"+(fixedPrice).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "₫"+"</b></p>";
					}
					var html = '<tr haravan-promotion><td><label class="combo-product" data-pid="'+pid+'" data-countbuy="'+v.quantity+'" data-id="'+variant+'"><img class="combo-img" src="'+imm+'"><p>'+typeHtml+'</p></label></td></tr>';
					itemCombo += html;
				});
				giftHtml += "<div class='combo-w "+((key==0)?'checked':'')+"'><div class='combo-list'><table>"+itemCombo+"</table></div></div>";
				titleHtml = "<p class='name-combo'><span>"+value.name_combo+"</span></p><p class='combo-title'>Khi mua "+ noti.substr(0, noti.length - 1)+ "sẽ được áp dụng giảm giá như sau</p>";
			});
			$('#combo-popup #combo-program').html(giftHtml);
			$('#combo-popup .heading-combo').html(titleHtml);
		},
		comboAddCart: function(pid, vid, callback){
			var self = this;
			var data = [];
			$('#combo-program .combo-w.checked .combo-product').each(function(k, e){
				if(parseInt($(this).attr('data-pid')) == pid){
					data[k] = {"vid": vid, "quan": parseInt($(this).attr("data-countbuy")) * parseInt($('#quantity').val())};
				}else{
					data[k] = {"vid": $(this).attr('data-id'), "quan": parseInt($(this).attr("data-countbuy")) * parseInt($('#quantity').val())};
				}
			});
			var success = 0;
			$.each(data, function(index, value){
				var params = {quantity:value.quan,id:value.vid};
				jQuery.ajax({
					type: 'POST',
					url: '/cart/add.js',
					data: params,
					dataType: 'json',
					async: false,
					success: function(cart) {
						success = index;
					},
					error: function(XMLHttpRequest, textStatus) {
					}
				});
			});
			if((success+1) == data.length){
				callback(true);
			}else{
				callback(false);
			}
		},
		comboUpdateCart: function(){		
			var self = this;
			var listCart = document.querySelectorAll('[id^="updates_"]');
			var tmp  = "";
			var listVariantIdHasPromotion = [];
			var listPromotionIdExisted = [];
			for(var i = 0; i < listCart.length; i++) {
				var qty = parseInt(listCart[i].value);
				if(i > 0) tmp += "&";
				tmp += "updates[]=" + qty;
			}
			tmp += "&note="+$('#note').val();
			$.post('/cart', tmp).always(function() {
				setTimeout(function() { location.reload(); }, 500);
			});
		},
		showGiftLabel: function(){
			var arr_prod_id = [];
			var elementGift = '.product_gift_label';
			$(elementGift).each(function(){
				var id = $(this).attr('data-id');
				arr_prod_id.push(id);
			});
			if(arr_prod_id.length > 0){
				checkRecommendeds(arr_prod_id,function(result){
					$.each(result,function(i,item){
						//	console.log(item.has_gift);
						if (item.has_gift == true || item.has_discount == true){
							$(elementGift + '[data-id="' + item.product_id +'"]').removeClass('d-none');
							$(elementGift).parents('.product-item').find('.product_action .btn_addtocart').removeClass('loading');
						}else{
							$(elementGift).parents('.product-item').find('.product_action .btn_addtocart').removeClass('loading');
						}
					})
				});
			}
		}
	}
	$(document).ready(function (){
		var idProduct = $('#combo-program').data('id');
		var idTitle = $('#combo-program').data('title');
		comboApp.init(idProduct, idTitle);

		$('body').on('click', '.combo-w', function(e){
			$('.combo-w').removeClass('checked');
			$(this).addClass('checked');
		})
	})
})(jQuery)