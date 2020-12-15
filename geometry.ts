export const createCubeVertices = (s: number) => {
  const data = [
    // Front
    [s, s, s],
    [s, -s, s],
    [-s, s, s],
    [-s, s, s],
    [s, -s, s],
    [-s, -s, s],

    // Left
    [-s, s, s],
    [-s, -s, s],
    [-s, s, -s],
    [-s, s, -s],
    [-s, -s, s],
    [-s, -s, -s],

    // Back
    [-s, s, -s],
    [-s, -s, -s],
    [s, s, -s],
    [s, s, -s],
    [-s, -s, -s],
    [s, -s, -s],

    // Right
    [s, s, -s],
    [s, -s, -s],
    [s, s, s],
    [s, s, s],
    [s, -s, s],
    [s, -s, -s],

    // Top
    [s, s, s],
    [s, s, -s],
    [-s, s, s],
    [-s, s, s],
    [s, s, -s],
    [-s, s, -s],

    // Bottom
    [s, -s, s],
    [s, -s, -s],
    [-s, -s, s],
    [-s, -s, s],
    [s, -s, -s],
    [-s, -s, -s],
  ];

  return data;
};
