declare module "language-detect" {
  type sync = (path: string) => string;
  export { sync };
}
