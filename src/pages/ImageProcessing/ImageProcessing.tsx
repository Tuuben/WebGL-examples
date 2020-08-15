import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createShader, createProgram } from 'utils/webgl-helpers';
import vertexShaderSource from './vertexShader.glsl';
import fragmentShaderSource from './fragmentShader.glsl';

const ImageProcessing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /*   const vertexShaderSource = `
    // an attribute will receive data from a buffer
    attribute vec4 a_position;
    
    // all shaders have a main function
    void main() {
    
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
  `;

  const fragmentShaderSource = `
    // fragment shaders don't have a default precision so we need
    // to pick one. mediump is a good default. It means "medium precision"
    precision mediump float;
    
    void main() {
      // gl_FragColor is a special variable a fragment shader
      // is responsible for setting
      gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
    }
  `; */

  useEffect(() => {
    console.log(canvasRef.current);
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext('webgl');

    if (!gl) {
      return;
    }

    console.log(vertexShaderSource);

    // Create & setup webgl program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Setting values to the buffer
    var positions = [0, 0, 0, 0.5, 0.7, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Enable WebGL to se the position attrib
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Point array_buffer to position attribute
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [canvasRef]);

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Image processing examples</h1>

      <canvas width="640" height="640" ref={canvasRef} id="canvas"></canvas>
    </div>
  );
};

export default ImageProcessing;
