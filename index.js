import pkg from "terminal-kit";
import readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const numChange = (cpuNum, callback, attempt) => {
  let result;
  terminal.cyan("Введите число\n");
  const quest = rl.question("", (userNum) => {
    const cpuNumStr = "" + cpuNum;
    const userNumStr = ("" + userNum).split("").map((v) => ({
      value: v,
      flagPos: 0,
      flagFind: 0,
    }));
    const ulh = userNumStr.length;
    const clh = cpuNumStr.length;
    for (let i = 1; i <= ulh; i++) {
      if (
        userNumStr[ulh - i].value === cpuNumStr[clh - i] &&
        cpuNumStr[clh - i]
      ) {
        userNumStr[ulh - i].flagPos = 1;
        // userNumStr[ulh - i].flagFind = 1;
      } else if (cpuNumStr.includes(userNumStr[ulh - i].value)) {
        userNumStr[ulh - i].flagFind = 1;
      }
    }

    const truePos = userNumStr
      .filter((v) => v.flagPos === 1)
      .map((v) => v.value);
    const trueFind = userNumStr
      .filter((v) => v.flagFind === 1)
      .map((v) => v.value);

    if (truePos.length === cpuNumStr.length) {
      result = { change: true, message: "Ты угадал!!!" };
    } else {
      result = {
        change: false,
        message: `совпавших цифр не на своих местах - ${
          trueFind.length
        } (${trueFind.join(", ")}), цифр на своих местах - ${
          truePos.length
        } (${truePos.join(", ")})\n`,
      };
    }
    callback(result, numChange, attempt - 1, cpuNum);
  });
};

const callbackChange = (result, callbackNumChange, attempt, cpuNum) => {
  if (result.change || attempt === 0) {
    terminal.cyan(result.message);
    terminal.red.bold(`Игра окончена, правильное число ${cpuNum}.\n`);
    process.exit(0);
  } else {
    terminal.cyan(result.message);
    return callbackNumChange(cpuNum, callbackChange, attempt - 1);
  }
};

const { terminal } = pkg;

terminal.clear();
terminal.blue.bold("Проект Быки и коровы\n\n");
terminal.cyan("Нужно выбрать угадать число в диапазоне от 100 до 999999! \n");

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const game = async (attempt = 3) => {
  await terminal.slowTyping(
    "Сейчас компьютер загадает число!\n==============================>\n",
    {
      style: terminal.blue.bold,
      flashStyle: terminal.red.bold,
    }
  );
  const randomNum = randomIntFromInterval(100, 999999);
  await terminal.slowTyping("Угадайте число!\n", {
    style: terminal.blue.bold,
    flashStyle: terminal.red.bold,
  });
  numChange(randomNum, callbackChange, attempt);
};

terminal.cyan("Введите количество желаемых попыток\n");
rl.question("", (attempt) => game(attempt));
