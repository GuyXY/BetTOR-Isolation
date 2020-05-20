function getDomain(url) {
	let host = new URL(url).hostname;
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
