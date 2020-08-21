
precision mediump float;
 

uniform sampler2D u_image0;
uniform sampler2D u_image1;
varying vec2 v_texCoord;

uniform float mouseX, mouseY;


void main() {
   vec4 textureCopy = texture2D(u_image1, v_texCoord);

   float x = (mouseX ) * 0.026; 
   float y = (mouseY ) * 0.026;

   vec2 parallax = vec2( x * textureCopy.r, y * textureCopy.r);

   gl_FragColor = texture2D(u_image0, v_texCoord + vec2(x, y) * textureCopy.r);
}