import { GlAttrib } from "./types";

const { POS, UV, V_UV, NORMAL, MAT_NORMAL, V_BRIGHT, MAT_MVP } = GlAttrib;

export const vShaderSrc = `
      precision mediump float;

      const vec3 lightDirection = normalize(vec3(0, 1.0, 1.0));
      const float ambient = 0.1;
      
      attribute vec3 ${POS};
      attribute vec2 ${UV};
      attribute vec3 ${NORMAL};
      
      varying vec2 ${V_UV};
      varying float ${V_BRIGHT};
      
      uniform mat4 ${MAT_MVP};
      uniform mat4 ${MAT_NORMAL};
      
      void main() {
            vec3 worldNormal = (${MAT_NORMAL} * vec4(${NORMAL}, 1)).xyz;
            float diffuse = max(0.0, dot(worldNormal, lightDirection));
            
            ${V_UV} = ${UV};
            ${V_BRIGHT} = ambient + diffuse;
            
            gl_Position = ${MAT_MVP} * vec4(${POS}, 1);
      }
`;

export const fShaderSrc = `
      precision mediump float;

      varying vec2 ${V_UV};
      varying float ${V_BRIGHT};
      
      uniform sampler2D textureID;
      
      void main() {
        vec4 texel = texture2D(textureID, ${V_UV});
        texel.xyz *= ${V_BRIGHT};
        gl_FragColor = texel;
      }
`;
