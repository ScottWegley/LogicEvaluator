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
        switch (this.#operation) {
            case Operations.And:

                break;
            case Operations.Of:

                break;
            case Operations.If:

                break;
            case Operations.Iff:

                break;
        }
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

    constructor(_symbol, _value, _negated = false) {
        this.#symbol = _symbol;
        this.#value = _value;
        this.#negated = _negated;
    }

    /** Returns the value of this proposition. */
    evaluate() {
        return this.#value;
    }

    /** Returns a string representation of the proposition. */
    toString() {
        return (this.#negated ? "~" : "") + this.#symbol;
    }
}