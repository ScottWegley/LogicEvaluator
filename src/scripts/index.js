import { Operations } from './expression.js';

/** The last recorded index of the cursor in our expression textbox */
let lastCursorIndex = 0;


/**
 * Our main function.  Used to establish initial state of page and setup all other event listeners.
 */
window.addEventListener('load', () => {
    
    injectScripts();
});

/**Adds event listeners to the HTML Elements on the page. */
function injectScripts() {
    /** Prevent the default behavior of submitting the form on button press. */
    document.getElementById('exprForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
    });

    /** Keep {@link lastCursorIndex} updated */
    document.getElementById('exprText').addEventListener('keydown', (ev) => {
        setTimeout(() => {
            lastCursorIndex = document.getElementById('exprText').selectionStart;
        }, 10);
    });
    document.getElementById('negateBtn').addEventListener('click', () =>{
        insertCharIntoExpr('~');
    });
    document.getElementById('andBtn').addEventListener('click', () =>{
        insertCharIntoExpr(Operations.And.description);
    });
    document.getElementById('orBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operations.Or.description);
    });
    document.getElementById('ifBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operations.If.description);
    });
    document.getElementById('iffBtn', () => {
        insertCharIntoExpr(Operations.Iff.description);
    });
}

function insertCharIntoExpr(char){
    alert(char);
}