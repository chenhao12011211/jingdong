class Uname{
    constructor(){
        // 判断用户登录
        this.token();
        //给图片上的x点击事件
        this.$('.close-btn').addEventListener('click',this.clickFn.bind(this));
    }
    //判断用户登录
    async token(){
   
        //token值是判断用户此时是否登陆过
        const token = localStorage.getItem('token');
        //设置get的头部字段
        axios.defaults.headers.common['authorization'] = token;
         //获取用户id值
         let uname= localStorage.getItem('user_id');
         //发送的是用户详细信息 用来判断用户是否登录过期 用户登录过期只有发送请求才可以获取
        let res = await axios.get(`http://localhost:8888/cart/list?id=${uname}`);
        // console.log(res);
        
        // console.log(location.href);
        //获取当前页面的地址
        let a = location.href;
        //保存地址的页面 并跳转
        let s =a.replace('http://127.0.0.1:5500/','');
        // console.log(s);
        //等于401  是登录过期   等于0是未登录
        if (!token ||res.data.code==401 ||res.data.code==0) {
            location.assign(`./login.html?ReturnUrl=./${s}`);
        }
        //当登录成功时
        if (res.data.code==1) {
            //获取购物车里的数量
            // console.log(res.data.cart.length);
            // console.log(this.$('.f10')[1]);
            this.$('.f10')[1].parentElement.innerHTML = '';
            // console.log(this.$(".num"));
            this.$(".num").innerHTML = res.data.cart.length;
            
        }
    }

    clickFn(e){
        // console.log(123);
        let a= e.target.previousElementSibling;
        // console.log(a);
        a.remove();
        e.target.remove();
    }
     //获取节点函数
     $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
      }
}
new Uname;