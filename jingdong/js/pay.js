class Pay{
    constructor(){
        //获取结算商品的列表
        this.getData();
        //给提交订单添加点击事件
        this.$('.me-commit').addEventListener('click',this.clickFn.bind(this));
    }
    getData(){
        //判断打开结算页面  如果未携带参数就跳回到购物车页面
        if (!location.search) {
            //未携带参数
            location.assign('./cart.html');
        }else{
            //携带参数
        //获取用户id
        let unama = localStorage.getItem('user_id');
        //获取商品id   此时的id是字符串  
        let goodsId =location.search;
        // console.log(goodsId);
        goodsId = goodsId.substring(1,goodsId.length);
        //把字符串改成数组
        goodsId = goodsId.split(',');
        // console.log(goodsId);
        // console.log(goodsId);


        //发送请求获取商品的详细信息 因为async有就近原则
        //循环数组  
        goodsId.forEach(val => {
            // console.log(val);
            //传的参数是id值
            this.axiosFn(val);
        });
        
        }
      
       
    }
    //此处的发送请求是获取商品的详细信息  
    async axiosFn(a){
        let res = await axios.get(`http://localhost:8888/goods/item?id=${a}`);
        // console.log(res);
        //加入到页面中
        let html =`<div class="me-bd" data-id="${res.data.info.goods_id}">
        <span>订单详情</span>
        <div class="me-bs">
            <span>
                <img src="${res.data.info.img_big_logo}" width="100px" height="100px"   alt="">
            </span>
            <p>
                ${res.data.info.title}
            </p>
            <div class="price">￥${res.data.info.price}</div>
            <div class="num">X1</div>
            <a href="#">有货</a>
        </div>
    </div>`;
    // console.log(this.$('.message'));
        this.$('.message')[3].innerHTML+=html;
        
    }




    //提交订单的点击事件
    async clickFn(){
        // console.log(123);
        //用户id
        let uname = localStorage.getItem('user_id');
        let param = 'id='+uname;
        //此处的请求是支付请求（不会改变后台数据  只会给个返回值）//所以支付成功后  在发送个删除购物车商品的请求
        let res = await axios.post('http://localhost:8888/cart/pay',param);
        // console.log(res);
        let { data , status } =res;
        if (status==200) {
            if (data.code==1) {
                let goodsId =location.search;
                // console.log(goodsId); 
                goodsId = goodsId.substring(1,goodsId.length);
                //把字符串改成数组
                goodsId = goodsId.split(',');
                goodsId.forEach(val=>{
                    this.removeFn(val);
                })
            }
        }
    }
    //购物车商品的的删除请求  删除成功  会跳转会购物车列表
    async removeFn(a){
         //用户id
         let uname = localStorage.getItem('user_id');
         let res = await axios.get(`http://localhost:8888/cart/remove?id=${uname}&goodsId=${a}`);
        //  console.log(res);
         let { data , status } = res;
        //  console.log(data,status);
        if (status ==200) {
            if (data.code==1) {
                alert('支付成功  点击确认会跳转到购物车页面');
                location.assign('./cart.html');
            }
        }
    }




     //获取节点函数
     $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
      }

    
}


new Pay;