
//var stringify = require('json-stringify');

export const smversion = "0.0";

export default function GenMetadata ( _address, _signature) {
		const signInfo = {
					version: smversion,
					signer : _address,
					signature : _signature
				}
			const ret = JSON.stringify(signInfo);
			console.log("signInfo " + ret);
			return ret;
}

export function ParseMetadata (_jsoninfo) {
			const info = JSON.parse(_jsoninfo);
			console.log("signInfo parsed " + info);
			return info;
}
//export default {GenMetadata, ParseMetadata};
