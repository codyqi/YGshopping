$(function(){
	$.ajax({
		url:"index.json",
		type:"get",
		success:function(res){
			var likeArr=res.result.data;
			console.log(likeArr)
			var str="";
			for(var i=0;i<likeArr.length;i++){
				str+='<li pid="'+likeArr[i].pid+'">'
						+'<img src="'+likeArr[i].images+'" />'
						+'<div class="introduce_price">'
							+'<p class="like_introduce">'+likeArr[i].pname+'</p>'
							+'<p class="like_price">￥'+likeArr[i].price+'</p>'
						+'</div>'
					+'</li>'
			}
			$(".yourLikes_imgs_wrap").prepend(str)
			$(".yourLikes_imgs_wrap li").click(function(){
				location.href="details.html?pid="+$(this).attr("pid")
			})
		},
		error:function(err){
			console.log(err)
		}
	})
	if(sessionStorage.hasLogin){
		$(".login_right a").first().html('<span>用户:'+sessionStorage.hasName+'</span>'+'<div class="info_user"><img src="img/avatar.gif"/><p class="last_login"></p><span class="exit">推出</span></div>')
	}
	$(".exit").click(function(){
		$(".login_right a").first().html('<span class="login_span">您好,请登录</span><span>免费注册</span>'+'<div class="info_user"><img src="../img/pig.png"/><p class="last_login"></p><span class="exit">推出</span></div>')
		sessionStorage.clear()
	})
	$(".buy_car").click(function(){
		if(sessionStorage.hasLogin){
			location.href="shoppingcar.html"
		}else{
			alert("请登录,查看购物车")
			sessionStorage.wantToCar=true;
			location.href="login.html"
		}
	})
	var uname=cookieObj.get("autoLogin")
	if(uname){
		localSave.getDate("user",uname,function(data){
			sessionStorage.hasLogin=true;
			sessionStorage.hasName=data.userName;
			sessionStorage.hasUid=data.uid;
		})
		$(".login_right a").first().html('<span>用户:'+sessionStorage.hasName+'</span>'+'<div class="info_user"><img src="img/avatar.gif"/><p class="last_login"></p><span class="exit">推出</span></div>')
		var now=cookieObj.get("LoginTime")
		if(sessionStorage.hasLogin){
			$(".last_login").html("上次登录: "+now)
		}
	}
	
	
	$(".loginbar_middle a").mouseenter(function(){
		var len=$(this).children().length-1
		$(this).children().eq(len).show(200)
	})
	$(".loginbar_middle a").mouseleave(function(){
		$(".loginbar_middle a div").hide()
	})
	
	$.ajax({
		type:"get",
		url:"place.json",
		async:true,
		success:function(res){
			var placeArr=res.data.areaList;
			$.each(placeArr,function(ind,arrs){
				$(".pos_lis_wrap").append('<li>'+arrs.areaName+'</li>')
			})
			$(".pos_lis_wrap li").click(function(){
				$(".thisPlace").html($(this).text())
			})
		}
	});
	
	//秒杀倒计时
	var lastTime=new Date(2019,5,1).getTime()
	console.log(lastTime)
	console.log(nowDate=new Date().getTime())
	function TimeFun(){
		var nowDate=new Date().getTime()
		var dif=parseInt((lastTime-nowDate)/1000)
		if(dif<=0){
			cler
		}
		var seconds=dif%60
		var minutes=parseInt(dif/60%60)
		var hours=parseInt(dif/60/60)
		$(".seconds").text(seconds<10? "0"+seconds : seconds)
		$(".minutes").text(minutes<10? "0"+minutes : minutes)
		$(".hours").text(hours<10? "0"+hours : hours)
	}
	TimeFun()
	setInterval(TimeFun,1000)
	
	//轮播图
	//  0        1         2       3(0)
	// 0*1210   1*2110    2*1210   3*1210
	var count=0;
	var flag=true
	function move(ind){
		flag=false
		$(".killGoods_ul").animate({"margin-left":-1211*ind+"px"},900,function(){
			if(ind==3){
				$(".killGoods_ul").css("margin-left","0px")
				count=0
			}
			flag=true
		})
	}
	var TCarousel=setInterval(function(){
		count++;
		move(count)
	},3300)
	//   上一张
	$(".To_left").click(function(){
		count--;
		if(count<0 && flag){
			count=2
			$(".killGoods_ul").css({"margin-left":"-3630px"})
		}
		move(count)
	}).mouseenter(function(){
		clearInterval(TCarousel)
	}).mouseleave(function(){
		TCarousel=setInterval(function(){
			count++;
			move(count)
		},3300)
	})
	//    下一张
	$(".To_right").click(function(){
		count++;
		if(count<0 && flag){
			count=2
			$(".killGoods_ul").css({"margin-left":"-3630px"})
		}
		move(count)
	}).mouseenter(function(){
		clearInterval(TCarousel)
	}).mouseleave(function(){
		TCarousel=setInterval(function(){
			count++;
			move(count)
		},3300)
	})
	
	$(".killGoods").mouseenter(function(){
		$(".To_left").show()
		$(".To_right").show()
	}).mouseleave(function(){
		$(".To_left").hide()
		$(".To_right").hide()
	})

	//至顶
	$(".to_top").click(function(){
		 $("html,body").animate({scrollTop:0},"slow");
	})

})
