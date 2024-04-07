import chalk from "chalk";
const instructions = [">", "<", ".", ",", "+", "-", "[", "]"];

export type BfState = {
  memory: Uint8Array;
  ap: number;
  pc: number;
  output: string;
  program: string[];
};

export type BfIterator = {
  next: () => BfIterator;
  done: boolean;
  value: BfState;
};

export const TAPE_SIZE = 99999;
function byteToHexString(uint8arr: Uint8Array) {
  if (!uint8arr) {
    return "";
  }

  var hexStr = "";
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}

export const printMemory = (memory: Uint8Array, ap: number) => {
  var result = "";

  for (let index = 0; index < memory.length; index++) {
    const idx = index + 1;
    const num = byteToHexString(new Uint8Array([memory[index]]));
    const element = ap === index ? chalk.bgCyan(num) : num;
    const isBiggerThan0 = idx > 0;
    const divisibleBy16 = idx % 16 === 0;

    if (idx % 4 === 0 && !divisibleBy16 && isBiggerThan0) {
      result += `${element} `;
      continue;
    } else if (divisibleBy16 && isBiggerThan0) {
      result += `${element}\n`;
      continue;
    }

    result += element;
  }

  return result;
};

export const bf = ({
  prog,
  input,
  iterate = false,
}: {
  prog: string;
  input?: string[];
  iterate?: boolean;
}) => {
  const np = prog.split("").filter((c) => instructions.includes(c));

  let ap = 0;
  let pc = 0;

  const memory = new Uint8Array(TAPE_SIZE);

  const incAp = () => {
    if (ap === memory.length - 1) {
      ap = 0;
      return;
    }
    ap++;
  };

  const decAp = () => {
    if (ap === 0) {
      ap = memory.length - 1;
      return;
    }
    ap--;
  };

  let output = "";

  let bStack = 0;

  const next = (): BfIterator => {
    const value: BfState = { memory, ap, pc, output, program: np };

    if (pc >= np.length) {
      return { value, done: true, next };
    }

    const p = np[pc];

    switch (p) {
      case ".":
        output += String.fromCharCode(memory[ap]);
        pc++;
        return { done: false, value, next };
      case ",":
        const a = input?.shift()?.charCodeAt(0) || 0;
        memory[ap] = a;
        pc++;
        return { done: false, value, next };
      case "-":
        memory[ap]--;
        pc++;
        return { done: false, value, next };
      case "+":
        memory[ap]++;
        pc++;
        return { done: false, value, next };
      case ">":
        incAp();
        pc++;
        return { done: false, value, next };
      case "<":
        pc++;
        decAp();
        return { done: false, value, next };
      case "[": {
        if (memory[ap] !== 0) {
          pc++;
          return { done: false, value, next };
        }

        bStack++;

        while (np[pc] !== "]" || bStack !== 0) {
          pc++;

          if (np[pc] === "[") {
            bStack++;
          } else if (np[pc] === "]") {
            bStack--;
          }
        }

        return { done: false, value, next };
      }
      case "]": {
        if (memory[ap] === 0) {
          pc++;
          return { done: false, value, next };
        }

        bStack++;

        while (np[pc] !== "[" || bStack != 0) {
          pc--;

          if (np[pc] === "]") {
            bStack++;
          } else if (np[pc] === "[") {
            bStack--;
          }
        }
        return { done: false, value, next };
      }
      default: {
        return { done: false, value, next };
      }
    }
  };

  if (!iterate) {
    let result: BfIterator | undefined;
    while (!result?.done) {
      result = next();
    }
    return result;
  }

  const value = { memory, ap, pc, output, program: prog };

  return { next, done: false, value };
};
