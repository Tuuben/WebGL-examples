// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
// our texture
uniform sampler2D u_image;
uniform sampler2D u_mapImage;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

uniform vec2 u_mouse;
 
void main() {
   vec4 depthDistortion = texture2D(u_mapImage, v_texCoord);
   float parallaxMult = depthDistortion.r;

   vec2 parallax = (u_mouse) * parallaxMult;

   gl_FragColor = texture2D(u_image, (v_texCoord + parallax));
}

/* https://codepen.io/robin-dela/pen/vaQQNL */

/* 
precision mediump float;
 
// our texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;
 
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // compute 1 pixel in texture coordinates.
   vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
 
   // average the left, middle, and right pixels.
   gl_FragColor = (
       texture2D(u_image, v_texCoord) +
       texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
       texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))) / 3.0;
}
 */