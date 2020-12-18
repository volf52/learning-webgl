import { mat4, quat, ReadonlyVec3, vec3 } from "gl-matrix";

const RAD_PER_DEG = Math.PI / 180;
export const toRadians = (deg: number): number => {
  return deg * RAD_PER_DEG;
};

export class Vec3 {
  private vec: vec3;

  private constructor(v: vec3) {
    this.vec = v;
  }

  static create(): Vec3 {
    return new Vec3(vec3.create());
  }

  static from(v: vec3): Vec3 {
    return new Vec3(vec3.fromValues(v[0], v[1], v[2]));
  }

  set(v: vec3): void {
    this.vec = v;
  }

  get(): vec3 {
    return this.vec;
  }

  add(other: Vec3 | vec3, out?: Vec3): Vec3 {
    let result: Vec3;

    if (out === undefined || out === null) {
      result = Vec3.create();
    } else {
      result = out;
    }

    vec3.add(result.vec, this.vec, this.getUnderlying(other));

    return result;
  }

  addp(other: Vec3 | vec3): Vec3 {
    vec3.add(this.vec, this.vec, this.getUnderlying(other));
    return this;
  }

  idxAdd(idx: number, toAdd: number): Vec3 {
    this.vec[idx] += toAdd;

    return this;
  }

  normalize(): Vec3 {
    vec3.normalize(this.vec, this.vec);

    return this;
  }

  normalized(): Vec3 {
    const v = Vec3.create();

    vec3.normalize(v.vec, this.vec);
    return v;
  }

  scale(factor: number): Vec3 {
    vec3.scale(this.vec, this.vec, factor);

    return this;
  }

  str(): string {
    return vec3.str(this.vec);
  }

  log(): Vec3 {
    console.log(vec3.str(this.vec));

    return this;
  }

  private getUnderlying(v: Vec3 | vec3): vec3 {
    if (v instanceof Vec3) return v.vec;
    else return v;
  }
}

export class Quat {
  private readonly q: quat;

  private constructor(q: quat) {
    this.q = q;
  }

  static create(): Quat {
    return new Quat(quat.create());
  }

  get(): quat {
    return this.q;
  }

  rotateX(rad: number): Quat {
    quat.rotateX(this.q, this.q, rad);

    return this;
  }

  rotateY(rad: number): Quat {
    quat.rotateY(this.q, this.q, rad);

    return this;
  }

  rotateZ(rad: number): Quat {
    quat.rotateZ(this.q, this.q, rad);

    return this;
  }
}

export class Mat4 {
  private static readonly UP = vec3.fromValues(0, 1, 0);
  private static readonly DOWN = vec3.fromValues(0, -1, 0);
  private static readonly LEFT = vec3.fromValues(-1, 0, 0);
  private static readonly RIGHT = vec3.fromValues(1, 0, 0);
  private static readonly arithBuffer = vec3.create();

  private mat: mat4;

  private constructor(m: mat4) {
    this.mat = m;
  }

  static create(): Mat4 {
    return new Mat4(mat4.create());
  }

  static from(mat: Mat4 | mat4): Mat4 {
    if (mat instanceof Mat4) return mat;

    return new Mat4(mat);
  }

  static fromQuat(q: Quat | quat): Mat4 {
    let qr: quat;
    if (q instanceof Quat) qr = q.get();
    else qr = q;

    const m = mat4.create();
    mat4.fromQuat(m, qr);

    return new Mat4(m);
  }

  identity(): Mat4 {
    mat4.identity(this.mat);
    return this;
  }

  fromQuat(q: Quat | quat): Mat4 {
    let qr: quat;
    if (q instanceof Quat) qr = q.get();
    else qr = q;

    mat4.fromQuat(this.mat, qr);
    return this;
  }

  get(): mat4 {
    return this.mat;
  }

  set(matrix: Mat4 | mat4): void {
    if (matrix instanceof Mat4) this.mat = matrix.mat;
    else this.mat = matrix;
  }

  translate(vec: ReadonlyVec3): Mat4 {
    mat4.translate(this.mat, this.mat, vec);
    return this;
  }

  transpose(): Mat4 {
    mat4.transpose(this.mat, this.mat);
    return this;
  }

  transposed(into: Mat4): Mat4 {
    mat4.transpose(into.mat, this.mat);
    return into;
  }

  private move(u: number, v: vec3): void {
    vec3.scale(Mat4.arithBuffer, v, u);
    mat4.translate(this.mat, this.mat, Mat4.arithBuffer);
  }

  mvLeft(units: number): Mat4 {
    this.move(units, Mat4.LEFT);
    return this;
  }

  mvRight(units: number): Mat4 {
    this.move(units, Mat4.RIGHT);
    return this;
  }

  mvUp(units: number): Mat4 {
    this.move(units, Mat4.UP);
    return this;
  }

  mvDown(units: number): Mat4 {
    this.move(units, Mat4.DOWN);
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

  mul(other: Mat4, out?: Mat4): Mat4 {
    let result: Mat4;

    if (out === undefined || out === null) {
      result = Mat4.create();
    } else {
      result = out;
    }

    mat4.multiply(result.mat, this.mat, other.mat);

    return result;
  }

  mulp(other: Mat4): Mat4 {
    mat4.mul(this.mat, this.mat, other.mat);
    return this;
  }

  lookAt(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
    mat4.lookAt(this.mat, eye.get(), center.get(), up.get());

    return this;
  }

  invert(): Mat4 {
    mat4.invert(this.mat, this.mat);
    return this;
  }

  inverted(into: Mat4): Mat4 {
    mat4.invert(into.mat, this.mat);
    return into;
  }

  str(): string {
    return mat4.str(this.mat);
  }

  log(): Mat4 {
    console.log(mat4.str(this.mat));

    return this;
  }
}
