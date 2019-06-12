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

//stoi converts a string to an integer
function stoi(string) {
    return string|0;
}

//versionCompare is a function that compares two strings of semantic versions
//this function returns
//-1 if v1 is newer
//1 if v2 is newer
//0 if both are the same
function versionCompare(v1, v2) {

    v1 = v1.split(".");
    v2 = v2.split(".");

    for(let i = 0; i < v1.length; ++i) {

        const v1Part = stoi(v1[i]);
        const v2Part = stoi(v2[i]);

        if(v1Part < v2Part) {
            return 1;
        } else if(v1Part > v2Part) {
            return -1;
        }
    }
    return 0;
}

browser.proxy.onRequest.addListener(async request => {
	
	const profileId = (request.tabId == -1 || (await browser.tabs.get(request.tabId)).incognito) ? privateProfileId : defaultProfileId;
	
	let url = request.documentUrl ? request.documentUrl : request.url;
	let host = getDomain(new URL(url).hostname);

	console.log(`${profileId} ${host}`); 

	const exceptions = (await browser.storage.local.get("exceptions")).exceptions.split("\n");
	if(exceptions.includes(host)) {
		return [{"type": "direct"}];
	}

	return [{
		"type": "socks",
		"host": (await browser.storage.local.get("host")).host,
		"port": (await browser.storage.local.get("port")).port,
		"username": profileId,
		"password": host,
		"proxyDNS": (await browser.storage.local.get("proxyDns")).proxyDns
	}];

}, {"urls": ["<all_urls>"]});

browser.runtime.onInstalled.addListener(async details => {
	switch(details.reason) {
		case "install":
			browser.storage.local.set({
				"host": "localhost",
				"port": 9050,
				"exceptions": "localhost",
				"proxyDns": true
			});
			break;
		case "update":
			if(versionCompare(details.previousVersion, "1.2.1") > 0) {
				let exceptions = (await browser.storage.local.get("exceptions")).exceptions;
				if(!exceptions.match(/.*(^|\n)localhost(\n|$).*/)) {
					exceptions = `localhost\n${exceptions}`;
				}
				browser.storage.local.set({
					"exceptions": exceptions,
					"proxyDns": true
				});
			}
			break;
	}
});
