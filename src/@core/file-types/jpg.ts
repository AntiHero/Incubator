function isJPG(buffer: Buffer) {
  const SOIMarker = buffer.toString('hex', 0, 2);
  return 'ffd8' === SOIMarker;
}

function extractSize(buffer: Buffer, i: number) {
  return {
    height: buffer.readUInt16BE(i),
    width: buffer.readUInt16BE(i + 2),
  };
}

function validateBuffer(buffer: Buffer, i: number) {
  if (i > buffer.length) {
    throw new TypeError('Corrupt JPG, exceeded buffer limits');
  }

  if (buffer[i] !== 0xff) {
    throw new TypeError('Invalid JPG, marker table corrupted');
  }
}

function calculate(buffer: Buffer) {
  buffer = buffer.slice(4);

  let i: number, next: number;
  while (buffer.length) {
    i = buffer.readUInt16BE(0);

    validateBuffer(buffer, i);

    next = buffer[i + 1];
    if (next === 0xc0 || next === 0xc1 || next === 0xc2) {
      return extractSize(buffer, i + 5);
    }

    buffer = buffer.slice(i + 2);
  }

  throw new TypeError('Invalid JPG, no size found');
}

export default {
  detect: isJPG,
  calculate,
};
