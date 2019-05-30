$(function(){
	var Uid=sessionStorage.hasUid
	$(".login_span").html("用户: "+sessionStorage.hasName)
	localSave.getDate("shopping",Uid,function(data,index){
		var buyArr=data.goods;
		console.log(buyArr)
		//个人购物车数据加载
		$.each(buyArr,function(index,obj){
			var savePrice=(obj.old_price-obj.price)*obj.count
			var str1='<input type="checkbox" name="'+index+'" class="select_this" />'
					+'<div class="photo_this">'
						+'<a href=""><img src="'+obj.imgs+'"/></a>'
					+'</div>'
			var	str2='<div class="table_wrap">'
						+'<p class="goods_tittle"><a href="">'+obj.pname+'</a></p>'
						+'<table class="goods_main_wrap">'
							+'<tr>'
								+'<td class="attr">'
									+'<input type="checkbox" />'
									+'颜色:<span>紫色</span>'
									+'尺码:<span>XXL</span>'
								+'</td>'
								+'<td class="count">'
									+'<span class="dis_count">'+obj.count+'</span>'
								+'</td>'
								+'<td class="price">￥<span class="dis_price">'+obj.old_price+'</span></td>'
								+'<td class="disprice">'
									+'<div>限时折扣</div>'
								+'</td>'
								+'<td class="this_sum">'
									+'<div class="dis_sum">￥'+obj.price+'</div>'
									+'<div class="less">共省 <span>￥'+savePrice.toFixed(2)+'</span></div>'
								+'</td>'
							+'</tr>'
						+'</table>'
					+'</div>'
					+'<div class="collect_del">'
						+'<i></i>'
						+'<i class="del_btn"></i>'
					+'</div>'
			$(".car_content").append('<div class="car_goods_msg">'+str1+str2+'</div>')
		})
		function showEleFun(Arrlen){
			if(Arrlen.length==0){
				$(".null").show()
				$(".car_top").css("opacity","0")
				$(".now_satus").css("opacity","0")
			}else{
				$(".null").hide()
				$(".car_top").css("opacity","1")
				$(".now_satus").css("opacity","1")
			}
		}
		showEleFun(buyArr)
		
		//购买操作
		var sum=0;//总价
		var countAll=0;//选购了总数
		var kind=0;//商品种类
		$(".selector_all").change(function(){
			if($(".selector_all").attr("checked")=="checked"){
				$(".car_goods_msg>input").attr("checked",true)
				sum=countAll=0;
				kind=buyArr.length
				$.each(buyArr,function(ind,ele){
					sum+=ele.price*ele.count
					countAll+=ele.count
				})
				console.log(countAll)
				$(".allSum").text(sum)
				$(".counts").text(countAll+"件")
				$(".kind").text(buyArr.length)
			}else{
				kind=sum=countAll=0;
				$(".car_goods_msg>input").attr("checked",false)
				$(".allSum").text(0)
				$(".counts").text("0件")
				$(".kind").text(0+"种")
			}
		})
		//计算种类   件数  总价
		$(".car_goods_msg>input").on("change",function(){
			$(".selector_all").attr("checked",false)
			var ind=parseInt($(this).attr("name"))
			var tprice=buyArr[ind].price;
			var tcount=buyArr[ind].count;
			var this_sum=tprice*tcount
			if($(this).attr("checked")=="checked"){
				sum += this_sum;
				countAll += tcount
				kind++;
			}else{
				sum -= this_sum;
				countAll -= tcount
				kind--;
				kind<0? kind=0 : kind;
			}
			$(".allSum").text(sum)
			$(".counts").text(countAll+"件")
			$(".kind").text(kind+"种")
		})
		
		//删除操作
		function shoppCarFun(deleteArr){//将个人购物车的商品数组更新
			localSave.getDate("shopping",sessionStorage.hasUid,function(data,index){
				var shoppingArr=JSON.parse(localStorage.shopping);
				shoppingArr[index].goods=deleteArr;
				var tempStr=JSON.stringify( shoppingArr )
				localSave.setValue( {name:"shopping",value:tempStr} )
			})
		}
		$(".del_btn").click(function(){
			var delInd=($(".del_btn").index($(this)))
			var delArr=buyArr
			delArr.splice(delInd,1)
			shoppCarFun(delArr)
			showEleFun(delArr)
			$(".car_content .car_goods_msg").eq(delInd).remove()
		})
		
		//全选删除
		$(".all_checked").change(function(){
			if($(".all_checked").attr("checked")=="checked"){
				$(".car_goods_msg>input").attr($(".all_checked").attr("checked"),true)
			}else{
				$(".car_goods_msg>input").attr("checked",false)
			}
			
		})
		$(".btn_del").click(function(){
			if($(".all_checked").attr("checked")=="checked"){
				var nullArr=[]
				shoppCarFun(nullArr)
				$(".car_content .car_goods_msg").remove()
				$(".null").show()
				$(".car_top").css("opacity","0")
				$(".now_satus").css("opacity","0")
				$(".all_checked").attr("checked",false)
			}
		})
	})
})
