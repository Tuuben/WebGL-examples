/* Declare glsl file type to be able to import glsl files */
declare module '*.glsl' {
  const value: string;
  export default value;
}
