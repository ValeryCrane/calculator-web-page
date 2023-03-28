let display = document.getElementById("display");

let operators = ["+", "-", "*", "/"];

// Добавление новых символов на экран калькулятора.
function addToDisplay(val) {
    let currentString = display.value
    let lastOperatorIndex = Math.max(...operators.map(element => currentString.lastIndexOf(element)))

    // Обработка выведенной ошибки.
    if (currentString.slice(-1) === "!") {
        display.value = val
        return
    }

    // Обработка нескольких точек подряд.
    if (val === "." && currentString.slice(-1) === ".") {
        display.value = currentString
        return 
    }

    // Обработка некорректных строк.
    if (operators.includes(val)) {
        if (currentString.length === 0) {
            return currentString
        } else if (lastOperatorIndex !== -1 && lastOperatorIndex === currentString.length - 1) {
            display.value = currentString.slice(0, currentString.length - 1) + val
        } else {
            display.value = currentString + val
        }
    } else {
        if (lastOperatorIndex === -1) {
            if (currentString === "0") {
                display.value = val
            } else {
                display.value = currentString + val
            }
        } else if (lastOperatorIndex === currentString.length - 2 && currentString.slice(-1) === "0") {
            display.value = currentString.slice(0, currentString.length - 1) + val
        } else {
            display.value = currentString + val
        }
    }
}

// Очистка экрана калькулятора.
function clearDisplay() {
  display.value = "0";
}

// Обработка нажатия на кнопку равно.
function calculate() {
  let expression = display.value;

  // Проверка на то, что последний символ - оператор.
  if (operators.includes(expression.slice(-1))) {
    return
  }

  // Проверка на деление на ноль.
  if (expression.includes("/0")) {
    display.value = "You can't divide by zero!";
    return;
  }

  // Вычисление результата.
  let result = calculateExpression(expression);

  // Проверка на выход за пределы Number.
  if (!isFinite(result)) {
    display.value = "You exceeded number type limit!"
  } else {
    display.value = result
  }
}

// Вычисление результата.
function calculateExpression(expression) {

  // Проверка на то, что expression просто цифра.
  if (!isNaN(expression)) {
    return parseFloat(expression);
  }

  let result = 0;

  for (let i = 0; i < operators.length; i++) {
    let op = operators[i];
    let [firstPart, ...restParts] = expression.split(op)
    let parts = [firstPart].concat(restParts.join(op) === '' ? [] : [restParts.join(op)]);

    // Если expression разделился по оператору, то вычисляем значение 
    // двух частей и применяем оператор.
    if (parts.length > 1) {
      let left = calculateExpression(parts[0]);
      let right = calculateExpression(parts[1]);
      result = applyOperator(left, right, op);
      break;
    }
  }
  
  return result;
}

// Применение оператора.
function applyOperator(left, right, op) {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    default:
      return 0;
  }
}
