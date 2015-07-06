"use strict";
define(function(){

	function crud_collection(data, fields, name){
		var id = webix.uid();

		var columns = [ { width:37, template:"<span class='webix_icon fa-trash-o'></span>" } ];
		for (var i = 0; i < fields.length; i++){
			var next = fields[i];
			if (typeof next === "string")
				columns[i+1] = { id:next, editor:"text", fillspace:1 };
			else
				columns[i+1] = next;
		}

		var table = {
			view:"datatable", columns:columns, id:id, scrollX:false,
			editable:true,
			onClick:{ webix_icon:function(ev, id){
				webix.confirm({
					text:"There is no undo, are you sure ?",
					callback:function(res){
						if (res)
							data.remove(id.row);
					}
				});
			}}
		};

		var toolbar = {
			view:"toolbar", elements:[
				{ view:"label", label:(name||"") },
				{ view:"button", value:"Add new", click:function(){
					var nid = data.add({});
					$$(id).editCell(nid, fields[0]);
				}}
			]
		}

		return {
			$ui:{ type:"clean", rows:[ toolbar, table ] },
			$oninit:function(){
				$$(id).sync(data);
			}
		};
	}

	function crud_model(data, fields){
		webix.message("Not implemented");
	}

	return {
		collection: crud_collection,
		model: crud_model
	};
});