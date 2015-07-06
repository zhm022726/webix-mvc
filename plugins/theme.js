"use strict";
define(function(){

	var key = "--:sales-client-app:";
	function _get_theme(){
		return {
			skin:webix.storage.local.get(key + "skin"),
			name:webix.storage.local.get(key + "theme")
		};
	}

	function _set_theme(name, skin){
		if (arguments.length == 1){
			var parts = name.split(":");
			name = parts[0];
			skin = parts[1];
		}

		var now = _get_theme();
		if (now.skin != skin || now.name != name){
			webix.storage.local.put(key + "skin", skin);
			webix.storage.local.put(key + "theme", name);
			document.location.reload();
		}
	}

	return {
		$oninit: function(){
			key = (app.id || "") + key;
		},

		setTheme: _set_theme,
		getTheme: _get_theme,
		getThemeId: function(){
			var theme = _get_theme();
			if (theme)
				return theme.name + ":" + theme.skin;

			return "siberia:webix";
		}
	};
});