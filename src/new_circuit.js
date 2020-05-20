async function getDomainOfCurrentTab() {
	return getDomain((await browser.tabs.query({active: true, currentWindow: true}))[0].url);
}

(async function() {
	let button = document.getElementsByTagName("button")[0];
	button.innerText = "Use new circuit for " + await getDomainOfCurrentTab();
	button.onclick = async () => {
		browser.runtime.sendMessage({type: "newCircuit", domain: await getDomainOfCurrentTab()});
	}
})();
