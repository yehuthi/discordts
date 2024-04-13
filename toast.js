class ToastElement extends HTMLElement {
	constructor() { super(); }

	static _template = (() => {
		const template = document.createElement('template');
		template.innerHTML = `
<style>
:host {
	background: #202225;
	position: fixed;
	bottom: 10px;
	border-radius: 10px;
}

#root {
	display: flex;
	padding: 1rem;
}

#button_close {
	background: none;
	border: none;
	cursor: pointer;
	color: #dcddde;
}
</style>

<div id="root">
	<slot></slot>
	<button id="button_close">🗙</button>
</div>
`;
		return template;
	})();

	static ATTR_VISIBLE = "visible";
	static observedAttributes = [this.ATTR_VISIBLE];

	connectedCallback() {
		const root = this.attachShadow({ mode: 'closed' });
		root.appendChild(ToastElement._template.content.cloneNode(true));
		const button_close = /** @type {HTMLButtonElement} */ (root.getElementById('button_close'));
		button_close.addEventListener('click', () => this.removeAttribute(ToastElement.ATTR_VISIBLE))
		this.style.opacity = 0;
		this.style.transform = 'translateY(100%)';
	}

	attributeChangedCallback(attr, _old_value, value) {
		console.log({attr,value}, Boolean(value));
		if (attr == ToastElement.ATTR_VISIBLE) {
			if (value !== null) {
				this.animate([
					{ transform: "translateY(0)", opacity: 1 },
				], { duration: 500, fill: 'forwards' });
			} else {
				this.animate([
					{},
					{ transform: `translateY(50%)`, opacity: 0.5 },
					{ transform: `translateY(100%)`, opacity: 0 },
				], { duration: 250, fill: 'forwards' });
			}
		}
	}
}

customElements.define("x-toast", ToastElement);
