export class CircularBuffer<T> {
  items: T[] = [];
  size: number;
  ip = 0;

  constructor(size: number) {
    this.size = size
  }

  dequeue() {
    return this.items.shift()
  }

  queue(item: T) {
    if (this.ip > this.size -1) {
      this.ip = 0
    }

    this.items[this.ip] = item
    this.ip++
  }
}
