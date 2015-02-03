$wf.addRuntimeModule "DOMWatcher", [],

	"$watchDom": ()->
		# Some stuff to allow the watcher to be deactivated, to support older browsers
		if window.FASHION_NO_OBSERVE is true then return

		# Get the mutation observer object, or revert to the polyfill if we can't
		if !MutationObserver? then MutationObserver = WebKitMutationObserver # Hello, Safari
		if !MutationObserver?
			if @watchDomPolyfill then return @LEGACY_watchDomPolyfill()
			else return @throwError "Failed to setup DOM watchers, cannot detect changes."

		observeFunction = (mutations)->
			# If the page has changed enough to be unrecognizable, abort mission
			if !window.FSOBSERVER? or !window.FASHION? or window.FASHION_NO_OBSERVE is true
				return

			for mutation in mutations 

				# Handle added nodes
				if mutation.addedNodes.length > 0
					@callDomGlobalWatchers "addNodes", @expandNodeList mutation.addedNodes

				# Handle moified nodes
				else if mutation.target?
					@callDomElementWatchers "changedNode", mutation.target

			# Request to still receive mutation events
			return true

		# Start the watcher
		window.FSOBSERVER = new MutationObserver (mutations)-> 
			if !window.FASHION? or !FASHION.runtime? then return
			observeFunction.call(FASHION.runtime, mutations)
		window.FSOBSERVER.observe(document.body, {childList: true, subtree: true});


	# Registers new watcher functions within the runtime.
	# Valid types: "addNodes", "changedNode"
	# ElementID applies to things that aren't addNode and limits the scope of the function
	"registerDomWatcher": (type, handler, elementId) ->
		if !window.FSDOMWATCHERS then window.FSDOMWATCHERS = {}
		if !window.FSDOMWATCHERS[type] then window.FSDOMWATCHERS[type] = []
		window.FSDOMWATCHERS[type].push [handler, elementId]


	# Run all functions registered to a given tag
	"callDomGlobalWatchers": (tag, nodes) ->
		f[0].call(FASHION.runtime, nodes) for f in window.FSDOMWATCHERS[tag]


	# Runs all functions registered to a given tag and a given element or one its children
	"callDomElementWatchers": (tag, element) ->

		# Accumulate all parents of the element
		matchingIds = [element.id]
		while element element.parentNode?
			matchingIds.push element.id

		# Go through watcher functions
		for f in window.FSDOMWATCHERS[tag] when f[1] in matchingIds
			f[0].call(FASHION.runtime, element)


	# Takes a top level node list and expands it to include all child nodes as well
	"expandNodeList": (nodeList) ->

		# Convert to writable array
		nodeList = Array.prototype.slice.call nodeList

		addChildren = (elm) ->
			if !elm? or !elm.children? or elm.children.length is 0 then return
			for child in elm.children
				nodeList.push child
				addChildren child

		addChildren(nodeList[i]) for i in [nodeList.length - 1 .. 0]

		return nodeList


	# Polyfill using MutationEvents for support back to IE9
	# Causes a significant performance hit
	"LEGACY_watchDomPolyfill": ()->
		console.log "[FASHION] Installing DOM Observer Polyfill. Will impact performance!"

		# Added Nodes
		document.body.addEventListener "DOMNodeInserted", ((ev)->
			@callDomGlobalWatchers "addNodes", @expandNodeList [event.target]
		), false

		# Changed Node
		changeEvents = [
			"DOMAttrModified", "DOMCharacterDataModified",
			"DOMElementNameChanged", "DOMAttributeNameChanged"
		]
		for evtName in changeEvents
			document.body.addEventListener evtName, ((ev)->
				@callDomElementWatchers "changedNode", ev.target
			), false
