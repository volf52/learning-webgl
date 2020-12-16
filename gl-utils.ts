import { DataArray } from "./types";

export enum GlAttrib {
  POS = "position",
  COLOR = "color",
  VAR_COLOR = "vColor",
  MAT = "model_matrix",
}

const VERTEX_SHADER_SRC = `
  precision mediump float;
  
  attribute vec3 ${GlAttrib.POS};
  attribute vec3 ${GlAttrib.COLOR};
  varying vec3 ${GlAttrib.VAR_COLOR};

  uniform mat4 ${GlAttrib.MAT};

  void main()
  {
    ${GlAttrib.VAR_COLOR} = ${GlAttrib.COLOR};
    gl_Position = ${GlAttrib.MAT} * vec4(${GlAttrib.POS}, 1);
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

type InitShaderParams = {
  vShaderSrc?: string;
  fShaderSrc?: string;
};

export const initGL = (
  canvasID: string,
  clearColor = false
): { canvas: HTMLCanvasElement; gl: WebGLRenderingContext } | null => {
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement; // might be null
  if (canvas === null) {
    console.error("HTML canvas not supported");
    return null;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext("webgl");
  if (gl === null) {
    alert("Unable to initialize WebGL");
    return null;
  }

  // basic config
  gl.viewport(0, 0, canvas.width, canvas.height);
  if (clearColor) gl.clearColor(0, 0, 0, 1);

  return { canvas, gl };
};

export class GlWrapper {
  private readonly gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  loadData(data: DataArray): WebGLBuffer | null {
    const { gl } = this;

    // Create buffer
    const buffer = gl.createBuffer();
    const flatArray = data.flat(1);

    // Load data
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      Float32Array.from(flatArray),
      gl.STATIC_DRAW
    );

    return buffer;
  }

  bindBuffer(buffer: WebGLBuffer | null): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  }

  createShader(type: GLenum, src: string): WebGLShader | null {
    const shader = this.gl.createShader(type);

    if (shader === null) return null;

    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    return shader;
  }

  initShaders = (
    params: InitShaderParams = {}
  ): { vShader: WebGLShader; fShader: WebGLShader } | null => {
    const { gl } = this;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (vShader === null || fShader === null) {
      console.error("Failed to initialize shaders");
      return null;
    }

    gl.shaderSource(vShader, params.vShaderSrc || VERTEX_SHADER_SRC);
    gl.compileShader(vShader);

    gl.shaderSource(fShader, params.fShaderSrc || FRAG_SHADER_SRC);
    gl.compileShader(fShader);

    return { vShader, fShader };
  };

  createGlProgram(
    vShader: WebGLShader,
    fShader: WebGLShader
  ): GLProgram | null {
    const program = this.gl.createProgram();
    if (program === null) return null;

    return new GLProgram(this.gl, program, vShader, fShader);
  }
}

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

  use(clear = true): void {
    if (clear) this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
  }

  getAndEnableAttrib(
    attrib: GlAttrib,
    buffer: WebGLBuffer | null,
    bind = false
  ): GLint {
    const location = this.gl.getAttribLocation(this.program, attrib);
    this.gl.enableVertexAttribArray(location);
    if (bind) this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    return location;
  }

  attribPtr(loc: number, size: GLint): void {
    this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, 0, 0);
  }

  setVAttrib(
    attrib: GlAttrib,
    buffer: WebGLBuffer | null,
    size: GLint,
    bind = false
  ): void {
    const idx = this.getAndEnableAttrib(attrib, buffer, bind);

    this.attribPtr(idx, size);
  }
}
