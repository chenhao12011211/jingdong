class Cart{
    constructor(){
        //获取购物车的列表
        this.getData();
        //给删除按钮绑定事件
        this.$('.cart-list').addEventListener('click',this.removeFn.bind(this));
        //全选
        this.$('.cart-th input').addEventListener('click',this.selectAllFN.bind(this));
        //单个商品选中的点击事件
        this.$('.cart-body').addEventListener('click',this.selectFN.bind(this));
        // 给 +  -绑定点击事件
        this.$('.cart-list').addEventListener('click',this.clickPigeFn.bind(this));
        //给清空购物车绑定点击事件
        this.$('.sum-btn1').addEventListener('click',this.clearFn.bind(this));
        //给结算绑定点击事件
        this.$('.sum-btn').addEventListener('click',this.settlementFn.bind(this));
    }
    //获取购物车的列表
    async getData(){
        //获取token值 
        const token = localStorage.getItem('token');
        //获取用户id值
        let uname= localStorage.getItem('user_id');
        //设置get的头部字段
        axios.defaults.headers.common['authorization'] = token;
        //发送get请求
        let res = await axios.get(`http://localhost:8888/cart/list?id=${uname}`);
        // console.log(res);
        //获取返回的数据
        let {data,status} =res;
        //保存数据
        let html = '';
        //发送成功
        if (status ==200) {
            //返回成功
            if (data.code==1) {
                // console.log(data.cart);
                //循环返回的数据  保存到html中
                data.cart.forEach(val => {
                    // console.log(val);
                    html+=`<ul class="goods-list yui3-g" data-id="${val.goods_id}">
                    <li class="yui3-u-3-8 pr">
                        <input type="checkbox" class="good-checkbox">
                        <div class="good-item">
                            <div class="item-img">
                                <img src="${val.img_small_logo}">
                            </div>
                            <div class="item-msg">${val.title}</div>
                        </div>
                    </li>
                    <li class="yui3-u-1-8">
                    </li>
                    <li class="yui3-u-1-8">
                        <span class="price">${val.current_price}</span>
                    </li>
                    <li class="yui3-u-1-8">
                        <div class="clearfix">
                            <a href="javascript:;" class="increment mins">-</a>
                            <input autocomplete="off" type="text" value="${val.cart_number}" minnum="1" class="itxt">
                            <a href="javascript:;" class="increment plus">+</a>
                        </div>
                        <div class="youhuo">有货</div>
                    </li>
                    <li class="yui3-u-1-8">
                        <span class="sum">${(val.current_price*val.cart_number-0).toFixed(2)}</span>
                    </li>
                    <li class="yui3-u-1-8">
                        <div class="del1">
                            <a href="javascript:;">删除</a>
                        </div>
                        <div>移到我的关注</div>
                    </li>
                </ul>`
                });
            }
        }
        //把html追加到页面中
        this.$('.cart-list').innerHTML = html;
    }
    //给删除按钮绑定事件
    async removeFn(e){
        // console.log(123);
        if (e.target.parentElement.className =='del1') {
            // console.log(123);
            //登录用户id和商品id
            let goodsId = e.target.parentElement.parentElement.parentElement.dataset.id;
            let uname = localStorage.getItem('user_id');
            // console.log(goodsId,uname);
            //发送get请求   就在数据库里删除了
            let res = await axios.get(`http://localhost:8888/cart/remove?id=${uname}&goodsId=${goodsId}`);
            // console.log(res);
            //接受返回的值
            let {data,status} = res;
            //发送成功
            if (status ==200) {
                //返回成功
                if (data.code ==1) {
                    //删除页面中这个商品
                    e.target.parentElement.parentElement.parentElement.remove();
                    this.getNumPriceFN();
                }
            }
        }
    }
    //全选
    selectAllFN(e){
        // console.log(123);
        // console.log(e.target.checked);
        //保存全选的选中状态
        let flax = e.target.checked;
        //获取所有的单选框
        let lisObj = this.$('.goods-list li > input');
        // console.log(lisObj);
        //给所有的单选框保存全选的选中状态
        lisObj.forEach(val =>{
            val.checked = flax;
        })
        this.getNumPriceFN();
        this.selAllFN();

    }
    //单个商品选中的点击事件
    async selectFN(e){
        //当点击单个商品input框是
        if (e.target.className=='good-checkbox') {
            // console.log(123);
            //当它为未选中时
            if (!e.target.checked) {
                //让全选框变为未选中
                this.$('.cart-th input').checked = false;
            }
            //  当它为选中时   
            if (e.target.checked) {
                //循化所有的单个商品  寻找val的checked为fales时返回这个值的input框  （find（）方法只找一个） 
                let res = Array.from(this.$('.good-checkbox')).find( val=>{
                    return !val.checked;
                })
                // console.log(res);
                //如果全部选中  res返回undifined  就让全选选中
                if (!res) {
                    this.$('.cart-th input').checked = true; 
                    this.selAllFN();
                }
                //发送post请求修改保存状态
           /* //用户id
            let uname = localStorage.getItem('user_id')-0;
            //商品id
            let goodsId = e.target.parentElement.parentElement.dataset.id-0;
            // console.log(uname,goodsId);
            //拼接post传输的数据
            let param = `id=${uname}&goodsId=${goodsId}&type=1`;
            let res1 = await axios.post('http://localhost:8888/cart/select',param);
            console.log(res1);*/
            }
            this.getNumPriceFN();

        }
        
    }
    //商品的价格和数量
    getNumPriceFN(){
        //保存数量和价格
        let totalNum =0;
        let totalPrice =0;
        //获取所有商品的列表
        let goods = document.querySelectorAll('.goods-list');
        // console.log(goods);
        //循环所有选中的商品  并保存
        goods.forEach(val=>{
            // console.log(val.firstElementChild.firstElementChild.checked);
            if (val.firstElementChild.firstElementChild.checked) {
                totalPrice=val.lastElementChild.previousElementSibling.firstElementChild.innerHTML - 0 + totalPrice ;

                totalNum +=(val.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.previousElementSibling.value  - 0);
               
               
            }
            // console.log(val);
            // console.log(val.lastElementChild.previousElementSibling.firstElementChild.innerHTML);
            // console.log(val.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.previousElementSibling.value);
        })
       
        // console.log(totalPrice,totalNum);
        //把商品的数量和价格追加到页面中
        this.$('.sumprice-top strong').innerHTML = totalNum;
        this.$('.sumprice-top .summoney').innerHTML = totalPrice;
    }
    //+ -的回调事件
    async clickPigeFn(e){
        // console.log(123);
        // console.log(e.target.classList[1]);
        //++
        if (e.target.classList[1]=='plus') {
            // console.log(123);
            ++e.target.previousElementSibling.value;
            await this.NumFn(e);  
            this.getNumPriceFN();  
        }
        //--
        if (e.target.classList[1]=='mins') {
            // console.log(456);
            if (e.target.nextElementSibling.value==1) e.target.nextElementSibling.value=2;

            --e.target.nextElementSibling.value;
            await this.NumFn(e);
            this.getNumPriceFN();  
        }
        //因为是个商品的总div绑定的事件  在这里出现  会导致bug
          
    }
    //计算单个商品总价的方法
    totalPrice(e){
        e.target.parentElement.parentElement.nextElementSibling.lastElementChild.innerHTML=((e.target.parentElement.parentElement.previousElementSibling.firstElementChild.innerHTML-0)*(e.target.parentElement.firstElementChild.nextElementSibling.value-0)).toFixed(2);
    }
    //发送ajax请求保存修改数量
    async NumFn(e){
        //用户id
        let uname = localStorage.getItem('user_id')-0;
        //商品id
        let goodsId = e.target.parentElement.parentElement.parentElement.dataset.id-0;
        // console.log(e.target.parentElement.parentElement.parentElement.dataset.id);
        //修改数量
        let number =e.target.parentElement.firstElementChild.nextElementSibling.value-0;
        // console.log(number);
        //拼接post传输数据
        let param =`id=${uname}&goodsId=${goodsId}&number=${number}`;
        //发送请求
        let res = await axios.post('http://localhost:8888/cart/number',param);
        // console.log(res);
        let {data,status}=res;
        if (status==200) {
            if (data.code==1) {
                this.totalPrice(e);
            }
        }
    }
    //发送ajax请求保存修改全部商品选中状态
    async selAllFN(){
        //用户id
        let uname = localStorage.getItem('user_id')-0;
        let param = `id=${uname}&type=1`;
        let res = await axios.post('http://localhost:8888/cart/select/all',param);
        // console.log(res);
    }
    //清空购物车的事件
    async clearFn(){
        //获取用户id
        let uname = localStorage.getItem('user_id')-0;
        let res = await axios.get(`http://localhost:8888/cart/clear?id=${uname}`);
        // console.log(res);
        let { data , status} =res;
        if (status==200) {
            if (data.code==1) {
                this.$('.goods-list').forEach(val=>{
                    val.remove();
                })
                // console.log(this.$('.goods-list'));
            }
        }
    }
    //结算绑定的点击事件
    async settlementFn(){
        //获取选中商品的id值
        // console.log(this.$('.good-checkbox'));
        //准备个空数组保存选中的id值
        let sumId = [];
        document.querySelectorAll('.good-checkbox').forEach(val=>{
            if (val.checked) {
               sumId.push(val.parentElement.parentElement.dataset.id-0) 
            }
        })
        // console.log(sumId);
        //准备把id数组值分割加入字符串
        let param ='';
        sumId.forEach(val=>{
            param+=val+',';
        })
        // console.log(param);
        //多一个，
        param=param.slice(0,param.length-1);
        // console.log(param);
        //把参数拼接到跳转的地址上
        location.assign(`./pay.html?${param}`);

        
    }










     //获取节点函数
     $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
      }
}



new Cart;