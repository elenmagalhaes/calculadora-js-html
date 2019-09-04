class CalculatorController {
  constructor() {
    this._audio = new Audio("click.mp3");
    this._audioOnOff = false;
    this._lastOperator = "";
    this._lastNumber = "";
    this._displayEl = document.querySelector("#display");
    this._operation = [];
    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();
  }

  /**
   * Getters and Setters
   */

  get displayCalc() {
    return this._displayEl.innerHTML;
  }

  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError();

      return;
    }

    this._displayEl.innerHTML = value;
  }

  /**
   * Methods
   */

  copyToClipboard() {
    let input = document.createElement("input");
    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();

    document.execCommand("Copy");
    input.remove();
  }

  pasteFromClipboard() {
    document.addEventListener("paste", event => {
      let text = event.clipboardData.getData("Text");
      this.displayCalc = parseFloat(text);
    });
  }

  initialize() {
    this.setLastNumberToDisplay();
    this.pasteFromClipboard();

    document.querySelectorAll(".btn-ac").forEach(button => {
      button.addEventListener("dblclick", () => {
        this.toggleAudio();
      });
    });
  }

  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
  }

  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll(".container .btn");
    buttons.forEach(button => {
      button.addEventListenerAll("click drag", () => {
        let btn = button.innerHTML;
        this.execBtn(btn);
      });

      this.addEventListenerAll(button, "mouseover mouseup mousedown", () => {
        button.style.cursor = "pointer";
      });
    });
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  initKeyboard() {
    // eslint-disable-next-line complexity
    addEventListener("keyup", event => {
      this.playAudio();
      switch (event.key) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          this.addOperation(event.key);
          break;
        case "Enter":
        case "=":
          this.calc();
          break;
        case ",":
        case ".":
          this.addDot();
          break;
        case "Backspace":
          this.clearEntry();
          break;
        case "Escape":
          this.clearAll();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(parseInt(event.key, 10));
          break;
        case "c":
          if (event.ctrlKey) {
            this.copyToClipboard();
          }
          break;
        default:
          break;
      }
    });
  }

  execBtn(value) {
    this.playAudio();
    switch (value) {
      case "soma":
        this.addOperation("+");
        break;
      case "subtracao":
        this.addOperation("-");
        break;
      case "multiplicacao":
        this.addOperation("*");
        break;
      case "divisao":
        this.addOperation("/");
        break;
      case "porcento":
        this.addOperation("%");
        break;
      case "igual":
        this.calc();
        break;
      case "ponto":
        this.addDot();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "ac":
        this.clearAll();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value, 10));
        break;
      default:
        this.setError();
        break;
    }
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let valorFinal = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(valorFinal);
        this.setLastNumberToDisplay();
      }
    }
  }

  addDot() {
    let lastOperation = this.getLastOperation();
    // eslint-disable-next-line curly
    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    ) return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(`${lastOperation.toString()}.`);
    }

    this.setLastNumberToDisplay();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  isOperator(value) {
    return ["+", "-", "*", "%", "/"].indexOf(value) > -1;
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  // eslint-disable-next-line max-statements
  calc() {
    let last = "",
    result = this.getResult();
    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      // eslint-disable-next-line prefer-destructuring
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._lastNumber = this.getResult();
    } else if (this._operation.length === 3) {
      this._lastNumber = this.getLastItem(false);
    }

    if (last === "%") {
      result /= 100;
      this._operation = [result];
    } else {
      this._operation = [result];

      // eslint-disable-next-line curly
      if (last) this._operation.push(last);
    }

    this.setLastNumberToDisplay();
  }

  // eslint-disable-next-line consistent-return
  getResult() {
    try {
      // eslint-disable-next-line no-eval
      return eval(this._operation.join(""));
    } catch (ev) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

}

window.calculator = new CalculatorController();
