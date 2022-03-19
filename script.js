const previewLocale = undefined;

const dateInput = document.getElementById("dateInput");
const tst = document.getElementById("ts-t");
const tsT = document.getElementById("ts-T");
const tsd = document.getElementById("ts-d");
const tsD = document.getElementById("ts-D");
const tsf = document.getElementById("ts-f");
const tsF = document.getElementById("ts-F");
const tsR = document.getElementById("ts-R");

function updateView() {
	// Reference: https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
	const date = new Date(dateInput.value);
	const epoch = (date / 1000) | 0;

	const epochCopyFlag = flag => () => {
		navigator.clipboard.writeText(`<t:${epoch}:${flag}>`);
	};

	tst.textContent = date.toLocaleTimeString(previewLocale, {
		timeStyle: "short",
		hour12: false,
	});
	tst.onclick = epochCopyFlag("t");

	tsT.textContent = `:${date.getSeconds().toString().padStart(2, "0")}`;
	tsT.onclick = epochCopyFlag("T");

	tsd.textContent = date.toLocaleDateString(previewLocale, {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	});
	tsd.onclick = epochCopyFlag("d");

	tsD.textContent = date.toLocaleDateString(previewLocale, {
		dateStyle: "long",
	});
	tsD.onclick = epochCopyFlag("D");

	tsF.textContent = date.toLocaleString(previewLocale, {
		weekday: "long",
	});
	tsF.onclick = epochCopyFlag("F");

	tsf.textContent = date.toLocaleString(previewLocale, {
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
	tsf.onclick = navigator.clipboard.writeText(`<t:${epoch}>`);

	timeago.cancel(tsR);
	tsR.setAttribute("datetime", date.toISOString());
	timeago.render(tsR);
	tsR.onclick = epochCopyFlag("R");
}

function init() {
	const now = new Date();
	dateInput.valueAsNumber = now.valueOf() + now.getTimezoneOffset() * -60000;
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
