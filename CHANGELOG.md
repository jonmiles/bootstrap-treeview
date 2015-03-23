# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.1.0 - [unreleased]

### New Features
- Node properties `expanded` and `selected` to set a node's initial state
- Methods `getNode`, `getParent` and `getSiblings` methods
- Methods `selectNode`, `unselectNode` and `toggleNodeSelected` methods
- Events `nodeUnselected`
- Option `multiSelect`
- Methods `expandAll`, `collapseAll`, `expandNode`, `collapseNode` and `toggleNodeExpanded` methods
- Events `nodeExpanded` and `nodeCollapsed` events
- Methods `search` and `clearSearch` methods, 
- Events `searchComplete` and `searchCleared` events
- Options `highlightSearchResults`, `searchResultColor` and `searchResultBackColor`


## v1.0.2 - 6th February, 2015

### Changes
- jQuery dependency version updated in Bower

### Bug Fixes
- Events not unbound when re-initialised
- CSS selectors too general, affecting other page elements
