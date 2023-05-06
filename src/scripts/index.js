/** The last recorded index of the cursor in our expression textbox */
let lastCursorIndex = 0;
/** A dictionary of legal character in our expressions. */
const alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ";
const symbols = "~∧∨→↔";
/** A variable to keep track of the legality of whatever is in the expression textbox. */
let legalExpression = false;
/** This will store the last legal expression in the form of my {@link Expression} class. */
let currentExpression;

/**
 * Our main function.  Used to establish initial state of page and setup all other event listeners.
 */
window.addEventListener('load', () => {
    console.log("Logic Evaluator: BACKEND LOADED");
    document.getElementById('exprText').value = "";
    document.getElementById('genTTBtn').disabled = true;
    document.getElementById('pluginBtn').disabled = true;
    document.getElementById('exprText').value = "()";
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

    /** Mark new expressions as automatically illegal to require reverification. Update character counts. */
    document.getElementById('exprText').addEventListener('keydown', (ev) => {
        // if (ev.key == "ArrowDown" || ev.key == "ArrowLeft" || ev.key == "ArrowUp" || ev.key == "ArrowRight" || ev.ctrlKey) { return; }
        setTimeout(() => {
            verifyUserInput();
            if(legalExpression){
                generateExpression();
            }
        }, 10);
        document.getElementById('exprText').setAttribute('size', document.getElementById('exprText').value.length+5);
    });

    document.getElementById('pluginBtn').addEventListener('click', () => {

    });

    /** Handles inserting special characters into the expression. */
    document.getElementById('negateBtn').addEventListener('click', () => {
        insertCharIntoExpr('~');
    });
    document.getElementById('andBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operation.And.description);
    });
    document.getElementById('orBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operation.Or.description);
    });
    document.getElementById('ifBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operation.If.description);
    });
    document.getElementById('iffBtn').addEventListener('click', () => {
        insertCharIntoExpr(Operation.Iff.description);
    });
}

/** Function to check the legality of the user's inputted expression. If it's legal, switch the app state.*/
function verifyUserInput() {
    encloseExpression();
    checkCharacters();
    updateAppState();
}

/** Encloses the expression in parenthesis if it is not already enclosed */
function encloseExpression() {
    let userInput = document.getElementById('exprText').value;
    if ((userInput.indexOf("(") == 0 || userInput.indexOf("~(") == 0) && userInput.lastIndexOf(")") == userInput.length - 1) {
        return;
    }
    document.getElementById('exprText').value = `(${userInput})`;
    document.getElementById('exprText').setAttribute('size', document.getElementById('exprText').value.length);
    return;
}

/**
 * Checks the validity of the expression in terms of characters and character distribution.
 */
function checkCharacters() {
    /**Remove all spaces. */
    while (document.getElementById('exprText').value.indexOf(" ") != -1) {
        document.getElementById('exprText').value = document.getElementById('exprText').value.replace(" ", "");
    }
    let userInput = document.getElementById('exprText').value;
    let preCount = 0;
    let postCount = 0;
    let letterCount = 0;
    let symbolCount = 0;
    /** Regex expression to catch two consecutive letters or symbols. */
    let regex = new RegExp(/[A-Za-z]{2,}|[∧∨→↔]{2,}/);
    for (let index = 0; index < userInput.length; index++) {
        if (userInput.charAt(index) == '(') {
            preCount++;
        }
        else if (userInput.charAt(index) == ')') {
            postCount++;
        }
        else if (userInput.charAt(index) == '~') {
            //dummy to skip next counts
        }
        else if (alphabet.indexOf(userInput.charAt(index)) != -1) {
            letterCount++;
        }
        else if (symbols.indexOf(userInput.charAt(index)) != -1) {
            symbolCount++;
        } else {
            appendError(ErrorType.IllegalCharError, userInput.charAt(index));
        }
        if (postCount > preCount) {
            appendError(ErrorType.MisplacedParenthesis, index);
        }
    }

    /** Check parenthesis count. */
    if (preCount != postCount) {
        appendError(ErrorType.MismatchedParenthesis);
        /** Check for repeating symbols or letters. */
    } else if (regex.test(userInput)) {
        appendError(ErrorType.ConsecutiveCharError);
        /** Check for proper distribution of symbols. */
    } else if (2 * preCount < letterCount || letterCount - 1 != symbolCount) {
        appendError(ErrorType.MiscInvalidError);
    } else {
        legalExpression = true;
        document.getElementById('legalityLbl').textContent = "Legal: " + legalExpression.toString();
        while (document.getElementById("errorReportDiv").firstChild != null) {
            document.getElementById("errorReportDiv").removeChild(document.getElementById("errorReportDiv").firstChild);
        }
    }
    document.getElementById('charStatsLbl').textContent = `Pre: ${preCount} Post: ${postCount} Ltrs: ${letterCount} Symb: ${symbolCount}`;
}

