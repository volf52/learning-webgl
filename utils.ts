import { Vec3, DataArray } from "./types";

export const randomColorVec = (): Vec3 => [
  Math.random(),
  Math.random(),
  Math.random(),
];

/**
 *
 * @return {number} a random number between -0.5 and 0.5
 */
const randomPoint = (): number => Math.random() - 0.5;
export const spherePointCloud = (num = 100_000): DataArray => {
  let points: DataArray = [];
  for (let i = 0; i < num; i++) {
    points.push([randomPoint(), randomPoint(), randomPoint()]);
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
const createFace = (v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3): DataArray => {
  return [v0, v1, v2, v2, v1, v3];
};

/**
 * Create faces for cuboid. Returns DataArray with [front, left, back, right, top, bottom] traingle vertices.
 *
 * @param length
 * @param width
 * @param height
 */
export const createCuboidVertices = (
  length: number,
  width: number,
  height: number
): DataArray => {
  const l = length / 2;
  const w = width / 2;
  const h = height / 2;

  // vIndices for each face are described as: 0 -> top-right, 1 -> bottom-right, 2 -> top-left, 3 -> bottom-left
  // Triangles for each face are drawn in this way: Triangle 1: (0 -> 1 -> 2), Triangle 2: (2 -> 1 -> 3)

  const v0: Vec3 = [l, h, w];
  const v1: Vec3 = [l, -h, w];
  const v2: Vec3 = [-l, h, w];
  const v3: Vec3 = [-l, -h, w];
  const v4: Vec3 = [-l, h, -w];
  const v5: Vec3 = [-l, -h, -w];
  const v6: Vec3 = [l, h, -w];
  const v7: Vec3 = [l, -h, -w];

  return [
    // Front: v0, v1, v2, v3
    ...createFace(v0, v1, v2, v3),

    // Left: v2, v3, v4, v4
    ...createFace(v2, v3, v4, v5),

    // Back: v4, v5, v6, v7
    ...createFace(v4, v5, v6, v7),

    // Right: v6, v7, v0, v1
    ...createFace(v6, v7, v0, v1),

    // Top: v6, v0, v4, v2
    ...createFace(v6, v0, v4, v2),

    // Bottom: v1, v7, v3, v5
    ...createFace(v1, v7, v3, v5),
  ];
};

export const createCubeVertices = (side: number): DataArray =>
  createCuboidVertices(side, side, side);
