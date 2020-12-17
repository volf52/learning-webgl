import { DataArray, GlAttrib, UniformLocations } from "./types";
import { Mat4 } from "./mat-utils";

const DEFAULT_VSHADER_SRC = `
  precision mediump float;
  
  attribute vec3 ${GlAttrib.POS};
  varying vec3 ${GlAttrib.V_COLOR};

  uniform mat4 ${GlAttrib.M_MAT};

  void main()
  {
    ${GlAttrib.V_COLOR} = vec3(${GlAttrib.POS}.xy, 1);
    gl_Position = ${GlAttrib.M_MAT} * vec4(${GlAttrib.POS}, 1);
  }
`;

const DEFAULT_FSHADER_SRC = `
  precision mediump float;
  
  varying vec3 ${GlAttrib.V_COLOR};
  
  void main()
  {
    gl_FragColor = vec4(${GlAttrib.V_COLOR}, 1);
  }
`;

interface InitShaderParams {
  vShaderSrc?: string;
  fShaderSrc?: string;
}

interface InitProgResult {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  glw: GlWrapper;
  glProg: GLProgram;
  uniformLocations: UniformLocations;
}

export const initProg = (
  canvasID: string,
  shaderSources: InitShaderParams = {}
): InitProgResult | null => {
  // Get canvas
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement; // might be null
  if (canvas === null) {
    console.error("HTML canvas not supported");
    return null;
  }

  // Canvas Config
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.9;

  // Get GL context
  const gl = canvas.getContext("webgl");
  if (gl === null) {
    alert("Unable to initialize WebGL");
    return null;
  }

  // GL Config
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.enable(gl.DEPTH_TEST);

  const glw = new GlWrapper(gl);
  const shaders = glw.initShaders(shaderSources);
  if (shaders === null) return null;

  const { vShader, fShader } = shaders;
  const glProg = glw.createGlProgram(vShader, fShader);
  if (glProg === null) return null;
  glProg.use();

  const uniformLocations: UniformLocations = {
    model_matrix: glProg.getUniformLoc(GlAttrib.M_MAT),
    view_matrix: glProg.getUniformLoc(GlAttrib.V_MAT),
    projection_matrix: glProg.getUniformLoc(GlAttrib.P_MAT),
  };

  return {
    canvas,
    gl,
    glw,
    glProg,
    uniformLocations,
  };
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

    gl.shaderSource(vShader, params.vShaderSrc || DEFAULT_VSHADER_SRC); // skipcq
    gl.compileShader(vShader);

    gl.shaderSource(fShader, params.fShaderSrc || DEFAULT_FSHADER_SRC); // skipcq
    gl.compileShader(fShader);

    return { vShader, fShader };
  };

  createGlProgram(
    vShader: WebGLShader,
    fShader: WebGLShader
  ): GLProgram | null {
    const program = this.gl.createProgram();
    if (program === null) {
      console.error("Failed to create GL program");
      return null;
    }
    return new GLProgram(this.gl, program, vShader, fShader);
  }

  uniformMat(loc: WebGLUniformLocation | null, mat: Mat4): void {
    this.gl.uniformMatrix4fv(loc, false, mat.get());
  }

  drawTriangles(len: number, first = 0): void {
    this.gl.drawArrays(this.gl.TRIANGLES, first, len);
  }

  drawPoints(len: number, first = 0): void {
    this.gl.drawArrays(this.gl.POINTS, first, len);
  }

  loadTexture(url: string): WebGLTexture | null {
    const { gl } = this;
    const texture = gl.createTexture();
    const img = new Image();

    img.addEventListener("load", (_) => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_INT, img);
    });

    img.src = url;
    return texture;
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

    if (!(gl.getProgramParameter(program, gl.LINK_STATUS) as GLboolean)) {
      console.error(
        `(WebGL shader program) ${gl.getProgramInfoLog(program) as string}`
      );
    }
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
    if (location < 0) {
      console.log(`Attrib: ${attrib}\tIndex: ${location}`);
    }
    this.gl.enableVertexAttribArray(location);
    if (bind) this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    return location;
  }

  attribPtr(loc: number, size: GLint): void {
    this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, 0, 0);
  }

  setAttrib(
    attrib: GlAttrib,
    buffer: WebGLBuffer | null,
    size: GLint,
    bind = false
  ): void {
    const idx = this.getAndEnableAttrib(attrib, buffer, bind);

    this.attribPtr(idx, size);
  }

  getUniformLoc = (attrib: GlAttrib): WebGLUniformLocation | null =>
    this.gl.getUniformLocation(this.program, attrib);

  getAttribLoc = (attrib: GlAttrib): number =>
    this.gl.getAttribLocation(this.program, attrib);
}
