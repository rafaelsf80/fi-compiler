/*
mul(int, int, ...) 			=> int
mul(int, nat, ...)		  => int
mul(nat, int, ...) 			=> int
mul(nat, nat, ...) 			=> nat
mul(mutez, nat, ...) 		=> mutez
mul(nat, mutez, ...) 		=> mutez
*/

var iotypes = {
	"int" : {
		"int" : "int",
		"nat" : "int",
	},
	"nat" : {
		"int" : "int",
		"nat" : "nat" ,
	},
	"mutez" : {
		"nat" : "mutez",
		"mutez" : "mutez"
	}
};

module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments for mul, expects at least 2";
		var instr = core.compile.ml('mul'), a1 = core.compile.code(op.shift()), an;
		if (typeof iotypes[a1.type[0]] == 'undefined') throw "Invalid type for mul, expects int, nat or mutez not " + a1.type[0];
		ret.type = a1.type;
		ret.code += a1.code;
		while(op.length){
			an = core.compile.code(op.shift());
			if (typeof iotypes[ret.type[0]][an.type[0]] == 'undefined') throw "Invalid type for mul " + an.type[0];
			ret.type = [iotypes[ret.type[0]][an.type[0]]];
			ret.code += core.compile.ml("dip", an.code);
			ret.code += instr;
		}
		return ret;
	}
};