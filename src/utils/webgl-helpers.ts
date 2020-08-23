export const createShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader => {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error('Failed to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Failed to compile shader. \n'.concat(log || ''));
  }

  return shader;
};

export const shaderSourceToString = async (shaderSourcePath: string): Promise<string> => {
  /* eslint-disable-line */
  const res = await fetch(shaderSourcePath);
  const text = await res.text();
  return text;
};

export const createProgram = async (
  gl: WebGLRenderingContext,
  vertexShaderSourcePath: string,
  fragmentShaderSourcePath: string
) => {
  // Load vertex shaders
  const vertexShaderSource = await shaderSourceToString(vertexShaderSourcePath);
  const fragmentShaderSource = await shaderSourceToString(fragmentShaderSourcePath);

  // Create shaders from source files
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();

  if (!program) {
    throw new Error('Failed to create program.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    gl.deleteProgram(program);
  }

  return program;
};

export function setRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}
