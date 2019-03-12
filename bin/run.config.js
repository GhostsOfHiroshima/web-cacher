module.exports = {
    apps: [{
	name: "web-cacher",
        script: "www",
        watch: "../",
        env: {
            NODE_ENV: "production"
        },
	env_production: {
            NODE_ENV: "production"
        },
	exec_mode: "cluster",
        instances: "max"          // max amount of instances
    }]
};

