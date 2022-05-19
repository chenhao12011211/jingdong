class detail1{
    constructor(){
        //获取结算商品的列表
        this.getData();
        //设置一个当前所在的图片索引
        this.index = 0;
    }
    async getData(){
        //判断打开结算页面  如果未携带参数就跳回到购物车页面
        if (!location.search) {
            //未携带参数
            location.assign('./list.html');
        }else{
        //获取用户id
        let unama = localStorage.getItem('user_id');
        //获取商品id  list页面中会传个id值
        let goodsId =location.search;
        // console.log(goodsId);
        let id = goodsId.slice(1,goodsId.length);
        // console.log(id);
        //发送ajax请求接受商品的详细信息
        let res = await axios.get(`http://localhost:8888/goods/item?id=${id}`);
        let { data , status }=res;
        // console.log(data,status);
        let html = '';
        if (status==200) {
            if (data.code==1) {
                //追加到页面中
                html=`<div class="preview_wrap fl" data-id="${data.info.goods_id}">
                    <div class="preview_img">
                        <img src="${data.info.img_big_logo}" width="100%" alt="">
                        <div class="mask"></div>
                        <div class="big">
                            <img src="${data.info.img_big_logo}" width="800px" alt="" class="bigimg">
                        </div>
                    </div></div>
                    <div class="itemInfo_wrap fr">
                    <div class="sku_name">
                        ${data.info.title}
                    </div>
                    
                    <div class="summary">
                        <dl class="summary_price">
                            <dt>闪购价</dt>
                            <dd>
                                <i class="price">¥${data.info.current_price}</i> 
                                <a href="#">降价通知</a>
                                <div class="remark">累计评价51万+</div>
                            </dd>
                        </dl>
                        <dl class="summary_promotion">
                            <dt>促销</dt>
                            <dd>
                                <em>加购价</em> 满999.00另加20.00元，或满1999.00另加30.00元，或满2999.00另加40.00元，即可在购物车换购热销商品 详情》
                            </dd>
                        </dl>
                        
                        <dl class="summary_stock">
                            <dt>配送至</dt>
                            <dd>
                                北京海淀区中关有货 支持 99元免运费 |货到付款 |211限时达
                                <br>由自营发货，并提供售后服务。11:00前完成下单，预计今天（11月19日）送达
                            </dd>
                        </dl>
                            <a href="javascript: " class="addCar">加入购物车</a>
                        </div>
                    </div>
                </div>
            </div>`;
        this.$('.product_intro').innerHTML=html;
                   
        //给小图绑定移入事件
        this.$('.preview_img').addEventListener('mouseover',this.overFn.bind(this));
        //给小图绑定移出事件
       this.$('.preview_img').addEventListener('mouseout',this.outFn.bind(this));
       //给小图绑定移动事件
       this.$('.preview_img').addEventListener('mousemove',this.moveFn.bind(this));
       //给加入购物车绑定事件
       this.$('.addCar').addEventListener('click',this.clickFn.bind(this));
        
            }
        }
       
    }
   }
     
    //鼠标移入小图事件0
    overFn(){
        this.$('.big').style.display='block';
        this.$('.mask').style.display='block';
    }
    //鼠标移动小图事件
    moveFn(eve){
        let e = eve || window.event;
        // console.log(e.offsetX,e.offsetY);
        // 先让mask随着鼠标动而动
        //鼠标的坐标-盒子的宽 -小黄块的宽一半
        let mask = this.$('.mask');
        let maskL = e.pageX - this.$('.preview_img').offsetLeft - mask.offsetWidth/2;
        let maskT = e.pageY - this.$('.preview_img').offsetTop - mask.offsetHeight/2;
        // console.log(maskL);
        
        //设定mask的边界值
        if (maskL<0) maskL = 0;
        if (maskT<0) maskT = 0;
        if (maskL> this.$('.preview_img').offsetWidth - mask.offsetWidth) maskL = this.$('.preview_img').offsetWidth - mask.offsetWidth;
        if (maskT>this.$('.preview_img').offsetHeight - mask.offsetHeight)  maskT=this.$('.preview_img').offsetHeight - mask.offsetHeight;
        //给mask赋值  让他随着鼠标动起来
        mask.style.left = maskL + 'px';
        mask.style.top = maskT + 'px';

        //让大图跟着动起来
        //小黄块的实时left/小黄块移动的最大left  = 大图的实时位置left/ 大图能移动的最大left值
        //大图移动的最大值
        let bigMaxLeft = this.$('.big img').offsetWidth -   this.$('.big').offsetWidth;
        let bigMaxTOP = this.$('.big img').offsetHeight -   this.$('.big').offsetHeight;

        //大图的实时位置
        let bigImgLeft = maskL / (this.$('.preview_img').offsetWidth - mask.offsetWidth) * bigMaxLeft;
        let bigImgTop = maskT / (this.$('.preview_img').offsetHeight - mask.offsetHeight) * bigMaxTOP;
        //给大图赋值
        this.$('.big img').style.left = -bigImgLeft + 'px';
        this.$('.big img').style.top = -bigImgTop + 'px';

    }
    //鼠标移出小图事件
    outFn(){
        this.$('.big').style.display='none';
        this.$('.mask').style.display='none';
    }
    //点击购物车的事件
    async clickFn(e){
        // console.log(123);
        //用户登录会保存localStorage值
        let token = localStorage.getItem('token');
        //获取商品id
        let goodsId =e.target.parentNode.parentNode.previousElementSibling.dataset.id;
        //获取用户id
        let  unameId = localStorage.getItem('user_id');
        // console.log(goodsId);
        //设置请求头
        axios.defaults.headers.common['authorization'] = token;
        // 必须设置内容的类型,默认是json格式,server 是处理不了
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        //拼接post请求
        let param = `id=${unameId}&goodsId=${goodsId}`;
        //发送请求
        let res = await axios.post('http://localhost:8888/cart/add',param);
        let { data , status}=res;
        // console.log(data,status);
        //判断请求成功
        if (status==200) {
            //判断成功获取到的参数
            if (data.code==1) {
                // 跳转到 购物车 页面
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


new detail1;