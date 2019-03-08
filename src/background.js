//saneCharacters only contains characters that can easily be used in a url without any conversion (just to be 100% sure to not cause any bug there)
//it's also only 64 character long because that way it's a power of 2 which makes avoiding the modulo bias a lot easier
const saneCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-";

function genProfileId() {
	let id = "";
	let numbers = new Uint8Array(255);
	crypto.getRandomValues(numbers);
	for(let n of numbers) {
		id += saneCharacters.charAt(n % 64);
	}
	return id;
}

const defaultProfileId = genProfileId();
const privateProfileId = genProfileId();

function getDomain(host) {
	let c = 0;
	for(let i = host.length - 1; i > 0; i--) {
		if(host.charAt(i) == ".") {
			c++;
		}
		if(c == 2) {
			return host.substr(i + 1);
		}
	}
	return host;
}

browser.proxy.onRequest.addListener(async request => {
	
	const profileId = (request.tabId == -1 || (await browser.tabs.get(request.tabId)).incognito) ? privateProfileId : defaultProfileId;
	
	let url = request.documentUrl ? request.documentUrl : request.url;
	let host = getDomain(new URL(url).hostname);

	console.log(`${profileId} ${host}`); 

	return [{
		"type": "socks",
		"host": (await browser.storage.local.get("host")).host,
		"port": (await browser.storage.local.get("port")).port,
		"username": profileId,
		"password": host,
		"proxyDNS": true
	}];

}, {"urls": ["<all_urls>"]});

(async () => {
	if(!(await browser.storage.local.get("host")).host) {
		browser.storage.local.set({
			"host": "localhost",
			"port": 9050
		});
	}
})();
