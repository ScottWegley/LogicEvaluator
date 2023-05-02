
/**
 * Our main function.  Used to establish initial state of page and setup all other event listeners.
 */
window.addEventListener('load', () => {
    document.getElementById('exprForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
    });
});