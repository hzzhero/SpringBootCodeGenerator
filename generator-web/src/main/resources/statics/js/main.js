
$.inputArea = undefined;
$.outputArea = undefined;

$(function(){
	//powered by zhengkai.blog.csdn.net

	//init input code area
	$.inputArea = CodeMirror.fromTextArea(document.getElementById("inputArea"), {
		lineNumbers: true,
		lineWrapping: false,
		readOnly: false,
		foldGutter: true,
		mode: "text/x-sql"
	});
	$.inputArea.setSize('auto','auto');

	// init output code area
	$.outputArea = CodeMirror.fromTextArea(document.getElementById("outputArea"), {
		mode: "text/x-java",  //Java语言
		lineNumbers: true,   //显示行号
		smartIndent: true, // 自动缩进
		autoCloseBrackets: true// 自动补全括号
	});
	$.outputArea.setSize('auto','auto');

});


const vm = new Vue({
	el: '#rrapp',
	data: {
		formData: {
			tableSql: "CREATE TABLE 'sys_user_info' (\n" +
				"  'user_id' int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号',\n" +
				"  'user_name' varchar(255) NOT NULL COMMENT '用户名',\n" +
				"  'status' tinyint(1) NOT NULL COMMENT '状态',\n" +
				"  'create_time' datetime NOT NULL COMMENT '创建时间',\n" +
				"  PRIMARY KEY ('user_id')\n" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息'",
			options: {
				dataType: "sql",

				authorName: "zhengkai.blog.csdn.net",
				packageName: "cn.devtools",
				returnUtilSuccess: "Return.SUCCESS",
				returnUtilFailure: "Return.ERROR",

				isPackageType: true,
				isSwagger: false,
				isAutoImport: false,
				isWithPackage: false,
				isComment: true,
				isLombok: true,

				ignorePrefix:"sys_",
				tinyintTransType: "int",
				nameCaseType: "CamelCase",
				timeTransType: "Date"
			}
		},
		templates:[{}],
		outputStr: "xxx",
		outputJson: {}
	},
	methods: {
		//set the template for output 选择页面输出的模板类型
		setOutputModel: function (event) {
			const targetModel = event.target.innerText.trim();
			console.log(targetModel);
			vm.outputStr=vm.outputJson[targetModel];
			$.outputArea.setValue(vm.outputStr);
			//console.log(vm.outputStr);
			$.outputArea.setSize('auto', 'auto');
		},
		//request with formData to generate the code 根据参数生成代码
		generate : function(){
			//get value from codemirror
			vm.formData.tableSql=$.inputArea.getValue();
			axios.post("code/generate",vm.formData).then(function(res){
				//console.log(res.outputJson);
				vm.outputJson=res.outputJson;
				// console.log(vm.outputJson["bootstrap-ui"]);
				vm.outputStr=vm.outputJson["plusentity"];
				//console.log(vm.outputJson["bootstrap-ui"]);
				//console.log(vm.outputStr);
				$.outputArea.setValue(vm.outputStr);
				$.outputArea.setSize('auto', 'auto');
			});
		},
		copy : function (){
			navigator.clipboard.writeText(vm.outputStr).then(r => {alert("已复制")});
		}
	},
	created: function () {
		//load all templates for selections 加载所有模板供选择
		axios.post("template/all",{
			id:1234
		}).then(function(res){
			//console.log(res.templates);
			vm.templates = JSON.parse(res.templates);
			console.log(vm.templates);
		});
	},
	updated: function () {
	}
});

