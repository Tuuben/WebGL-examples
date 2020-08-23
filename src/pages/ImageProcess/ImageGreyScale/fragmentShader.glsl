
precision mediump float;
 
uniform sampler2D u_image;
uniform vec2 u_textureSize;
 
varying vec2 v_texCoord;
 
void main() {
   vec4 color = texture2D(u_image, v_texCoord);
	float gray = dot(color.rgb, vec3(0.35, 0.35, 0.35));
	gl_FragColor = vec4(vec3(gray), 1.0);
}
 