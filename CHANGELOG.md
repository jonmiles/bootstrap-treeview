# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.2.0 - [Unreleased]

### New Features
- New option selectedIcon to support displaying different icons when node is selected.
- New search option `{ revealResults : true | false }` which when set to true will automatically expand the tree view to reveal matching nodes
- New method `revealNode` which expands the tree view to reveal a given node
- New methods `getSelected`, `getUnselected`, `getExpanded` and `getCollapsed` to retrieve nodes by state

### Changes
- By default search will expand tree view and reveal results
- Method collapseNode accepts new option `{ ignoreChildren: true | false }`.  The default is false, passing true will leave child nodes uncollapsed

### Bug Fixes
- Child nodes should collapse by default on collapseNode
- Incorrect expand collapse icon displayed when nodes array is empty


## v1.1.0 - 29th March, 2015

### New Features
- Added node state properties `expanded` and `selected` so a node's intial state can be set
- New get methods `getNode`, `getParent` and `getSiblings` for retrieving nodes and their immediate relations
- New select methods `selectNode`, `unselectNode` and `toggleNodeSelected`
- Adding `nodeUnselected` event
- New global option `multiSelect` which allows multiple nodes to hold the selected state, default is false
- New expand collapse methods `expandAll`, `collapseAll`, `expandNode`, `collapseNode` and `toggleNodeExpanded`
- Adding events `nodeExpanded` and `nodeCollapsed`
- New methods `search` and `clearSearch` which allow you to query the tree view for nodes based on a `text` value
- Adding events `searchComplete` and `searchCleared`
- New global options `highlightSearchResults`, `searchResultColor` and `searchResultBackColor` for configuring how search results are displayed


## v1.0.2 - 6th February, 2015

### Changes
- jQuery dependency version updated in Bower

### Bug Fixes
- Events not unbound when re-initialised
- CSS selectors too general, affecting other page elements
