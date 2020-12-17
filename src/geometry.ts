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

  moveR(units: number): void {
    this.mat.translate([units, 0, 0]);
  }

  moveL(units: number): void {
    this.mat.translate([-units, 0, 0]);
  }

  moveU(units: number): void {
    this.mat.translate([0, units, 0]);
  }

  moveD(units: number): void {
    this.mat.translate([0, -units, 0]);
  }

  translate(v: TVec3): void {
    this.mat.translate(v);
  }

  // rotate(radX: number, radY: number): void {
  //   const r = Quat.create();
  //   r.rotateY(radX);
  //   r.rotateX(radY);
  //   this.mat.fromQuat(r);
  // }
  // rotate(radX: number, radY: number): void {
  //   this.mat.rotateX(radX).rotateY(radY);
  // }

  update(glw: GlWrapper): void {
    glw.uniformMat(this.matLoc, this.mat);
  }
}
