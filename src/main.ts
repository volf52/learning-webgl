import { initProg } from "./gl-utils";
import { genCubeVertices, getRandomCubeColors } from "./utils";
import { fShaderSrc, vShaderSrc } from "./shaders";
import { GlAttrib } from "./types";
import { Scene } from "./scene";
import { CubeGeometry } from "./geometry";

const main = async (): Promise<void> => {
  const initProgResult = initProg("glCanvas", {
    vShaderSrc,
    fShaderSrc,
  });
  if (initProgResult === null) return;

  const { canvas, glProg, glw, uniformLocations } = initProgResult;

  //============== Data Loading ==========
  // Cube vertex and UV data
  const vertexData = genCubeVertices(1.0);
  const colorData = getRandomCubeColors();

  // create and load data to GPU buffers
  const cubeObj = new CubeGeometry(1.0, uniformLocations.model_matrix, glw);
  const colorBuffer = glw.loadData(colorData);

  // enable vertex and color attribs
  glProg.setAttrib(GlAttrib.POS, cubeObj.getBuff(), 3, true);
  glProg.setAttrib(GlAttrib.COLOR, colorBuffer, 3, true);

  const scene = new Scene();
  scene.viewMat.translate([0, 0, -10]);
  scene.projMat.perspective((36 / 180) * Math.PI, canvas.width / canvas.height);

  window.addEventListener("keypress", (e) => {
    const f = 0.3;
    switch (e.key) {
      case "w":
        cubeObj.mvUp(f);
        break;
      case "s":
        cubeObj.mvDown(f);
        break;
      case "d":
        cubeObj.mvRight(f);
        break;
      case "a":
        cubeObj.mvLeft(f);
        break;
      case "i":
        scene.viewMat.mvDown(f);
        break;
      case "k":
        scene.viewMat.mvUp(f);
        break;
      case "j":
        scene.viewMat.mvRight(f);
        break;
      case "l":
        scene.viewMat.mvLeft(f);
        break;
    }
  });

  const animate = (): void => {
    cubeObj.update(glw);
    scene.update(glw, uniformLocations);
    glw.drawTriangles(vertexData.length);
    requestAnimationFrame(animate);
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
