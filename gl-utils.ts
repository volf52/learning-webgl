type DataArray = Array<number | DataArray>;

export enum GlAttrib {
  POS = "position",
  COLOR = "color",
  VAR_COLOR = "vColor",
}

const VERTEX_SHADER_SRC = `
  precision mediump float;
  
  attribute vec3 ${GlAttrib.POS};
  attribute vec3 ${GlAttrib.COLOR};
  varying vec3 ${GlAttrib.VAR_COLOR};

  uniform mat4 matrix;

  void main()
  {
    vColor = color;
    gl_Position = matrix * vec4(${GlAttrib.POS}, 1);
  }
`;

const FRAG_SHADER_SRC = `
  precision mediump float;
  
  varying vec3 ${GlAttrib.VAR_COLOR};
  
  void main()
  {
    gl_FragColor = vec4(${GlAttrib.VAR_COLOR}, 1);
  }
`;

const createShader = (gl: WebGLRenderingContext, type: GLenum, src: string) => {
  const shader = gl.createShader(type);

  if (!shader) return null;

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  return shader;
};

export const initGL = (canvasID: string, clearColor = false) => {
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement; // might be null
  if (!canvas) {
    console.error("HTML canvas not supported");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Unable to initialize WebGL");
    return;
  }

  // basic config
  gl.viewport(0, 0, canvas.width, canvas.height);
  if (clearColor) gl.clearColor(0, 0, 0, 1);

  return { canvas, gl };
};

export const createGlProgram = (
  gl: WebGLRenderingContext,
  vShaderSrc = VERTEX_SHADER_SRC,
  fShaderSrc = FRAG_SHADER_SRC
) => {
  const program = gl.createProgram();
  if (!program) return null;
  gl.useProgram(program);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc);
  if (!vertexShader) {
    console.error("Failed to create vertex shader");
    return null;
  }

  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc);
  if (!fragShader) {
    console.error("Failed to create fragment shader");
    return null;
  }

  return new GLProgram(gl, program, vertexShader, fragShader);
};

class GLProgram {
  gl: WebGLRenderingContext;
  program: WebGLProgram;

  constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    vShader: WebGLShader,
    fShader: WebGLShader
  ) {
    this.gl = gl;
    this.program = program;

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
  }

  loadData = (data: DataArray) => {
    const { gl } = this;

    // Create buffer
    const buffer = gl.createBuffer();
    const flat_array = data.flat(Infinity) as ArrayLike<number>;

    // Load data
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      Float32Array.from(flat_array),
      gl.STATIC_DRAW
    );

    return buffer;
  };

  getAndEnableAttrib = (
    attrib: GlAttrib,
    buffer: WebGLBuffer | null,
    enable = false
  ) => {
    const location = this.gl.getAttribLocation(this.program, attrib);
    this.gl.enableVertexAttribArray(location);
    if (enable) this.bindBuffer(buffer);

    return location;
  };

  bindBuffer = (buffer: WebGLBuffer | null) => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  };

  use = (clear = true) => {
    if (clear) this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
  };
}

export default GLProgram;
