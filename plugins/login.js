"use strict";
define([
	"models/users",
	"libs/routie"
], function(users){
	var user = null;		//current user
	var olduser = null;		//previously logged user

	var config = {
		login		:"#!/login",
		afterLogin	:"",
		afterLogout	:"#!/login",

		ping:5*60*1000
	};


	function ping(){
		if (user)
			users.getLoginStatus().then(function(status){
				if (!status){
					user = status;
					show(config.afterLogout);
				}
			});
	}

	function show(url){
		if (url.indexOf("#") === 0)
			require(["app"], function(app){
				app.show(url.substr(2));
			});
		else
			document.location.href = url;
	}

	function try_to_login(){
		user = users.getLoginStatus().sync();
		return user;
	}

	function show_login_screen(){
		//show the same page after login
		config.afterLogin = document.location.hash || config.afterLogin;

		webix.delay(function(){
			show(config.login);
		});
		return false;
	}

	function try_to_logout(){
		olduser = user;
		user = false;

		if (users.logout)
			users.logout().sync();

		show(config.afterLogout);
	}
	routie("!/logout", try_to_logout);

	return  {
		$oninit:function(app, newconfig){
			if (newconfig)
				webix.extend(config, newconfig, true);

			if (config.ping)
				setInterval(ping, config.ping);

			config.afterLogin = config.afterLogin || ("#!"+app.config.start);
		},
		$onurl:function(url){
			if (!config.allowGuest && !user && url != "login"){
				try_to_login();
				if (!user)
					return show_login_screen();
			}
		},
		$onurlchange:function(ui, name, url){
			if (user === null)
				try_to_login();

			if (!user && !ui.$allowGuest){
				return show_login_screen();				
			} else if (user && name == "login"){
				webix.delay(function(){
					show(config.afterLogin);
				});
				return false;
			}
		},


		login:function(){
			show(config.login);
		},
		logout:try_to_logout,

		getStatus:function(){
			return !!user;
		},
		getInfo:function(){
			return user;
		},
		setInfo:function(value){
			if (value && !user && olduser){
				//change of active user
				if (user && olduser.group != value.group || olduser.login != value.login )
					return document.location.reload();
			}

			user = value;
			if (config.afterLogin)
				show(config.afterLogin);
		}
	};
});