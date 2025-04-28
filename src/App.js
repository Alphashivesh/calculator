import React, { useState } from "react";
import Display from "./Display";
import Button from "./Button";
import "./styles.css"; // Import styles

function App() {
  const [currentOperand, setCurrentOperand] = useState("0");
  const [previousOperand, setPreviousOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [result, setResult] = useState(null); // Added state for the final result
  const [overwrite, setOverwrite] = useState(true); // Should next digit overwrite or append?

  const evaluate = () => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return null; // Return null if numbers are invalid

    let computation = "";
    switch (operator) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        if (current === 0) {
          computation = "Error"; // Handle division by zero
        } else {
          computation = prev / current;
        }
        break;
      default:
        return null; // Should not happen
    }
    // Optional: Handle potential floating point inaccuracies
    // computation = computation !== 'Error' ? parseFloat(computation.toFixed(10)) : computation;
    return computation.toString();
  };

  const clearAll = () => {
    setCurrentOperand("0");
    setPreviousOperand(null);
    setOperator(null);
    setResult(null); // Clear result state
    setOverwrite(true);
  };

  const handleButtonClick = (label) => {
    // Handle Number clicks
    if (!isNaN(label) || label === ".") {
      if (label === "." && currentOperand.includes(".")) return;

      // If a result is shown, start a new calculation
      if (result !== null) {
        setCurrentOperand(label === "." ? "0." : label);
        setPreviousOperand(null);
        setOperator(null);
        setResult(null);
        setOverwrite(false);
        return;
      }

      if (overwrite) {
        setCurrentOperand(label === "." ? "0." : label);
        setOverwrite(false);
      } else {
        if (currentOperand === "0" && label !== ".") {
          setCurrentOperand(label);
        } else {
          // Prevent excessively long numbers (optional)
          // if (currentOperand.length >= 15) return;
          setCurrentOperand((prev) => prev + label);
        }
      }
      return;
    }

    // Handle Operator clicks (+, -, *, /)
    if (["+", "-", "*", "/"].includes(label)) {
      // If a result is shown, use it as the first operand for chaining
      if (result !== null && result !== "Error") {
        setPreviousOperand(result);
        setCurrentOperand("0"); // Ready for next input
        setResult(null); // Clear result
        setOperator(label);
        setOverwrite(true);
        return;
      }

      // Handle chaining operations (e.g., 5 + 3 *)
      if (previousOperand != null && operator != null && !overwrite) {
        const evaluation = evaluate();
        if (evaluation === "Error") {
          setResult("Error");
          setCurrentOperand("Error"); // Show error in main display too
          setPreviousOperand(null);
          setOperator(null);
          setOverwrite(true);
        } else {
          setPreviousOperand(evaluation); // The result becomes the new previous operand
          setResult(null); // Clear any previous final result
          setCurrentOperand(evaluation); // Show intermediate result briefly
          setOperator(label); // Set the new operator
          setOverwrite(true); // Ready for next number
        }
      }
      // Standard operator click (first operator or after equals)
      else if (currentOperand !== "Error") {
        setPreviousOperand(currentOperand); // Move current to previous
        setOperator(label);
        setResult(null); // Clear any previous final result
        setOverwrite(true); // Ready for the next operand
      }
      return;
    }

    // Handle Equals (=) click
    if (label === "=") {
      if (
        operator == null ||
        previousOperand == null ||
        currentOperand === "Error" ||
        result !== null
      ) {
        // Do nothing if already showing a result or calculation is incomplete/error
        return;
      }
      const evaluation = evaluate();
      setResult(evaluation); // Set the final result state
      // Keep previousOperand and operator for display, but reset for next potential calc
      // setCurrentOperand(evaluation); // Show result in main display via result state
      // setPreviousOperand(null); // Don't clear yet for display
      // setOperator(null); // Don't clear yet for display
      setOverwrite(true); // Next number starts fresh (handled in number logic)

      // If error, clear previous/operator
      if (evaluation === "Error") {
        setPreviousOperand(null);
        setOperator(null);
      }
      // On success, we might want to reset currentOperand if we aren't chaining immediately
      // For now, result state handles the main display
      setCurrentOperand(evaluation === "Error" ? "Error" : "0"); // Reset current internal state after equals

      return;
    }

    // Handle Clear (AC) click
    if (label === "AC") {
      clearAll();
      return;
    }

    // Handle Delete (DEL) click
    if (label === "DEL") {
      // Don't allow delete if a final result is shown, force AC or new number
      if (result !== null) return;

      if (overwrite) {
        // If overwriting (e.g. after operator), clear current to 0
        setCurrentOperand("0");
        setOverwrite(true); // Remain in overwrite state maybe? Or false? Let's reset to 0.
      } else if (currentOperand !== "0" && currentOperand !== "Error") {
        if (currentOperand.length === 1) {
          setCurrentOperand("0"); // Back to 0 if deleting last digit
          setOverwrite(true); // Default state for 0
        } else {
          setCurrentOperand(currentOperand.slice(0, -1));
        }
      }
      return;
    }
  };

  return (
    <div className="calculator">
      {/* Pass all relevant states to Display */}
      <Display
        previous={previousOperand}
        operator={operator}
        current={currentOperand}
        result={result}
      />
      <div className="buttons">
        {/* Row 1 */}
        <Button label="AC" onClick={handleButtonClick} className="function" />
        <Button label="DEL" onClick={handleButtonClick} className="function" />
        <Button label="" onClick={() => {}} className="placeholder" />{" "}
        {/* Empty Placeholder */}
        <Button label="/" onClick={handleButtonClick} className="operator" />
        {/* Row 2 */}
        <Button label="7" onClick={handleButtonClick} />
        <Button label="8" onClick={handleButtonClick} />
        <Button label="9" onClick={handleButtonClick} />
        <Button label="*" onClick={handleButtonClick} className="operator" />
        {/* Row 3 */}
        <Button label="4" onClick={handleButtonClick} />
        <Button label="5" onClick={handleButtonClick} />
        <Button label="6" onClick={handleButtonClick} />
        <Button label="-" onClick={handleButtonClick} className="operator" />
        {/* Row 4 */}
        <Button label="1" onClick={handleButtonClick} />
        <Button label="2" onClick={handleButtonClick} />
        <Button label="3" onClick={handleButtonClick} />
        <Button label="+" onClick={handleButtonClick} className="operator" />
        {/* Row 5 */}
        <Button label="0" onClick={handleButtonClick} className="zero" />
        <Button label="." onClick={handleButtonClick} />
        <Button label="=" onClick={handleButtonClick} className="operator" />
      </div>
    </div>
  );
}

export default App;
