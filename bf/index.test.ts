import { describe, test, expect } from "bun:test";
import { bf } from "./index";

describe("bf", () => {
  test("should increment the memory value at the address pointer", async () => {
    const prog = "+";
    const { memory, ap } = await bf({ prog });
    expect(memory[0]).toBe(1);
    expect(ap).toBe(0);
  });

  test("should decrement the memory value at the address pointer", async () => {
    const prog = "-";
    const { memory, ap } = await bf({ prog });
    expect(memory[0]).toBe(255);
    expect(ap).toBe(0);
  });

  test("should increment the address counter after an increase instruction", async () => {
    const prog = ">+";
    const { memory, ap } = await bf({ prog });
    expect(memory[0]).toBe(0);
    expect(memory[1]).toBe(1);
    expect(ap).toBe(1);
  });

  test("should wrap back when decrementing ap 0", async () => {
    const prog = "<+";
    const { memory, ap } = await bf({ prog });
    expect(memory[0]).toBe(0);
    expect(memory[memory.length - 1]).toBe(1);
    expect(ap).toBe(memory.length - 1);
  });

  test("should jump to matching ] if head == 0", async () => {
    const { memory, pc } = await bf({ prog: "[---]" });
    expect(memory[0]).toBe(0);
    expect(pc).toBe(5);
  });

  test("should go back to matching [ if head != 0", async () => {
    const { memory } = await bf({ prog: "+++[-]" });
    expect(memory[0]).toBe(0);
  });

  test("print h", async () => {
    const { output } = await bf({ prog: "++++++++++[>++++++++++<-]>++++." });
    expect(output).toBe("h");
  });

  test("should handle single char input correctly", async () => {
    const { memory } = await bf({
      prog: ",",
      input: "A".split(""),
    });
    expect(memory[0]).toBe(65);
  });

  test("should handle multiple char input correctly", async () => {
    const { memory } = await bf({
      prog: ",>,>,>,",
      input: "ABCD".split(""),
    });
    expect(memory[0]).toBe(65);
    expect(memory[1]).toBe(66);
    expect(memory[2]).toBe(67);
    expect(memory[3]).toBe(68);
  });

  test("hello.b", async () => {
    const { output } = await bf({
      prog: `>++++++++[-<+++++++++>]<.>>+>-[+]++
  >++>+++[>[->+++<<+++>]<<]>-----.>->
  +++..+++.>-.<<+[>[+>+]>>]<---------
  -----.>>.+++.------.--------.>+.>+.
      `,
    });
    expect(output).toBe("Hello World!\n");
  });
});
