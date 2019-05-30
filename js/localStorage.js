var localSave={   //user    shopping
	setValue:function(o){
		var name=o.name   //编码用户
		var value=o.value  //所有的用户密码数组     jsonifiny后的字符串
//				var name=encodeURIComponent(o.name)
//				var value=encodeURIComponent(o.value)
		localStorage.setItem(name,value);
	},
	getDate:function(type,dates,fn){//type 决定去找用户还是购物车
		var TempArr=JSON.parse(localStorage.getItem(type));
		for(var j=0;j<TempArr.length;j++){
			if(dates==TempArr[j].userName){
				fn(TempArr[j],j)
				return;
			}
		}
		fn(-1)//没找到
	}
}
