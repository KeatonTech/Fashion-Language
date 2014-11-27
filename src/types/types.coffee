# Javascript Enum of Types
window.fashion.$type =

	# Basic Singular Types (font, width, color)
	Number: 	0
	String:		1
	Color: 		2

	# Composite Types (border, box-shadow, padding)
	C2Number:	50
	C4Number:	51
	CBorder:	52
	CShadow: 	53

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