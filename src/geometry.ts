import { Mat4 } from "./mat-utils";
import { GlWrapper } from "./gl-utils";
import { GlBuff, TVec3 } from "./types";
import { genCubeNormals, genCubeVertices } from "./utils";

export class CubeGeometry {
  static readonly DATA_LEN = 36;

  private readonly mat: Mat4;
  private readonly normalMat: Mat4;

  private readonly dataBuffer: GlBuff;
  private readonly normalBuffer: GlBuff;

  constructor(side: number, glw: GlWrapper) {
    this.dataBuffer = glw.loadData(genCubeVertices(side));
    this.normalBuffer = glw.loadData(genCubeNormals());

    this.mat = Mat4.create();
    this.normalMat = Mat4.create();
  }

  getVBuff(): GlBuff {
    return this.dataBuffer;
  }

  getNBuff(): GlBuff {
    return this.normalBuffer;
  }

  getMatM(): Mat4 {
    return this.mat;
  }

  getMatN(): Mat4 {
    return this.normalMat;
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
}
