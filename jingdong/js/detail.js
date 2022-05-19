class Detail {
    constructor(){
        //设置一个当前所在的图片索引
        this.index = 0;
        //给小图绑定移入事件
        this.$('.preview_img').addEventListener('mouseover',this.overFn.bind(this));
         //给小图绑定移出事件
        this.$('.preview_img').addEventListener('mouseout',this.outFn.bind(this));
        //给小图绑定移动事件
        this.$('.preview_img').addEventListener('mousemove',this.moveFn.bind(this));
        //给5张小图的ul绑定事件委托（点击）事件
        this.$('.list_item').addEventListener('click',this.clickFn.bind(this));
        //给上一张<  下一张>绑定点击事件(利用事件委托)
        this.$('.preview_list').addEventListener('click',this.clickPNFn.bind(this));
        // 给数量 的+  - 设置点击事件（事件委托）
        this.$('.choose_amount').addEventListener('click',this.clickPigeFn.bind(this));
        //给加入购物车绑定点击事件
        this.$('.addCar').addEventListener('click',this.clickAddFn.bind(this));
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
    //5张小图点击事件
    clickFn(e){
        
        // console.log(this);
        // console.log(this.$('.mask').previousElementSibling.src);
        // console.log(e.target.src);
        //判断点击的是否是图片
        // e.target.src = e.target.src ||this.index;
        if (e.target.src) {
            //让图片互换地址
             this.$('.mask').previousElementSibling.src = e.target.src;
             this.$('.big img').src = e.target.src;
            //让其他4图没有这个类
            this.$('.list_item li').forEach((key,val) => {
            //    console.log(key); 
            key.classList.remove('current');
            });
            //让选中的图有红色边框
            e.target.parentElement.classList.add('current');

            //保存点击图片的索引
            this.$('.list_item li').forEach((key,val) => {
              if (key.className =='current') {
                  this.index = val;
                //   console.log(val);
                  return ;
              }
                });
        }
       
    }
    //<  >绑定事件
    clickPNFn(e){
        // console.log(e.target.className);
        
        //判断是不是上一张
        if(e.target.className =='arrow_prev'){
            if (this.index <=0) {
                this.index = 5;
            }
           this.set(--this.index);
        }

        //判断是不是下一张
        if(e.target.className =='arrow_next'){
            if (this.index >=4) {
                this.index = -1;
            }
           this.set(++this.index);
        }
    }
    // <    > 里的图片交换事件
    set(index){
        // console.log(this.$('.list_item li')[index]);
        //让图片互换地址
        this.$('.mask').previousElementSibling.src  = this.$('.list_item li')[index].firstElementChild.src;
        this.$('.big img').src = this.$('.list_item li')[index].firstElementChild.src;
         //让其他4图没有这个类,循环所有li，去掉类的属性
         this.$('.list_item li').forEach((key,val) => {
            //    console.log(key); 
            key.classList.remove('current');
        });
        //让选中的图有红色边框（类）
        this.$('.list_item li')[index].classList.add('current');
        //保存点击图片的索引
        this.$('.list_item li').forEach((key,val) => {
            if (key.className =='current') {
                  this.index = val;
                //   console.log(val);
                 return ;
            } 
        });

    }
    //数量的+  -事件
    clickPigeFn(e){
        //当鼠标点击+时
        if (e.target.className =='add') {  
            //input框里的值就+1
            ++this.$('.choose_amount input').value; 
        }
        //当鼠标点击+时
        if (e.target.className =='reduce') {
            //当input框里的值等于1是  就停止
            if (this.$('.choose_amount input').value ==1){
                return;
        } 
        //  否则input框里的值就+1
            --this.$('.choose_amount input').value;
        }
        
    }
    //加入购物车的点击事件
    async clickAddFn(){
        // let goodsId =e.target.parentNode.dataset.id;
        // let  unameId = localStorage.getItem('user_id');
        let res =await axios.get(`http://localhost:8888/goods/item?`)
    }

    //获取节点函数
    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
      }
    
}
new Detail;