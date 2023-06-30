import { c as create_ssr_component, e as escape } from './ssr-7369fb3e.js';

let a = 123;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { b = 12 } = $$props;
  if ($$props.b === void 0 && $$bindings.b && b !== void 0)
    $$bindings.b(b);
  return `${escape(a)} + 12`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-7f9c4b96.js.map
