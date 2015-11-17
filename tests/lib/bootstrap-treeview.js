/* =========================================================
 * bootstrap-treeview.js v1.2.0
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

	var _default = {};

	_default.settings = {

		injectStyle: true,

		levels: 2,

		expandIcon: 'glyphicon glyphicon-plus',
		collapseIcon: 'glyphicon glyphicon-minus',
		emptyIcon: 'glyphicon',
		nodeIcon: '',
		selectedIcon: '',
		checkedIcon: 'glyphicon glyphicon-check',
		uncheckedIcon: 'glyphicon glyphicon-unchecked',

		color: undefined, // '#000000',
		backColor: undefined, // '#FFFFFF',
		borderColor: undefined, // '#dddddd',
		onhoverColor: '#F5F5F5',
		selectedColor: '#FFFFFF',
		selectedBackColor: '#428bca',
		searchResultColor: '#D9534F',
		searchResultBackColor: undefined, //'#FFFFFF',

		enableLinks: false,
		highlightSelected: true,
		highlightSearchResults: true,
		showBorder: true,
		showIcon: true,
		showCheckbox: false,
		showTags: false,
		multiSelect: false,

		// Event handlers
		onNodeChecked: undefined,
		onNodeCollapsed: undefined,
		onNodeDisabled: undefined,
		onNodeEnabled: undefined,
		onNodeExpanded: undefined,
		onNodeSelected: undefined,
		onNodeUnchecked: undefined,
		onNodeUnselected: undefined,
		onSearchComplete: undefined,
		onSearchCleared: undefined
	};

	_default.options = {
		silent: false,
		ignoreChildren: false
	};

	_default.searchOptions = {
		ignoreCase: true,
		exactMatch: false,
		revealResults: true
	};

	var Tree = function (element, options) {

		this.$element = $(element);
		this._elementId = element.id;
		this._styleId = this._elementId + '-style';

		this._init(options);

		return {

			// Options (public access)
			options: this._options,

			// Initialize / destroy methods
			init: $.proxy(this._init, this),
			remove: $.proxy(this._remove, this),

			// Get methods
			getNode: $.proxy(this.getNode, this),
			getParent: $.proxy(this.getParent, this),
			getSiblings: $.proxy(this.getSiblings, this),
			getSelected: $.proxy(this.getSelected, this),
			getUnselected: $.proxy(this.getUnselected, this),
			getExpanded: $.proxy(this.getExpanded, this),
			getCollapsed: $.proxy(this.getCollapsed, this),
			getChecked: $.proxy(this.getChecked, this),
			getUnchecked: $.proxy(this.getUnchecked, this),
			getDisabled: $.proxy(this.getDisabled, this),
			getEnabled: $.proxy(this.getEnabled, this),

			// Select methods
			selectNode: $.proxy(this.selectNode, this),
			unselectNode: $.proxy(this.unselectNode, this),
			toggleNodeSelected: $.proxy(this.toggleNodeSelected, this),

			// Expand / collapse methods
			collapseAll: $.proxy(this.collapseAll, this),
			collapseNode: $.proxy(this.collapseNode, this),
			expandAll: $.proxy(this.expandAll, this),
			expandNode: $.proxy(this.expandNode, this),
			toggleNodeExpanded: $.proxy(this.toggleNodeExpanded, this),
			revealNode: $.proxy(this.revealNode, this),

			// Expand / collapse methods
			checkAll: $.proxy(this.checkAll, this),
			checkNode: $.proxy(this.checkNode, this),
			uncheckAll: $.proxy(this.uncheckAll, this),
			uncheckNode: $.proxy(this.uncheckNode, this),
			toggleNodeChecked: $.proxy(this.toggleNodeChecked, this),

			// Disable / enable methods
			disableAll: $.proxy(this.disableAll, this),
			disableNode: $.proxy(this.disableNode, this),
			enableAll: $.proxy(this.enableAll, this),
			enableNode: $.proxy(this.enableNode, this),
			toggleNodeDisabled: $.proxy(this.toggleNodeDisabled, this),

			// Search methods
			search: $.proxy(this.search, this),
			clearSearch: $.proxy(this.clearSearch, this)
		};
	};

	Tree.prototype._init = function (options) {

		this._tree = [];
		this._nodes = [];
		this._initialized = false;

		if (options.data) {
			if (typeof options.data === 'string') {
				options.data = $.parseJSON(options.data);
			}
			this._tree = $.extend(true, [], options.data);
			delete options.data;
		}
		this._options = $.extend({}, _default.settings, options);

		this._destroy();
		this._subscribeEvents();
		this._setInitialStates({ nodes: this._tree }, 0);
		this._render();
	};

	Tree.prototype._remove = function () {
		this._destroy();
		$.removeData(this, pluginName);
		$('#' + this._styleId).remove();
	};

	Tree.prototype._destroy = function () {

		if (!this._initialized) return;

		this.$wrapper.remove();
		this.$wrapper = null;

		// Switch off events
		this._unsubscribeEvents();

		// Reset this._initialized flag
		this._initialized = false;
	};

	Tree.prototype._unsubscribeEvents = function () {

		this.$element.off('click');
		this.$element.off('nodeChecked');
		this.$element.off('nodeCollapsed');
		this.$element.off('nodeDisabled');
		this.$element.off('nodeEnabled');
		this.$element.off('nodeExpanded');
		this.$element.off('nodeSelected');
		this.$element.off('nodeUnchecked');
		this.$element.off('nodeUnselected');
		this.$element.off('searchComplete');
		this.$element.off('searchCleared');
	};

	Tree.prototype._subscribeEvents = function () {

		this._unsubscribeEvents();

		this.$element.on('click', $.proxy(this._clickHandler, this));

		if (typeof (this._options.onNodeChecked) === 'function') {
			this.$element.on('nodeChecked', this._options.onNodeChecked);
		}

		if (typeof (this._options.onNodeCollapsed) === 'function') {
			this.$element.on('nodeCollapsed', this._options.onNodeCollapsed);
		}

		if (typeof (this._options.onNodeDisabled) === 'function') {
			this.$element.on('nodeDisabled', this._options.onNodeDisabled);
		}

		if (typeof (this._options.onNodeEnabled) === 'function') {
			this.$element.on('nodeEnabled', this._options.onNodeEnabled);
		}

		if (typeof (this._options.onNodeExpanded) === 'function') {
			this.$element.on('nodeExpanded', this._options.onNodeExpanded);
		}

		if (typeof (this._options.onNodeSelected) === 'function') {
			this.$element.on('nodeSelected', this._options.onNodeSelected);
		}

		if (typeof (this._options.onNodeUnchecked) === 'function') {
			this.$element.on('nodeUnchecked', this._options.onNodeUnchecked);
		}

		if (typeof (this._options.onNodeUnselected) === 'function') {
			this.$element.on('nodeUnselected', this._options.onNodeUnselected);
		}

		if (typeof (this._options.onSearchComplete) === 'function') {
			this.$element.on('searchComplete', this._options.onSearchComplete);
		}

		if (typeof (this._options.onSearchCleared) === 'function') {
			this.$element.on('searchCleared', this._options.onSearchCleared);
		}
	};

	/*
		Recurse the tree structure and ensure all nodes have
		valid initial states.  User defined states will be preserved.
		For performance we also take this opportunity to
		index nodes in a flattened structure
	*/
	Tree.prototype._setInitialStates = function (node, level) {

		if (!node.nodes) return;
		level += 1;

		var parent = node;
		var _this = this;
		$.each(node.nodes, function checkStates(index, node) {

			// nodeId : unique, incremental identifier
			node.nodeId = _this._nodes.length;

			// parentId : transversing up the tree
			node.parentId = parent.nodeId;

			// if not provided set selectable default value
			if (!node.hasOwnProperty('selectable')) {
				node.selectable = true;
			}

			// where provided we should preserve states
			node.state = node.state || {};

			// set checked state; unless set always false
			if (!node.state.hasOwnProperty('checked')) {
				node.state.checked = false;
			}

			// set enabled state; unless set always false
			if (!node.state.hasOwnProperty('disabled')) {
				node.state.disabled = false;
			}

			// set expanded state; if not provided based on levels
			if (!node.state.hasOwnProperty('expanded')) {
				if (!node.state.disabled &&
						(level < _this._options.levels) &&
						(node.nodes && node.nodes.length > 0)) {
					node.state.expanded = true;
				}
				else {
					node.state.expanded = false;
				}
			}

			// set visible state; based purely on levels
			if (level > _this._options.levels) {
				node.state.visible = false;
			}
			else {
				node.state.visible = true;
			}

			// set selected state; unless set always false
			if (!node.state.hasOwnProperty('selected')) {
				node.state.selected = false;
			}

			// index nodes in a flattened structure for use later
			_this._nodes.push(node);

			// recurse child nodes and transverse the tree
			if (node.nodes) {
				_this._setInitialStates(node, level);
			}
		});
	};

	Tree.prototype._clickHandler = function (event) {

		if (!this._options.enableLinks) event.preventDefault();

		var target = $(event.target);
		var node = this.targetNode(target);
		if (!node || node.state.disabled) return;

		var classList = target.attr('class') ? target.attr('class').split(' ') : [];
		if ((classList.indexOf('expand-icon') !== -1)) {
			this._toggleExpanded(node, _default.options);
		}
		else if ((classList.indexOf('check-icon') !== -1)) {
			this._toggleChecked(node, _default.options);
		}
		else {
			if (node.selectable) {
				this._toggleSelected(node, _default.options);
			} else {
				this._toggleExpanded(node, _default.options);
			}
		}
	};

	// Looks up the DOM for the closest parent list item to retrieve the
	// data attribute nodeid, which is used to lookup the node in the flattened structure.
	Tree.prototype.targetNode = function (target) {

		var nodeId = target.closest('li.list-group-item').attr('data-nodeid');
		var node = this._nodes[nodeId];

		if (!node) {
			console.log('Error: node does not exist');
		}
		return node;
	};

	Tree.prototype._toggleExpanded = function (node, options) {
		if (!node) return;
		this._setExpanded(node, !node.state.expanded, options);
	};

	Tree.prototype._setExpanded = function (node, state, options) {

		// We never pass options when rendering, so the only time
		// we need to validate state is from user interaction
		if (options && state === node.state.expanded) return;

		if (state && node.nodes) {

			// Set node state
			node.state.expanded = true;

			// Set element
			if (node.$el) {
				node.$el.children('span.expand-icon')
					.removeClass(this._options.expandIcon)
					.addClass(this._options.collapseIcon);
			}

			// Expand children 
			if (node.nodes && options) {
				$.each(node.nodes, $.proxy(function (index, node) {
					this._setVisible(node, true, options);
				}, this));
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeExpanded', $.extend(true, {}, node));
			}
		}
		else if (!state) {

			// Set node state
			node.state.expanded = false;

			// Set element
			if (node.$el) {
				node.$el.children('span.expand-icon')
					.removeClass(this._options.collapseIcon)
					.addClass(this._options.expandIcon);
			}

			// Collapse children 
			if (node.nodes && options) {
				$.each(node.nodes, $.proxy(function (index, node) {
					this._setVisible(node, false, options);
					this._setExpanded(node, false, options);
				}, this));
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeCollapsed', $.extend(true, {}, node));
			}
		}
	};

	Tree.prototype._setVisible = function (node, state, options) {

		if (options && state === node.state.visible) return;

		if (state) {

			// Set node state
			node.state.visible = true;

			// Set element
			if (node.$el) {
				node.$el.removeClass('node-hidden');
			}
		}
		else {

			// Set node state to unchecked
			node.state.visible = false;

			// Set element
			if (node.$el) {
				node.$el.addClass('node-hidden');
			}
		}
	};

	Tree.prototype._toggleSelected = function (node, options) {
		if (!node) return;
		this._setSelected(node, !node.state.selected, options);
		return this;
	};

	Tree.prototype._setSelected = function (node, state, options) {

		// We never pass options when rendering, so the only time
		// we need to validate state is from user interaction
		if (options && state === node.state.selected) return;

		if (state) {

			// If multiSelect false, unselect previously selected
			if (!this._options.multiSelect) {
				$.each(this._findNodes('true', 'g', 'state.selected'), $.proxy(function (index, node) {
					this._setSelected(node, false, options);
				}, this));
			}

			// Set note state
			node.state.selected = true;

			// Set element
			if (node.$el) {
				node.$el.addClass('node-selected');

				if (node.selectedIcon || this._options.selectedIcon) {
					node.$el.children('span.node-icon')
						.removeClass(node.icon || this._options.nodeIcon)
						.addClass(node.selectedIcon || this._options.selectedIcon);
				}
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeSelected', $.extend(true, {}, node));
			}
		}
		else {

			// Set node state
			node.state.selected = false;

			// Set element
			if (node.$el) {
				node.$el.removeClass('node-selected');

				if (node.selectedIcon || this._options.selectedIcon) {
					node.$el.children('span.node-icon')
						.removeClass(node.selectedIcon || this._options.selectedIcon)
						.addClass(node.icon || this._options.nodeIcon);
				}
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeUnselected', $.extend(true, {}, node));
			}
		}

		return this;
	};

	Tree.prototype._toggleChecked = function (node, options) {
		if (!node) return;
		this._setChecked(node, !node.state.checked, options);
	};

	Tree.prototype._setChecked = function (node, state, options) {

		// We never pass options when rendering, so the only time
		// we need to validate state is from user interaction
		if (options && state === node.state.checked) return;

		if (state) {

			// Set node state
			node.state.checked = true;

			// Set element
			if (node.$el) {
				node.$el.addClass('node-checked');
				node.$el.children('span.check-icon')
					.removeClass(this._options.uncheckedIcon)
					.addClass(this._options.checkedIcon);
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeChecked', $.extend(true, {}, node));
			}
		}
		else {

			// Set node state to unchecked
			node.state.checked = false;

			// Set element
			if (node.$el) {
				node.$el.removeClass('node-checked');
				node.$el.children('span.check-icon')
					.removeClass(this._options.checkedIcon)
					.addClass(this._options.uncheckedIcon);
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeUnchecked', $.extend(true, {}, node));
			}
		}
	};

	Tree.prototype._setDisabled = function (node, state, options) {

		// We never pass options when rendering, so the only time
		// we need to validate state is from user interaction
		if (options && state === node.state.disabled) return;

		if (state) {

			// Set node state to disabled
			node.state.disabled = true;

			// Disable all other states
			this._setSelected(node, false, options);
			this._setChecked(node, false, options);
			this._setExpanded(node, false, options);

			// Set element
			if (node.$el) {
				node.$el.addClass('node-disabled');
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeDisabled', $.extend(true, {}, node));
			}
		}
		else {

			// Set node state to enabled
			node.state.disabled = false;

			// Set element
			if (node.$el) {
				node.$el.removeClass('node-disabled');
			}

			// Optionally trigger event
			if (options && !options.silent) {
				this.$element.trigger('nodeEnabled', $.extend(true, {}, node));
			}
		}
	};

	Tree.prototype._setSearchResult = function (node, state, options) {
		if (options && state === node.searchResult) return;

		if (state) {

			node.searchResult = true;

			if (node.$el) {
				node.$el.addClass('node-result');
			}
		}
		else {

			node.searchResult = false;

			if (node.$el) {
				node.$el.removeClass('node-result');
			}
		}
	};

	Tree.prototype._render = function () {

		if (!this._initialized) {

			// Setup first time only components
			this.$wrapper = $(this._template.tree);
			this.$element.empty()
				.addClass(pluginName)
				.append(this.$wrapper);

			this._injectStyle();

			this._initialized = true;
		}

		if (!this._tree) return;

		$.each(this._tree, $.proxy(function addRootNodes(id, node) {
			node.level = 1;
			this._renderNode(node);
		}, this));
	};

	Tree.prototype._renderNode = function (node, pEl) {
		if (!node) return;

		if (!node.$el) {

			// New node, needs a new element
			node.$el = this._newNodeEl(pEl);

			// One time setup
			node.$el
				.addClass('node-' + this._elementId)
				.attr('data-nodeid', node.nodeId);
		}
		else {
			node.$el.empty();
		}

		// Add indent/spacer to mimic tree structure
		for (var i = 0; i < (node.level - 1); i++) {
			node.$el.append(this._template.indent);
		}

		// Add expand / collapse or empty spacer icons
		node.$el
			.append($(this._template.icon)
				.addClass(node.nodes ? 'expand-icon' : this._options.emptyIcon)
			);

		// Add node icon
		if (this._options.showIcon) {
			node.$el
				.append($(this._template.icon)
					.addClass('node-icon')
					.addClass(node.icon || this._options.nodeIcon)
				);
		}

		// Add checkable icon
		if (this._options.showCheckbox) {
			node.$el
				.append($(this._template.icon)
					.addClass('check-icon')
				);
		}

		// Add text
		if (this._options.enableLinks) {
			node.$el
				.append($(this._template.link)
					.attr('href', node.href)
					.append(node.text)
				);
		}
		else {
			node.$el
				.append(node.text);
		}

		// Add tags as badges
		if (this._options.showTags && node.tags) {
			$.each(node.tags, $.proxy(function addTag(id, tag) {
				node.$el
					.append($(this._template.badge)
						.append(tag)
					);
			}, this));
		}

		// Set various node states
		this._setSelected(node, node.state.selected);
		this._setChecked(node, node.state.checked);
		this._setSearchResult(node, node.searchResult);
		this._setExpanded(node, node.state.expanded);
		this._setDisabled(node, node.state.disabled);
		this._setVisible(node, node.state.visible);

		// If children exist, recursively add
		if (node.nodes) {
			$.each(node.nodes.slice(0).reverse(), $.proxy(function (index, childNode) {
				childNode.level = node.level + 1;
				this._renderNode(childNode, node.$el);
			}, this));
		}
	};

	// Creates a new node element from template and
	// ensures the template is inserted at the correct position
	Tree.prototype._newNodeEl = function (pEl) {

		var $el = $(this._template.node);
		
		if (pEl) {
			this.$wrapper.children()
				.eq(pEl.index()).after($el);
		}
		else {
			this.$wrapper.append($el);
		}

		return $el;
	};

	// Expand node, rendering it's immediate children
	Tree.prototype._expandNode = function (node) {
		if (!node.nodes) return;

		var $pEl = node.$el;
		$.each(node.nodes.slice(0).reverse(), $.proxy(function (index, childNode) {
			childNode.level = node.level + 1;
			this._renderNode(childNode, $pEl);
		}, this));
	};

	// Add inline style into head
	Tree.prototype._injectStyle = function () {

		if (this._options.injectStyle && !document.getElementById(this._styleId)) {
			$('<style type="text/css" id="' + this._styleId + '"> ' + this._buildStyle() + ' </style>').appendTo('head');
		}
	};

	// Construct trees style based on user options
	Tree.prototype._buildStyle = function () {

		var style = '.node-' + this._elementId + '{';

		// Basic bootstrap style overrides
		if (this._options.color) {
			style += 'color:' + this._options.color + ';';
		}

		if (this._options.backColor) {
			style += 'background-color:' + this._options.backColor + ';';
		}

		if (!this._options.showBorder) {
			style += 'border:none;';
		}
		else if (this._options.borderColor) {
			style += 'border:1px solid ' + this._options.borderColor + ';';
		}
		style += '}';

		if (this._options.onhoverColor) {
			style += '.node-' + this._elementId + ':not(.node-disabled):hover{' +
				'background-color:' + this._options.onhoverColor + ';' +
			'}';
		}

		// Style search results
		if (this._options.highlightSearchResults && (this._options.searchResultColor || this._options.searchResultBackColor)) {
			
			var innerStyle = ''
			if (this._options.searchResultColor) {
				innerStyle += 'color:' + this._options.searchResultColor + ';';
			}
			if (this._options.searchResultBackColor) {
				innerStyle += 'background-color:' + this._options.searchResultBackColor + ';';
			}

			style += '.node-' + this._elementId + '.node-result{' + innerStyle + '}';
			style += '.node-' + this._elementId + '.node-result:hover{' + innerStyle + '}';
		}

		// Style selected nodes
		if (this._options.highlightSelected && (this._options.selectedColor || this._options.selectedBackColor)) {
			
			var innerStyle = ''
			if (this._options.selectedColor) {
				innerStyle += 'color:' + this._options.selectedColor + ';';
			}
			if (this._options.selectedBackColor) {
				innerStyle += 'background-color:' + this._options.selectedBackColor + ';';
			}

			style += '.node-' + this._elementId + '.node-selected{' + innerStyle + '}';
			style += '.node-' + this._elementId + '.node-selected:hover{' + innerStyle + '}';
		}

		// Node level style overrides
		$.each(this._nodes, $.proxy(function (index, node) {
			if (node.color || node.backColor) {
				var innerStyle = '';
				if (node.color) {
					innerStyle += 'color:' + node.color + ';';
				}
				if (node.backColor) {
					innerStyle += 'background-color:' + node.backColor + ';';
				}
				style += '.node-' + this._elementId + '[data-nodeid="' + node.nodeId + '"]{' + innerStyle + '}';
			}
		}, this));

		return this._css + style;
	};

	Tree.prototype._template = {
		tree: '<ul class="list-group"></ul>',
		node: '<li class="list-group-item"></li>',
		indent: '<span class="indent"></span>',
		icon: '<span class="icon"></span>',
		link: '<a href="#" style="color:inherit;"></a>',
		badge: '<span class="badge"></span>'
	};

	Tree.prototype._css = '.treeview .list-group-item{cursor:pointer}.treeview span.indent{margin-left:10px;margin-right:10px}.treeview span.icon{width:12px;margin-right:5px}.treeview .node-disabled{color:silver;cursor:not-allowed}'


	/**
		Returns a single node object that matches the given node id.
		@param {Number} nodeId - A node's unique identifier
		@return {Object} node - Matching node
	*/
	Tree.prototype.getNode = function (nodeId) {
		return this._nodes[nodeId];
	};

	/**
		Returns the parent node of a given node, if valid otherwise returns undefined.
		@param {Object|Number} identifier - A valid node or node id
		@returns {Object} node - The parent node
	*/
	Tree.prototype.getParent = function (identifier) {
		var node = this._identifyNode(identifier);
		return this._nodes[node.parentId];
	};

	/**
		Returns an array of sibling nodes for a given node, if valid otherwise returns undefined.
		@param {Object|Number} identifier - A valid node or node id
		@returns {Array} nodes - Sibling nodes
	*/
	Tree.prototype.getSiblings = function (identifier) {
		var node = this._identifyNode(identifier);
		var parent = this.getParent(node);
		var nodes = parent ? parent.nodes : this._tree;
		return nodes.filter(function (obj) {
				return obj.nodeId !== node.nodeId;
			});
	};

	/**
		Returns an array of selected nodes.
		@returns {Array} nodes - Selected nodes
	*/
	Tree.prototype.getSelected = function () {
		return this._findNodes('true', 'g', 'state.selected');
	};

	/**
		Returns an array of unselected nodes.
		@returns {Array} nodes - Unselected nodes
	*/
	Tree.prototype.getUnselected = function () {
		return this._findNodes('false', 'g', 'state.selected');
	};

	/**
		Returns an array of expanded nodes.
		@returns {Array} nodes - Expanded nodes
	*/
	Tree.prototype.getExpanded = function () {
		return this._findNodes('true', 'g', 'state.expanded');
	};

	/**
		Returns an array of collapsed nodes.
		@returns {Array} nodes - Collapsed nodes
	*/
	Tree.prototype.getCollapsed = function () {
		return this._findNodes('false', 'g', 'state.expanded');
	};

	/**
		Returns an array of checked nodes.
		@returns {Array} nodes - Checked nodes
	*/
	Tree.prototype.getChecked = function () {
		return this._findNodes('true', 'g', 'state.checked');
	};

	/**
		Returns an array of unchecked nodes.
		@returns {Array} nodes - Unchecked nodes
	*/
	Tree.prototype.getUnchecked = function () {
		return this._findNodes('false', 'g', 'state.checked');
	};

	/**
		Returns an array of disabled nodes.
		@returns {Array} nodes - Disabled nodes
	*/
	Tree.prototype.getDisabled = function () {
		return this._findNodes('true', 'g', 'state.disabled');
	};

	/**
		Returns an array of enabled nodes.
		@returns {Array} nodes - Enabled nodes
	*/
	Tree.prototype.getEnabled = function () {
		return this._findNodes('false', 'g', 'state.disabled');
	};


	/**
		Set a node state to selected
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.selectNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setSelected(node, true, options);
		}, this));
	};

	/**
		Set a node state to unselected
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.unselectNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setSelected(node, false, options);
		}, this));
	};

	/**
		Toggles a node selected state; selecting if unselected, unselecting if selected.
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.toggleNodeSelected = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._toggleSelected(node, options);
		}, this));
	};


	/**
		Collapse all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.collapseAll = function (options) {
		options = $.extend({}, _default.options, options);
		options.levels = options.levels || 999;
		this.collapseNode(this._tree, options);
	};

	/**
		Collapse a given tree node
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.collapseNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setExpanded(node, false, options);
		}, this));
	};

	/**
		Expand all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.expandAll = function (options) {
		options = $.extend({}, _default.options, options);
		options.levels = options.levels || 999;
		this.expandNode(this._tree, options);
	};

	/**
		Expand a given tree node
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.expandNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setExpanded(node, true, options);
			if (node.nodes) {
				this._expandLevels(node.nodes, options.levels-1, options);
			}
		}, this));
	};

	Tree.prototype._expandLevels = function (nodes, level, options) {
		$.each(nodes, $.proxy(function (index, node) {
			this._setExpanded(node, (level > 0) ? true : false, options);
			if (node.nodes) {
				this._expandLevels(node.nodes, level-1, options);
			}
		}, this));
	};

	/**
		Reveals a given tree node, expanding the tree from node to root.
		@param {Object|Number|Array} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.revealNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			var parentNode = node;
			var tmpNode;
			while (tmpNode = this.getParent(parentNode)) {
				parentNode = tmpNode;
				this._setExpanded(parentNode, true, options);
			};
		}, this));
	};

	/**
		Toggles a nodes expanded state; collapsing if expanded, expanding if collapsed.
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.toggleNodeExpanded = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._toggleExpanded(node, options);
		}, this));
	};


	/**
		Check all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.checkAll = function (options) {
		var identifiers = this._findNodes('false', 'g', 'state.checked');
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setChecked(node, true, options);
		}, this));
	};

	/**
		Check a given tree node
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.checkNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setChecked(node, true, options);
		}, this));
	};

	/**
		Uncheck all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.uncheckAll = function (options) {
		var identifiers = this._findNodes('true', 'g', 'state.checked');
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setChecked(node, false, options);
		}, this));
	};

	/**
		Uncheck a given tree node
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.uncheckNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setChecked(node, false, options);
		}, this));
	};

	/**
		Toggles a nodes checked state; checking if unchecked, unchecking if checked.
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.toggleNodeChecked = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._toggleChecked(node, options);
		}, this));
	};


	/**
		Disable all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.disableAll = function (options) {
		var identifiers = this._findNodes('false', 'g', 'state.disabled');
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setDisabled(node, true, options);
		}, this));
	};

	/**
		Disable a given tree node
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.disableNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setDisabled(node, true, options);
		}, this));
	};

	/**
		Enable all tree nodes
		@param {optional Object} options
	*/
	Tree.prototype.enableAll = function (options) {
		var identifiers = this._findNodes('true', 'g', 'state.disabled');
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setDisabled(node, false, options);
		}, this));
	};

	/**
		Enable a given tree node
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.enableNode = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setDisabled(node, false, options);
		}, this));
	};

	/**
		Toggles a nodes disabled state; disabling is enabled, enabling if disabled.
		@param {Object|Number} identifiers - A valid node, node id or array of node identifiers
		@param {optional Object} options
	*/
	Tree.prototype.toggleNodeDisabled = function (identifiers, options) {
		this._forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
			this._setDisabled(node, !node.state.disabled, options);
		}, this));
	};


	/**
		Common code for processing multiple identifiers
	*/
	Tree.prototype._forEachIdentifier = function (identifiers, options, callback) {

		options = $.extend({}, _default.options, options);

		if (!(identifiers instanceof Array)) {
			identifiers = [identifiers];
		}

		$.each(identifiers, $.proxy(function (index, identifier) {
			callback(this._identifyNode(identifier), options);
		}, this));	
	};

	/*
		Identifies a node from either a node id or object
	*/
	Tree.prototype._identifyNode = function (identifier) {
		return ((typeof identifier) === 'number') ?
						this._nodes[identifier] :
						identifier;
	};

	/**
		Searches the tree for nodes (text) that match given criteria
		@param {String} pattern - A given string to match against
		@param {optional Object} options - Search criteria options
		@return {Array} nodes - Matching nodes
	*/
	Tree.prototype.search = function (pattern, options) {
		options = $.extend({}, _default.searchOptions, options);

		var previous = this._getSearchResults();
		var results = [];

		if (pattern && pattern.length > 0) {

			if (options.exactMatch) {
				pattern = '^' + pattern + '$';
			}

			var modifier = 'g';
			if (options.ignoreCase) {
				modifier += 'i';
			}

			results = this._findNodes(pattern, modifier);
		}

		// Clear previous results no longer matched
		$.each(this._diffArray(results, previous), $.proxy(function (index, node) {
			this._setSearchResult(node, false, options);
		}, this));

		// Set new results
		$.each(this._diffArray(previous, results), $.proxy(function (index, node) {
			this._setSearchResult(node, true, options);
		}, this));

		// Reveal hidden nodes
		if (results && options.revealResults) {
			this.revealNode(results);
		}

		this.$element.trigger('searchComplete', $.extend(true, {}, results));

		return results;
	};

	/**
		Clears previous search results
	*/
	Tree.prototype.clearSearch = function (options) {

		options = $.extend({}, { render: true }, options);

		var results = $.each(this._getSearchResults(), $.proxy(function (index, node) {
			this._setSearchResult(node, false, options);
		}, this));
		
		this.$element.trigger('searchCleared', $.extend(true, {}, results));
	};

	Tree.prototype._getSearchResults = function () {
		return this._findNodes('true', 'g', 'searchResult');
	};

	Tree.prototype._diffArray = function (a, b) {
		var diff = [];
		$.grep(b, function (n) {
			if ($.inArray(n, a) === -1) {
				diff.push(n);
			}
		});
		return diff;
	};

	/**
		Find nodes that match a given criteria
		@param {String} pattern - A given string to match against
		@param {optional String} modifier - Valid RegEx modifiers
		@param {optional String} attribute - Attribute to compare pattern against
		@return {Array} nodes - Nodes that match your criteria
	*/
	Tree.prototype._findNodes = function (pattern, modifier, attribute) {

		modifier = modifier || 'g';
		attribute = attribute || 'text';

		return $.grep(this._nodes, $.proxy(function (node) {
			var val = this._getNodeValue(node, attribute);
			if (typeof val === 'string') {
				return val.match(new RegExp(pattern, modifier));
			}
		}, this));
	};

	/**
		Recursive find for retrieving nested attributes values
		All values are return as strings, unless invalid
		@param {Object} obj - Typically a node, could be any object
		@param {String} attr - Identifies an object property using dot notation
		@return {String} value - Matching attributes string representation
	*/
	Tree.prototype._getNodeValue = function (obj, attr) {
		var index = attr.indexOf('.');
		if (index > 0) {
			var _obj = obj[attr.substring(0, index)];
			var _attr = attr.substring(index + 1, attr.length);
			return this._getNodeValue(_obj, _attr);
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
		if (window.console) {
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
			else if (typeof options === 'boolean') {
				result = _this;
			}
			else {
				$.data(this, pluginName, new Tree(this, $.extend(true, {}, options)));
			}
		});

		return result || this;
	};

})(jQuery, window, document);
