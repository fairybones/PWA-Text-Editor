const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA

// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    // store the events triggered
    window.deferredPrompt = event;
    // make button visible
    butInstall.classList.toggle('hidden', false);
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    // store the events triggered
    const promptEvent = window.deferredPrompt;
    // if no e, handle error
    if (!promptEvent) {
        return;
    } // show prompt
    promptEvent.prompt();
    // reset the deferredPrompt var (can only be used once)
    window.deferredPrompt = null;
    // make button invisible
    butInstall.classList.toggle('hidden', true);
});

// Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    // clear prompt
    window.deferredPrompt = null;
});