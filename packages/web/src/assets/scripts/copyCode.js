document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
	const codeBlock = copyCodeButton.closest('figure.code-block');
	const code = codeBlock.querySelector('code').innerText;
	const copiedAlert = codeBlock.querySelector('[role="alert"]');

	copyCodeButton.addEventListener('click', () => {
		window.navigator.clipboard.writeText(code);
		copyCodeButton.classList.add('copied');
		copyCodeButton.innerText = 'Copied';
		copiedAlert.innerText = 'Copied';

		setTimeout(() => {
			copyCodeButton.classList.remove('copied');
			copyCodeButton.innerText = 'Copy';
			copiedAlert.innerText = '';
		}, 2000);
	});
});
