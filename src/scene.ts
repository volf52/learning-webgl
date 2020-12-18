import { Mat4, Quat, Vec3 } from "./mat-utils";

export class Scene {
  viewMat = Mat4.create();
  projMat = Mat4.create();
  up = Vec3.from([0, 1, 0]);

  camera = {
    translation: Vec3.create(),
    rotation: Quat.create(),
  };
}
