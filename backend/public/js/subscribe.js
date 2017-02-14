/**
 * Created by moyu on 2017/2/14.
 */

!function ($, doc, win) {

    var $name = $('#name');
    var $email = $('#email');
    var $submit = $('#submit');

    $submit.on('click', function (event) {
        event.preventDefault();
        var name = $name.val().trim();
        var email = $email.val().trim();

        var post_fn = function () {
            $.post('/api/admin/add-receiver', {name: name, mail: email}, function (data) {
                if (data.code == 200) {
                    alert(data.result);
                } else {
                    alert(data.result);
                }
            }, 'json')
        }
        if (form.reportValidity && form.reportValidity()) {
            post_fn();
        } else if (!form.reportValidity && name != '' && email != '') {
            post_fn();
        } else {
            alert('please input correctly!')
        }
    })
}($, document, window)