/**
 * Adds an error to the error div.
 * @param {ErrorType} eType A {@link ErrorType} that determines the format of the error.
 * @param {*} param An optional parameter that is variably inserted into the error text.
 */
function appendError(eType, param = '') {
    legalExpression = false;
    if (document.getElementById(eType.description) != null) { return; }
    let newError = document.createElement("Label");
    newError.setAttribute('id', eType.description);
    switch (eType) {
        case ErrorType.IllegalCharError:
            newError.textContent = `\"${param}\" is an illegal character.`;
            break;
        case ErrorType.MisplacedParenthesis:
            newError.textContent = `Misplaced Parenthesis at index ${param}`;
            break;
        case ErrorType.MismatchedParenthesis:
            newError.textContent = `Parenthesis are mismatched somewhere in expression.`;
            break;
        case ErrorType.ConsecutiveCharError:
            newError.textContent = `Cannot have consecutive symbols or consecutive letters.`;
            break;
        case ErrorType.MiscInvalidError:
            newError.textContent = `This expression is invalid.  Double check your parenthesis placement and make sure you don't have extra symbols.`;
            break;
    }
    document.getElementById("errorReportDiv").appendChild(newError);
    document.getElementById("errorReportDiv").appendChild(document.createElement("br"));
}

const ErrorType = {
    IllegalCharError: Symbol("illegalCharError"),
    MisplacedParenthesis: Symbol("misplaceParError"),
    MismatchedParenthesis: Symbol("mismatchParError"),
    ConsecutiveCharError: Symbol("consecCharError"),
    MiscInvalidError: Symbol("miscInvalidError")
}

/** Function to insert a character into the expression at the last location of the cursor. */
function insertCharIntoExpr(char) {
    document.getElementById('exprText').value = document.getElementById('exprText').value.substring(0, lastCursorIndex) + char + document.getElementById('exprText').value.substring(lastCursorIndex);
    lastCursorIndex++;
    document.getElementById('cursIndxLbl').textContent = "Index: " + lastCursorIndex.toString();
    document.getElementById('exprText').focus();
    document.getElementById('exprText').setSelectionRange(lastCursorIndex, lastCursorIndex);
    verifyUserInput();
}

/** Function to alter UI elements based on interal flags. */
function updateAppState() {
    document.getElementById('genTTBtn').disabled = !legalExpression;
    document.getElementById('pluginBtn').disabled = !legalExpression;
}

/** Function to scan the expression for all the pairings. */
function generateExpression() {
    let userInput = document.getElementById('exprText').value;
    currentExpression = new Expression((userInput.charAt(0) == '~' ? 1 : 0), userInput.length - 1, userInput,userInput.charAt(0) == '~');

    document.getElementById('curExprLbl').textContent = `Expr: ${currentExpression.toString()}`
}

/** Function to generate the plugin table for the current expression. */
function generatePluginTable() {
    let props = [];
    let stack = [currentExpression];
    while(stack.length > 0){
        let head = stack.shift();
        if(!(head instanceof Proposition)){
            stack.push(head.getLeft());
            stack.push(head.getRight());
        } else {
            props.push(head.getSymbol());
        }
    }
    console.log(props);
}

