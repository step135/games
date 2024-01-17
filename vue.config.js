module.exports = {
    publicPath: "./",
    outputDir: "./team",
    chainWebpack: (config) => {
        config.optimization.minimizer("terser").tap((args) => {
            args[0].terserOptions.compress = { drop_console: true };
            args[0].terserOptions.output = { comments: false, beautify: false };
            return args;
        });
    },
};
