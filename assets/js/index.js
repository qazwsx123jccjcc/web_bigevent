$(function(){
    getUserInfo()

    $('#btnout').on('click',function () {
        layui.layer.confirm('确定退出吗', {icon: 3, title:'提示'}, function(index){
            //do something

            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
          })
    })
})

//获取用户信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        headers:{Authorization:localStorage.getItem('token')||''},
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }

            //渲染用户头像
            renderAvatar(res.data)
        },
        // complete:function(res){
        //     if(res.responseJSON.status === 1 && res.responseJSON.message ==='身份认证失败！'){
        //         localStorage.removeItem('token')
        //         location.href='/login.html'
        //     }
        //     console.log(res);
        // }
    }
    )
}


function renderAvatar(user){
    let name = user.nickname||user.username
    $('#welcome').html = `欢迎&nbsp&nbsp${name}`

    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avater').hide()
    }else{
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
}