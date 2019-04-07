const fields = {
	host:		document.getElementById("host"),
	port:		document.getElementById("port"),
	exceptions:	document.getElementById("exceptions")
};

(async () => {
	const values = await browser.storage.local.get(Object.keys(fields));

	for(const field in fields) {
		fields[field].value = values[field] ? values[field] : "";
	}
})();

document.getElementById("save").onclick = () => {

	let map = {};
	for(const field in fields) {
		map[field] = fields[field].value;
	}

	browser.storage.local.set(map);
};
