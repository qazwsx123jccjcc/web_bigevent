$(function(){
    //点击去注册账号
    $('#denglu1').on('click',function(){
        $('.denglu').hide()
        $('.zhuce').show()
    })


    //点击去登录
    $('#zhuce1').on('click',function(){
        $('.denglu').show()
        $('.zhuce').hide()
    })


    let form = layui.form

    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位,且不能出现空格'
          ],
        repwd:function(value){
            let pwd = $('#password1').val()
            if(pwd !== value){
                return '两次密码不一致'
            } 
        }
    })

    //监听注册表单的提交事件
    $('#zhuceform').on('submit',function(e){
        e.preventDefault()
        
        let data = {username:$('#username1').val(),password:$('#password1').val()}
        $.post('/api/reguser',data,function(res){
            if(res.status !== 0){
                return layer.msg(res.message);
            }
            layer.msg('注册成功请登录')
            $('#zhuce1').click()
        })
    })

    //监听登录事件
    $('#dengluform').submit(function(e){
        e.preventDefault()

        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success: function(res){
                if(res !== 0){
                    return layer.msg('登录失败')
                }
                layer.msg('登陆成功')
                // console.log('res.token');

                //将token存储到localStorage

                localStorage.setItem('token',res.token)
                //跳转到主页
                location.href ='/index.html'
            }
        })
    })
    
})