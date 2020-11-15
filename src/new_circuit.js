async function getDomainOfCurrentTab() {
	return getDomain((await browser.tabs.query({active: true, currentWindow: true}))[0].url);
}

(async function() {
	let domainInput = document.getElementById("domain");
	let submitButton = document.getElementById("submit");
	domainInput.value = await getDomainOfCurrentTab();
	submitButton.onclick = () => {
		browser.runtime.sendMessage({type: "newCircuit", domain: domainInput.value});
		close();
	}
})();
