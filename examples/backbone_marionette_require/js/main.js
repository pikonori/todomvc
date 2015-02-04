/**
 * 一番最初に呼ばれるファイル
 * <script data-main="js/main" src="bower_components/requirejs/require.js"></script>
 * で呼び出し開始
 */


/**
 * ココらへんはrequirejsでのファイル呼び込み
 */
require.config({
	paths: {
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		marionette: '../bower_components/backbone.marionette/lib/backbone.marionette',
		jquery: '../bower_components/jquery/jquery',
		localStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		tpl: 'lib/tpl'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
		},
		marionette: {
			exports: 'Backbone.Marionette',
			deps: ['backbone']
		}
	},
	deps: ['jquery', 'underscore']
});

require([
	'app',
	'backbone',
	'routers/index',
	'controllers/index'
], function (app, Backbone, Router, Controller) {
	'use strict';

    /**
     * app.jsの最後で、
     * return window.app = app;
     * のように処理しているので、appはどこでも呼び出しが可能。
     *
     * 実態は Marionette.Application の start メソッドを呼び出している。
     *
     * applicationのプロセスを全部キックするぜ！
     * applicationに追加した全てのregionsも初期化して実行するぜ！
     *
     * 的なことがMarionetteのコメントに書いてあった。
     * 簡単な事言うと、applicationにセットしたaddInitializerとかlistenToを全て実行しますってことかな
     */
	app.start();

    /**
     * routers/index のインスタンスを作成。
     * 内部ではAppRouterが呼び出されている。
     *
     * 	return Marionette.AppRouter.extend({
     * 		appRoutes: {
     * 			'*filter': 'setFilter'
     * 		}
     * 	});
     *
     * このような記述であるが、'*filter': 'setFilter'の記法が意味がわからない。
     * 2015/02/03 ワイルドカードなので何でもマッチするってことになっている
     *
     *
     * あと、AppRouterはコントローラーを渡すのが基本
     * Controllerはcontrollers/indexが呼び出されている。
     *
     *	return {
     *		setFilter: function (param) {
     *			app.vent.trigger('todoList:filter', param && param.trim() || '');
     *		}
     *	};
     *
     * '*filter': 'setFilter'で呼び出した奴は、paramとして渡る。
     * 例えばURLが http://localhost:8080/#/active となっていたら、「active」が渡るはず。
     *
     *
     * ちなみにURLの種類は、
     * /
     * /active
     * /completed
     * の3個
     *
     */
	new Router({ controller: Controller });

    /**
     * いつもの
     */
	Backbone.history.start();
});
