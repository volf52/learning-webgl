import { mat4, ReadonlyVec3 } from "gl-matrix";

export class Mat4 {
  private mat: mat4;

  private constructor() {
    this.mat = mat4.create();
  }

  public static create() {
    return new Mat4();
  }

  get() {
    return this.mat;
  }

  set(matrix: mat4) {
    this.mat = matrix;
  }

  translate(vec: ReadonlyVec3) {
    mat4.translate(this.mat, this.mat, vec);
    return this;
  }

  scale(vec: ReadonlyVec3) {
    mat4.scale(this.mat, this.mat, vec);
    return this;
  }

  rotate(rad: number, axis: ReadonlyVec3) {
    mat4.rotate(this.mat, this.mat, rad, axis);
    return this;
  }

  rotateX(rad: number) {
    mat4.rotateX(this.mat, this.mat, rad);
    return this;
  }

  rotateY(rad: number) {
    mat4.rotateY(this.mat, this.mat, rad);
    return this;
  }

  rotateZ(rad: number) {
    mat4.rotateZ(this.mat, this.mat, rad);
    return this;
  }

  str() {
    return mat4.str(this.mat);
  }
}
