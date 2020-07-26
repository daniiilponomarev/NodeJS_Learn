// Write a program which reads a string from the standard input stdin,
// reverses it and then writes it to the standard output stdout.

var stream = require("stream");
var util = require("util");
var Transform = stream.Transform || require("readable-stream").Transform;

var readable = process.stdin;
var writable = process.stdout;

function Reverser(options) {
  // allow use without new
  if (!(this instanceof Reverser)) {
    return new Reverser(options);
  }

  // init Transform
  Transform.call(this, options);
}
util.inherits(Reverser, Transform);

Reverser.prototype._transform = function (chunk, enc, callback) {
  var reversedChunk = chunk.toString().split("").reverse().join("") + "\n\n";
  this.push(reversedChunk);
  callback();
};
var reverser = new Reverser();

readable.pipe(reverser).pipe(writable);
