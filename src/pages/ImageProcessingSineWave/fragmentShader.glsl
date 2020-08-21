
precision mediump float;
 

uniform sampler2D u_image;
varying vec2 v_texCoord;
uniform float timeX, timeY;

vec2 Sine( vec2 point ) {
    float x = sin( 10.0 * point.y + 1.0 * point.x * timeX ) * 0.05;
    float y = sin( 10.0 * point.x + 1.0 * point.y * timeY ) * 0.05;
    return vec2(point.x + x, point.y + y );
}

void main() {
   gl_FragColor = texture2D(u_image, Sine(v_texCoord));
}