import { mat4, ReadonlyVec3 } from "gl-matrix";

export class Mat4 {
  private mat: mat4;

  private constructor(m: mat4) {
    this.mat = m;
  }

  public static create(): Mat4 {
    return new Mat4(mat4.create());
  }

  public static from(mat: Mat4 | mat4): Mat4 {
    if (mat instanceof Mat4) return mat;

    return new Mat4(mat);
  }

  get(): mat4 {
    return this.mat;
  }

  set(matrix: mat4): void {
    this.mat = matrix;
  }

  translate(vec: ReadonlyVec3): Mat4 {
    mat4.translate(this.mat, this.mat, vec);
    return this;
  }

  scale(vec: ReadonlyVec3): Mat4 {
    mat4.scale(this.mat, this.mat, vec);
    return this;
  }

  rotate(rad: number, axis: ReadonlyVec3): Mat4 {
    mat4.rotate(this.mat, this.mat, rad, axis);
    return this;
  }

  rotateX(rad: number): Mat4 {
    mat4.rotateX(this.mat, this.mat, rad);
    return this;
  }

  rotateY(rad: number): Mat4 {
    mat4.rotateY(this.mat, this.mat, rad);
    return this;
  }

  rotateZ(rad: number): Mat4 {
    mat4.rotateZ(this.mat, this.mat, rad);
    return this;
  }

  /**
   *
   * @param fovy Field of View in radians (vertical axis)
   * @param ar Aspect Ration Width / Height
   */
  perspective(fovy: number, ar: number): Mat4 {
    mat4.perspective(this.mat, fovy, ar, 1e-4, 1e4);
    return this;
  }

  mul(otherMatrix: Mat4 | mat4, out?: Mat4): Mat4 {
    let result: Mat4;

    if (out === undefined || out === null) {
      result = Mat4.create();
    } else {
      result = out;
    }

    mat4.multiply(result.mat, this.mat, this.getUnderlying(otherMatrix));

    return result;
  }

  mulp(otherMatrix: Mat4 | mat4): Mat4 {
    mat4.mul(this.mat, this.mat, this.getUnderlying(otherMatrix));
    return this;
  }

  invert(): Mat4 {
    mat4.invert(this.mat, this.mat);
    return this;
  }

  str(): string {
    return mat4.str(this.mat);
  }

  log(): Mat4 {
    console.log(mat4.str(this.mat));

    return this;
  }

  private getUnderlying(m: Mat4 | mat4): mat4 {
    if (m instanceof Mat4) return m.get();
    else return m;
  }
}
