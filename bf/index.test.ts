import { describe, test, expect } from "bun:test";
import { bf } from "./index";

describe("bf", () => {
  test("should increment the memory value at the address pointer", async () => {
    const program = "+";
    const { memory, ap } = await bf(program);
    expect(memory[0]).toBe(1);
    expect(ap).toBe(0);
  });

  test("should decrement the memory value at the address pointer", async () => {
    const program = "-";
    const { memory, ap } = await bf(program);
    expect(memory[0]).toBe(255);
    expect(ap).toBe(0);
  });

  test("should increment the address counter after an increase instruction", async () => {
    const program = ">+";
    const { memory, ap } = await bf(program);
    expect(memory[0]).toBe(0);
    expect(memory[1]).toBe(1);
    expect(ap).toBe(1);
  });

  test("should wrap back when decrementing ap 0", async () => {
    const program = "<+";
    const { memory, ap } = await bf(program);
    expect(memory[0]).toBe(0);
    expect(memory[memory.length - 1]).toBe(1);
    expect(ap).toBe(memory.length - 1);
  });

  test("should jump to matching ] if head == 0", async () => {
    const { memory, pc } = await bf("[---]");
    expect(memory[0]).toBe(0);
    expect(pc).toBe(5);
  });

  test("should go back to matching [ if head != 0", async () => {
    const { memory } = await bf("+++[-]");
    expect(memory[0]).toBe(0);
  });

  test("print h", async () => {
    const { output } = await bf("++++++++++[>++++++++++<-]>++++.");
    expect(output).toBe("h");
  });
  test("hello.b", async () => {
    const { output } = await bf(`>++++++++[-<+++++++++>]<.>>+>-[+]++
  >++>+++[>[->+++<<+++>]<<]>-----.>->
  +++..+++.>-.<<+[>[+>+]>>]<---------
  -----.>>.+++.------.--------.>+.>+.
      `);
    expect(output).toBe("Hello World!\n");
  });
});
