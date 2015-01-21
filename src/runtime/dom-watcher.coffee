$wf.addRuntimeModule "DOMWatcher", [],

	"$watchDom": ()->
		# Some stuff to allow the watcher to be deactivated, to support older browsers
		if window.FASHION_NO_OBSERVE is true then return

		observeFunction = (mutations)->
			if !window.FSOBSERVER? or !window.FASHION? or window.FASHION_NO_OBSERVE is true
				return
			if !@expandNodeList? then return

			# Go through each mutation
			for mutation in mutations when mutation.addedNodes.length > 0

				# The node list here is just the top level, we need to consider absoluteley
				# everything that was added, so we'll expand it a bit
				addedNodes = @expandNodeList mutation.addedNodes

				# If there are individual scoped elements, add overrides for those
				if @addedIndividualScopedElements?
					@addedIndividualScopedElements addedNodes

				# If there are individualized properties, make sure those are updated 
				if @addedIndividualElements?
					@addedIndividualElements addedNodes

			# Request to still receive mutation events
			return true

		# Start the watcher
		window.FSOBSERVER = new MutationObserver (mutations)-> 
			if !window.FASHION? or !FASHION.runtime? then return
			observeFunction.call(FASHION.runtime, mutations)
		window.FSOBSERVER.observe(document.body, {childList: true, subtree: true});


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