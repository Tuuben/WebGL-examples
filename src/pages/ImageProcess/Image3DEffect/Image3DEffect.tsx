import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  createShader,
  createProgram,
  shaderSourceToString,
  setRectangle,
} from 'utils/webgl-helpers';
import mountainSrc from 'assets/images/mountains.jpeg';
import mountainMapSrc from 'assets/images/mountains-map.jpg';
import vertexShaderSourcePath from './vertexShader.glsl';
import fragmentShaderSourcePath from './fragmentShader.glsl';

const Image3DEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderImage = (image: HTMLImageElement, gl: WebGLRenderingContext) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    return texture;
  };

  const loadImage = (gl: WebGLRenderingContext, src: string): Promise<WebGLTexture | null> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = '';
      image.src = src;
      image.onload = () => {
        const texture = renderImage(image, gl);
        resolve(texture);
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

    // Setup canvas mouse position
    let mousePos = { x: 0, y: 0 };
    canvas.onmousemove = (mouseEvent: MouseEvent) => {
      const getMousePos = (c: HTMLCanvasElement, event: MouseEvent) => {
        const rect = c.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      };

      const mp = getMousePos(canvas, mouseEvent);
      mousePos = { x: mp.x / canvas.width, y: mp.y / canvas.height };
    };

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

    /* set fragment shader time vars */
    const mouseXPosition = gl.getUniformLocation(program, 'mouseX');
    const mouseYPosition = gl.getUniformLocation(program, 'mouseY');

    setRectangle(gl, -1, 1, 2, -2);

    const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const image01 = await loadImage(gl, mountainSrc);
    const image02 = await loadImage(gl, mountainMapSrc);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // link textures to right pos
    const uImageLocation = gl.getUniformLocation(program, 'u_image0');
    const uMapImageLocation = gl.getUniformLocation(program, 'u_image1');

    gl.uniform1i(uImageLocation, 0);
    gl.uniform1i(uMapImageLocation, 1);

    // Bind textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, image01);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, image02);

    setInterval(() => {
      gl.uniform1f(mouseXPosition, mousePos.x);
      gl.uniform1f(mouseYPosition, mousePos.y);

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
      <h1>Image processing - 3D effect</h1>
      <canvas width="640" height="640" ref={canvasRef} id="canvas" />
    </div>
  );
};

export default Image3DEffect;
