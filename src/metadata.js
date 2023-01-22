
var stringify = require('json-stringify');

const smversion = 0.0;
const GenMetadata = async ({
	_address,
	_signature,
}) => {
		const signInfo = {
					version: smversion,
					signer : _address,
					signature : _signature
				}
			const ret = JSON.stringfy(signInfo);
			console.log("signInfo " + ret);
			return ret;
}
