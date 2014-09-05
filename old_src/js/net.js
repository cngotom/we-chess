var socket = io('http://www.lvlike.com:3000/xiangqi');

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});
	
socket.on('SStartGame', function (data) {
	netplay.isPlay=true ;	
	netplay.init(data.offs,data.map,data.last_turn);
	jQuery('#player_info').html(data.info);
	com.get("chessBox").style.display = "block";
	com.get("menuBox").style.display = "none";
	com.get("bnBox").style.display = "none";

});


socket.on('SMove', function (data) {
	netplay.oppendMove(data);
});

socket.on('SWatcherEnter', function (data) {
	var text = data.name + "加入了观战";
	jQuery("#info_list").prepend("<li>" + text + "</li>");
});

socket.on('SJoinRoom', function (data) {
	console.log(data.name);
	if(data.len >= 2 && !netplay.isPlay)
		socket.emit("CStartGame");
		
});

socket.on('SPlayerLeave', function (data) {
	var player_text = ["黑方","红方"]
	var text = player_text[data.type] + "连接中断，游戏暂停";	
	jQuery("#info_list").prepend("<li>" + text + "</li>");
	console.log(text);
})

socket.on('SWatcherLeave', function (data) {
	jQuery("#info_list").prepend("<li>" +  data.name + "离开了房间</li>");
})
socket.on('SPlayerReconnect', function (data) {
	var player_text = ["黑方","红方"]
	var text = player_text[data.type] + "连接恢复，游戏继续";	
	jQuery("#info_list").prepend("<li>" + text + "</li>");
	console.log(text);
})

socket.on('SCreateRoom',function(data){
	var room = data.room;
	var url = window.location.href + "?" + room;
	GameConfig.shareData.title = "我已经摆好了棋局，敢不敢来挑战!";	
	GameConfig.shareData.link = url;
	window.onShareComplete = function(){
		window.history.replaceState("","",url);
		socket.emit("CJoinRoom",{room:parseInt(room),name:GUserName()});
		jQuery("#share").hide();
		com.get("chessBox").style.display = "block";
		com.get("menuBox").style.display = "none";
		com.get("bnBox").style.display = "none";
		jQuery('#info_list').append("等待玩家加入");
	}
	alert("房间创建成功,分享连接给好友即可进行对战");
	com.get("share").style.display = "block";
});

socket.on('connect', function() {
	if(netplay.isPlay )
	{
		var text = "连接恢复";	
		jQuery("#info_list").prepend("<li>" + text + "</li>");
		window.location=window.location.href;
	}
});


socket.on('disconnect', function() {
	var text = "连接中断";	
	jQuery("#info_list").prepend("<li>" + text + "</li>");

})
