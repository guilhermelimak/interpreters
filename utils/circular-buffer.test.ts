import { CircularBuffer } from './circular-buffer';
import { describe, expect, test, beforeAll } from "bun:test";

describe('CircularBuffer', () => {
  test('should enqueue items correctly', () => {
    const buffer = new CircularBuffer<number>(3);
    buffer.queue(1);
    buffer.queue(2);
    buffer.queue(3);
    expect(buffer.items).toEqual([1, 2, 3]);
  });

  test('should dequeue items correctly', () => {
    const buffer = new CircularBuffer<number>(3);
    buffer.queue(1);
    buffer.queue(2);
    buffer.queue(3);
    const item = buffer.dequeue();
    expect(item).toBe(1);
    expect(buffer.items).toEqual([2, 3]);
  });

  test('should handle buffer overflow correctly', () => {
    const buffer = new CircularBuffer<number>(3);
    buffer.queue(1);
    buffer.queue(2);
    buffer.queue(3);
    buffer.queue(4);
    expect(buffer.items).toEqual([4, 2, 3]);
  });

  test('should handle buffer underflow correctly', () => {
    const buffer = new CircularBuffer<number>(3);
    buffer.queue(1);
    buffer.queue(2);
    buffer.queue(3);
    buffer.dequeue();
    buffer.dequeue();
    buffer.dequeue();
    const item = buffer.dequeue();
    expect(item).toBeUndefined();
  });
});
