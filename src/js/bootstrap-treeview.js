/* =========================================================
 * bootstrap-treeview.js v1.0.2
 * =========================================================
 * Copyright 2013 Jonathan Miles
 * Project URL : http://www.jondmiles.com/bootstrap-treeview
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

;(function ($, window, document, undefined) {

	/*global jQuery, console*/

	'use strict';

	var pluginName = 'treeview';

	var defaults = {

		injectStyle: true,

		levels: 2,

		expandIcon: 'glyphicon glyphicon-plus',
		collapseIcon: 'glyphicon glyphicon-minus',
		emptyIcon: 'glyphicon',
		nodeIcon: 'glyphicon glyphicon-stop',

		color: undefined, // '#000000',
		backColor: undefined, // '#FFFFFF',
		borderColor: undefined, // '#dddddd',
		onhoverColor: '#F5F5F5',
		selectedColor: '#FFFFFF',
		selectedBackColor: '#428bca',
		searchResultColor: '#E5E313',
		searchResultBackColor: undefined, //'#FFFFFF',

		enableLinks: false,
		highlightSelected: true,
		showBorder: true,
		showTags: false,

		// Event handlers
		onNodeCollapsed: undefined,
		onNodeExpanded: undefined,
		onNodeSelected: undefined,
		onNodeUnselected: undefined,
		onSearchComplete: undefined,
		onSearchCleared: undefined
	};

	var Tree = function (element, options) {

		this.$element = $(element);
		this.elementId = element.id;
		this.styleId = this.elementId + '-style';

		this.init(options);

		return {

			// Options (public access)
			options: this.options,

			// Initialize / destroy methods
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this),

			// Get methods
			getNode: $.proxy(this.getNode, this),
			getParent: $.proxy(this.getParent, this),
			getSiblings: $.proxy(this.getSiblings, this),

			// Select methods
			selectNode: $.proxy(this.selectNode, this),
			unselectNode: $.proxy(this.unselectNode, this),

			// Expand / collapse methods
			collapseAll: $.proxy(this.collapseAll, this),
			collapseNode: $.proxy(this.collapseNode, this),
			expandAll: $.proxy(this.expandAll, this),
			expandNode: $.proxy(this.expandNode, this),
			toggleNodeExpanded: $.proxy(this.toggleNodeExpanded, this),

			// Search methods
			search: $.proxy(this.search, this),
			clearSearch: $.proxy(this.clearSearch, this)
		};
	};

	Tree.prototype.init = function (options) {

		this.tree = [];
		this.nodes = [];

		if (options.data) {
			if (typeof options.data === 'string') {
				options.data = $.parseJSON(options.data);
			}
			this.tree = $.extend(true, [], options.data);
			delete options.data;
		}
		this.options = $.extend({}, defaults, options);

		this.destroy();
		this.subscribeEvents();
		this.setInitialStates({ nodes: this.tree }, 0);
		this.render();
	};

	Tree.prototype.remove = function () {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();
	};

	Tree.prototype.destroy = function () {

		if (!this.initialized) return;

		this.$wrapper.remove();
		this.$wrapper = null;

		// Switch off events
		this.unsubscribeEvents();

		// Reset this.initialized flag
		this.initialized = false;
	};

	Tree.prototype.unsubscribeEvents = function () {

		this.$element.off('click');

		if (typeof (this.options.onNodeCollapsed) === 'function') {
			this.$element.off('nodeCollapsed');
		}

		if (typeof (this.options.onNodeExpanded) === 'function') {
			this.$element.off('nodeExpanded');
		}

		if (typeof (this.options.onNodeSelected) === 'function') {
			this.$element.off('nodeSelected');
		}

		if (typeof (this.options.onNodeUnselected) === 'function') {
			this.$element.off('nodeUnselected');
		}

		if (typeof (this.options.onSearhComplete) === 'function') {
			this.$element.off('searchComplete');
		}

		if (typeof (this.options.onSearchCleared) === 'function') {
			this.$element.off('searchCleared');
		}
	};

	Tree.prototype.subscribeEvents = function () {

		this.unsubscribeEvents();

		this.$element.on('click', $.proxy(this.clickHandler, this));

		if (typeof (this.options.onNodeCollapsed) === 'function') {
			this.$element.on('nodeCollapsed', this.options.onNodeCollapsed);
		}

		if (typeof (this.options.onNodeExpanded) === 'function') {
			this.$element.on('nodeExpanded', this.options.onNodeExpanded);
		}

		if (typeof (this.options.onNodeSelected) === 'function') {
			this.$element.on('nodeSelected', this.options.onNodeSelected);
		}

		if (typeof (this.options.onNodeUnselected) === 'function') {
			this.$element.on('nodeUnselected', this.options.onNodeUnselected);
		}

		if (typeof (this.options.onSearchComplete) === 'function') {
			this.$element.on('searchComplete', this.options.onSearchComplete);
		}

		if (typeof (this.options.onSearchCleared) === 'function') {
			this.$element.on('searchCleared', this.options.onSearchCleared);
		}
	};

	/*
		Recurse the tree structure and ensure all nodes have
		valid initial states.  User defined states will be preserved.
		For performance we also take this opportunity to
		index nodes in a flattened structure
	*/
	Tree.prototype.setInitialStates = function (node, level) {

		if (!node.nodes) { return; }
		level += 1;

		var parent = node;
		var _this = this;
		$.each(node.nodes, function checkStates(index, node) {

			// nodeId : unique, incremental identifier
			node.nodeId = _this.nodes.length;

			// parentId : transversing up the tree
			node.parentId = parent.nodeId;

			// if not provided set selectable default value
			if (!node.hasOwnProperty('selectable')) {
				node.selectable = true;
			}

			// where provided we shouuld preserve states
			node.states = node.states || {};

			// set expanded state; if not provided based on levels
			if (!node.states.hasOwnProperty('expanded')) {
				if (level < _this.options.levels) {
					node.states.expanded = true;
				}
				else {
					node.states.expanded = false;
				}
			}

			// set selected state; unless set always false
			if (!node.states.hasOwnProperty('selected')) {
				node.states.selected = false;
			}

			// index nodes in a flattened structure for use later
			_this.nodes.push(node);

			// recurse child nodes and transverse the tree
			if (node.nodes) {
				_this.setInitialStates(node, level);
			}
		});
	};

	Tree.prototype.clickHandler = function (event) {

		if (!this.options.enableLinks) { event.preventDefault(); }

		var target = $(event.target),
			classList = target.attr('class') ? target.attr('class').split(' ') : [],
			node = this.findNode(target);

		if ((classList.indexOf('click-expand') != -1) ||
				(classList.indexOf('click-collapse') != -1)) {
			this.toggleExpandedState(node);
		}
		else if (node) {
			if (node.selectable) {
				this.toggleSelectedState(node);
			} else {
				this.toggleExpandedState(node);
			}
		}
	};

	// Looks up the DOM for the closest parent list item to retrieve the
	// data attribute nodeid, which is used to lookup the node in the flattened structure.
	Tree.prototype.findNode = function (target) {

		var nodeId = target.closest('li.list-group-item').attr('data-nodeid'),
			node = this.nodes[nodeId];

		if (!node) {
			console.log('Error: node does not exist');
		}
		return node;
	};

	Tree.prototype.toggleExpandedState = function (node, silent) {
		if (!node) return;
		this.setExpandedState(node, !node.states.expanded, silent);
		this.render();
	};

	Tree.prototype.setExpandedState = function (node, state, silent) {
		if (state) {
			node.states.expanded = true;
			if (!silent) {
				this.$element.trigger('nodeExpanded', $.extend(true, {}, node));
			}
		}
		else {
			node.states.expanded = false;
			if (!silent) {
				this.$element.trigger('nodeCollapsed', $.extend(true, {}, node));
			}
		}
	};

	Tree.prototype.toggleSelectedState = function (node) {

		if (!node) { return; }

		if (node.states.selected) {
			node.states.selected = false;
			this.$element.trigger('nodeUnselected', $.extend(true, {}, node) );
		}
		else {
			node.states.selected = true;
			this.$element.trigger('nodeSelected', $.extend(true, {}, node) );
		}

		this.render();
	};

	Tree.prototype.render = function () {

		if (!this.initialized) {

			// Setup first time only components
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.list);

			this.injectStyle();

			this.initialized = true;
		}

		this.$element.empty().append(this.$wrapper.empty());

		// Build tree
		this.buildTree(this.tree, 0);
	};

	// Starting from the root node, and recursing down the
	// structure we build the tree one node at a time
	Tree.prototype.buildTree = function (nodes, level) {

		if (!nodes) { return; }
		level += 1;

		var _this = this;
		$.each(nodes, function addNodes(id, node) {

			var treeItem = $(_this.template.item)
				.addClass('node-' + _this.elementId)
				.addClass(node.states.selected ? 'node-selected' : '')
				.addClass(node.searchResult ? 'search-result' : '')
				.attr('data-nodeid', node.nodeId)
				.attr('style', _this.buildStyleOverride(node));

			// Add indent/spacer to mimic tree structure
			for (var i = 0; i < (level - 1); i++) {
				treeItem.append(_this.template.indent);
			}

			// Add expand, collapse or empty spacer icons
			if (node.nodes) {
				if (!node.states.expanded) {
						treeItem
							.append($(_this.template.expandCollapseIcon)
								.addClass('click-expand')
								.addClass(_this.options.expandIcon)
							);
					}
					else {
						treeItem
							.append($(_this.template.expandCollapseIcon)
								.addClass('click-collapse')
								.addClass(_this.options.collapseIcon)
							);
					}
			}
			else {
				treeItem
					.append($(_this.template.expandCollapseIcon)
						.addClass(_this.options.emptyIcon)
					);
			}

			// Add node icon
			treeItem
				.append($(_this.template.icon)
					.addClass(node.icon ? node.icon : _this.options.nodeIcon)
				);

			// Add text
			if (_this.options.enableLinks) {
				// Add hyperlink
				treeItem
					.append($(_this.template.link)
						.attr('href', node.href)
						.append(node.text)
					);
			}
			else {
				// otherwise just text
				treeItem
					.append(node.text);
			}

			// Add tags as badges
			if (_this.options.showTags && node.tags) {
				$.each(node.tags, function addTag(id, tag) {
					treeItem
						.append($(_this.template.badge)
							.append(tag)
						);
				});
			}

			// Add item to the tree
			_this.$wrapper.append(treeItem);

			// Recursively add child ndoes
			// console.log(node.text + ' ' + node.states.expanded);
			if (node.nodes && node.states.expanded) {
				return _this.buildTree(node.nodes, level);
			}
		});
	};

	// Define any node level style override for
	// 1. selectedNode
	// 2. node|data assigned color overrides
	Tree.prototype.buildStyleOverride = function (node) {

		var color = node.color;
		var backColor = node.backColor;

		if (this.options.highlightSelected && (node.states.selected)) {
			if (this.options.selectedColor) {
				color = this.options.selectedColor;
			}
			if (this.options.selectedBackColor) {
				backColor = this.options.selectedBackColor;
			}
		}

		if (node.searchResult) {
			if (this.options.searchResultColor) {
				color = this.options.searchResultColor;
			}
			if (this.options.searchResultBackColor) {
				backColor = this.options.searchResultBackColor;
			}
		}

		return 'color:' + color +
			';background-color:' + backColor + ';';
	};

	// Add inline style into head
	Tree.prototype.injectStyle = function () {

		if (this.options.injectStyle && !document.getElementById(this.styleId)) {
			$('<style type="text/css" id="' + this.styleId + '"> ' + this.buildStyle() + ' </style>').appendTo('head');
		}
	};

	// Construct trees style based on user options
	Tree.prototype.buildStyle = function () {

		var style = '.node-' + this.elementId + '{';
		if (this.options.color) {
			style += 'color:' + this.options.color + ';';
		}
		if (this.options.backColor) {
			style += 'background-color:' + this.options.backColor + ';';
		}
		if (!this.options.showBorder) {
			style += 'border:none;';
		}
		else if (this.options.borderColor) {
			style += 'border:1px solid ' + this.options.borderColor + ';';
		}
		style += '}';

		if (this.options.onhoverColor) {
			style += '.node-' + this.elementId + ':hover{' +
			'background-color:' + this.options.onhoverColor + ';' +
			'}';
		}

		return this.css + style;
	};

	Tree.prototype.template = {
		list: '<ul class="list-group"></ul>',
		item: '<li class="list-group-item"></li>',
		indent: '<span class="indent"></span>',
		expandCollapseIcon: '<span class="expand-collapse"></span>',
		icon: '<span class="icon"></span>',
		link: '<a href="#" style="color:inherit;"></a>',
		badge: '<span class="badge"></span>'
	};

	Tree.prototype.css = '.treeview .list-group-item{cursor:pointer}.treeview span.indent{margin-left:10px;margin-right:10px}.treeview span.expand-collapse{width:1rem;height:1rem}.treeview span.icon{margin-left:10px;margin-right:5px}'


	/**
		Returns a single node object that matches the given node id.
		@param {Number} nodeId - A node's unique identifier
		@return {Object} node - Matching node
	*/
	Tree.prototype.getNode = function (nodeId) {
		return this.nodes[nodeId];
	};

	/**
		Returns the parent node of a given node, if valid otherwise returns undefined.
		@param {Object} node - A valid node object
		@returns {Object} parent - The parent node
	*/
	Tree.prototype.getParent = function (node) {
		return this.nodes[node.parentId];
	};

	/**
		Returns an array of sibling nodes for a given node, if valid otherwise returns undefined.
		@param {Object} node - A valid node object
		@returns {Array} siblings - Sibling nodes
	*/
	Tree.prototype.getSiblings = function (node) {
		var parent = this.getParent(node);
		var nodes = parent ? parent.nodes : this.tree;
		return nodes.filter(function (obj) {
				return obj.nodeId !== node.nodeId;
			});
	};


	/**
		Collapse all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.collapseAll = function (options) {
		var silent = this.isSilent(options);

		$.each(this.nodes, $.proxy(function (index, node) {
			this.setExpandedState(node, false, silent);
		}, this));

		this.render();
	};

	/**
		Collapse a given tree node
		@param {Object|Number} identifier - node or node id
		@param {optional Object} options
	*/
	Tree.prototype.collapseNode = function (identifier, options) {
		var silent = this.isSilent(options);
		this.setExpandedState(this.identifyNode(identifier), false, silent);
		this.render();
	};

	/**
		Expand all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.expandAll = function (options) {
		var silent = this.isSilent(options);

		if (options && options.levels) {
			this.expandLevels(this.tree, options.levels, silent);
		}
		else {
			$.each(this.nodes, $.proxy(function (index, node) {
				this.setExpandedState(node, true, silent);
			}, this));
		}

		this.render();
	};

	/**
		Expand a given tree node
		@param {Object|Number} identifier - node or node id
		@param {optional Object} options
	*/
	Tree.prototype.expandNode = function (identifier, options) {
		var silent = this.isSilent(options);

		var node = this.identifyNode(identifier);
		this.setExpandedState(node, true, silent);

		if (node.nodes && (options && options.levels)) {
			this.expandLevels(node.nodes, options.levels-1, silent);
		}

		this.render();
	};

	Tree.prototype.expandLevels = function (nodes, level, silent) {
		$.each(nodes, $.proxy(function (index, node) {
			this.setExpandedState(node, (level > 0) ? true : false)
			if (node.nodes) {
				this.expandLevels(node.nodes, level-1, silent);
			}
		}, this));
	}

	/**
		Toggles a nodes expanded state; collapsing if expanded, expanding if collapsed.
		@param {Object|Number} identifier = node or node id
		@param {optional Object} options 
	*/
	Tree.prototype.toggleNodeExpanded = function (identifier, options) {
		this.toggleExpandedState(this.identifyNode(identifier),
															this.isSilent(options));
	}

	Tree.prototype.identifyNode = function (identifier) {
		return ((typeof identifier) === 'number') ?
						this.nodes[identifier] :
						identifier;
	}

	Tree.prototype.isSilent = function (options) {
		return (options && options.hasOwnProperty('silent')) ?
						options.silent :
						false;
	}


	/**
		Set a node state to selected
		@param {Number} nodeId - A node's unique identifier
	*/
	Tree.prototype.selectNode = function (nodeId) {
		this.nodes[nodeId].states.selected = true;
		this.render();
	};

	/**
		Set a node state to unselected
		@param {Number} nodeId - A node's unique identifier
	*/
	Tree.prototype.unselectNode = function (nodeId) {
		this.nodes[nodeId].states.selected = false;
		this.render();
	};


	/**
		Searches the tree for nodes (text) that match given criteria
		@param {String} pattern - A given string to match against
		@param {optional Object} options - Search criteria options
		@return {Array} nodes - Matching nodes
	*/
	Tree.prototype.search = function (pattern, options) {

		this.clearSearch();

		var results = [];
		if (pattern && pattern.length > 0) {

			if (options.exactMatch) {
				pattern = '^' + pattern + '$';
			}

			var modifier = 'g';
			if (options.ignoreCase) {
				modifier += 'i';
			}

			results = this.findNodes(pattern, modifier);
			$.each(results, function (index, node) {
				node.searchResult = true;
			})

			this.render();
		}

		this.$element.trigger('searchComplete', $.extend(true, {}, results));

		return results;
	};

	/**
		Clears previous search results
	*/
	Tree.prototype.clearSearch = function () {

		var results = $.each(this.findNodes('true', 'g', 'searchResult'), function (index, node) {
			node.searchResult = false;
		});

		this.render();

		this.$element.trigger('searchCleared', $.extend(true, {}, results));
	};

	/**
		Find nodes that match a given criteria
		@param {String} pattern - A given string to match against
		@param {optional String} modifier - Valid RegEx modifiers
		@param {optional String} attribute - Attribute to compare pattern against
		@return {Array} nodes - Nodes that match your criteria
	*/
	Tree.prototype.findNodes = function (pattern, modifier, attribute) {

		modifier = modifier || 'g';
		attribute = attribute || 'text';

		var _this = this;
		return $.grep(this.nodes, function (node) {
			var val = _this.getNodeValue(node, attribute);
			if (typeof val === 'string') {
				return val.match(new RegExp(pattern, modifier));
			}
		});
	};

	/**
		Recursive find for retrieving nested attributes values
		All values are return as strings, unless invalid
		@param {Object} obj - Typically a node, could be any object
		@param {String} attr - Identifies an object property using dot notation
		@return {String} value - Matching attributes string representation
	*/
	Tree.prototype.getNodeValue = function (obj, attr) {
		var index = attr.indexOf('.');
		if (index > 0) {
			var _obj = obj[attr.substring(0, index)];
			var _attr = attr.substring(index + 1, attr.length);
			return this.getNodeValue(_obj, _attr);
		}
		else {
			if (obj.hasOwnProperty(attr)) {
				return obj[attr].toString();
			}
			else {
				return undefined;
			}
		}
	};


	var logError = function (message) {
        if(window.console) {
            window.console.error(message);
        }
    };

	// Prevent against multiple instantiations,
	// handle updates and method calls
	$.fn[pluginName] = function (options, args) {

		var result;

		this.each(function () {
			var _this = $.data(this, pluginName);
			if (typeof options === 'string') {
				if (!_this) {
					logError('Not initialized, can not call method : ' + options);
				}
				else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
					logError('No such method : ' + options);
				}
				else {
					if (!(args instanceof Array)) {
						args = [ args ];
					}
					result = _this[options].apply(_this, args);
				}
			}
			else {
				$.data(this, pluginName, new Tree(this, $.extend(true, {}, options)));
			}
		});

		return result || this;
	};

})(jQuery, window, document);
