/**
 * Created by moyu on 2017/2/14.
 */

!function ($, doc, win) {

    var $name = $('#name');
    var $pwd = $('#pwd');
    var $login = $('#login');
    var form = $('#form')[0];

    $login.on('click', function (event) {
        event.preventDefault();
        var name = $name.val().trim();
        var pwd = $pwd.val().trim();

        var post_fn = function () {
            $.post('/api/admin/login', {name: name, pwd: pwd}, function (data) {
                if (data.code == 200) {
                    win.location.href = '/admin/dashboard';
                } else {
                    alert(data.result);
                }
            }, 'json')
        }
        if (form.reportValidity && form.reportValidity()) {
            post_fn();
        } else if (!form.reportValidity && name != '' && pwd != '') {
            post_fn();
        } else {
            alert('please input correctly!')
        }
    })
}($, document, window)