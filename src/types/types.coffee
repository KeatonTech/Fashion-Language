# Javascript Enum of Types
window.fashion.$type =

	# Basic Singular Types (font, width, color)
	None:		0
	Number: 	1
	String:		2
	Color: 		3
	Element:	4

	# Constant Valued Types (display, text-align)
	KGeneric: 	100
	KDisplay:	101
	KCenter:	102
	KListStyle:	103
	KLineStyle:	104
	KInset:		105

	# Special Types
	Unknown:	255

# Includes
# @prepros-append ./units.coffee
# @prepros-append ./constants.coffee