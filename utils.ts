export const POS_ATTRIB = "position";
export const COLOR_ATTRIB = "color";

const VERTEX_SHADER_SRC = `
  precision mediump float;
  
  attribute vec3 ${POS_ATTRIB};
  attribute vec3 ${COLOR_ATTRIB};
  varying vec3 vColor;

  void main()
  {
    vColor = color;
    gl_Position=vec4(${POS_ATTRIB}, 1);
  }
`;

const FRAG_SHADER_SRC = `
  precision mediump float;

  varying vec3 vColor;
  
  void main()
  {
    gl_FragColor=vec4(vColor,1);
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
  // gl.clearColor(0, 0, 0, 1);

  return { canvas, gl };
};

export const loadData = (gl: WebGLRenderingContext, data: DataArray) => {
  // Create buffer
  const buffer = gl.createBuffer();
  const flat_array = data.flat(Infinity) as ArrayLike<number>;

  // Load data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(flat_array), gl.STATIC_DRAW);

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
  fShader: WebGLShader
) => {
  const program = gl.createProgram();
  if (!program) return program;

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  return program;
};

export const enableAndBind = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  attrib: string,
  buffer: WebGLBuffer | null
) => {
  const loc = gl.getAttribLocation(program, attrib);
  gl.enableVertexAttribArray(loc);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  return loc;
};
