import { registerApplication, start, addErrorHandler } from "single-spa";

function domElementGetter(id) {
  if (id) {
    return document.getElementById(id);
  }
}

registerApplication({
    name: 'productsNg',
    app: async () => await import("mfeMicroApp"),
    activeWhen: () => {
        return window.location.pathname.indexOf('/') === 0;
    },
    customProps: {
        domElement: domElementGetter('guest'),
        baseHref: '/',
        bypassUserContext: 'abcde'
    }
});

addErrorHandler(err => {
    console.log(err);
})

start({
    urlRerouteOnly: true,
})