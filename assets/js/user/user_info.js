$(function(){

    initUserInfo()
    let form = layui.form
    
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return layui.layer.msg('不能超过6个字符')
            }
        }
    })



//初始化用户信息
function initUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function (res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            console.log(res)
            form.val('formUserInfo',res.date)
        }
    })
}


//重置表单数据
$('#btnReset').on('click',function(e){
    e.preventDefault()
    initUserInfo()
})


//监听表单的提交时间
$('.layui-form').on('submit',function(e){
    e.preventDefault()

    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('更新用户信息失败')
            }
            layui.layer.msg('更新用户信息成功')
        }
    })
})

})