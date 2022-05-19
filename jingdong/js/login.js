
class login{
    constructor(){
        // 给登录绑定点击事件  
        this.$('.over').addEventListener('click',this.clickButtonFn.bind(this));
    }
    //登录的点击事件
    clickButtonFn(){
        let time = setTimeout(()=> {
            this.$('.forgot span').innerText = ''
            ;
            // console.log( '我执行了');
            // console.log(new Date());

        },3000);
         //判断用户名和密码格式是否错误
        if (!this.$('#uname').value.trim()) {
            this.$('.forgot span').innerText = '请输入用户名';
            return;
        }
        if (!this.$('#password').value.trim()) {
            this.$('.forgot span').innerText = '请输入密码';
            return;
        }
       
        //获取用户名和密码的值
       const uname = this.$('#uname').value;
       const pwd = this.$('#password').value;
        //console.log(uname,pwd);
        //发送post请求头
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // 以key=val&key=val的形式传参
        let data = `username=${uname}&password=${pwd}`;
        axios.post('http://localhost:8888/users/login',data).then(res =>{
            let { status , data} =res;
            // console.log(status,data);
            //等于200时请求成功
            if (status == 200) {
                // 判断是否登录成功
            if (data.code == 1) {
                // token 是登录 的 标识符给他加给localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user.id);
                //从哪里来,跳转到哪里去
                //location.assign（url）跳转到这个地址
                // location.search  获取url？后的参数
                 location.assign(location.search.split('=')[1])
            }else{
                // 登录失败,就提示输入错误
                this.$('.forgot span').innerText = '用户名或者密码输入错误';
            }
            }

        })
        
    }
    //获取节点函数
    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
      }
}
new login;