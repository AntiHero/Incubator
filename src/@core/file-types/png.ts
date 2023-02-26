const pngSignature = 'PNG\r\n\x1a\n';
const pngImageHeaderChunkName = 'IHDR';

const pngFriedChunkName = 'CgBI';

function isPNG(buffer: Buffer) {
  if (pngSignature === buffer.toString('ascii', 1, 8)) {
    let chunkName = buffer.toString('ascii', 12, 16);
    if (chunkName === pngFriedChunkName) {
      chunkName = buffer.toString('ascii', 28, 32);
    }
    if (chunkName !== pngImageHeaderChunkName) {
      throw new TypeError('invalid png');
    }

    return true;
  }
}

function calculate(buffer: Buffer) {
  if (buffer.toString('ascii', 12, 16) === pngFriedChunkName) {
    return {
      width: buffer.readUInt32BE(32),
      height: buffer.readUInt32BE(36),
    };
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export default {
  detect: isPNG,
  calculate: calculate,
};
