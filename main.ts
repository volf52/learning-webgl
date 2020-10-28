const main = () => {
  let r = 3;
  r = "2";
  const canvas = document.querySelector<HTMLCanvasElement>("#glCanvas");
  const gl = canvas.getContext("webgl");

  if (gl === null) {
    alert("Unable to initialize WebGL");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

window.onload = main;
