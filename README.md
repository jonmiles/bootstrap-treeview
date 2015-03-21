# Bootstrap Tree View

---

![Bower version](https://img.shields.io/bower/v/bootstrap-treeview.svg?style=flat)
[![npm version](https://img.shields.io/npm/v/bootstrap-treeview.svg?style=flat)](https://www.npmjs.com/package/bootstrap-treeview)
[![Build Status](https://img.shields.io/travis/jonmiles/bootstrap-treeview/master.svg?style=flat)](https://travis-ci.org/jonmiles/bootstrap-treeview)
[![devDependency Status](https://img.shields.io/david/dev/jonmiles/bootstrap-treeview.svg?style=flat)](https://david-dm.org/jonmiles/bootstrap-treeeview#info=devDependencies)

A simple and elegant solution to displaying hierarchical tree structures (i.e. a Tree View) while leveraging the best that Twitter Bootstrap has to offer.

![Bootstrap Tree View Default](https://raw.github.com/jondmiles/bootstrap-treeview/master/screenshot/default.PNG)

<!--For full documentation and examples, please visit [Bootstrap Tree View Website](http://www.jondmiles.com/bootstrap-treeview/ "Click to visit Bootstrap Tree View")-->

## Requirements


Where provided these are the actual versions bootstrap-treeview has been tested against.  Other versions should work but you use them as your own risk.

- [Bootstrap v3.0.3](http://getbootstrap.com/)
- [jQuery v2.0.3](http://jquery.com/)

Sorry no support planned for Bootstrap 2.

## Usage

A full list of dependencies required for the bootstrap-treeview to function correctly.

```html
<!-- Required Stylesheets -->
<link href="./css/bootstrap.css" rel="stylesheet">

<!-- Required Javascript -->
<script src="./js/jquery.js"></script>
<script src="./js/bootstrap-treeview.js"></script>
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

At the lowest level a tree node is a represented as a simple JavaScript object.  Just one required property `text` will build you a tree.

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
  states: {
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


## Node Properties

The following properties are defined to allow node level overrides, such as node specific icons, colours and tags.

### text
`String` `Mandatory`

The text value displayed for a given tree node, typically to the right of the nodes icon.

### icon
`String` `Optional`

The icon displayed on a given node, typically to the left of the text.

For simplicity we directly leverage [Bootstraps Glyphicons support](http://getbootstrap.com/components/#glyphicons) and as such you should provide both the base class and individual icon class separated by a space.  

By providing the base class you retain full control over the icons used.  If you want to use your own then just add your class to this icon field.

### color
`String` `Optional`

The foreground color used on a given node, overrides global color option.

### backColor
`String` `Optional`

The background color used on a given node, overrides global color option.

### href
`String` `Optional`

Used in conjunction with global enableLinks option to specify anchor tag URL on a given node.

### selectable
`Boolean` `Default: true`

Whether or not a node is selectable in the tree. False indicates the node should act as an expansion heading and will not fire selection events.

### states
`Object` `Optional`

Describes a node's initial state.

### states.expanded
`Boolean` `Default: false`

Whether or not a node is expanded i.e. open.  Takes precedence over global option levels.

### states.selected
`Boolean` `Default: false`

Whether or not a node is selected.

### tags
`Array of Strings`  `Optional`

Used in conjunction with global showTags option to add additional information to the right of each node; using [Bootstrap Badges](http://getbootstrap.com/components/#badges)

### Extendible

You can extend the node object by adding any number of additional key value pairs that you require for your application.  Remember this is the object which will be passed around during selection events.



## Options

### data
Array of Objects.  No default, expects data

This is the core data to be displayed by the tree view.

### backColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: inherits from Bootstrap.css.

Sets the default background color used by all nodes, except when overridden on a per node basis in data.

### borderColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: inherits from Bootstrap.css.

Sets the border color for the component; set showBorder to false if you don't want a visible border.

### collapseIcon
String, class name(s).  Default: "glyphicon glyphicon-minus" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the icon to be used on a collapsible tree node.

### color
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: inherits from Bootstrap.css.

Sets the default foreground color used by all nodes, except when overridden on a per node basis in data.

### emptyIcon
String, class name(s).  Default: "glyphicon" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the icon to be used on a tree node with no child nodes.

### enableLinks
Boolean.  Default: false

Whether or not to present node text as a hyperlink.  The href value of which must be provided in the data structure on a per node basis.

### expandIcon
String, class name(s).  Default: "glyphicon glyphicon-plus" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the icon to be used on an expandable tree node.

### highlightSelected
Boolean.  Default: true

Whether or not to highlight the selected node.

### onhoverColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#F5F5F5'.

Sets the default background color activated when the users cursor hovers over a node.

### levels
Integer. Default: 2

Sets the number of hierarchical levels deep the tree will be expanded to by default.

### nodeIcon
String, class name(s).  Default: "glyphicon glyphicon-stop" as defined by [Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons)

Sets the default icon to be used on all nodes, except when overridden on a per node basis in data.

### selectedColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#FFFFFF'.

Sets the foreground color of the selected node.

### selectedBackColor
String, [any legal color value](http://www.w3schools.com/cssref/css_colors_legal.asp).  Default: '#FFFFFF'.

Sets the background color of the selected node.

### showBorder
Boolean.  Default: true

Whether or not to display a border around nodes.

### showTags
Boolean.  Default: false

Whether or not to display tags to the right of each node.  The values of which must be provided in the data structure on a per node basis.



## Methods

### clearSearch()

Clear the tree view of any previous search results e.g. remove their highlighted state.

```javascript
$('#tree').treeview('clearSearch');
```

Triggers `searchCleared` event

### collapseAll()

Collapse all tree nodes, collapsing the entire tree.

```javascript
$('#tree').treeview('collapseAll');
```

Triggers `nodeCollapsed` event

### collapseNode(node | nodeId)

Collapse a given tree node, accepts node or nodeId

```javascript
$('#tree').treeview('collapseNode', nodeId);
```

Triggers `nodeCollapsed` event

### expandAll([levels])

Expand all tree nodes.  Optionally can be expanded to any given number of levels.

```javascript
$('#tree').treeview('expandAll', levels);
```

Triggers `nodeExpanded` event

### expandNode(node | nodeId, [levels])

Expand a given tree node, accepts node or nodeId.  Optionally can be expanded to any given number of levels.

```javascript
$('#tree').treeview('expandNode', [ nodeId, levels]);
```

Triggers `nodeExpanded` event

### getNode(nodeId)

Returns a single node object that matches the given node id.

```javascript
$('#tree').treeview('getNode', nodeId);
```

### getParent(node)

Returns the parent node of a given node, if valid otherwise returns undefined.

```javascript
$('#tree').treeview('getParent', node);
```

### getSiblings(node)

Returns an array of sibling nodes for a given node, if valid otherwise returns undefined.

```javascript
$('#tree').treeview('getSiblings', node);
```

### remove()

Removes the tree view component. Removing attached events, internal attached objects, and added HTML elements.

```javascript
$('#tree').treeview('remove');
```

### search(pattern, options)

Searches the tree view for nodes that match a given string, highlighting them in the tree.  

Returns an array of matching nodes.

```javascript
$('#tree').treeview('search', [ 'Parent', {
  ignoreCase: true,
  exactMatch: false
}]);
```

Triggers `searchComplete` event

### selectNode(nodeId)

Set a node's state to selected

```javascript
$('#tree').treeview('selectNode', nodeId);
```

Triggers `nodeSelected` event

### toggleNodeExpanded(node | nodeId)

Toggles a nodes expanded state; collapsing if expanded, expanding if collapsed.

```javascript
$('#tree').treeview('toggleNodeExpanded', nodeId);
```

Triggers either `nodeExpanded` or `nodeCollapsed` event

### unselectNode(nodeId)

Set a node's state to unselected

```javascript
$('#tree').treeview('unselectNode', nodeId);
```

Triggers `nodeUnselected` event

## Events

You can bind to any event defined below by either using an options callback handler, or the standard jQuery .on method.

Example using options callback handler:

```javascript
$('#tree').treeview({
  // The naming convention for callback's is to prepend with `on`
  // an capitalize the first letter of the event name
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
