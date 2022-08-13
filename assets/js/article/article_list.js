$(function (){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    template.defaults.imports.dataFormat = function (data) {
        let date = new Date(data)

        let y = num(date.getFullYear())
        let m = num(date.getMonth()+1)
        let d = num(date.getDate())

        let hh = num(date.getHours())
        let mm = num(date.getMinutes())
        let ss = num(date.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
      }


      //定义补0函数
      function num(n){
        return n>9?n:'0'+n
      }

    //定义一个查询的参数对象
    let q = {
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }
  
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            date:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    initTable()
    initCate()
    //初始化文章分类
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类失败')
                }
                let htmlStr = template('tpl_cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit',function (e) { 
        e.perventDefault()
        //获取表单中值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //为q赋值
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
     })


     //定义分页渲染分页的方法

     function renderPage(total,first){
        laypage.render({
            elem: 'pageBox' //容器id
            ,count: total ,  //总容器
            limit:q.pagesize,  //每页显示几条数据
            curr:q.pagenum,    //设置默认被选中的分页
            layout: ['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            //分页切换发生jump回调
            jump:function(obj){
               q.pagenum = obj.curr
               q.pagesize = obj.limit
                if(!first){
                    initTable()
                }

            }

          })


     }

     $('tbody').on('click',$('.btndelete'),function(){
        //获取文章ID
        let id = $(this).attr('data-id')
        let len = $('.btndelete').length
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+ id,
                success:function (res) {
                    if(res.status !== 0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    //当数据删除完成后，需要判断当前这一页，是否还有剩余数据，如果没数据，页码值减1

                    if(len === 1){
                        q.pagenum = q.pagenum === 1?q.pagenum:q.pagenum-1
                    }
                    initTable()
                 }
            })
            
            layer.close(index);
          });
     })

})