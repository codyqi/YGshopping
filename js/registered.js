
$(function(){
	var userName;
	var userPass;
	$(".send_msg").click(function(){
		var phreg=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/; //验证手机正则
		var codeArr=["a","v","c","h","f","g","j","k","l","z","x",1,3,2,4,5,0,6,7,8,9,"A","B","C","D","W","Z"];
		function hsaMath(phoneC){
			var regRepaet=new RegExp(phoneC,"g"); //验证是否已被注册正则
			if(regRepaet.test( localStorage.user )){
				return true //已被注册
			}else{
				return false //没注册
			}
		}
		var tempCode="";
		//手机输入是否正确
		if( !$("#phoneNum").val() ){
			$(".form_phone .error").html('<i></i>请填写手机号').show()
		}else if( !(phreg.test( $("#phoneNum").val() )) ){
			$(".form_phone .error").html('<i></i>请输入正确的手机号').show()
		}else if( hsaMath( $("#phoneNum").val() ) ){
			$(".form_phone .error").html('<i></i>手机号已被注册').show()
		}else{  //手机正确
			if( $("#agree").attr("checked") ){ //服务框已勾选
				$(".user_input").hide()
				for(var i=0;i<6;i++){
					var tempStr=codeArr[Math.floor(Math.random()*codeArr.length)];
					tempCode+=tempStr;
				}
				sessionStorage.proveCode=tempCode;
				userName=$("#phoneNum").val()   	//用户名
				$(".set_pass").show()
				alert(sessionStorage.proveCode)
			}
		}
		if( !$("#agree").attr("checked") ){
			$(".agreement .error").show()
		}
	})
	$("#phoneNum").focus(function(){
		$(".form_phone .error").hide()
	})
	$("#agree").focus(function(){
		$(".agreement .error").hide()
	})
	
	//````````注册信息`````````
	var flagCode=flagPass=false;
	$("#phoneCode").blur(function(){
		var regCode=new RegExp(sessionStorage.proveCode,"gi")
		flagCode=true;
		if( !regCode.test($("#phoneCode").val()) ){
			$(".input_msg .error").html("<i></i>验证码错误").show()
			flagCode=false;
		}
	})
	$("#phoneCode").focus(function(){
		$(".input_msg .error").hide()
	})
	$("#setPass").blur(function(){
					//数字、字母、特殊字符的密码
		var setReg=/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,16}$/;
		var tempPass=$("#setPass").val()
		if( !$("#setPass").val() ){
			$(".password .error").html("<i></i>密码不能为空").show()
		}else if( !setReg.test(tempPass) ){
			$(".password .error").html("<i></i>密码至少6个包含数字、字母、特殊字符").show()
		}
	})
	$("#surePass").blur(function(){
		flagPass=true;
		if(!$("#surePass").val() || $("#surePass").val()!=$("#setPass").val()){
			$(".password_agin .error").html("<i></i>密码两次输入不一致").show()
			flagPass=false;
		}
	})
	$("#setPass").focus(function(){
		$(".password .error").hide()
	})
	$("#surePass").focus(function(){
		$(".password_agin .error").hide()
	})
	//立即注册       								{"userName"/"userPass"/"uid"}
			//	传    key(user/shopping)  value=[ {用户1},{用户2}，{用户3}... ]
	function setUserFun(name,pass){
		if(!localStorage.user){
			localSave.setValue( {name:"user",value:JSON.stringify([])} )//如果localStorage没存到user,则先存空数组
		}
		var userArr=JSON.parse(localStorage.user);
		var tempObj={
			"userName":name,
			"userPass":pass,
			"uid": "user"+(userArr.length+1)
		};
		userArr.push(tempObj) //把之前所有的用户的和这次要存储的用户拼接在一起
		var tempStr=JSON.stringify( userArr )
		localSave.setValue( {name:"user",value:tempStr} )
		console.log(JSON.parse(localStorage.user))
	}
	$(".registered_now").click(function(){
		if( flagCode && flagPass ){
			$(".logo_success").show("slow",function(){
				userPass=$("#setPass").val();		//用户密码
				setUserFun(userName,userPass)
				setTimeout(function(){
					localSave.getDate("user",userName,function(data,index){
						var nowdata=new Date();
						sessionStorage.loginTime=nowdata.toLocaleString()
						sessionStorage.hasLogin=true;
						sessionStorage.hasName=data.userName;
						sessionStorage.hasUid=data.uid;
					})
					location.href="index.html"
				},2000)
			})
		}
	})
})
