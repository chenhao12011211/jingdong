class Index{
    constructor(){
        //设置全局变量  保存定时器
        this.times ;
        //保存当前的图片的索引
        this.index = 0;
        //保存上一张图片的索引
        this.lastIndex = 0;
        //轮播图的实现
        this.ShufflingFigureFn();
        //倒计时的实现
        this.theCountdownFn();
    }   
    //轮播图的实现
    ShufflingFigureFn(){
        //定时器的实现
        this.autoPlay();
         //给下一个绑定点击事件
         this.$('.arrow-r').addEventListener('click',this.nextonclick.bind(this));
         //给上一个绑定点击事件
         this.$('.arrow-l').addEventListener('click',this.prevonclick.bind(this));
         //鼠标移入  轮播图停止
        this.$('.grid-col2-t').addEventListener('mouseover',this.overFn.bind(this));
        //鼠标移出  轮播图继续
        this.$('.grid-col2-t').addEventListener('mouseout',this.outFn.bind(this));

    }
    //设置一个定时器  1s后执行下一张的点击事件
    autoPlay(){
        this.times = setInterval(()=>{
            this.nextonclick();
        },1000)
    };
    //上一个的点击事件
    prevonclick(){
        //保存上一个的索引
        this.lastIndex  = this.index;
        //索引--
        this.index--;
        // console.log(this.index);
        //判断范围
        if (this.index<0) {
            this.index=3
        }
        this.change();
    }
    //下一个的点击事件
    nextonclick(){
         //保存上一个的索引
        this.lastIndex  = this.index;
        //索引++
        this.index++;
         //判断范围
        if (this.index>3) {
            this.index=0
        }
        this.change();
    }
    //图片的出现
    change(){
        //那个图片出现   就让他的索引有ca这个类
        this.$('.t-img li')[this.lastIndex].className = '';
        this.$('.t-img li')[this.index].className = 'ca';
    }
    //鼠标移入关闭定时器
    overFn(){
        clearInterval(this.times);
    }
    //鼠标移除开启定时器
    outFn(){
        this.autoPlay();
    }
    //倒计时的实现
    async theCountdownFn(){
        let times; 
        //获取4个节点  在定时器里面获取报错
        let zhengdian = this.$('.zhengdian');
        let hour = this.$('.hour');
        let minute = this.$('.minute');
        let second = this.$('.second');
        
        // 开启个定时器
        times = setInterval(function () {
        //获取第一个当前的时间
        let date1 = new Date;
        //获取第一个当前时间的小时数
        date1 = date1.getHours();
        // console.log(date1);
        //如果时间是偶数 就+2
        if (date1 %2==0) {
            date1+=2;
            // console.log(date1);
        }else{
            //是奇数  +1
            date1+=1;
            // console.log(date1);
        }
        //此时的date1是每隔2小时的时间
        //把他变成时间戳
        //把他变成字符串 追加到页面中
        let param = date1+':00';
        zhengdian.innerHTML = param;
        //把第一个时间变成时间戳
        let a = date1*1000*60*60;
        // console.log(a);
        //获取第二个当前时间  把他的年月日变成2022年5月5号
        let date2= new Date;
        date2.setFullYear(2022);
        date2.setMonth(4);
        //此时的date2为5.5的现在时间的时间戳
        date2.setDate(5);
        date2 = date2 -0;
        //console.log(date2);
        //获取5.5的0时0分0秒的时间戳  
        let date3 =new Date(2022,4,5);
        // console.log(date3);
        //获取5月5号现在几点的时间戳 - 5月5号的0时0分的时间戳
        let b= date2 - date3;
        // console.log(b);
        // console.log(a-b);
        //此时的c为倒计时的时间戳
        let c = a-b;
        // console.log(a,b,c);
        // 把c 变成一个秒数
        
        c = Math.round(c/1000);
        console.log(c/60);
            hour.innerHTML = Math.floor(c/(60*60));
            minute.innerHTML = Math.floor(c/60-Math.floor(c/(60*60))*60);
            second.innerHTML = c%60;
        },1000)
        
        
    }


    //获取节点函数
    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
      }
}
new Index;