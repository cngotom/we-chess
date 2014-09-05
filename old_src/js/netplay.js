/*! 流星飞雨 | qq:396263612 | 欢迎指教 */

var netplay = netplay||{};

netplay.init = function (offs,map,last_turn){
	var map = map || com.initMap;
	netplay.my				=	1;				//玩家方
	netplay.nowMap			=	map;
	netplay.map 			=	com.arr2Clone ( map );		//初始化棋盘
	netplay.nowManKey		=	false;			//现在要操作的棋子
	netplay.pace 			=	[];				//记录每一步
	netplay.isPlay 		=	true ;			//是否能走棋
	
	netplay.bylaw 			= 	com.bylaw;
	netplay.show 			= 	com.show;
	netplay.showPane 		= 	com.showPane;
	netplay.isOffensive	=	(offs)?true:false;			//是否先手
	netplay.clickHandling   = !netplay.isOffensive;          //是否正则处理点击事件
	netplay.isFoul			=	false;			//是否犯规长将
	com.pane.isShow		=	 false;			//隐藏方块
	

       	netplay.isWatcher = false;
        if(offs == -1)
        	netplay.isWatcher = true;
	//清除所有旗子
	netplay.mans 			=	com.mans	= {};
	
	//这么搞有点2，以后说不定出啥问题，先放着记着以后改
	com.childList.length = 3
	/*
	l(com.childList)
	for (var i=0; i<com.childList.length ; i++){
		var o = com.childList[i];
		if (o.pater) com.childList.splice(i, 1)
	}
	l(com.childList)
	*/
	com.createMans( map )		//生成棋子	
	com.bg.show();
	
	//初始化棋子
	for (var i=0; i<netplay.map.length; i++){
		for (var n=0; n<netplay.map[i].length; n++){
			var key = netplay.map[i][n];
			if (key){
				com.mans[key].x=n;
				com.mans[key].y=i;
				com.mans[key].isShow = true;
			}
		}
	}
	netplay.show();
	if(!netplay.isOffensive)
	{
		for(var key in com.mans)
		{
			com.mans[key].my = -com.mans[key].my;
		}
	}

	if(last_turn != undefined)
		netplay.clickHandling = (last_turn == offs);

	//绑定点击事件
        if(!netplay.isWatcher)
		com.canvas.addEventListener("click",netplay.clickCanvas)
}



//悔棋
netplay.regret = function (){
	var map  = com.arr2Clone(com.initMap);
	//初始化所有棋子
	for (var i=0; i<map.length; i++){
		for (var n=0; n<map[i].length; n++){
			var key = map[i][n];
			if (key){
				com.mans[key].x=n;
				com.mans[key].y=i;
				com.mans[key].isShow = true;
			}
		}
	}
	var pace= netplay.pace;
	pace.pop();
	pace.pop();
	
	for (var i=0; i<pace.length; i++){
		var p= pace[i].split("")
		var x = parseInt(p[0], 10);
		var y = parseInt(p[1], 10);
		var newX = parseInt(p[2], 10);
		var newY = parseInt(p[3], 10);
		var key=map[y][x];
		//try{
	 
		var cMan=map[newY][newX];
		if (cMan) com.mans[map[newY][newX]].isShow = false;
		com.mans[key].x = newX;
		com.mans[key].y = newY;
		map[newY][newX] = key;
		delete map[y][x];
		if (i==pace.length-1){
			com.showPane(newX ,newY,x,y)	
		}
		//} catch (e){
		//	com.show()
		//	z([key,p,pace,map])
			
		//	}
	}
	netplay.map = map;
	netplay.my=1;
	netplay.isPlay=true;
	com.show();
}



//点击棋盘事件
netplay.clickCanvas = function (e){

	if(netplay.clickHandling)
		return false;
	if (!netplay.isPlay) return false;
	var key = netplay.getClickMan(e);
	var point = netplay.getClickPoint(e);
	
	var x = point.x;
	var y = point.y;
	
	if (key){
		netplay.clickMan(key,x,y);	
	}else {
		netplay.clickPoint(x,y);	
	}


	netplay.isFoul = netplay.checkFoul();//检测是不是长将
}

//点击棋子，两种情况，选中或者吃子
netplay.clickMan = function (key,x,y){
	var man = com.mans[key];
	//吃子
	if (netplay.nowManKey&&netplay.nowManKey != key && man.my != com.mans[netplay.nowManKey ].my){
		//man为被吃掉的棋子
		if (netplay.indexOfPs(com.mans[netplay.nowManKey].ps,[x,y])){


			socket.emit("CMove",{key:netplay.nowManKey,x:x,y:y});

			netplay.clickHandling = true;
			man.isShow = false;
			var pace=com.mans[netplay.nowManKey].x+""+com.mans[netplay.nowManKey].y
			//z(bill.createMove(netplay.map,man.x,man.y,x,y))
			delete netplay.map[com.mans[netplay.nowManKey].y][com.mans[netplay.nowManKey].x];
			netplay.map[y][x] = netplay.nowManKey;
			com.showPane(com.mans[netplay.nowManKey].x ,com.mans[netplay.nowManKey].y,x,y)
			com.mans[netplay.nowManKey].x = x;
			com.mans[netplay.nowManKey].y = y;
			com.mans[netplay.nowManKey].alpha = 1
			
			netplay.pace.push(pace+x+y);
			netplay.nowManKey = false;
			com.dot.dots = [];
			com.show()
			com.pane.isShow = false;
			com.get("clickAudio").play();
			//setTimeout(netplay.AIPlay,500);
			if (key == "j0") netplay.showWin (-1);
			if (key == "J0") netplay.showWin (1);
		}
	// 选中棋子
	}else{
		if (man.my===1){
			if (com.mans[netplay.nowManKey]) com.mans[netplay.nowManKey].alpha = 1 ;
			man.alpha = 0.8;
			com.pane.isShow = false;
			netplay.nowManKey = key;
			com.mans[key].ps = com.mans[key].bl(); //获得所有能着点
			com.dot.dots = com.mans[key].ps
			com.show();
			//com.get("selectAudio").start(0);
			com.get("selectAudio").play();
		}
	}
}

