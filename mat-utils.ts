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

  /**
   *
   * @param fovy Field of View in radians (vertical axis)
   * @param ar Aspect Ration Width / Height
   */
  persepective(fovy: number, ar: number) {
    mat4.perspective(this.mat, fovy, ar, 1e-4, 1e4);
    return this;
  }

  mul(otherMatrix: Mat4 | mat4, out: Mat4 | mat4 | null) {
    let result: mat4;

    if (!out) {
      result = mat4.create();
    } else {
      result = this.getUnderlying(out);
    }

    let om = this.getUnderlying(otherMatrix);

    mat4.mul(result, this.mat, om);

    return result;
  }

  mulIP(otherMatrix: Mat4 | mat4) {
    mat4.mul(this.mat, this.mat, this.getUnderlying(otherMatrix));

    return this;
  }

  str() {
    return mat4.str(this.mat);
  }

  private getUnderlying(m: Mat4 | mat4) {
    if (m instanceof Mat4) return m.get();
    else return m;
  }
}
