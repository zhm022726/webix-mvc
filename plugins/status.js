"use strict";
define([
	"app"
],function(app){

	var template;
	function message(text){
		var area = $$(template);
		if (area) area.setHTML(text);
	}

	var status = "good";
	var count = 0;
	var iserror = false;

	function setStatus(mode){
		if (count < 0) count = 0;

		if (mode == "saving"){
			status = "saving";
			refresh();
		} else {
			iserror = (mode == "error");
			if (count === 0){
				status = iserror ? "error" : "good";
				if (iserror && app.callEvent("ServerError",[]))
					show_error_message();

				refresh();
			}
		}
	}

	var icons = {
		"good":	"check",
		"error": "warning",
		"saving": ""
	};

	var texts = {
		"good":	"Data in sync",
		"error": "Error",
		"saving": "Connecting..."
	};

	function refresh(){
		message("<div class='status_"+status+"'><span class='webix_icon fa-"+icons[status]+"'></span> "+texts[status]+"</div>");
	}

	function success_event(){
		count--;
		setStatus("good");
	}
	function fail_event(){
		count--;
		setStatus("error");
	}
	function start_event(promise, data){
		if (promise){
			count++;
			setStatus("saving");

			var promise = promise.then ? promise : promise[0][2];
			promise.then( success_event, fail_event );
		}
	}

	webix.attachEvent("onRemoteCall", start_event);

	function show_error_message(){
		webix.alert({
			title:"Server side error",
			text:"It seems the app has a problem to process your request.<br>Try to repeat the last action and if problem reoccurs - please reload the app.",
			width:"550px"
		});
	}

	return {
		setStatus:setStatus,
		icons:icons,
		texts:texts,

		container:function(box){
			template = box;
		},
		track:function(col){
			if (col && col.config && col.config.id){
				var dp = webix.dp.$$(col.config.id);
				if (dp){
					dp.attachEvent("onAfterDataSend", start_event);
					dp.attachEvent("onAfterSaveError", fail_event);
					dp.attachEvent("onAfterSave", success_event);
				}
			}
		}
	};
});