/**
 * This is an expression class.  It is composed of a left and right side (either {@link Expression}s or {@link Proposition}s), 
 * the {@link Operation} between them, and whether or not the expression is negated.
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


    constructor(_preIndex, _postIndex, _expr, _negated) {
        this.#negated = _negated;
        let startIndex = _preIndex + 1;
        let endIndex = _postIndex;
        let expr = _expr.substring(startIndex, endIndex);
        let preArr = [];
        let postArr = [];
        for (let i = 0; i < expr.length; i++) {
            if (expr.charAt(i) == '(') {
                preArr[preArr.length] = i;
            }
        }

        preArr.reverse();
        preArr.forEach((preI) => {
            for (let i = preI + 1; i < expr.length; i++) {
                if (expr.charAt(i) == ")") {
                    if (!postArr.includes(i)) {
                        postArr[postArr.length] = i;
                        break;
                    }
                }
            }
        });
        preArr.reverse();
        postArr.reverse();
        let operationIndex = -1;

        for (let i = 0; i < expr.length; i++) {
            if (symbols.substring(1, symbols.length).indexOf(expr.charAt(i)) != -1) {
                let tooDeep = false;
                for (let j = 0; j < preArr.length; j++) {
                    if (i > preArr[j] && i < postArr[j]) {
                        tooDeep = true;
                    }
                    if (tooDeep) {
                        break;
                    }
                }
                if (!tooDeep) {
                    operationIndex = i;
                    switch (expr.charAt(i)) {
                        case "∧":
                            this.#operation = Operation.And;
                            break;
                        case "∨":
                            this.#operation = Operation.Or;
                            break;
                        case "→":
                            this.#operation = Operation.If;
                            break;
                        case "↔":
                            this.#operation = Operation.Iff;
                            break;
                    }
                }
            }
            if (!this.#operation == undefined) { break; }
        }

        let leftIsProp = true;
        let rightIsProp = true;
        for (let i = 0; i < operationIndex; i++) {
            if (symbols.substring(1, symbols.length).indexOf(expr.charAt(i)) != -1) {
                leftIsProp = false;
            }
            if (!leftIsProp) {
                this.#leftExpr = new Expression((expr.charAt(0) == '~'?1:0), operationIndex-1, expr,expr.charAt(0) == '~');
                break;
            }
        }
        if (leftIsProp) {
            this.#leftExpr = new Proposition(expr.substring(0, operationIndex));
        }
        for (let i = operationIndex + 1; i < expr.length; i++) {
            if (symbols.substring(1, symbols.length).indexOf(expr.charAt(i)) != -1) {
                rightIsProp = false;
            }
            if (!rightIsProp) {
                this.#rightExpr = new Expression((expr.charAt(operationIndex + 1) == '~'?operationIndex + 2:operationIndex + 1), expr.length - 1, expr,expr.charAt(operationIndex + 1) == '~');
                break;
            }
        }
        if (rightIsProp) {
            this.#rightExpr = new Proposition(expr.substring(operationIndex + 1, expr.length));
        }
    }

    /** Returns the value of this expression. */
    evaluate() {
        let oResult;
        switch (this.#operation) {
            case Operation.And:
                oResult = this.#leftExpr.evaluate() && this.#rightExpr.evaluate();
                break;
            case Operation.Of:
                oResult = this.#leftExpr.evaluate() || this.#rightExpr.evaluate();
                break;
            case Operation.If:
                oResult = !this.#leftExpr.evaluate() || this.#rightExpr.evaluate();
                break;
            case Operation.Iff:
                let lResult = this.#leftExpr.evaluate();
                let rResult = this.#rightExpr.evaluate();
                oResult = (!lResult || rResult) && (!rResult || lResult);
                break;
        }
        return (this.#negated ? !oResult : oResult);
    }

    /** Returns a string representation of an expression, enclosed by parenthesis. */
    toString() {
        return (this.#negated ? "~" : "") + "(" + this.#leftExpr.toString() + this.#operation.description + this.#rightExpr.toString() + ")";
    }

    /** Allow access to the left side of the expression. */
    getLeft(){
        return this.#leftExpr;
    }

    /** Allow access to the right side of the expression. */
    getRight(){
        return this.#rightExpr;
    }
}

/** Basically an enum that stores the four possible center operations. */
const Operation = {
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
    testField = 22;

    constructor(_expr) {
        this.#negated = (_expr.charAt(0) == '~');
        this.#symbol = _expr.charAt(this.#negated ? 1 : 0);
    }

    /** Returns the value of this proposition. */
    evaluate() {
        return (this.#negated ? !this.#value : this.#value);
    }

    /** Returns a string representation of the proposition. */
    toString() {
        return (this.#negated ? "~" : "") + this.#symbol;
    }

    /** Returns the symbol representation of this proposition. */
    getSymbol() {
        return this.#symbol;
    }
}