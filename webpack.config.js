export const module = {
  rules: [
    {
      test: /\.([jt]sx?)?$/,
      use: "swc-loader",
      exclude: /node_modules/
    }
  ]
}