//点击着点
netplay.clickPoint = function (x,y){
	var key=netplay.nowManKey;
	var man=com.mans[key];
	if (netplay.nowManKey){
		if (netplay.indexOfPs(com.mans[key].ps,[x,y])){
			socket.emit("CMove",{key:key,x:x,y:y});
			netplay.clickHandling = true;
			var pace=man.x+""+man.y
			//z(bill.createMove(netplay.map,man.x,man.y,x,y))
			delete netplay.map[man.y][man.x];
			netplay.map[y][x] = key;
			com.showPane(man.x ,man.y,x,y)
			man.x = x;
			man.y = y;
			man.alpha = 1;
			netplay.pace.push(pace+x+y);
			netplay.nowManKey = false;
			com.dot.dots = [];
			com.show();
			com.get("clickAudio").play();
			//setTimeout(netplay.AIPlay,500);
		}else{
			//alert("不能这么走哦！")	
		}
	}
	
}

//对手走棋
netplay.oppendMove = function(data)
{

	var key = data.key
	netplay.nowManKey = key;
	var key = netplay.map[data.y][data.x];
	if (key){
		netplay.AIclickMan(key,data.x,data.y);	
	}else {
		netplay.AIclickPoint(data.x,data.y);	
	}
	com.get("clickAudio").play();

	setTimeout(function(){
		netplay.clickHandling = false;
	},100)

}

//Ai自动走棋
netplay.AIPlay = function (){
	//return
	netplay.my = -1 ;
	var pace=AI.init(netplay.pace.join(""))
	if (!pace) {
		netplay.showWin (1);
		return ;
	}
	netplay.pace.push(pace.join(""));
	var key=netplay.map[pace[1]][pace[0]]
		netplay.nowManKey = key;
	
	var key=netplay.map[pace[3]][pace[2]];
	if (key){
		netplay.AIclickMan(key,pace[2],pace[3]);	
	}else {
		netplay.AIclickPoint(pace[2],pace[3]);	
	}
	com.get("clickAudio").play();

	setTimeout(function(){
		netplay.clickHandling = false;
	},100)
	
}

//检查是否长将
netplay.checkFoul = function(){
	var p=netplay.pace;
	var len=parseInt(p.length,10);
	if (len>11&&p[len-1] == p[len-5] &&p[len-5] == p[len-9]){
		return p[len-4].split("");
	}
	return false;
}



netplay.AIclickMan = function (key,x,y){
	var man = com.mans[key];
	//吃子
	man.isShow = false;
	delete netplay.map[com.mans[netplay.nowManKey].y][com.mans[netplay.nowManKey].x];
	netplay.map[y][x] = netplay.nowManKey;
	netplay.showPane(com.mans[netplay.nowManKey].x ,com.mans[netplay.nowManKey].y,x,y)
	
	com.mans[netplay.nowManKey].x = x;
	com.mans[netplay.nowManKey].y = y;
	netplay.nowManKey = false;
	
	com.show()
	if (key == "j0") netplay.showWin (-1);
	if (key == "J0") netplay.showWin (1);
}

netplay.AIclickPoint = function (x,y){
	var key=netplay.nowManKey;
	var man=com.mans[key];
	if (netplay.nowManKey){
		delete netplay.map[com.mans[netplay.nowManKey].y][com.mans[netplay.nowManKey].x];
		netplay.map[y][x] = key;
		
		com.showPane(man.x,man.y,x,y)
		
	
		man.x = x;
		man.y = y;
		netplay.nowManKey = false;
		
	}
	com.show();
}


netplay.indexOfPs = function (ps,xy){
	for (var i=0; i<ps.length; i++){
		if (ps[i][0]==xy[0]&&ps[i][1]==xy[1]) return true;
	}
	return false;
	
}

//获得点击的着点
netplay.getClickPoint = function (e){
	var domXY = com.getDomXY(com.canvas);
	var x=Math.round((e.pageX-domXY.x-com.pointStartX-20)/com.spaceX)
	var y=Math.round((e.pageY-domXY.y-com.pointStartY-20)/com.spaceY)

	if(!netplay.isOffensive)
	{
		y = 9 - y; 
	}

	return {"x":x,"y":y}
}

//获得棋子
netplay.getClickMan = function (e){
	var clickXY=netplay.getClickPoint(e);
	var x=clickXY.x;
	var y=clickXY.y;
	if (x < 0 || x>8 || y < 0 || y > 9) return false;
	return (netplay.map[y][x] && netplay.map[y][x]!="0") ? netplay.map[y][x] : false;
}

netplay.showWin = function (my){
	netplay.isPlay = false;
        if(netplay.isWatcher)
        {
		if (my==netplay.isOffensive){
			alert("游戏结束,红方赢了！");
		}else{
			alert("游戏结束,黑放胜利");
		}
	}
	else
	{
		socket.emit("CGameOver",{});
		if (my==netplay.isOffensive){
			alert("恭喜你，你赢了！");
		}else{
			alert("很遗憾，你输了！");
		}
	}
	window.location = window.location.href;
}


