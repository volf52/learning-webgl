import { Mat4, Vec3, Quat } from "./mat-utils";
import { GlWrapper } from "./gl-utils";
import {UniformLocations} from './types'

export class Scene {
  viewMat = Mat4.create();
  projMat = Mat4.create();
  up = Vec3.from([0, 1, 0]);

  camera = {
    translation: Vec3.create(),
    rotation: Quat.create(),
  };

  update(glw: GlWrapper, locations: UniformLocations): void {
    // const center = this.camera.translation.add([0, 0, 1]);
    //
    // this.viewMat.lookAt(this.camera.translation, center, this.up);

    glw.uniformMat(locations.view_matrix, this.viewMat);
    glw.uniformMat(locations.projection_matrix, this.projMat);
  }
}
