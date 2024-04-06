const instructions = [">", "<", ".", ",", "+", "-", "[", "]"];

export const bf = async ({
  prog,
  input,
}: {
  prog: string;
  input?: string[];
}) => {
  const np = prog.split("").filter((c) => instructions.includes(c));

  let ap = 0;
  let pc = 0;

  const memory = new Uint8Array(9999999);

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
  for (pc; pc < np.length; pc++) {
    const p = np[pc];
    switch (p) {
      case ".":
        output += String.fromCharCode(memory[ap]);
        continue;
      case ",":
        const a = input?.shift()?.charCodeAt(0) || 0;
        memory[ap] = a;
        continue;
      case "-":
        memory[ap]--;
        continue;
      case "+":
        memory[ap]++;
        continue;
      case ">":
        incAp();
        continue;
      case "<":
        decAp();
        continue;
      case "[": {
        if (memory[ap] !== 0) {
          continue;
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

        continue;
      }
      case "]": {
        if (memory[ap] === 0) {
          continue;
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
      }
    }
  }

  return { memory, ap, pc, output };
};
