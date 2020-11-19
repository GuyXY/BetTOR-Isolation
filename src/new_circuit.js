async function getCurrentTab() {
	return (await browser.tabs.query({active: true, currentWindow: true}))[0];
}

(async function() {
	let domainSelect = document.getElementById("domain");
	let submitButton = document.getElementById("submit");

	let {history} = await browser.runtime.sendMessage({type: "getTabHistory", tabId: (await getCurrentTab()).id});
	for (let domain of history.reverse()) {
		let option = document.createElement("option");
		option.text = domain;
		domainSelect.add(option);
	}

	submitButton.onclick = async () => {
		await browser.runtime.sendMessage({type: "newCircuit", domain: domainSelect.value});
		close();
	}
})();
