# Bootstrap Tree View

---

![Bower version](https://img.shields.io/bower/v/bootstrap-treeview.svg?style=flat)
[![npm version](https://img.shields.io/npm/v/bootstrap-treeview.svg?style=flat)](https://www.npmjs.com/package/bootstrap-treeview)
[![Build Status](https://img.shields.io/travis/jonmiles/bootstrap-treeview/master.svg?style=flat)](https://travis-ci.org/jonmiles/bootstrap-treeview)

A simple and elegant solution to displaying hierarchical tree structures (i.e. a Tree View) while leveraging the best that Twitter Bootstrap has to offer.

![Bootstrap Tree View Default](https://raw.github.com/jonmiles/bootstrap-treeview/master/screenshot/default.PNG)

## Dependencies

Where provided these are the actual versions bootstrap-treeview has been tested against.  

- [Bootstrap v3.3.4 (>= 3.0.0)](http://getbootstrap.com/)
- [jQuery v2.1.3 (>= 1.9.0)](http://jquery.com/)


## Getting Started

### Install

You can install using bower (recommended):

```javascript
$ bower install bootstrap-treeview
```

or using npm:

```javascript
$ npm install bootstrap-treeview
```

or [download](https://github.com/jonmiles/bootstrap-treeview/releases/tag/v1.1.0) manually.



### Usage

Add the following resources for the bootstrap-treeview to function correctly.

```html
<!-- Required Stylesheets -->
<link href="bootstrap.css" rel="stylesheet">

<!-- Required Javascript -->
<script src="jquery.js"></script>
<script src="bootstrap-treeview.js"></script>
```

The component will bind to any existing DOM element.

```html
<div id="tree"></div>
```

Basic usage may look something like this.

```javascript
function getTree() {
  // Some logic to retrieve, or generate tree structure
  return data;
}

$('#tree').treeview({data: getTree()});
```


## Data Structure

In order to define the hierarchical structure needed for the tree it's necessary to provide a nested array of JavaScript objects.

Example

```javascript
var tree = [
  {
    text: "Parent 1",
    nodes: [
      {
        text: "Child 1",
        nodes: [
          {
            text: "Grandchild 1"
          },
          {
            text: "Grandchild 2"
          }
        ]
      },
      {
        text: "Child 2"
      }
    ]
  },
  {
    text: "Parent 2"
  },
  {
    text: "Parent 3"
  },
  {
    text: "Parent 4"
  },
  {
    text: "Parent 5"
  }
];
```

At the lowest level a tree node is a represented as a simple JavaScript object.  This one required property `text` will build you a tree.

```javascript
{
  text: "Node 1"
}
```

If you want to do more, here's the full node specification

```javascript
{
  text: "Node 1",
  icon: "glyphicon glyphicon-stop",
  color: "#000000",
  backColor: "#FFFFFF",
  href: "#node-1",
  selectable: true,
  state: {
  	expanded: true,
  	selected: true
  },
  tags: ['available'],
  nodes: [
    {},
    ...
  ]
}
```

### Node Properties

The following properties are defined to allow node level overrides, such as node specific icons, colours and tags.

#### text
`String` `Mandatory`

The text value displayed for a given tree node, typically to the right of the nodes icon.

#### icon
`String` `Optional`

The icon displayed on a given node, typically to the left of the text.

For simplicity we directly leverage [Bootstraps Glyphicons support](http://getbootstrap.com/components/#glyphicons) and as such you should provide both the base class and individual icon class separated by a space.  

By providing the base class you retain full control over the icons used.  If you want to use your own then just add your class to this icon field.

#### color
`String` `Optional`

The foreground color used on a given node, overrides global color option.

#### backColor
`String` `Optional`

The background color used on a given node, overrides global color option.

#### href
`String` `Optional`

Used in conjunction with global enableLinks option to specify anchor tag URL on a given node.

#### selectable
`Boolean` `Default: true`

Whether or not a node is selectable in the tree. False indicates the node should act as an expansion heading and will not fire selection events.

#### state
`Object` `Optional`

Describes a node's initial state.

#### state.expanded
`Boolean` `Default: false`

Whether or not a node is expanded i.e. open.  Takes precedence over global option levels.

#### state.selected
`Boolean` `Default: false`

Whether or not a node is selected.

#### tags
`Array of Strings`  `Optional`

Used in conjunction with global showTags option to add additional information to the right of each node; using [Bootstrap Badges](http://getbootstrap.com/components/#badges)

### Extendible

You can extend the node object by adding any number of additional key value pairs that you require for your application.  Remember this is the object which will be passed around during selection events.



## Options

Options allow you to customise the treeview's default appearance and behaviour.  They are passed to the plugin on initialization, as an object.

```javascript
// Example: initializing the treeview
// expanded to 5 levels
// with a background color of green
$('#tree').treeview({
  data: data,         // data is not optional
  levels: 5,
  backColor: 'green'
});
```
You can pass a new options object to the treeview at any time but this will have the effect of re-initializing the treeview.

### List of Options

The following is a list of all available options.

#### data
Array of Objects.  No default, expects data

This is the core data to be displayed by the tree view.

#### backColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: inherits from Bootstrap.css.

Sets the default background color used by all nodes, except when overridden on a per node basis in data.

#### borderColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: inherits from Bootstrap.css.

Sets the border color for the component; set showBorder to false if you don't want a visible border.

#### collapseIcon
String, class name(s).  Default: "glyphicon glyphicon-minus" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the icon to be used on a collapsible tree node.

#### color
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: inherits from Bootstrap.css.

Sets the default foreground color used by all nodes, except when overridden on a per node basis in data.

#### emptyIcon
String, class name(s).  Default: "glyphicon" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the icon to be used on a tree node with no child nodes.

#### enableLinks
Boolean.  Default: false

Whether or not to present node text as a hyperlink.  The href value of which must be provided in the data structure on a per node basis.

#### expandIcon
String, class name(s).  Default: "glyphicon glyphicon-plus" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the icon to be used on an expandable tree node.

#### highlightSearchResults
Boolean.  Default: true

Whether or not to highlight search results.

#### highlightSelected
Boolean.  Default: true

Whether or not to highlight the selected node.

#### levels
Integer. Default: 2

Sets the number of hierarchical levels deep the tree will be expanded to by default.

#### multiSelect
Boolean.  Default: false

Whether or not multiple nodes can be selected at the same time.

#### nodeIcon
String, class name(s).  Default: "glyphicon glyphicon-stop" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the default icon to be used on all nodes, except when overridden on a per node basis in data.

#### onhoverColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#F5F5F5'.

Sets the default background color activated when the users cursor hovers over a node.

#### searchResultBackColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: undefined, inherits.

Sets the background color of the selected node.

#### searchResultColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#D9534F'.

Sets the foreground color of the selected node.

#### selectedBackColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#428bca'.

Sets the background color of the selected node.

#### selectedColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#FFFFFF'.

Sets the foreground color of the selected node.

#### showBorder
Boolean.  Default: true

Whether or not to display a border around nodes.

#### showTags
Boolean.  Default: false

Whether or not to display tags to the right of each node.  The values of which must be provided in the data structure on a per node basis.



## Methods

Methods provide a way of interacting with the plugin programmatically.  For example, expanding a node is possible via the expandNode method.

You can invoke methods in one of two ways, using either:

#### 1. The plugin's wrapper

The plugin's wrapper works as a proxy for accessing the underlying methods.

```javascript
$('#tree').treeview('methodName', args)
```
> Limitation, multiple arguments must be passed as an array of arguments.

#### 2. The treeview directly

You can get an instance of the treeview using one of the two following methods.

```javascript
// This special method returns an instance of the treeview.
$('#tree').treeview(true)
  .methodName(args);

// The instance is also saved in the DOM elements data,
// and accessible using the plugin's id 'treeview'.
$('#tree').data('treeview')
  .methodName(args);
```
> A better approach, if you plan a lot of interaction.

### List of Methods

The following is a list of all available methods.

#### clearSearch()

Clear the tree view of any previous search results e.g. remove their highlighted state.

```javascript
$('#tree').treeview('clearSearch');
```

Triggers `searchCleared` event

#### collapseAll(options)

Collapse all tree nodes, collapsing the entire tree.

```javascript
$('#tree').treeview('collapseAll', { silent: true });
```

Triggers `nodeCollapsed` event; pass silent to suppress events.

#### collapseNode(node | nodeId, options)

Collapse a given tree node and it's child nodes.  If you don't want to collapse the child nodes, pass option `{ ignoreChildren: true }`.

```javascript
$('#tree').treeview('collapseNode', [ nodeId, { silent: true, ignoreChildren: false } ]);
```

Triggers `nodeCollapsed` event; pass silent to suppress events.


#### expandAll(options)

Expand all tree nodes.  Optionally can be expanded to any given number of levels.

```javascript
$('#tree').treeview('expandAll', { levels: 2, silent: true });
```

Triggers `nodeExpanded` event; pass silent to suppress events.

#### expandNode(node | nodeId, options)

Expand a given tree node, accepts node or nodeId.  Optionally can be expanded to any given number of levels.

```javascript
$('#tree').treeview('expandNode', [ nodeId, { levels: 2, silent: true } ]);
```

Triggers `nodeExpanded` event; pass silent to suppress events.

#### getCollapsed()

Returns an array of collapsed nodes e.g. state.expanded = false.

```javascript
$('#tree').treeview('getCollapsed', nodeId);
```
#### getExpanded()

Returns an array of expanded nodes e.g. state.expanded = true.

```javascript
$('#tree').treeview('getExpanded', nodeId);
```

#### getNode(nodeId)

Returns a single node object that matches the given node id.

```javascript
$('#tree').treeview('getNode', nodeId);
```

#### getParent(node | nodeId)

Returns the parent node of a given node, if valid otherwise returns undefined.

```javascript
$('#tree').treeview('getParent', node);
```

#### getSelected()

Returns an array of selected nodes e.g. state.selected = true.

```javascript
$('#tree').treeview('getSelected', nodeId);
```

#### getSiblings(node | nodeId)

Returns an array of sibling nodes for a given node, if valid otherwise returns undefined.

```javascript
$('#tree').treeview('getSiblings', node);
```

#### getUnselected()

Returns an array of unselected nodes e.g. state.selected = false.

```javascript
$('#tree').treeview('getUnselected', nodeId);
```

#### remove()

Removes the tree view component. Removing attached events, internal attached objects, and added HTML elements.

```javascript
$('#tree').treeview('remove');
```

#### revealNode(node | nodeId, options)

Reveals a given tree node, expanding the tree from node to root.

```javascript
$('#tree').treeview('revealNode', [ nodeId, { silent: true } ]);
```

Triggers `nodeExpanded` event; pass silent to suppress events.

#### search(pattern, options)

Searches the tree view for nodes that match a given string, highlighting them in the tree.  

Returns an array of matching nodes.

```javascript
$('#tree').treeview('search', [ 'Parent', {
  ignoreCase: true,     // case insensitive
  exactMatch: false,    // like or equals
  revealResults: true,  // reveal matching nodes
}]);
```

Triggers `searchComplete` event

#### selectNode(node | nodeId, options)

Selects a given tree node, accepts node or nodeId.

```javascript
$('#tree').treeview('selectNode', [ nodeId, { silent: true } ]);
```

Triggers `nodeSelected` event; pass silent to suppress events.

#### toggleNodeExpanded(node | nodeId, options)

Toggles a nodes expanded state; collapsing if expanded, expanding if collapsed.

```javascript
$('#tree').treeview('toggleNodeExpanded', [ nodeId, { silent: true } ]);
```

Triggers either `nodeExpanded` or `nodeCollapsed` event; pass silent to suppress events.

#### toggleNodeSelected(node | nodeId, options)

Toggles a node selected state; selecting if unselected, unselecting if selected.

```javascript
$('#tree').treeview('toggleNodeSelected', [ nodeId, { silent: true } ]);
```

Triggers either `nodeSelected` or `nodeUnselected` event; pass silent to suppress events.

#### unselectNode(node | nodeId, options)

Unselects a given tree node, accepts node or nodeId.

```javascript
$('#tree').treeview('unselectNode', [ nodeId, { silent: true } ]);
```

Triggers `nodeUnselected` event; pass silent to suppress events.

## Events

Events are provided so that your application can respond to changes in the treeview's state.  For example, if you want to update a display when a node is selected use the `nodeSelected` event.

You can bind to any event defined below by either using an options callback handler, or the standard jQuery .on method.

Example using options callback handler:

```javascript
$('#tree').treeview({
  // The naming convention for callback's is to prepend with `on`
  // and capitalize the first letter of the event name
  // e.g. nodeSelected -> onNodeSelected
  onNodeSelected: function(event, data) {
    // Your logic goes here
  });
```

and using jQuery .on method

```javascript
$('#tree').on('nodeSelected', function(event, data) {
  // Your logic goes here
});
```

### List of Events

`nodeCollapsed (event, node)`  - A node is collapsed.

`nodeExpanded (event, node)` - A node is expanded.

`nodeSelected (event, node)`  - A node is selected.

`nodeUnselected (event, node)`  - A node is unselected.  

`searchComplete (event, results)`  - After a search completes

`searchCleared (event, results)`  - After search results are cleared



## Copyright and Licensing
Copyright 2013 Jonathan Miles

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
