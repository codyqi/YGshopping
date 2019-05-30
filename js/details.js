$(function(){
	//正则获取参数
	function getQueryString(name) {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
       var r = window.location.search.substr(1).match(reg);
       if(r != null) {
             return decodeURIComponent(r[2]);
       }
       return '';
	}
	var pid=getQueryString("pid");
	var infoArr;//当前商品信息
	console.log(pid)
	$.ajax({
		url:"details.json",
		type:"get",
		async:true,//如果是异步，行66绑不了
		success:function(res){
			var tempArr=res.result.data;
			console.log(tempArr)
//			var infoArr;
			$.each(tempArr,function(index,Tarr){
				if(Tarr.pid==pid){
					infoArr=Tarr
					console.log(infoArr)
					return false;
				}
			})
			//放大镜部分数据加载
			$.each(infoArr.images,function(index,imgs){
				if(index==0){
					$(".small").append('<img src="'+imgs+'">')
					$(".big_img img").attr("src",imgs)
				}
				var str='<li>'
							+'<img src="'+imgs+'"/>'
						+'</li>'
				$(".goods_imgs_wrap").append(str)
			})
			$(".goods_imgs_wrap img").mouseenter(function(){//行66
				$(".small img").attr("src",$(this).attr("src"))
				$(".big_img img").attr("src",$(this).attr("src"))
			})
			
			//顶部中间部分数据加载
			$(".goods_name").html(infoArr.pname)
			$(".pnum").html(infoArr.price)
			if( infoArr.price!=infoArr.old_price ){
				$(".old_price").html("￥"+infoArr.old_price)
			}
			
			//产品介绍大图
			$.each(infoArr.images_big, function(index,src) {
				$(".photos").append('<img src="'+src+'"/>')
			});
		},
		error:function(err){
			console.log(err)
		}
	})
	
	//实现放大镜
	$(".small").on("mousemove",function(e){
		var axisX=e.clientX-$(".small").offset().left-$(".mask").outerWidth()/2;
		var axisY=e.clientY-$(".small").offset().top-$(".mask").outerHeight()/2;
		axisX<0? axisX=0 : axisX;
		axisY<0? axisY=0 : axisY;
		axisX>$(".small").width()-$(".mask").outerWidth()? axisX=$(".small").width()-$(".mask").outerWidth() : axisX;
		axisY>$(".small").height()-$(".mask").outerHeight()? axisY=$(".small").height()-$(".mask").outerHeight() : axisY;
		$(".mask").css({left:axisX+"px",top:axisY+"px"});
		var ratioX=$(".big_img img").width()/$(".small img").width();
		var ratioY=$(".big_img img").height()/$(".small img").height();
		$(".big_img").scrollLeft(ratioX*axisX)
		$(".big_img").scrollTop(ratioY*axisY)
	})
	$(".small").mouseleave(function(){
		$(".big_img").hide()
		$(".mask").hide()
	})
	$(".small").mouseenter(function(){
		$(".big_img").show()
		$(".mask").show()
	})

	//购买操作
	var buyCount=1;
	sessionStorage.removeItem("tempPid")
	$(".reduction").click(function(){
		buyCount--
		$(".add").css({"color":"#333","cursor":"pointer"})
		if( buyCount<=1 ){
			$(".show_buy_num").text(1)
			buyCount=1
			$(".reduction").css({"color":"#c1c1c1","cursor":"no-drop"})
		}else{
			$(".show_buy_num").text(buyCount)
		}
	})
	$(".add").click(function(){
		buyCount++
		$(".reduction").css({"color":"#333","cursor":"pointer"})
		if( buyCount>=10 ){
			$(".show_buy_num").text(10)
			buyCount=10
			$(".add").css({"color":"#c1c1c1","cursor":"no-drop"})
		}else{
			$(".show_buy_num").text(buyCount)
		}
	})
	
	//加入购物
	//	传    key(user/shopping)  value=[ {1},{2}，{3}... ]
	function pobj(){
		var goodsObj={//商品基本信息
			"pid": infoArr.pid,
			"pname": infoArr.pname,
			"imgs": infoArr.images[0],
			"price": infoArr.price,
			"old_price": infoArr.old_price,
			"count": buyCount
		};
		return goodsObj;
	}
	function setShopFun(uid){
		var flag=true;
		if(!localStorage.shopping){
			localSave.setValue( {name:"shopping",value:JSON.stringify([])} )//如果localStorage没存到shopping,则先存空数组
		}
		var shoppingArr=JSON.parse(localStorage.shopping);
		localSave.getDate("shopping",uid,function(userDate,index){//判断所有购物车是否存在用户
//		userCar(用户购物车) 		{
//									"userName": uid,
//									"goods":[{商品1},{商品2}]
//								}
			if(userDate==-1){//不存在
				var userCar={
					"userName": sessionStorage.hasUid
				}
				var temp=[]
				temp.push(pobj())
				userCar.goods=temp
				shoppingArr.push(userCar)//把用户购物车存到  所有的购物车里面
			}else{//已存在用户购物车
				//判断用户的购物车是否存在  此商品
				var produce=userDate.goods;
				$.each(produce, function(ind,obj) {
					if(obj.pid==pid){
						var old_count=obj.count
						produce[ind].count=old_count+buyCount;//更新数量
						shoppingArr[index].goods=produce
						flag=false
					}
				});
				if(flag){//把商品整体加入用户的购物车数组中
					produce.push(pobj())
					shoppingArr[index].goods=produce
				}
			}
		})
		var tempStr=JSON.stringify( shoppingArr )
		localSave.setValue( {name:"shopping",value:tempStr} )
	}
	$(".to_buy_car").click(function(){
		if(sessionStorage.hasLogin){
			setShopFun(sessionStorage.hasUid)
			alert("添加成功")
			var tttt=localStorage.shopping
			console.log(JSON.parse(tttt))
		}else{
			alert("请先登录")
			sessionStorage.buyToCar=true;
			sessionStorage.tempPid=pid
			location.href="login.html"
		}
	})
	//至顶
	$(".to_top").click(function(){
		 $("html,body").animate({scrollTop:0},"slow");
	})
	$(".in_buy_car").click(function(){
		if(sessionStorage.hasLogin){
			location.href="shoppingcar.html"
		}else{
			alert("请登录")
			location.href="login.html"
		}
	})
})
