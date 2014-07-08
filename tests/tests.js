/* global $, module, test, equal, ok */

;(function () {

	'use strict';

	function init(options) {
		return $('#treeview').treeview(options);
	}

	function getOptions(el) {
		return el.data('plugin_treeview').options;
	}

	var data = [
		{
			text: 'Parent 1',
			nodes: [
				{
					text: 'Child 1',
					nodes: [
						{
							text: 'Grandchild 1'
						},
						{
							text: 'Grandchild 2'
						}
					]
				},
				{
					text: 'Child 2'
				}
			]
		},
		{
			text: 'Parent 2'
		},
		{
			text: 'Parent 3'
		},
		{
			text: 'Parent 4'
		},
		{
			text: 'Parent 5'
		}
	];

	var json = '[' +
		'{' +
			'"text": "Parent 1",' +
			'"nodes": [' +
				'{' +
					'"text": "Child 1",' +
					'"nodes": [' +
						'{' +
							'"text": "Grandchild 1"' +
						'},' +
						'{' +
							'"text": "Grandchild 2"' +
						'}' +
					']' +
				'},' +
				'{' +
					'"text": "Child 2"' +
				'}' +
			']' +
		'},' +
		'{' +
			'"text": "Parent 2"' +
		'},' +
		'{' +
			'"text": "Parent 3"' +
		'},' +
		'{' +
			'"text": "Parent 4"' +
		'},' +
		'{' +
			'"text": "Parent 5"' +
		'}' +
	']';

	module('Options');

	test('Options setup', function () {
		// First test defaults option values
		var el = init(),
			options = getOptions(el);
		ok(options, 'Defaults created ok');
		equal(options.levels, 2, 'levels defaults ok');
		equal(options.expandIcon, 'glyphicon glyphicon-plus', 'expandIcon defaults ok');
		equal(options.collapseIcon, 'glyphicon glyphicon-minus', 'collapseIcon defaults ok');
		equal(options.nodeIcon, 'glyphicon glyphicon-stop', 'nodeIcon defaults ok');
		equal(options.color, undefined, 'color defaults ok');
		equal(options.backColor, undefined, 'backColor defaults ok');
		equal(options.borderColor, undefined, 'borderColor defaults ok');
		equal(options.onhoverColor, '#F5F5F5', 'onhoverColor defaults ok');
		equal(options.selectedColor, '#FFFFFF', 'selectedColor defaults ok');
		equal(options.selectedBackColor, '#428bca', 'selectedBackColor defaults ok');
		equal(options.enableLinks, false, 'enableLinks defaults ok');
		equal(options.highlightSelected, true, 'highlightSelected defaults ok');
		equal(options.showBorder, true, 'showBorder defaults ok');
		equal(options.showTags, false, 'showTags defatuls ok');
		equal(options.onNodeSelected, null, 'onNodeSelected default ok');

		// Then test user options are correctly set
		var opts = {
			levels: 99,
			expandIcon: 'glyphicon glyphicon-expand',
			collapseIcon: 'glyphicon glyphicon-collapse',
			nodeIcon: 'glyphicon glyphicon-node',
			color: 'yellow',
			backColor: 'purple',
			borderColor: 'purple',
			onhoverColor: 'orange',
			selectedColor: 'yellow',
			selectedBackColor: 'darkorange',
			enableLinks: true,
			highlightSelected: false,
			showBorder: false,
			showTags: true,
			onNodeSelected: function () {}
		};

		options = getOptions(init(opts));
		ok(options, 'User options created ok');
		equal(options.levels, 99, 'levels set ok');
		equal(options.expandIcon, 'glyphicon glyphicon-expand', 'expandIcon set ok');
		equal(options.collapseIcon, 'glyphicon glyphicon-collapse', 'collapseIcon set ok');
		equal(options.nodeIcon, 'glyphicon glyphicon-node', 'nodeIcon set ok');
		equal(options.color, 'yellow', 'color set ok');
		equal(options.backColor, 'purple', 'backColor set ok');
		equal(options.borderColor, 'purple', 'borderColor set ok');
		equal(options.onhoverColor, 'orange', 'onhoverColor set ok');
		equal(options.selectedColor, 'yellow', 'selectedColor set ok');
		equal(options.selectedBackColor, 'darkorange', 'selectedBackColor set ok');
		equal(options.enableLinks, true, 'enableLinks set ok');
		equal(options.highlightSelected, false, 'highlightSelected set ok');
		equal(options.showBorder, false, 'showBorder set ok');
		equal(options.showTags, true, 'showTags set ok');
		equal(typeof options.onNodeSelected, 'function', 'onNodeSelected set ok');
	});

	test('Links enabled', function () {

		init({enableLinks:true, data:data});
		ok($('.list-group-item:first').children('a').length, 'Links are enabled');
		
	});

	module('Data');

	test('Accepts JSON', function () {

		var el = init({levels:1,data:json});
		equal($(el.selector + ' ul li').length, 5, 'Correct number of root nodes');

	});

	module('Behaviour');

	test('Is chainable', function () {
		var el = init();
		ok(el.addClass('test'), 'Is chainable');
		equal(el.attr('class'), 'treeview test', 'Test class was added');
	});

	test('Correct initial levels shown', function () {

		var el = init({levels:1,data:data});
		equal($(el.selector + ' ul li').length, 5, 'Correctly display 5 root nodes when levels set to 1');

		el = init({levels:2,data:data});
		equal($(el.selector + ' ul li').length, 7, 'Correctly display 5 root and 2 child nodes when levels set to 2');

		el = init({levels:3,data:data});
		equal($(el.selector + ' ul li').length, 9, 'Correctly display 5 root, 2 children and 2 grand children nodes when levels set to 3');
	});

	test('Expanding a node', function () {

		init({levels:1,data:data});

		var nodeCount = $('.list-group-item').length;
		var el = $('i.click-expand:first');
		el.trigger('click');
		ok(($('.list-group-item').length > nodeCount), 'Number of nodes are increased, so node must have expanded');
	});

	test('Collapsing a node', function () {

		init({levels:2,data:data});

		var nodeCount = $('.list-group-item').length;
		var el = $('i.click-collapse:first');
		el.trigger('click');
		ok(($('.list-group-item').length < nodeCount), 'Number of nodes has decreased, so node must have collapsed');
	});

	test('Selecting a node', function () {

		var cbWorked, onWorked = false;
		init({
			data: data,
			onNodeSelected: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onWorked = true;
		});

		var el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected : class "node-selected" added');
		ok(($('.node-selected').length === 1), 'There is only one selected node');
		ok(cbWorked, 'onNodeSelected function was calledted');
		ok(onWorked, 'nodeSelected was fired');
	});

	test('Unselecting a node', function () {

		var cbWorked, onWorked = false;
		init({
			data: data,
			onNodeSelected: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onWorked = true;
		});

		// First select a node
		var el = $('.list-group-item:first');
		el.trigger('click');

		// Then test unselect by simulating another click
		cbWorked = onWorked = false;
		el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok((el.attr('class').split(' ').indexOf('node-selected') === -1), 'Node is correctly unselected : class "node-selected" removed');
		ok(($('.node-selected').length === 0), 'There are no selected nodes');
		ok(!cbWorked, 'onNodeSelected was not called');
		ok(!onWorked, 'nodeSelected was not fired');
	});

	test('Clicking a collapsed node expands the node when singleClickToggle true', function () {
		init({
			levels: 1,
			data: data,
			singleClickToggle: true
		});

		var nodeCount = $('.list-group-item').length;
		var el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok(el.hasClass('node-selected'), 'Node should be selected');
		ok(($('.list-group-item').length > nodeCount), 'Number of nodes has incrased, so node must have expanded');
	});

	test('Clicking an expanded node collapses the node when singleClickToggle true', function () {
		init({
			levels: 2,
			data: data,
			singleClickToggle: true
		});

		var nodeCount = $('.list-group-item').length;
		var el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok(el.hasClass('node-selected'), 'Node should be selected');
		ok(($('.list-group-item').length < nodeCount), 'Number of nodes has decreased, so node must have collapsed');
	});

}());