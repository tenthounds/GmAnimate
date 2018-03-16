/**
 * *赛车动画
 * Created by alan on 17-6-6.
 */
var racingGame=(function(w){
    var racingGame=function(){};
    var _prop=racingGame.prototype;
    var bg=$('#container'); //得到大背景
    var bg_tree=$("#bg-tree");  //得到背景树
    var signal_lamp=bg_tree.find('.road-ready'); //得到信号灯
    var runway=$('.bg-runway');    //得到跑道
    var cars=$('.runway .car'); //得到所有车辆
    var signalInterval;     //信号灯循环
    var WhiteHotInterval;   //白热化循环
    var carStatus="Init";   //赛车当前状态
    /**
     * 赛车信号灯变换
     */
    _prop.signal=function(){
        signalInterval=setInterval(function(){
            if(signal_lamp.hasClass('road-ready-1')){
                signal_lamp.removeClass('road-ready-1').addClass('road-ready-2');
            }else if(signal_lamp.hasClass('road-ready-2')){
                signal_lamp.removeClass('road-ready-2').addClass('road-ready-3');
            }else{
                signal_lamp.removeClass('road-ready-3').addClass('road-ready-1');
            }
        },200)
    };
    /**
     * 赛车开始方法
     */
    _prop.Run=function(){
        //起跑阶段
        carStatus="Run";
        bg.addClass('bgmove');
        runway.removeClass('bg-begin'); //移除起跑线
        cars.animate({'margin-right':"100px"},200,'linear');    //赛车进入比赛第一阶段
        signal_lamp.hide(); //隐藏信号灯
        window.clearInterval(signalInterval);
        _prop.WhiteHot(); //进入白热化阶段
    };
    /**
     * 赛车白热化阶段
     */
    _prop.WhiteHot=function(){
        carStatus="WhiteHot";
        /**
         * @returns 随机数组（元素值-50～50之间）
         */
        function getWhite_hot_arr(){
            var white_hot_arr=[];
            var flag;
            var num;
            for(var i=0;i<10;i++){
                flag=Math.random();
                if(flag>0.5){
                    num=Math.round(Math.random()*20+30);
                }else{
                    num=Math.round(-(Math.random()*20+30));
                }
                white_hot_arr.push(num);
            }
            return white_hot_arr;
        }
        WhiteHotInterval=setInterval(function(){
            var white_hot_arr=getWhite_hot_arr();
            $.each(white_hot_arr,function(index,el){
                $('#car'+(index+1)).animate({'margin-right':white_hot_arr[index]+100+"px"},1000);
            })
        },1100);
    }
    /**
     * 赛车冲刺阶段
     */
    _prop.Sprint=function(data){
        carStatus='Sprint';
        var secord=0;
        var time=3000;
        var sort='<div class="sharp"></div>';   //到达终点名次显示div
        var marginJson={'margin-right':'762px'};
        var removeClassList;            //车子到达终点后移除的冒火/抖动效果
        var addClassList_before;       //车子到达终点前增加冒火效果
        var addCLassList_after;         //前三名达到终点后名次的背景效果
        /**
         *冲刺动画渲染
         */
        function animate_sprint(i,el){
            if(i<3){
                addClassList_before="speedup";
                time+=300;
            }else{
                addClassList_before="";
                time+=200;
            }
            $("#car"+el).addClass(addClassList_before).animate(marginJson,time,'linear',function(){
                if(i==0){
                    runway.addClass('bg-end'); //显示终点线
                    bg.removeClass('bgmove');  //大背景停止切换
                    removeClassList="speedup car-active";
                    addCLassList_after="no1";
                }else if(i==1){
                    removeClassList="speedup car-active";
                    addCLassList_after="no2";
                }else if(i==2){
                    removeClassList="speedup car-active";
                    addCLassList_after="no3";
                }else if(i==9){ //最后一辆车达到终点
                    var setStatus=setInterval(function(){
                        if(secord>5){
                            window.clearInterval(setStatus);
                            carStatus='Sprint_end';
                           // _prop.ReStart();
                            return;
                        }
                        secord++;
                    },1000)
                }else{
                    removeClassList="car-active";
                    addCLassList_after="";
                }

                $("#car"+el).removeClass(removeClassList)
                    .append(sort).find('.sharp ').addClass(addCLassList_after).html(getChinese(i));
            });
        }
        /**
         * 将数字转换成中文
         * @param index
         * @returns 中文数字
         */
        function getChinese(index){
            var sortChinese;
            switch(index){
                case 0:sortChinese= '冠'; break;
                case 1:sortChinese= '亚'; break;
                case 2:sortChinese= '季'; break;
                case 3:sortChinese= '四'; break;
                case 4:sortChinese= '五'; break;
                case 5:sortChinese= '六'; break;
                case 6:sortChinese= '七'; break;
                case 7:sortChinese= '八'; break;
                case 8:sortChinese= '九'; break;
                case 9:sortChinese= '十'; break;
                default : break;
            }
            return sortChinese;
        }
        runway.removeClass('bg-begin'); //移除起跑线
        signal_lamp.hide(); //隐藏信号灯
        window.clearInterval(signalInterval);
        window.clearInterval(WhiteHotInterval);     //清除白热化阶段
        cars.stop(); //暂停赛车动画
        $.each(data,function(i,el){
            animate_sprint(i,el);
        });
    }
    /**
     * 赛车重开方法
     */
    _prop.ReStart=function(){
        carStatus="Init";
        signal_lamp.show();     //显示信号灯
        runway.removeClass('bg-end').addClass('bg-begin');  //移除终点线&&增加终点线
        cars.css('margin-right',"0").addClass('car-active').find('.sharp').remove();
        _prop.signal();
    }
    _prop.signal();
    return racingGame;
})(window);