


        <!--Begin login -->
        <main class="wrapperMain_content">
            <div class="layout-account">
                <div class="container">
                    <div class="wrapbox-content-account">
                        <div id="customer-login" class="customers_accountForm customer_login">
                            <div class="tab-form-account d-flex align-items-center justify-content-center">
                                <h4 class="active">
                                    <a href="/Login.html">Đăng nhập</a>
                                </h4>
                                 <h4>
                                <a href="/register">Đăng ký</a>
                                 </h4>
                            </div>
                        <div id="login">
                            <div class="accounttype">
                                <h2 class="title"></h2>
                            </div>
                            <form accept-charset="UTF-8" action="/account/login" id="customer_login" method="post">
                                <input name="form_type" type="hidden" value="customer_login">
                                <input name="utf8" type="hidden" value="✓">
        
                            
                            <div class="clearfix large_form">
                                <label for="customer_email" class="icon-field"><i class="icon-login icon-envelope "></i></label>
                                <input required="" type="email" value="" name="customer[email]" id="customer_email" placeholder="Vui lòng nhập email của bạn" class="text">
                            </div>
                            
                            <div class="clearfix large_form large_form-mrb">
                                <label for="customer_password" class="icon-field"><i class="icon-login icon-shield"></i></label>
                                <input required="" type="password" value="" name="customer[password]" id="customer_password" placeholder="Vui lòng nhập mật khẩu" class="text" size="16">      
                            </div>
                            
                            <div class="clearfix large_form sitebox-recaptcha ">
                                This site is protected by reCAPTCHA and the Google
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> 
                                and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
                            </div>	
                            <div class="clearfix custommer_account_action">
                                <div class="action_bottom button">
                                    <input class="btn btn-signin" type="submit" value="Đăng nhập">
                                </div>
                                <div class="req_pass">
                                    <p>Bạn chưa có tài khoản?<a href="#" onclick="showRecoverPasswordForm();return false;" title="Quên mật khẩu"> Quên mật khẩu?</a></p>
                                    <p>Bạn quên mật khẩu?<a href="/account/register" title="Đăng ký"> Đăng ký</a></p>
                                </div>
                            </div>
                            
                              
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
       
        </main>




























    </div>
</body>



