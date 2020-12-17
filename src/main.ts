import { initProg } from "./gl-utils";
import { genCubeUV, genCubeVertices } from "./utils";
import { fShaderSrc, vShaderSrc } from "./shaders";
import { GlAttrib } from "./types";
import { Scene } from "./scene";
import { CubeGeometry } from "./geometry";
import brickData from "./textures/default_brick.png";

const main = async (): Promise<void> => {
  const initProgResult = initProg("glCanvas", {
    vShaderSrc,
    fShaderSrc,
  });
  if (initProgResult === null) return;

  const { canvas, glProg, gl, glw, uniformLocations } = initProgResult;

  // Load texture
  const brick = glw.loadTexture(brickData);
  // Bind Texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, brick);

  //============== Data Loading ==========
  // Cube vertex and UV data
  const vertexData = genCubeVertices(1.0);
  const uvData = genCubeUV();

  // create and load data to GPU buffers
  const cubeObj = new CubeGeometry(1.0, uniformLocations.model_matrix, glw);
  const uvBuff = glw.loadData(uvData);

  // enable vertex and color attribs
  glProg.setAttrib(GlAttrib.POS, cubeObj.getBuff(), 3, true);
  glProg.setAttrib(GlAttrib.UV, uvBuff, 2, true);

  const textureUniLoc = gl.getUniformLocation(glProg.program, "textureID");
  gl.uniform1i(textureUniLoc, 0);

  // World Setup
  const scene = new Scene();
  scene.viewMat.translate([0, 0.1, 2]).invert();
  scene.projMat.perspective((75 / 180) * Math.PI, canvas.width / canvas.height);

  window.addEventListener("keypress", (e) => {
    const f = 0.3;
    switch (e.key) {
      case "w":
        scene.viewMat.mvUp(f);
        break;
      case "s":
        scene.viewMat.mvDown(f);
        break;
      case "d":
        scene.viewMat.mvRight(f);
        break;
      case "a":
        scene.viewMat.mvLeft(f);
        break;
    }
  });

  const animate = (): void => {
    requestAnimationFrame(animate);

    // Data updates
    cubeObj.rotate(Math.PI / 60, Math.PI / 60);

    // Render Part
    cubeObj.update(glw);
    scene.update(glw, uniformLocations);
    glw.drawTriangles(vertexData.length);
  };

  animate();
};

// skipcq
window.onload = async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
};
