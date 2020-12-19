import { initProg } from "./gl-utils";
import { Mat4 } from "./mat-utils";
import { genCubeUV } from "./utils";
import { fShaderSrc, vShaderSrc } from "./shaders";
import { GlAttrib } from "./types";
import { Scene } from "./scene";
import { CubeGeometry } from "./geometry";
import textureData from "./textures/meme.jpg";

const main = async (): Promise<void> => {
  const initProgResult = initProg("glCanvas", {
    vShaderSrc,
    fShaderSrc,
  });
  if (initProgResult === null) return;

  const { canvas, glProg, gl, glw, uniformLocations } = initProgResult;

  //============== Data Loading ==========
  // Cube vertex and UV data
  const uvData = genCubeUV();

  // create and load data to GPU buffers
  const cubeObj = new CubeGeometry(1.0, glw);
  const uvBuff = glw.loadData(uvData);

  // enable vertex and color attribs
  glProg.setAttrib(GlAttrib.POS, cubeObj.getVBuff(), 3, true);
  glProg.setAttrib(GlAttrib.UV, uvBuff, 2, true);
  glProg.setAttrib(GlAttrib.NORMAL, cubeObj.getNBuff(), 3, true);

  // Load texture
  const texture = glw.loadTexture(textureData);
  // Bind Texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const textureUniLoc = gl.getUniformLocation(glProg.program, "textureID");
  gl.uniform1i(textureUniLoc, 0);

  // World Setup
  const scene = new Scene();
  scene.viewMat.translate([0, 0.1, 2]).invert();
  scene.projMat.perspective((75 / 180) * Math.PI, canvas.width / canvas.height);

  const modelMat = cubeObj.getMatM();
  const normal = cubeObj.getMatN();
  const mv = Mat4.create();
  const mvp = Mat4.create();

  const FRAME_PERIOD = 1000 / 60; // 60FPS
  let lastTime: number;
  const animate = (time: number): void => {
    if (lastTime === undefined) lastTime = time;
    const elapsed = time - lastTime;

    requestAnimationFrame(animate);

    if (elapsed > FRAME_PERIOD) {
      lastTime = time - (elapsed % FRAME_PERIOD);

      // Data updates
      cubeObj.rotate(Math.PI / 100, Math.PI / 200);

      scene.viewMat.mul(modelMat, mv);
      scene.projMat.mul(mv, mvp);

      mv.inverted(normal).transpose(); // invert mv, store into normal, then transpose normal

      // Render Part
      glw.uniformMat(uniformLocations.normal_matrix, normal);
      glw.uniformMat(uniformLocations.mvp_matrix, mvp);

      glw.drawTriangles(CubeGeometry.DATA_LEN);
    }
  };

  // animate();
  requestAnimationFrame(animate);
};

// skipcq
window.onload = async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
};
