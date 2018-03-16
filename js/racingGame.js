/**
 * *赛车动画
 * Created by alan on 17-6-6.
 */
var racingGame=(function(w){
    var racingGame=function(data){};
        config={
            runTime:"0.7s", //起跑时间
            runAfterClass:"" //起跑后赛马添加的class
        }
        _prop=racingGame.prototype,
        bg=$('#racing-container'), //得到大背景
        bg_tree=$("#bg-tree"),  //得到背景树
        signal_lamp=bg_tree.find('.road-ready'), //得到信号灯
        lane=$('#lane'),
        bg_line=$('#bg-line'),    //得到起点/终点线
        cars=$('.runway .car'), //得到所有车辆
        carStatus="Init",   //赛车当前状态
        css = {'backgroundPositionX': "100%"};
    var signalInterval;    //信号灯循环
    _prop.setStatus=function(status){
        carStatus = status;
    }
    _prop.getStatus=function(){
        return carStatus;
    }
    /**
     * 赛车信号灯变换
     */
    _prop.signal=function(){
        return;
        w.clearInterval(signalInterval);
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
    function bgmove() {
        if(css.backgroundPositionX=='100%'){
            bg.css('backgroundPositionX','0px');
            bg.velocity(css, {
                duration: 500,
//                loop:true,
                complete:bgmove,
                delay:false,
                easing:"linear",
                mobileHA:true,
                queue:""
            });
        }
    }
    /**
     * 赛车开始方法
     */
    _prop.Run=function(name_en){
        bgmove();
        _prop.setStatus("Run");
        cars.removeClass("car-active");
        bg_line.removeClass('bg-begin'); //移除起跑线
        if(name_en&&name_en=='SMPK10'){
            cars.addClass("running");
            config.runTime='2s';
            bg_line.addClass('bg-begin1');
            setTimeout(function(){
                bg_line.removeClass('bg-begin1');
            },400);
        }
        lane.hide();
        //赛车进入比赛第一阶段
        $("#car10").get(0).addEventListener("transitionend",enter_whiteHot_handler);
        cars.css({'transform':"translate(-200px)",'transition':'all '+config.runTime});

        signal_lamp.hide(); //隐藏信号灯
        w.clearInterval(signalInterval);
    };

    function enter_whiteHot_handler(event){
        _prop.WhiteHot(); //进入白热化阶段
        event.target.removeEventListener("transitionend",enter_whiteHot_handler);
    }
    /**
     * 赛车白热化阶段
     */
    _prop.WhiteHot=function(){
        _prop.setStatus("WhiteHot");

        white_hot_arr=getWhite_hot_arr();

        $("#car10").get(0).addEventListener("transitionend",action_whiteHot_handler);

        $.each(white_hot_arr,function(index,el){
            $('#car'+(index+1)).css({'transform':"translate("+white_hot_arr[index]+"px)",'transition':'all 3s'});
        });

    }

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
                num=Math.round(-Math.random()*300+10);
            }else{
                num=Math.round(-(Math.random()*100+10));
            }
            white_hot_arr.push(num);
        }
        return white_hot_arr;
    }

    function action_whiteHot_handler(event){
        var white_hot_arr=getWhite_hot_arr();
        $.each(white_hot_arr,function(index,el){
            $('#car'+(index+1)).css({'transform':"translate("+white_hot_arr[index]+"px)",'transition':'all 4s'});
        });
    }

    /**
     * 赛车冲刺阶段
     */
    _prop.Sprint=function(number,data,callBack,callBack1,endClass){
        _prop.setStatus('Sprint');
        var secord=0;
        var time=2500;
        var rank='<div class="rank"></div>';   //到达终点名次显示div
        var removeClassList;            //车子到达终点后移除的冒火/抖动效果
        var addClassList_before;       //车子到达终点前增加冒火效果
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

            $("#car"+el).get(0).addEventListener("transitionend",action_end_handler);

            $("#car"+el).addClass(addClassList_before).css({'transform':"translate(-810px)",'transition':'all '+time+'ms','transition-timing-function': 'linear'});

            function action_end_handler(event){
                if(i==0){
                    bg_line.addClass('bg-end'); //显示终点线
                    bg.velocity("stop");  //大背景停止切换
                    removeClassList="speedup running";
                }else if(i==1){
                    removeClassList="speedup running";
                }else if(i==2){
                    removeClassList="speedup running";
                }else if(i==9){ //最后一辆车达到终点
                    removeClassList="running";
                    //全部车辆到达终点后回调
                    if(callBack){
                        callBack(data);
                    }
                    if(callBack1){
                        callBack1(number,data);
                    }
                    //五秒之后重开
                    var setStatus=setInterval(function(){
                        if(secord>5){
                            w.clearInterval(setStatus);
                            _prop.setStatus("Sprint_end");
                            _prop.ReStart();
                            return;
                        }
                        secord++;
                    },1000);
                }else{
                    removeClassList="running";
                }
                var j=i+1;
                console.log(removeClassList);
                $("#car"+el).removeClass(removeClassList)
                    .append(rank).find('.rank ').addClass('rank'+j);

                event.target.removeEventListener("transitionend",action_end_handler);
            }

        }
        bg_line.removeClass('bg-begin'); //移除起跑线
        signal_lamp.hide(); //隐藏信号灯
        w.clearInterval(signalInterval);
        cars.stop(true); //暂停赛车动画
        $.each(data,function(i,el){
            $("#car10").get(0).removeEventListener("transitionend",action_whiteHot_handler);
            animate_sprint(i,el);
        });
    }
    /**
     * 赛车重开方法
     */
    _prop.ReStart=function(){
        _prop.setStatus("Init");
        signal_lamp.show();     //显示信号灯
        bg_line.removeClass('bg-end').addClass('bg-begin');  //移除终点线&&增加终点线
        lane.show();
        cars.css({'transform':"translate(0px)",'transition':"all 0s"}).addClass('car-active').find('.rank').remove();
        _prop.signal();
        $(".car").removeAttr('style');
    }
    //_prop.signal();
    return racingGame;
})(window);