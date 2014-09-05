require("core/object");
require("config");
require("core/scene");
require("core/stateMachine");
require("core/sound");
require("view/Android_800_480/error_view");
require("view/view_config");
require("config/game_config");

function event_load ( width, height )	


	--同步关闭room/hall socket
	socket_room_close(-1);
	socket_hall_close(-1);

	
	--删除全部4类对象
	res_delete_group(-1);
	anim_delete_group(-1);
	prop_delete_group(-1);
	drawing_delete_all();

	--http怎么办呢？
	
	--关闭音乐
	Sound.stopMusic(true);

	errorScene = new(Scene,error_view);
	

	local errorContent = errorScene:getRoot():getChildByName("error_reason");
	
	local str = sys_get_string("last_lua_error");
	-- local str = debug.traceback();
	if str then
		print_string("last_lua_error" .. str);
	else
		print_string("last_lua_error not str" );
	end
	-- errorContent:setText(str);
	report_lua_error(str);

	errorBtn = errorScene:getRoot():getChildByName("error_repair_btn");
	errorBtn.onClick = function()
		dtor();
		to_lua("main.lua");
	end
	errorBtn:setOnClick(errorBtn,errorBtn.onClick);
end

--上报lua错误
function report_lua_error(error)
	print_string("report_lua_error = " .. error);
	dict_set_string(REPORT_LUA_ERROR , REPORT_LUA_ERROR .. kparmPostfix , error);
	call_native(REPORT_LUA_ERROR);

end

function event_touch_raw ( finger_action, x, y, drawing_id)	  
 
end

function event_anim ( anim_type, anim_id, repeat_or_loop_num )
end

function event_pause()
end

function event_resume()
end

function event_backpressed()    
end

function dtor()
	delete(errorScene);
end