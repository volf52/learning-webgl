const main = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#glCanvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("Unable to initialize WebGL");
    return;
  }

  // vertex data
  const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0];

  // create buffer
  const buffer = gl.createBuffer();

  // load vertex data into buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

  // create vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vertexShader,
    `
  attribute vec3 position;
  void main(){
    gl_Position = vec4(position, 1); 
  }
`
  );
  gl.compileShader(vertexShader);
  // create fragment shader
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fragShader,
    `
void main(){
  gl_FragColor = vec4(1, 0, 0, 1);
}
`
  );
  gl.compileShader(fragShader);
  // attach shaders to program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  // enable vertex attribs
  const posLoc = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);

  // draw
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

window.onload = main;
