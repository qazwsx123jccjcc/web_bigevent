$(function () {
    let layer = layui.layer
    let form = layui.form
    initEditor()
    initCate()
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败')
                }

                //调用模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id').html(htmlStr)
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('#btn1').on('click', function () {
        $('#coverfile').click()
    })

    $('#coverfile').on('change', function (e) {
        let files = e.target.files
        //判断用户是否选择了图片
        if (files.length === 0) {
            return layer.msg('错误')
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    let art_state = '已发布'
    $('btnsave').on('click', function () {
        art_state = '草稿'

    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于form表单，快速创建一个formData 对象
        let fd = new FormData($(this)[0])

        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
              
              //将文件对象存储到fd中
                fd.append('cover_img',blob)

                publish(fd )
            })
    })

    //定义发布文章的方法
    function publish(fd){
        $.ajax({
            method:'POSt',
            url:'/my/article/add',
            data:fd,
            //注意如果向服务器提交的是formData格式的数据，必须添加以下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }

})