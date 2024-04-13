const previewLocale = undefined;

const dateInput = /** @type {HTMLInputElement} */ (document.getElementById("dateInput"));
const tst = /** @type {HTMLButtonElement} */ (document.getElementById("ts-t"));
const tsT = /** @type {HTMLButtonElement} */ (document.getElementById("ts-T"));
const tsd = /** @type {HTMLButtonElement} */ (document.getElementById("ts-d"));
const tsD = /** @type {HTMLButtonElement} */ (document.getElementById("ts-D"));
const tsf = /** @type {HTMLButtonElement} */ (document.getElementById("ts-f"));
const tsF = /** @type {HTMLButtonElement} */ (document.getElementById("ts-F"));
const tsR = /** @type {HTMLButtonElement} */ (document.getElementById("ts-R"));
const toast = /** @type {ToastElement} */ (document.getElementById('toast'));

function updateView() {
	// Reference: https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
	const date = new Date(dateInput.value);
	const epoch = (date.valueOf() / 1000) | 0;

	/**
	 * @param {string} string 
	 */
	const clipboard_copy = async (string) => {
		try {
			await navigator.clipboard.writeText(string);
			toast.setAttribute(ToastElement.ATTR_VISIBLE, '');
			toast.textContent = 'Copied';
			setTimeout(() => toast.removeAttribute(ToastElement.ATTR_VISIBLE), 3000)
		} catch (e) {
			console.error("navigator.clipboard.writeText failed", e);
			toast.setAttribute(ToastElement.ATTR_VISIBLE, '');
			// @ts-ignore
			toast.innerHTML = `Failed to copy:<code id="toast_code">${string.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</code>`;
		}
	}

	const epochCopyFlag = (flag, type) => () => {
		clipboard_copy(`<t:${epoch}:${flag}>`);
		// @ts-ignore
		gtag("event", "copy_output", { date, type });
	};

	tst.textContent = date.toLocaleTimeString(previewLocale, {
		timeStyle: "short",
		hour12: false,
	});
	tst.onclick = epochCopyFlag("t", "Time (Short)");

	tsT.textContent = `:${date.getSeconds().toString().padStart(2, "0")}`;
	tsT.onclick = epochCopyFlag("T", "Time (Long)");

	tsd.textContent = date.toLocaleDateString(previewLocale, {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	});
	tsd.onclick = epochCopyFlag("d", "Date (Short)");

	tsD.textContent = date.toLocaleDateString(previewLocale, {
		dateStyle: "long",
	});
	tsD.onclick = epochCopyFlag("D", "Date (Long)");

	tsF.textContent = date.toLocaleString(previewLocale, {
		weekday: "long",
	});
	tsF.onclick = epochCopyFlag("F", "Datetime (Long)");

	tsf.textContent = date.toLocaleString(previewLocale, {
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
	tsf.onclick = () => {
		clipboard_copy(`<t:${epoch}>`);
		// @ts-ignore
		gtag("event", "copy_output", { date, type: "Datetime (Short)" });
	};

	// @ts-ignore
	timeago.cancel(tsR);
	tsR.setAttribute("datetime", date.toISOString());
	// @ts-ignore
	timeago.render(tsR);
	tsR.onclick = epochCopyFlag("R", "Relative");
}

function init() {
	const now = new Date();
	dateInput.valueAsNumber = (now.getTimezoneOffset() * -60000) +
		// round away the milliseconds so they don't show up in the date <input> control
		(((now.valueOf() / 1000) | 0) * 1000); 
	dateInput.oninput = updateView;
	updateView();

	// Make the time + seconds button also highlight the time without seconds
	// to suggest it will semantically include it.
	// Note: The datetime button group does this via CSS.
	tsT.onmouseenter = () => {
		tst.classList.add("buttonHover");
	};
	tsT.onmouseleave = () => {
		tst.classList.remove("buttonHover");
	};
	tsT.onmousedown = () => {
		tst.classList.add("buttonActive");
		window.addEventListener(
			"mouseup",
			() => {
				tst.classList.remove("buttonActive");
			},
			{ once: true }
		);
	};
}

init();
