import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createProgram, setRectangle } from 'utils/webgl-helpers';
import vertexShaderSourcePath from './vertexShader.glsl';
import fragmentShaderSourcePath from './fragmentShader.glsl';

const ImageGreyScale = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageUrl =
    'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80';

  const renderImage = (
    image: HTMLImageElement,
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ) => {
    const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const loadImage = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = '';
      image.src = imageUrl;
      image.onload = () => {
        renderImage(image, gl, program);
        resolve();
      };
      image.onerror = () => {
        reject();
      };
    });
  };

  const setup = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext('webgl');

    if (!gl) {
      return;
    }

    const program = await createProgram(gl, vertexShaderSourcePath, fragmentShaderSourcePath);

    /* set position buffer */
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    setRectangle(gl, -1, 1, 2, -2);

    await loadImage(gl, program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  // Setup once canvas has been rendered on screen
  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Image processing - Grey scale</h1>
      <canvas width="640" height="480" ref={canvasRef} id="canvas" />
    </div>
  );
};

export default ImageGreyScale;
