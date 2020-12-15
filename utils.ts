export const POS_ATTRIB = "position";
export const COLOR_ATTRIB = "color";

const VERTEX_SHADER_SRC = `
  attribute vec4 ${POS_ATTRIB};

  void main(){
    gl_Position=${POS_ATTRIB};
  }
`;

const FRAG_SHADER_SRC = `
precision mediump float;
void main(){
  gl_FragColor=vec4(1.0,1.0,1.0,1.0);
}
`;

type DataArray = Array<number | DataArray>;

export const initGL = (canvasID: string) => {
  const canvas = document.querySelector<HTMLCanvasElement>(canvasID);

  if (!canvas) {
    console.error("HTML canvas not supported");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Unable to initialize WebGL");
    return;
  }

  // Basic Config
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);

  return { canvas, gl };
};

export const loadData = (gl: WebGLRenderingContext, data: DataArray) => {
  // Create buffer
  const buffer = gl.createBuffer();

  // Load data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(data.flat(Infinity)),
    gl.STATIC_DRAW,
  );

  return buffer;
};
const createShader = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);

  if (!shader) return null;

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  return shader;
};

export const createVertexShader = (gl: WebGLRenderingContext) =>
  createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);

export const createFragmentShader = (gl: WebGLRenderingContext) =>
  createShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER_SRC);

export const initProgram = (gl: WebGLRenderingContext) => {
  // create vertex shader
  const vertexShader = createVertexShader(gl);
  if (!vertexShader) {
    console.error("Failed to create vertex shader");
    return null;
  }

  // create fragment shader
  const fragShader = createFragmentShader(gl);
  if (!fragShader) {
    console.error("Failed to create fragment shader");
    return null;
  }

  return createProgram(gl, vertexShader, fragShader);
};

export const createProgram = (
  gl: WebGLRenderingContext,
  vShader: WebGLShader,
  fShader: WebGLShader,
) => {
  const program = gl.createProgram();
  if (!program) return program;

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  return program;
};