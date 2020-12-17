import { Mat4 } from "./mat-utils";
import { GlWrapper } from "./gl-utils";
import { TVec3, UniformLoc } from "./types";
import { genCubeVertices } from "./utils";

export class CubeGeometry {
  private readonly mat: Mat4;
  private readonly matLoc: UniformLoc;
  private readonly dataBuffer: WebGLBuffer | null;

  constructor(side: number, mLoc: UniformLoc, glw: GlWrapper) {
    const data = genCubeVertices(side);
    const buff = glw.loadData(data);
    this.dataBuffer = buff;

    this.mat = Mat4.create();

    this.matLoc = mLoc;
  }

  getBuff(): WebGLBuffer | null {
    return this.dataBuffer;
  }

  mvRight(units: number): void {
    this.mat.mvRight(units);
  }

  mvLeft(units: number): void {
    this.mat.mvLeft(units);
  }

  mvUp(units: number): void {
    this.mat.mvUp(units);
  }

  mvDown(units: number): void {
    this.mat.mvDown(units);
  }

  translate(v: TVec3): void {
    this.mat.translate(v);
  }

  rotate(radX: number, radY: number): void {
    this.mat.rotateX(radX).rotateY(radY);
  }

  rotateX(rad: number): void {
    this.mat.rotateX(rad);
  }

  rotateY(rad: number): void {
    this.mat.rotateY(rad);
  }

  update(glw: GlWrapper): void {
    glw.uniformMat(this.matLoc, this.mat);
  }
}
