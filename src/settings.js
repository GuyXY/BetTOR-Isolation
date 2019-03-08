const hostField = document.getElementById("host");
const portField = document.getElementById("port");

(async () => {
	hostField.value = (await browser.storage.local.get("host")).host;
	portField.value = (await browser.storage.local.get("port")).port;
})();

document.getElementById("save").onclick = () => {
	browser.storage.local.set({
		"host": hostField.value,
		"port": portField.value
	});
};
