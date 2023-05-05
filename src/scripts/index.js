/** The last recorded index of the cursor in our expression textbox */
let lastCursorIndex = 0;
/** A dictionary of legal character in our expressions. */
let legalCharDict = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ()~∧∨→↔";
/** A variable to keep track of the legality of whatever is in the expression textbox. */
let legalExpression = false;

/**
 * Our main function.  Used to establish initial state of page and setup all other event listeners.
 */
window.addEventListener('load', () => {
    console.log("Logic Evaluator: BACKEND LOADED");
    document.getElementById('exprText').value = "";
    document.getElementById('genTTBtn').disabled = true;
    document.getElementById('pluginBtn').disabled = true;
    injectScripts();
});

/**Adds event listeners to the HTML Elements on the page. */
function injectScripts() {
    /** Prevent the default behavior of submitting the form on button press. */
    document.getElementById('exprForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
    });

    /** Keep {@link lastCursorIndex} updated */
    document.getElementById('exprText').addEventListener('selectionchange', () => {
        setTimeout(() => {
            lastCursorIndex = document.getElementById('exprText').selectionStart;
            document.getElementById('cursIndxLbl').textContent = "Index: " + lastCursorIndex.toString();
        }, 10);
    });

    /** Mark new expressions as automatically illegal to require reverification. */
    document.getElementById('exprText').addEventListener('keydown', (ev) => {
        if(ev.key == "ArrowDown" || ev.key == "ArrowLeft" || ev.key == "ArrowUp" || ev.key == "ArrowRight" || ev.ctrlKey){ return; }
        legalExpression = false;
        document.getElementById('legalityLbl').textContent = "Legal: " + legalExpression.toString();
        updateAppState();
    });

    /** Sets up the expression verification button. */
    document.getElementById('verifyBtn').addEventListener('click', () => {
        verifyUserInput();
    });

    /** Handles inserting special characters into the expression. */
    document.getElementById('negateBtn').addEventListener('click', () => {
        insertCharIntoExpr('~');
    });
    document.getElementById('andBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operations.And.description);
    });
    document.getElementById('orBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operations.Or.description);
    });
    document.getElementById('ifBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operations.If.description);
    });
    document.getElementById('iffBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operations.Iff.description);
    });
}

/** Function to check the legality of the user's inputted expression. If it's legal, switch the app state.*/
function verifyUserInput() {
    /**Remove all spaces. */
    while(document.getElementById('exprText').value.indexOf(" ") != -1){
        document.getElementById('exprText').value = document.getElementById('exprText').value.replace(" ", "");
    }
    let userInput = document.getElementById('exprText').value;
    let preCount = 0;
    let postCount = 0;
    for (let index = 0; index < userInput.length; index++) {
        if(userInput.charAt(index) == '('){
            preCount++;
            continue;
        }            
        if(userInput.charAt(index) == ')'){
            postCount++;
            continue;
        }
        /** Check character against dictionary. */
        if(legalCharDict.indexOf(userInput.charAt(index)) == -1){
            alert(`\"${userInput.charAt(index)}\" is not a legal character`);
            return;
        }
    }
    /** Check parenthesis count. */
    if(preCount != postCount){
        alert("Mistmatched Parenthesis");
    } else {
        legalExpression = true;
        document.getElementById('legalityLbl').textContent = "Legal: " + legalExpression.toString();
    }
    updateAppState();
}

/** Function to insert a character into the expression at the last location of the cursor. */
function insertCharIntoExpr(char) {
    document.getElementById('exprText').value = document.getElementById('exprText').value.substring(0, lastCursorIndex) + char + document.getElementById('exprText').value.substring(lastCursorIndex);
    lastCursorIndex++;
    document.getElementById('cursIndxLbl').textContent = "Index: " + lastCursorIndex.toString();
}

/** Function to alter UI elements based on interal flags. */
function updateAppState(){
    document.getElementById('genTTBtn').disabled = !legalExpression;
    document.getElementById('pluginBtn').disabled = !legalExpression;
}

/**
 * This is an expression class.  It is composed of a left and right side (either expressions or propositions), 
 * the operation between them, and whether or not the expression is negated.
 */
class Expression {

    /** The left side of the expression. */
    #leftExpr;
    /** The right side of the expression. */
    #rightExpr;
    /** The operation between the expression. */
    #operation;
    /** Whether or not the expression is negated. */
    #negated;

    constructor(_leftExpr, _rightExpr, _operation, _negated = false) {
        this.#leftExpr = _leftExpr;
        this.#rightExpr = _rightExpr;
        this.#operation = _operation;
        this.#negated = _negated;
    }

    /** Returns the value of this expression. */
    evaluate() {
        let oResult;
        switch (this.#operation) {
            case Operations.And:
                oResult = this.#leftExpr.evaluate() && this.#rightExpr.evaluate();
                break;
            case Operations.Of:
                oResult = this.#leftExpr.evaluate() || this.#rightExpr.evaluate();
                break;
            case Operations.If:
                oResult = !this.#leftExpr.evaluate() || this.#rightExpr.evaluate();
                break;
            case Operations.Iff:
                let lResult = this.#leftExpr.evaluate();
                let rResult = this.#rightExpr.evaluate();
                oResult = (!lResult || rResult) && (!rResult || lResult);
                break;
        }
        return (this.#negated ? !oResult : oResult);
    }

    /** Returns a string representation of an expression, enclosed by parenthesis. */
    toString() {
        return (this.#negated ? "~" : "") + + "(" + this.#leftExpr.toString() + this.#operation.toString() + this.#rightExpr.toString() + ")";
    }
}

/** Basically an enum that stores the four possible center operations. */
const Operations = {
    And: Symbol("∧"),
    Or: Symbol("∨"),
    If: Symbol("→"),
    Iff: Symbol("↔")
}

/**
 * This is a class to store a singular proposition
 * and its value, it it has one.
 */
class Proposition {

    #symbol;
    #value;
    #negated;

    constructor(_symbol, _value = null, _negated = false) {
        this.#symbol = _symbol;
        this.#value = _value;
        this.#negated = _negated;
    }

    /** Returns the value of this proposition. */
    evaluate() {
        return (this.#negated ? !this.#value : this.#value);
    }

    /** Returns a string representation of the proposition. */
    toString() {
        return (this.#negated ? "~" : "") + this.#symbol;
    }
}