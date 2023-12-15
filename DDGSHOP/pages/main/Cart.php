
<?php include ("./DDGSHOP/view/Header.php"); ?>



        <!--Main-->
        <div class="wrapper-mainCart">
            <div class="content-bodyCart">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-md-12 col-12 contentCart-detail">
                            <div class="mainCart-detail">
                                <h1 class="heading-cart">Giỏ hàng của bạn</h1>

                                <div class="list-pageform-cart">
                                    <form action="/cart" method="post" id="cartformpage">
                                        <div class="cart-row">
                                            <p class="title-number-cart">
                                                Bạn đang có <strong class="count-cart">1 sản phẩm</strong> trong giỏ
                                                hàng
                                            </p>
                                            <div class="table-cart">
                                                <div class="media-line-item line-item" data-variant-id="1095390575"
                                                    data-product-id="1043476696">
                                                    <div class="media-left">
                                                        <div class="item-img">
                                                            <a
                                                                href="/products/pc-zotac-gaming-type2-super-vga-qua-su-dung-linh-kien-con-lai-all-new">
                                                                <img src="  //product.hstatic.net/1000288298/product/untitled-3_87ae9c71f49b46c9b4a1b53f20a888c4_medium.jpg"
                                                                    alt="PC ZOTAC GAMING Type2 Super (VGA qua sử dụng -Linh kiện còn lại all new)">
                                                            </a>
                                                        </div>
                                                        <div class="item-remove">
                                                            <a href="javascript:void(0)"
                                                                onclick="HRT.Cart.removeItemCart(this,'/cart/change?line=1&amp;quantity=0')"
                                                                class="cart">Xóa</a>
                                                        </div>
                                                    </div>
                                                    <div class="media-right">
                                                        <div class="item-info">
                                                            <h3 class="item--title"><a
                                                                    href="/products/pc-zotac-gaming-type2-super-vga-qua-su-dung-linh-kien-con-lai-all-new">PC
                                                                    ZOTAC GAMING Type2 Super (VGA qua sử dụng -Linh kiện
                                                                    còn lại all new)</a></h3>

                                                        </div>
                                                        <div class="item-price">
                                                            <p>
                                                                <span>9,590,000₫</span>

                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="media-total">
                                                        <div class="item-total-price">
                                                            <div class="price">
                                                                <span class="line-item-total">9,590,000₫</span>
                                                            </div>
                                                        </div>
                                                        <div class="item-qty">
                                                            <div class="qty quantity-partent qty-click clearfix">
                                                                <button type="button" class="qtyminus qty-btn">
                                                                    <svg width="18" height="18" viewBox="0 0 20 20"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <rect height="1" width="18" y="9" x="1"></rect>
                                                                    </svg>
                                                                </button>
                                                                <input type="text" size="4" name="updates[]" min="1"
                                                                    oriprice="959000000" line="1" productid="1043476696"
                                                                    variantid="1095390575" id="updates_1095390575"
                                                                    data-price="959000000" value="1" readonly=""
                                                                    class="tc line-item-qty item-quantity">
                                                                <button type="button" class="qtyplus qty-btn">
                                                                    <svg width="18" height="18" viewBox="0 0 20 20"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <rect x="9" y="1" width="1" height="17"></rect>
                                                                        <rect x="1" y="9" width="17" height="1"></rect>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="cart-row">
                                            <div class="order-noted-block">
                                                <div class="container-pd15">
                                                    <div class="checkout-buttons clearfix">
                                                        <label for="note" class="note-label">Ghi chú đơn hàng</label>
                                                        <textarea class="form-control" id="note" name="note"
                                                            rows="5"></textarea>
                                                    </div>
                                                    <button type="submit" id="checkout"
                                                        class="btn-checkout button d-none " name="checkout"
                                                        value="">Thanh toán</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="cart-row">
                                            <div class="order-invoice-block">
                                                <div class="checkbox">
                                                    <input type="hidden" name="attributes[invoice]"
                                                        id="re-checkbox-bill" value="no">
                                                    <input type="checkbox" id="checkbox-bill" value="yes"
                                                        name="regular-checkbox" class="regular-checkbox">
                                                    <label for="checkbox-bill" class="box"></label>
                                                    <label for="checkbox-bill" class="title">Xuất hoá đơn cho đơn
                                                        hàng</label>
                                                </div>
                                                <div class="bill-field">
                                                    <div class="form-group">
                                                        <input type="text" class="form-control val-f check_change"
                                                            name="attributes[bill_order_company]" value=""
                                                            placeholder="Tên công ty...">
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="number" pattern=".{10,}"
                                                            onkeydown="return HRT.All.FilterInput(event)"
                                                            onpaste="HRT.All.handlePaste(event)"
                                                            class="form-control val-f val-n check_change"
                                                            name="attributes[bill_order_tax_code]" value=""
                                                            placeholder="Mã số thuế...">
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="email"
                                                            class="form-control val-f val-mail check_change"
                                                            name="attributes[bill_email]" value=""
                                                            placeholder="Email...">
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="text" class="form-control val-f check_change"
                                                            name="attributes[bill_order_address]" value=""
                                                            placeholder="Địa chỉ công ty...">
                                                    </div>
                                                    <div class="form-btn">
                                                        <a href="javascript:void();" class="button btn-save">Lưu thông
                                                            tin</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                        <div class="col-lg-4 col-md-12 col-12 sidebarCart-sticky">
                            <div class="wrap-order-summary">
                                <div class="order-summary-block">
                                    <h2 class="summary-title">Thông tin đơn hàng</h2>

                                    <div class="summary-time summary-picktime">
                                        <div class="summary-time__row">
                                            <div class="boxtime-title">
                                                <p class="txt-title">Thời gian giao hàng</p>
                                                <p class="txt-time ">
                                                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                                                    <span>Chọn thời gian</span>
                                                </p>
                                            </div>
                                            <div class="boxtime-radio" id="picktime_radio" data-time-start=""
                                                data-time-end="">
                                                <div class="radio-item">
                                                    <input class="input-radio" type="radio" name="timeRadios"
                                                        id="timeRadios-1" value="timeNow">
                                                    <label class="label-radio" for="timeRadios-1">Giao khi có
                                                        hàng</label>
                                                </div>
                                                <div class="radio-item">
                                                    <input class="input-radio" type="radio" name="timeRadios"
                                                        id="timeRadios-2" value="timeDate">
                                                    <label class="label-radio" for="timeRadios-2">Chọn thời gian</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="summary-time__row picktime_selecter">
                                            <div class="boxtime-select">
                                                <div class="select-choose">
                                                    <div class="select-box date-option">
                                                        <label>Ngày giao</label>
                                                        <div class="select-option">
                                                            <select id="date_shipping">
                                                                <option value="14/12/2023">Hôm nay</option>
                                                                <option value="15/12/2023">15/12/2023</option>
                                                                <option value="16/12/2023">16/12/2023</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="select-box time-option">
                                                        <label>Thời gian giao</label>
                                                        <div class="select-option">
                                                            <select id="time_shipping">
                                                                <option data-min="08:00:00" data-max="09:00:00"
                                                                    value="08:00 - 09:00" disabled="disabled">08:00 -
                                                                    09:00</option>
                                                                <option data-min="09:00:00" data-max="10:00:00"
                                                                    value="09:00 - 10:00" disabled="disabled">09:00 -
                                                                    10:00</option>
                                                                <option data-min="10:00:00" data-max="11:00:00"
                                                                    value="10:00 - 11:00" disabled="disabled">10:00 -
                                                                    11:00</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="select-button">
                                                    <button class="btn-accepttime disabled" id="btn-cart-accepttime"
                                                        disabled="disabled">Xác nhận thời gian</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="summary-total">
                                        <p>Tổng tiền: <span>9,590,000₫</span></p>
                                    </div>
                                    <div class="summary-action">
                                        <p>Phí vận chuyển sẽ được tính ở trang thanh toán.</p>
                                        <p>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</p>
                                        <p>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</p>
                                        <div class="summary-alert alert alert-danger ">
                                            Giỏ hàng của bạn hiện chưa đạt mức tối thiểu để thanh toán.
                                        </div>
                                    </div>
                                    <div class="summary-button">
                                        <a id="btnCart-checkout" class="checkout-btn btnred " data-price-min="40000"
                                            data-price-total="9590000" href="#">THANH TOÁN </a>
                                    </div>
                                </div>
                                <div class="order-summary-block order-summary-notify ">
                                    <div class="summary-warning alert-order">
                                        <p class="textmr"><strong>Chính sách mua hàng</strong>:</p>
                                        <p>Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu
                                            <strong>40.000₫ </strong> trở lên.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Footer -->
    


        <?php   include ("./DDGSHOP/view/Footer.php");?>
    