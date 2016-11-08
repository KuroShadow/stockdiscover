var first = "a", last = "z";
for(var i = first.charCodeAt(0);
 i <= last.charCodeAt(0);
 i++) {
	document.write( eval("String.fromCharCode(" + i + ")") + " " );
}
