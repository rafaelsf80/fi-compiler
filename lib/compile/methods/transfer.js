/*
transfer(contract _, mutez, *_)
transfer(address, mutez, *_)
transfer(key, mutez, *_)
transfer(key_hash, mutez, *_)
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: false
		}
		if (op.length < 2 || op.length > 3) {
			throw 'Invalid arguments for function transfer, expects 2 or 3'
		}
		const to = core.compile.code(op.shift())
			 const amt = core.compile.code(op.shift()); let tt = ['unit']

		if (['contract', 'address', 'key', 'key_hash'].indexOf(to.type[0]) < 0) {
			throw `Invalid type for transfer to, expecting contract, address, key or key_hash not ${to.type[0]}`
		}
		if (amt.type[0] != 'mutez') {
			throw `Invalid type for amount, expecting mutez not ${amt.type[0]}`
		}


		if (op.length) {
			const param = core.compile.code(op.shift())
			ret.code = param.code
			tt = param.type
		}
		else {
			ret.code = ['UNIT']
		}

		ret.code.push(['DIP', amt.code])

		if (to.type[0] == 'key_hash' || to.type[0] == 'key') {
			if (to.type[0] == 'key') {
				to.code.push(core.compile.ml('hash_key'))
			}
			to.code.push(core.compile.ml('implicit_account'))
		}
		else if (to.type[0] == 'address') {
			to.code.push(`CONTRACT ${core.compile.type(tt)}`)
			to.code = to.code.concat(core.compile.error('Invalid contract'))
		}

		ret.code.push(['DIIP', to.code])
		ret.code.push('TRANSFER_TOKENS')
		ret.code = ret.code.concat(core.compile.operation())
		return ret
	}
}
