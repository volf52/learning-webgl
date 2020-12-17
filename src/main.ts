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

  const { canvas, gl, glProg, glw, uniformLocations } = initProgResult;

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
        cubeObj.moveU(f);
        break;
      case "s":
        cubeObj.moveD(f);
        break;
      case "d":
        cubeObj.moveR(f);
        break;
      case "a":
        cubeObj.moveL(f);
        break;
    }
  });

  // let mouseIsDown = false;
  // canvas.addEventListener("mouseup", (_) => {
  //   mouseIsDown = false;
  // });
  // canvas.addEventListener("mousedown", (_) => {
  //   mouseIsDown = true;
  // });
  //
  // canvas.addEventListener("mousemove", (e) => {
  //   if (mouseIsDown) {
  //     const { radX, radY } = getRotRadFromMouse(e, canvas);
  //     cubeObj.rotate(radX, radY);
  //   }
  // });

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
