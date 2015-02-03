/*global define */
define([
	'app'
], function (app) {
	'use strict';

	return {
		setFilter: function (param) {
            /**
             * http://tech.nitoyon.com/ja/blog/2007/12/27/cmpop/
             */
			app.vent.trigger('todoList:filter', param && param.trim() || '');
		}
	};
});
