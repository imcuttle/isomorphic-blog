/**
 * Created by moyu on 2017/2/14.
 */

!function ($, doc, win) {

    var $exit = $('#exit');
    var $editor = $('#editor');
    var $title = $('#title');
    $title.val(win.localStorage.getItem('title') || '')
    $editor.val(win.localStorage.getItem('content') || '')
    var $submit = $('#submit');
    var $dels = $('[name="del-art"]');

    $dels.on('click', function () {
        var $self = $(this)
        var id = $self.attr('data-del');
        if (confirm('确定删除 '+id + '吗？')) {
            $.post('/api/admin/post/del', {id: id}, function (data) {
                alert(data.result);
                if (data.code == 200) {
                    $self.parent().remove();
                }
            }, 'json')
        }
    })

    $title.on('input', function () {
        win.localStorage.setItem('title', $title.val())
    })
    $editor.on('change', function () {
        win.localStorage.setItem('content', $editor.val())
    })

    $exit.on('click', function (event) {
        event.preventDefault();
        $.post('/api/admin/out', function (data) {
            if (data.code == 200) win.location.href="/admin";
            else alert(data.result);
        }, 'json')
    })
    $submit.on('click', function (event) {
        event.preventDefault();
        var content = $editor.val();
        var title = $title.val().trim();
        if (!title || !content) {
            alert('please input correctly!');
            return;
        }
        $.post('/api/admin/post', {content: content, title: title}, function (data) {
            if (data.code == 200) {
                alert(data.result);
            } else if (data.code == 4000) {
                var i = 3;
                while ( i >0 && confirm('已经存在 '+ title + ', 是否覆盖？需确认'+i+'次') ) {
                    i--;
                }

                if (i==0) {
                    $.post('/api/admin/post', {content: content, title: title, force: '1'}, function (data) {
                        alert(data.result);
                    }, 'json')
                }
            } else {
                alert(data.result);
            }
        }, 'json')
    })
}($, document, window)