/*global define */

define([
	'marionette',
	'collections/TodoList',
	'views/Header',
	'views/TodoListCompositeView',
	'views/Footer'
], function (Marionette, TodoList, Header, TodoListCompositeView, Footer) {
	'use strict';

	var app = new Marionette.Application();
	var todoList = new TodoList();

	var viewOptions = {
		collection: todoList
	};

	var header = new Header(viewOptions);
	var main = new TodoListCompositeView(viewOptions);
	var footer = new Footer(viewOptions);

    /**
     * Regionを追加します。
     * Regionは関連するDOM内のレンダリングやViewの破棄などを管理するオブジェクトです。
     * Applicationや後述するLayoutの子要素として定義します。
     */
	app.addRegions({
		header: '#header',
		main: '#main',
		footer: '#footer'
	});

    /**
     * アプリケーション初期化時のコールバックを追加します。
     */
	app.addInitializer(function () {
		app.header.show(header);
		app.main.show(main);
		app.footer.show(footer);

        /**
         * データ呼び出し
         */
		todoList.fetch();
	});

    /**
     * オブザーバーの設定
     * 状態変化するmodelまたはCollectionを引数として渡す。
     * 'all'って書いているといつでも呼び出すってことなのかな？
     *
     * ここで再レンダリングやっている
     */
	app.listenTo(todoList, 'all', function () {
		app.main.$el.toggle(todoList.length > 0);
		app.footer.$el.toggle(todoList.length > 0);
	});

    /**
     * イベント追加している。
     * todoList:filterという名称が付けられるみたい
     */
	app.vent.on('todoList:filter', function (filter) {

        /**
         * Footer.jsのupdateFilterSelectionを呼び出している。
         * updateFilterSelection はクリックしたリンクにselectedを付けてクリック後のリンクに装飾している。
         */
		footer.updateFilterSelection(filter);

        /**
         * <section id="todoapp"> にクラス名をつけている。
         * filterにはactiveとかが入ってくるので「fillter-active」等の文字列が付く
         * クラス名を付けることにより、表示側をdisplay: noneとかやって非表示にしている。
         * 賢いね！！！
         */
		document.getElementById('todoapp').className = 'filter-' + (filter === '' ? 'all' : filter);
	});

	app.vent.on('todoList:clear:completed', function () {
		todoList.getCompleted().forEach(function (todo) {
			todo.destroy();
		});
	});

	return window.app = app;
});
