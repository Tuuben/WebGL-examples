import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createShader, createProgram, shaderSourceToString } from 'utils/webgl-helpers';
import vertexShaderSourcePath from './vertexShader.glsl';
import fragmentShaderSourcePath from './fragmentShader.glsl';

const ImageSineWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageUrl =
    'https://images.unsplash.com/photo-1592838890225-2c052fa0cf34?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80';

  function setRectangle(
    gl: WebGLRenderingContext,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW
    );
  }

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

    // Load vertex shaders
    const vertexShaderSource = await shaderSourceToString(vertexShaderSourcePath);
    const fragmentShaderSource = await shaderSourceToString(fragmentShaderSourcePath);

    // Create & setup webgl program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    /* set position buffer */
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    /* Get delta positions */
    const dXPosition = gl.getUniformLocation(program, 'dX');
    const dYPosition = gl.getUniformLocation(program, 'dY');

    setRectangle(gl, -1, 1, 2, -2);

    await loadImage(gl, program);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // lookup uniforms
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    let val = 0;
    setInterval(() => {
      gl.uniform1f(dXPosition, Math.sin(val));
      gl.uniform1f(dYPosition, Math.cos(val));

      val += 0.05;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 10);
  };

  // Setup once canvas has been rendered on screen
  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Image processing - Sine wave</h1>
      <canvas width="640" height="480" ref={canvasRef} id="canvas" />
    </div>
  );
};

export default ImageSineWave;
