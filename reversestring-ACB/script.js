// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const inputText    = document.getElementById('inputText');
    const btnReverse   = document.getElementById('btnReverse');
    const output       = document.getElementById('output');
    const btnCopy      = document.getElementById('btnCopy');
    const copyFeedback = document.getElementById('copyFeedback');

    // Helper: enable/disable the Copy button based on whether there is output
    function syncCopyButton() {
        btnCopy.disabled = output.textContent.trim() === '';
    }

    // Reverse the input string and display it
    btnReverse.addEventListener('click', () => {
        const text = inputText.value;

        // Bug fix: if input is empty, clear output and return early
        if (text.trim() === '') {
            output.textContent = '';
            copyFeedback.textContent = '';
            syncCopyButton();
            return;
        }

        const reversed = text.split('').reverse().join('');
        output.textContent = reversed;

        // Clear previous copy feedback when a new reverse is triggered
        copyFeedback.textContent = '';
        syncCopyButton();
    });

    // Copy the output text to clipboard
    btnCopy.addEventListener('click', () => {
        const textToCopy = output.textContent;
        if (!textToCopy) return;

        // Bug fix: execCommand('copy') is deprecated — use only Clipboard API.
        // The catch handles contexts where the Clipboard API is unavailable (e.g. non-HTTPS).
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => showCopyFeedback())
                .catch(() => showCopyFeedback(false));
        } else {
            // Graceful degradation for non-secure contexts (HTTP, some older browsers)
            showCopyFeedback(false);
        }
    });

    function showCopyFeedback(success = true) {
        copyFeedback.textContent = success ? '✓ Copied to clipboard!' : '⚠ Copy not available in this context.';
        setTimeout(() => { copyFeedback.textContent = ''; }, 2000);
    }

    // Set initial state
    syncCopyButton();
});