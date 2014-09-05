--���ļ���������ɣ�������Ϊ���ļ�?
--Note�����ļ��� ANSI ���룬ע���Լ�תΪUTF-8
require("config");
require("view/view_config");
require("core/anim");
require("core/constants");
require("core/drawing");
require("core/eventDispatcher");
require("core/stateMachine");
require("core/global");
require("core/object");
require("core/prop");
require("core/res");
require("core/system");
require("core/sound");
require("core/gameString");
require("framerate");
require("net/http/PhpInfo");
require("util/NativeEvent");

function event_load ( width, height )
	NativeEvent.initGame();
	PhpInfo.setPlatform(PhpInfo.APPID_NDUO, PhpInfo.APPKEY_NDUO,PhpInfo.BID_NDUO,PhpInfo.SID_GOOGLEPLAY,PhpInfo.TYPE_YOUKE);
	StateMachine:getInstance():changeState(States.Hall);
end
