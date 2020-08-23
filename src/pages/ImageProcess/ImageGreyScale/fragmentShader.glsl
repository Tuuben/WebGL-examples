
precision mediump float;
 
// our texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;
 
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // average the left, middle, and right pixels.
//   gl_FragColor = texture2D(u_image, v_texCoord).brga;

   vec4 color = texture2D(u_image, v_texCoord);
	float gray = dot(color.rgb, vec3(0.35, 0.35, 0.35));
	gl_FragColor = vec4(vec3(gray), 1.0);
}
 