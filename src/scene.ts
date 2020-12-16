import { Mat4, Vec3, Quat } from "./mat-utils";
import { GlWrapper, UniformLocations } from "./gl-utils";

export class Scene {
  modelMat = Mat4.create();
  viewMat = Mat4.create();
  projMat = Mat4.create();
  up = Vec3.from([0, 1, 0]);
  glw: GlWrapper;

  camera = {
    translation: Vec3.create(),
    rotation: Quat.create(),
  };

  constructor(glWrapper: GlWrapper) {
    this.glw = glWrapper;
  }

  rotateModel(radX: number, radY: number): void {
    const r = Quat.create();
    r.rotateY(radX);
    r.rotateX(radY);
    this.modelMat.fromQuat(r);
  }

  update(locations: UniformLocations) {
    this.modelMat.rotateY(Math.PI / 300);
    const center = this.camera.translation.add([0, 0, 1]);

    this.viewMat.lookAt(this.camera.translation, center, this.up);

    this.glw.uniformMat(locations.model_matrix, this.modelMat);
    this.glw.uniformMat(locations.view_matrix, this.viewMat);
    this.glw.uniformMat(locations.projection_matrix, this.projMat);
  }
}
