$(function(){
	$(".login_btn").click(function(){
		var Name=$("#username").val();
		var Pass=$("#password").val();
		if(!Name || !Pass){
			alert("用户名和密码不能为空")
		}else{
			localSave.getDate("user",Name,function(data,index){
				if(data==-1){
					alert("用户名不存在或错误")	
				}else{
					if(Pass!=data.userPass){
						alert("密码不正确")
					}else{
						var nowdata=new Date();
						sessionStorage.loginTime=nowdata.toLocaleString()
						if($(".auto_login").attr("checked")=="checked"){
							nowdata.setDate(nowdata.getDate()+7)
							cookieObj.set({name:"autoLogin",value:Name,expires:nowdata.toGMTString()})
							cookieObj.set({name:"LoginTime",value:nowdata.toLocaleString(),expires:nowdata.toGMTString()})
						}
						if(sessionStorage.wantToCar){
							sessionStorage.removeItem("wantToCar")
							localSave.getDate("user",Name,function(data,index){
								sessionStorage.hasLogin=true;
								sessionStorage.hasName=data.userName;
								sessionStorage.hasUid=data.uid;
							})
							location.href="shoppingcar.html"
						}else if(sessionStorage.buyToCar){
							sessionStorage.hasLogin=true;
							sessionStorage.hasName=data.userName;
							sessionStorage.hasUid=data.uid;
							sessionStorage.removeItem("buyToCar")
							location.href="details.html?pid="+sessionStorage.tempPid
						}else{
							sessionStorage.hasLogin=true;
							sessionStorage.hasName=data.userName;
							sessionStorage.hasUid=data.uid;
							location.href="index.html"
						}
					}
				}
			})
		}
	})
})
