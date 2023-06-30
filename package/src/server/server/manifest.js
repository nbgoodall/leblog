const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.0def109a.js","app":"_app/immutable/entry/app.c916749c.js","imports":["_app/immutable/entry/start.0def109a.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/singletons.77edb8b8.js","_app/immutable/entry/app.c916749c.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.7cf2deec.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-47264315.js'),
			() => import('./chunks/1-01ba3b00.js')
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
