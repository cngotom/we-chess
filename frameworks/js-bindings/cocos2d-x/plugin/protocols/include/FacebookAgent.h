/****************************************************************************
 Copyright (c) 2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#ifndef __FACEBOOK_AGENT_H__
#define __FACEBOOK_AGENT_H__

#include <string>
#include <map>
#include <vector>
#include <functional>

namespace cocos2d{namespace plugin{

class AgentManager;

class FacebookAgent{

public:
	~FacebookAgent();

	/** Get singleton of FacebookAgent */
	static FacebookAgent* getInstance();
	/** Destroy singleton of FacebookAgent */
	static void destroyInstance();

	enum HttpMethod{
		Get = 0,
		Post,
		Delete
	};

	typedef std::map<std::string, std::string> FBInfo;
	typedef std::function<void(int, std::string&)> FBCallback;

	/**
     @brief log in
     @param cb callback of login
     */
	void login(FBCallback cb);

	/**
     @brief log out
     */
	void logout();

	/**
     @brief Check whether the user logined or not
     */
	bool isLoggedIn();

	/**
     @brief request new permissions
     @param permissoins different permissions splited by ','
     @param cb callback of requestPermissions
     */
	void requestPermissions(std::string permissions, FBCallback cb);
	
	/**
     @brief get AccessToken
     */
	std::string getAccessToken();

	/**
     @brief share
     @param info share information
     @param cb callback of share
     */
	void share(FBInfo &info, FBCallback cb);

	/**
     @brief open a dialog of Facebook app
     @param info share information
     @param cb callback of dialog
     */
	void dialog(FBInfo &info, FBCallback cb);
	
	/**
     @brief use Facebook Open Graph api
     @param path path of Open Graph api
     @param method HttpMethod
     @param params request parameters
     @param cb callback of request
     */
	void request(std::string &path, int method, FBInfo &params, FBCallback cb);
	FBCallback getRequestCallback(int index);
private:
	FacebookAgent();
	
	AgentManager* agentManager;
	std::vector<FBCallback> requestCallbacks;
};

}}
#endif
