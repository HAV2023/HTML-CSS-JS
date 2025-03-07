document.addEventListener('DOMContentLoaded', function () {
    const restrictedMenu = document.getElementById('restricted-menu');

    if (sessionStorage.getItem('loggedIn')) {
        restrictedMenu.style.display = 'block';
    }
});