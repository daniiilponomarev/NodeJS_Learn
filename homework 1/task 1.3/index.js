// Write a program which reads a string from the standard input stdin,
// reverses it and then writes it to the standard output stdout.

const Transform =
  require("stream").Transform || require("readable-stream").Transform;

const readable = process.stdin;
const writable = process.stdout;

class Reverser extends Transform {
  _transform(chunk, enc, callback) {
    const reversedChunk =
      chunk.toString().split("").reverse().join("") + "\n\n";
    this.push(reversedChunk);
    callback();
  }
}
const reverser = new Reverser();

readable.pipe(reverser).pipe(writable);
