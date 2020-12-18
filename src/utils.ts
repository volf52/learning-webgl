import { DataArray, DataArray2D, DataArray3D, TVec2, TVec3 } from "./types";
import { vec3 } from "gl-matrix";
import { Vec3 } from "./mat-utils";

export const getRotRadFromMouse = (
  e: MouseEvent,
  canvas: HTMLCanvasElement
): { radX: number; radY: number } => {
  const radX = (2 * (e.pageX - canvas.offsetLeft)) / canvas.width - 1;
  const radY = (2 * (e.pageY - canvas.offsetTop)) / canvas.height - 1;

  return { radX, radY };
};

export const randomColorVec = (): TVec3 => [
  Math.random(),
  Math.random(),
  Math.random(),
];

export const getRandomCubeColors = (): DataArray3D => {
  const colors = [];
  for (let i = 0; i < 6; i++) {
    const faceColor = randomColorVec();
    for (let j = 0; j < 6; j++) colors.push(faceColor);
  }

  return colors;
};

/**
 *
 * @return {number} a random number between -1 and 1
 */
const randomPoint = (): number => Math.random() * 2 - 1;

export const spherePointCloud = (num: number, radius = 1.0): DataArray3D => {
  const points: DataArray3D = [];
  for (let i = 0; i < num; i++) {
    const point: vec3 = Vec3.from([randomPoint(), randomPoint(), randomPoint()])
      .normalize()
      .scale(radius)
      .get();

    points.push([point[0], point[1], point[2]]);
  }

  return points;
};

/**
 * Create the triangle vertices from the face's corner vertices.
 *
 *
 * vIndices for each face are described as: v0 -> top-right, v1 -> bottom-right, v2 -> top-left, v3 -> bottom-left.
 *
 *
 * Resultant =>   Triangle 1: (v0 -> v1 -> v2)    Triangle 2: (v2 -> v1 -> v3).
 *
 *
 * @param v0 top right
 * @param v1 bottom right
 * @param v2 top left
 * @param v3 bottom left
 *
 * @return d: DataArray [...Triangle 1 vertices, ...Triangle 2 vertices]
 *
 */
const genFace = (
  v0: TVec2 | TVec3,
  v1: TVec2 | TVec3,
  v2: TVec2 | TVec3,
  v3: TVec2 | TVec3
): DataArray => {
  const res = [v0, v1, v2, v2, v1, v3];
  if (v0.length === 2) return res as DataArray2D;
  else return res as DataArray3D;
};

const genFace3D = (v0: TVec3, v1: TVec3, v2: TVec3, v3: TVec3): DataArray3D => {
  return genFace(v0, v1, v2, v3) as DataArray3D;
};

const genFace2D = (v0: TVec2, v1: TVec2, v2: TVec2, v3: TVec2): DataArray2D => {
  return genFace(v0, v1, v2, v3) as DataArray2D;
};

/**
 * Create faces for cuboid. Returns DataArray with [front, left, back, right, top, bottom] traingle vertices.
 *
 * @param length
 * @param width
 * @param height
 */
export const genCuboidVertices = (
  length: number,
  width: number,
  height: number
): DataArray3D => {
  const l = length / 2;
  const w = width / 2;
  const h = height / 2;

  // vIndices for each face are described as: 0 -> top-right, 1 -> bottom-right, 2 -> top-left, 3 -> bottom-left
  // Triangles for each face are drawn in this way: Triangle 1: (0 -> 1 -> 2), Triangle 2: (2 -> 1 -> 3)

  const v0: TVec3 = [l, h, w];
  const v1: TVec3 = [l, -h, w];
  const v2: TVec3 = [-l, h, w];
  const v3: TVec3 = [-l, -h, w];
  const v4: TVec3 = [-l, h, -w];
  const v5: TVec3 = [-l, -h, -w];
  const v6: TVec3 = [l, h, -w];
  const v7: TVec3 = [l, -h, -w];

  return [
    // Front: v0, v1, v2, v3
    ...genFace3D(v0, v1, v2, v3),

    // Left: v2, v3, v4, v4
    ...genFace3D(v2, v3, v4, v5),

    // Back: v4, v5, v6, v7
    ...genFace3D(v4, v5, v6, v7),

    // Right: v6, v7, v0, v1
    ...genFace3D(v6, v7, v0, v1),

    // Top: v6, v0, v4, v2
    ...genFace3D(v6, v0, v4, v2),

    // Bottom: v1, v7, v3, v5
    ...genFace3D(v1, v7, v3, v5),
  ];
};

export const genCubeVertices = (side: number): DataArray3D =>
  genCuboidVertices(side, side, side);

export const genCubeUV = (): DataArray2D => {
  const v0: TVec2 = [1, 1];
  const v1: TVec2 = [1, 0];
  const v2: TVec2 = [0, 1];
  const v3: TVec2 = [0, 0];

  const faceData = genFace2D(v0, v1, v2, v3);

  const data = [];

  for (let i = 0; i < 6; i++) data.push(...faceData);

  return data;
};

export const genCubeNormals = (): DataArray3D => {
  const faceData: DataArray3D = [
    [0, 0, 1], // F = +Z
    [-1, 0, 0], // L = -X
    [0, 0, -1], // B = -Z
    [1, 0, 0], // R = +X
    [0, 1, 0], // T = +Y
    [0, -1, 0], // U = -Y
  ];

  const data = [];

  for (let faceIdx = 0; faceIdx < 6; faceIdx++)
    for (let j = 0; j < 6; j++) data.push(faceData[faceIdx]);

  return data;
};
