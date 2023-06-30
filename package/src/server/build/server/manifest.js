const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.0c80257f.js","app":"_app/immutable/entry/app.15f51524.js","imports":["_app/immutable/entry/start.0c80257f.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/singletons.8b4f221b.js","_app/immutable/entry/app.15f51524.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.7cf2deec.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-47264315.js'),
			() => import('./chunks/1-6a88b8b2.js'),
			() => import('./chunks/2-78922b77.js'),
			() => import('./chunks/3-3ba87bc3.js')
		],
		routes: [
			{
				id: "/leblog",
				pattern: /^\/leblog\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
