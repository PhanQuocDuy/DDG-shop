document.addEventListener('DOMContentLoaded', function() {
    var titleMenu = document.querySelector('.title-menu.menu-clicked');
    if(titleMenu) {
        titleMenu.addEventListener('click', function() {
            var sidebarMenu = document.querySelector('.sidebar-menu.sidebar-menu--colum');
            if(sidebarMenu) {
                sidebarMenu.classList.toggle('active-menu');
            }
        });
    }
});