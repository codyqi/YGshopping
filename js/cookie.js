var cookieObj={
	set:function (o){
			var cookiestr=encodeURIComponent(o.name)+"="+encodeURIComponent(o.value);
			if(o.expires){
				cookiestr+="; expires="+o.expires;
			}
		document.cookie=cookiestr;
	},
	get:function(name){
		var cook=document.cookie;
		 	var arr=cook.split("; ");
		 	for(var i=0;i<arr.length;i++){
		 		var newarr=arr[i].split("=");
		 		if(name==newarr[0]){
		 			return decodeURIComponent(newarr[1])
		 		}
		 	}
	},
	del:function(names){
		//设置时间为过期
			var nowdata=new Date();
			nowdata.setDate(-1);
			//调用设置方法
			cookieObj.set({
				name:names,
				expires:nowdata.toGMTString()
			})
	}

}