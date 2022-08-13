$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()




    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // if(res.status)
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    $('#btn1').on('click', function () {
        let index = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()

        });
    })


    //通过代理绑定事件
    $('body').on('submit', '#form1', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章失败')
                }
                initArtCateList()
                layer.msg('新增文章成功')
                //根据索引关闭对应的弹出层
                layer.close(index)
            }
        })
    })


    //代理绑定编辑事件
    let index1 = null
    $('tbody').on('click', '#btnbianji', function () {
        let index1 = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()

        })
        let id = $(this).attr('data-id')

        //发起请求获取对应分类的对象
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form2', res.data)
            }
        })
    })


    //代理绑定修改分类表单
    $('body').on('submit', '#form2', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            succcess: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章失败')
                }
                initArtCateList()
                layer.msg('更新文章成功')
                layer.close(index1)
            }

        })
    })

    //代理绑定click事件
    $('tbody').on('click', $('.btndlete'), function () {
        let id = $(this).att('data-id')

        //提示用户是否删除
        //eg1
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                }
            })
            initArtCateList()
            layer.close(index);
        });
        //eg2
        layer.confirm('is not?', function (index) {
            //do something

            layer.close(index);
        })
    })




})