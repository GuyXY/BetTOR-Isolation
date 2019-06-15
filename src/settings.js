const fields = {
	host:		document.getElementById("host"),
	port:		document.getElementById("port"),
	exceptions:	document.getElementById("exceptions"),
	proxyDns:	document.getElementById("proxyDns"),
	hsDnsLookup:	document.getElementById("hsDnsLookup")
};

let hsDnsLookupBlock = document.getElementById("hsDnsLookupBlock");

function refreshHsDnsLookupBlockVisibility() {
	hsDnsLookupBlock.style.display = fields.proxyDns.checked ? "none" : "block";
}

(async () => {
	const values = await browser.storage.local.get(Object.keys(fields));

	for(const fieldName in fields) {
		let field = fields[fieldName];
		if(field.type != "checkbox") {
			field.value = values[fieldName] ? values[fieldName] : "";
		} else {
			field.checked = values[fieldName];
		}
	}

	refreshHsDnsLookupBlockVisibility();
	fields.proxyDns.onclick = refreshHsDnsLookupBlockVisibility;

})();

document.getElementById("save").onclick = () => {

	let map = {};
	for(const fieldName in fields) {
		let field = fields[fieldName];
		if(field.type != "checkbox") {
			map[fieldName] = field.value;
		} else {
			map[fieldName] = field.checked;
		}
	}

	browser.storage.local.set(map);
};
