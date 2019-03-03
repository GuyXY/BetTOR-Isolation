const saneCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_";

function genProfileId() {
	let id = "";
	const x = Math.pow(10, Math.floor(Math.log(saneCharacters.length) / Math.log(10)))
	for(let i = 0; i < 256; i++) {
		id += saneCharacters.charAt(Math.floor(Math.random() * x) % saneCharacters.length);
	}
	return id;
}

const defaultProfileId = genProfileId();
const privateProfileId = genProfileId();

browser.proxy.onRequest.addListener(async request => {
	
	const profileId = (await browser.tabs.get(request.tabId)).incognito ? privateProfileId : defaultProfileId;
	
	let host = new URL(request.documentUrl).hostname;
	let lastHostCharCode = domain.charCodeAt(domain.length - 1);
	if(!(lastHostCharCode >= 48 /*0*/ && lastHostCharCode <= 57 /*9*/)) {
		host = /\.(.*?\..*)$/.exec(host)[0];
	}
	
	return {
		"type": "socks",
		"host": "localhost",
		"port": 9050,
		"username": profileId,
		"password": host,
		"proxyDNS": true
	};
}, "<all_urls>");