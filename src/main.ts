import { initProg } from "./gl-utils";
import { genCubeVertices, getRandomCubeColors } from "./utils";
import { fShaderSrc, vShaderSrc } from "./shaders";
import { GlAttrib } from "./types";
import { Scene } from "./scene";
import { Mat4 } from "./mat-utils";
import { CubeGeometry } from "./geometry";

const main = async (): Promise<void> => {
  const initProgResult = initProg("glCanvas", {
    vShaderSrc,
    fShaderSrc,
  });
  if (initProgResult === null) return;

  const { canvas, gl, glProg, glw, uniformLocations } = initProgResult;

  //============== Data Loading ==========
  // Cube vertex and UV data
  const vertexData = genCubeVertices(1.0);
  const colorData = getRandomCubeColors();

  // create and load data to GPU buffers
  const cubeObj = new CubeGeometry(1.0, uniformLocations.model_matrix, glw);
  cubeObj.translate([0, 0, -10])
  const colorBuffer = glw.loadData(colorData);

  // enable vertex and color attribs
  glProg.setAttrib(GlAttrib.POS, cubeObj.getBuff(), 3, true);
  glProg.setAttrib(GlAttrib.COLOR, colorBuffer, 3, true);

  const scene = new Scene();
  // cubeObj.translate([2, 0, -10]);
  scene.projMat.perspective((36 / 180) * Math.PI, canvas.width / canvas.height);

  window.addEventListener("keypress", (e) => {
    const f = 0.1;
    switch (e.key) {
      case "w":
        // scene.viewMat.translate([0, f, 0]);
          cubeObj.moveU(f)
        break;
      case "s":
        scene.viewMat.translate([0, -f, 0]);
        break;
      case "d":
        scene.viewMat.translate([f, 0, 0]);
        break;
      case "a":
        scene.viewMat.translate([-f, 0, 0]);
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
