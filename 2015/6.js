
var str = heredoc(function(){/*

*/});

var arr = str.split("\n");


for (var i in arr) {

}











// Multiline Function String - Nate Ferrero - Public Domain
function heredoc (f) {
	return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
};