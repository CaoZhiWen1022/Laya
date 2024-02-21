// v1.2.7
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
const useCMDNode = process.argv[1].indexOf("layaair2-cmd") > -1 ? true : false;

function useOtherNode() {
	return useIDENode || useCMDNode;
}
//获取Node插件和工作路径
let ideModuleDir = useOtherNode() ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
let workSpaceDir = useOtherNode() ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\compile.js", "").replace("/.laya/compile.js", "") : "./../";

const gulp = require(ideModuleDir + "gulp");
const rollup = require(ideModuleDir + "rollup");
const typescript = require(ideModuleDir + 'rollup-plugin-typescript2');//typescript2 plugin
const glsl = require(ideModuleDir + 'rollup-plugin-glsl');
const path = require('path');
const fs = require('fs');

// 如果是发布时调用编译功能，增加prevTasks
let prevTasks = "";
if (global.publish) {
	prevTasks = ["loadConfig"];
}

gulp.task("compile", prevTasks, function () {
	// 发布时调用编译功能，判断是否点击了编译选项
	if (global.publish) {
		workSpaceDir = global.workSpaceDir; // 发布时调用编译，workSpaceDir使用publish.js里的变量
		let forceCompile = !fs.existsSync(path.join(workSpaceDir, "bin", "js", "bundle.js")); // 发布时，并且没有编译过，则强制编译
		if (!global.config.compile && !forceCompile) {
			return;
		}
	}

	return rollup.rollup({
		input: workSpaceDir + '/src/Main.ts',
		onwarn: (waring, warn) => {
			if (waring.code == "CIRCULAR_DEPENDENCY") {
				console.log("warnning Circular dependency:");
				console.log(waring);
			}
		},
		treeshake: false, //建议忽略
		plugins: [
			typescript({
				tsconfig: workSpaceDir + "/tsconfig.json",
				check: true, //Set to false to avoid doing any diagnostic checks on the code
				tsconfigOverride: { compilerOptions: { removeComments: true } },
				include: /.*.ts/,
			}),
			glsl({
				// By default, everything gets included
				include: /.*(.glsl|.vs|.fs)$/,
				sourceMap: false,
				compress: false
			}),
			/*terser({
				output: {
				},
				numWorkers:1,//Amount of workers to spawn. Defaults to the number of CPUs minus 1
				sourcemap: false
			})*/
		]
	}).then(bundle => {
		return bundle.write({
			file: workSpaceDir + '/bin/js/bundle.js',
			format: 'iife',
			name: 'laya',
			sourcemap: true
		});
	}).catch(err => {
		console.log(err);
	});
});

var mainBuildConfig = {
	output: {
		sourcemap: true,
		file: '../bin/js/bundle.js',
		format: 'iife',
		name: 'laya',
	},
	cache: false,
	input: workSpaceDir + '/src/Main.ts',
	onwarn: (waring, warn) => {
		if (waring.code == "CIRCULAR_DEPENDENCY") {
			console.log("warnning Circular dependency:");
			console.log(waring);
		}
	},
	treeshake: false, //建议忽略
	plugins: [
		typescript({
			clean: true,
			tsconfig: workSpaceDir + "/tsconfig.json",
			check: false, //Set to false to avoid doing any diagnostic checks on the code
			tsconfigOverride: { compilerOptions: { removeComments: false } },
			include: /.*.ts/,
		}),
		glsl({
			include: /.*(.glsl|.vs|.fs)$/,
			sourceMap: true,
			compress: false
		})
	]
};

gulp.task("watch", prevTasks, function () {
	// 发布时调用编译功能，判断是否点击了编译选项
	if (global.publish && !global.config.compile) {
		return;
	} else if (global.publish && global.config.compile) {
		// 发布时调用编译，workSpaceDir使用publish.js里的变量
		workSpaceDir = global.workSpaceDir;
	}

	console.log('Rollup Version:', rollup.VERSION);
	const rollupConfig = [mainBuildConfig]

	const watcher = rollup.watch(rollupConfig);

	var t0 = Date.now();
	watcher.on('event', event => {
		// console.log(event);
		switch (event.code) {
			case 'START':
				t0 = Date.now()
				console.info('\n\nRebuilding ' + new Date().toString());
				break;
			case 'BUNDLE_START':
				console.info('Bundling:' + (event && event.input && path.resolve(event.input)));
				break;
			case 'BUNDLE_END':
				console.info('Bundled!' + (event && event.input && path.resolve(event.input)));
				break;
			case 'END':
				console.info('Done!Cost:' + (Date.now() / 1000 - t0 / 1000).toFixed(1) + 's');
				t0 = Date.now();
				break;
			case 'ERROR':
			case 'FATAL':
				console.error("Rollup error: ", event);
		}
	});
	console.log('Rollup is watching for changes...');
	return watcher;
});