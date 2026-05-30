(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))k(p);new MutationObserver(p=>{for(const N of p)if(N.type==="childList")for(const _ of N.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&k(_)}).observe(document,{childList:!0,subtree:!0});function d(p){const N={};return p.integrity&&(N.integrity=p.integrity),p.referrerPolicy&&(N.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?N.credentials="include":p.crossOrigin==="anonymous"?N.credentials="omit":N.credentials="same-origin",N}function k(p){if(p.ep)return;p.ep=!0;const N=d(p);fetch(p.href,N)}})();function tp(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var cl={exports:{}},Zo={},pl={exports:{}},fe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sc;function Zu(){if(Sc)return fe;Sc=1;var l=Symbol.for("react.element"),u=Symbol.for("react.portal"),d=Symbol.for("react.fragment"),k=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),N=Symbol.for("react.provider"),_=Symbol.for("react.context"),g=Symbol.for("react.forward_ref"),C=Symbol.for("react.suspense"),z=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),b=Symbol.iterator;function x(S){return S===null||typeof S!="object"?null:(S=b&&S[b]||S["@@iterator"],typeof S=="function"?S:null)}var v={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},c=Object.assign,h={};function m(S,B,ce){this.props=S,this.context=B,this.refs=h,this.updater=ce||v}m.prototype.isReactComponent={},m.prototype.setState=function(S,B){if(typeof S!="object"&&typeof S!="function"&&S!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,S,B,"setState")},m.prototype.forceUpdate=function(S){this.updater.enqueueForceUpdate(this,S,"forceUpdate")};function L(){}L.prototype=m.prototype;function T(S,B,ce){this.props=S,this.context=B,this.refs=h,this.updater=ce||v}var H=T.prototype=new L;H.constructor=T,c(H,m.prototype),H.isPureReactComponent=!0;var j=Array.isArray,M=Object.prototype.hasOwnProperty,F={current:null},X={key:!0,ref:!0,__self:!0,__source:!0};function G(S,B,ce){var me,he={},ge=null,we=null;if(B!=null)for(me in B.ref!==void 0&&(we=B.ref),B.key!==void 0&&(ge=""+B.key),B)M.call(B,me)&&!X.hasOwnProperty(me)&&(he[me]=B[me]);var ye=arguments.length-2;if(ye===1)he.children=ce;else if(1<ye){for(var Se=Array(ye),Ye=0;Ye<ye;Ye++)Se[Ye]=arguments[Ye+2];he.children=Se}if(S&&S.defaultProps)for(me in ye=S.defaultProps,ye)he[me]===void 0&&(he[me]=ye[me]);return{$$typeof:l,type:S,key:ge,ref:we,props:he,_owner:F.current}}function be(S,B){return{$$typeof:l,type:S.type,key:B,ref:S.ref,props:S.props,_owner:S._owner}}function Ie(S){return typeof S=="object"&&S!==null&&S.$$typeof===l}function pe(S){var B={"=":"=0",":":"=2"};return"$"+S.replace(/[=:]/g,function(ce){return B[ce]})}var He=/\/+/g;function Fe(S,B){return typeof S=="object"&&S!==null&&S.key!=null?pe(""+S.key):B.toString(36)}function te(S,B,ce,me,he){var ge=typeof S;(ge==="undefined"||ge==="boolean")&&(S=null);var we=!1;if(S===null)we=!0;else switch(ge){case"string":case"number":we=!0;break;case"object":switch(S.$$typeof){case l:case u:we=!0}}if(we)return we=S,he=he(we),S=me===""?"."+Fe(we,0):me,j(he)?(ce="",S!=null&&(ce=S.replace(He,"$&/")+"/"),te(he,B,ce,"",function(Ye){return Ye})):he!=null&&(Ie(he)&&(he=be(he,ce+(!he.key||we&&we.key===he.key?"":(""+he.key).replace(He,"$&/")+"/")+S)),B.push(he)),1;if(we=0,me=me===""?".":me+":",j(S))for(var ye=0;ye<S.length;ye++){ge=S[ye];var Se=me+Fe(ge,ye);we+=te(ge,B,ce,Se,he)}else if(Se=x(S),typeof Se=="function")for(S=Se.call(S),ye=0;!(ge=S.next()).done;)ge=ge.value,Se=me+Fe(ge,ye++),we+=te(ge,B,ce,Se,he);else if(ge==="object")throw B=String(S),Error("Objects are not valid as a React child (found: "+(B==="[object Object]"?"object with keys {"+Object.keys(S).join(", ")+"}":B)+"). If you meant to render a collection of children, use an array instead.");return we}function Qe(S,B,ce){if(S==null)return S;var me=[],he=0;return te(S,me,"","",function(ge){return B.call(ce,ge,he++)}),me}function ue(S){if(S._status===-1){var B=S._result;B=B(),B.then(function(ce){(S._status===0||S._status===-1)&&(S._status=1,S._result=ce)},function(ce){(S._status===0||S._status===-1)&&(S._status=2,S._result=ce)}),S._status===-1&&(S._status=0,S._result=B)}if(S._status===1)return S._result.default;throw S._result}var ze={current:null},$={transition:null},ae={ReactCurrentDispatcher:ze,ReactCurrentBatchConfig:$,ReactCurrentOwner:F};function Y(){throw Error("act(...) is not supported in production builds of React.")}return fe.Children={map:Qe,forEach:function(S,B,ce){Qe(S,function(){B.apply(this,arguments)},ce)},count:function(S){var B=0;return Qe(S,function(){B++}),B},toArray:function(S){return Qe(S,function(B){return B})||[]},only:function(S){if(!Ie(S))throw Error("React.Children.only expected to receive a single React element child.");return S}},fe.Component=m,fe.Fragment=d,fe.Profiler=p,fe.PureComponent=T,fe.StrictMode=k,fe.Suspense=C,fe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ae,fe.act=Y,fe.cloneElement=function(S,B,ce){if(S==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+S+".");var me=c({},S.props),he=S.key,ge=S.ref,we=S._owner;if(B!=null){if(B.ref!==void 0&&(ge=B.ref,we=F.current),B.key!==void 0&&(he=""+B.key),S.type&&S.type.defaultProps)var ye=S.type.defaultProps;for(Se in B)M.call(B,Se)&&!X.hasOwnProperty(Se)&&(me[Se]=B[Se]===void 0&&ye!==void 0?ye[Se]:B[Se])}var Se=arguments.length-2;if(Se===1)me.children=ce;else if(1<Se){ye=Array(Se);for(var Ye=0;Ye<Se;Ye++)ye[Ye]=arguments[Ye+2];me.children=ye}return{$$typeof:l,type:S.type,key:he,ref:ge,props:me,_owner:we}},fe.createContext=function(S){return S={$$typeof:_,_currentValue:S,_currentValue2:S,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},S.Provider={$$typeof:N,_context:S},S.Consumer=S},fe.createElement=G,fe.createFactory=function(S){var B=G.bind(null,S);return B.type=S,B},fe.createRef=function(){return{current:null}},fe.forwardRef=function(S){return{$$typeof:g,render:S}},fe.isValidElement=Ie,fe.lazy=function(S){return{$$typeof:E,_payload:{_status:-1,_result:S},_init:ue}},fe.memo=function(S,B){return{$$typeof:z,type:S,compare:B===void 0?null:B}},fe.startTransition=function(S){var B=$.transition;$.transition={};try{S()}finally{$.transition=B}},fe.unstable_act=Y,fe.useCallback=function(S,B){return ze.current.useCallback(S,B)},fe.useContext=function(S){return ze.current.useContext(S)},fe.useDebugValue=function(){},fe.useDeferredValue=function(S){return ze.current.useDeferredValue(S)},fe.useEffect=function(S,B){return ze.current.useEffect(S,B)},fe.useId=function(){return ze.current.useId()},fe.useImperativeHandle=function(S,B,ce){return ze.current.useImperativeHandle(S,B,ce)},fe.useInsertionEffect=function(S,B){return ze.current.useInsertionEffect(S,B)},fe.useLayoutEffect=function(S,B){return ze.current.useLayoutEffect(S,B)},fe.useMemo=function(S,B){return ze.current.useMemo(S,B)},fe.useReducer=function(S,B,ce){return ze.current.useReducer(S,B,ce)},fe.useRef=function(S){return ze.current.useRef(S)},fe.useState=function(S){return ze.current.useState(S)},fe.useSyncExternalStore=function(S,B,ce){return ze.current.useSyncExternalStore(S,B,ce)},fe.useTransition=function(){return ze.current.useTransition()},fe.version="18.3.1",fe}var kc;function Fl(){return kc||(kc=1,pl.exports=Zu()),pl.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cc;function em(){if(Cc)return Zo;Cc=1;var l=Fl(),u=Symbol.for("react.element"),d=Symbol.for("react.fragment"),k=Object.prototype.hasOwnProperty,p=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,N={key:!0,ref:!0,__self:!0,__source:!0};function _(g,C,z){var E,b={},x=null,v=null;z!==void 0&&(x=""+z),C.key!==void 0&&(x=""+C.key),C.ref!==void 0&&(v=C.ref);for(E in C)k.call(C,E)&&!N.hasOwnProperty(E)&&(b[E]=C[E]);if(g&&g.defaultProps)for(E in C=g.defaultProps,C)b[E]===void 0&&(b[E]=C[E]);return{$$typeof:u,type:g,key:x,ref:v,props:b,_owner:p.current}}return Zo.Fragment=d,Zo.jsx=_,Zo.jsxs=_,Zo}var Ec;function tm(){return Ec||(Ec=1,cl.exports=em()),cl.exports}var n=tm(),D=Fl();const oe=tp(D);var gi={},ul={exports:{}},dt={},ml={exports:{}},fl={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _c;function nm(){return _c||(_c=1,(function(l){function u($,ae){var Y=$.length;$.push(ae);e:for(;0<Y;){var S=Y-1>>>1,B=$[S];if(0<p(B,ae))$[S]=ae,$[Y]=B,Y=S;else break e}}function d($){return $.length===0?null:$[0]}function k($){if($.length===0)return null;var ae=$[0],Y=$.pop();if(Y!==ae){$[0]=Y;e:for(var S=0,B=$.length,ce=B>>>1;S<ce;){var me=2*(S+1)-1,he=$[me],ge=me+1,we=$[ge];if(0>p(he,Y))ge<B&&0>p(we,he)?($[S]=we,$[ge]=Y,S=ge):($[S]=he,$[me]=Y,S=me);else if(ge<B&&0>p(we,Y))$[S]=we,$[ge]=Y,S=ge;else break e}}return ae}function p($,ae){var Y=$.sortIndex-ae.sortIndex;return Y!==0?Y:$.id-ae.id}if(typeof performance=="object"&&typeof performance.now=="function"){var N=performance;l.unstable_now=function(){return N.now()}}else{var _=Date,g=_.now();l.unstable_now=function(){return _.now()-g}}var C=[],z=[],E=1,b=null,x=3,v=!1,c=!1,h=!1,m=typeof setTimeout=="function"?setTimeout:null,L=typeof clearTimeout=="function"?clearTimeout:null,T=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function H($){for(var ae=d(z);ae!==null;){if(ae.callback===null)k(z);else if(ae.startTime<=$)k(z),ae.sortIndex=ae.expirationTime,u(C,ae);else break;ae=d(z)}}function j($){if(h=!1,H($),!c)if(d(C)!==null)c=!0,ue(M);else{var ae=d(z);ae!==null&&ze(j,ae.startTime-$)}}function M($,ae){c=!1,h&&(h=!1,L(G),G=-1),v=!0;var Y=x;try{for(H(ae),b=d(C);b!==null&&(!(b.expirationTime>ae)||$&&!pe());){var S=b.callback;if(typeof S=="function"){b.callback=null,x=b.priorityLevel;var B=S(b.expirationTime<=ae);ae=l.unstable_now(),typeof B=="function"?b.callback=B:b===d(C)&&k(C),H(ae)}else k(C);b=d(C)}if(b!==null)var ce=!0;else{var me=d(z);me!==null&&ze(j,me.startTime-ae),ce=!1}return ce}finally{b=null,x=Y,v=!1}}var F=!1,X=null,G=-1,be=5,Ie=-1;function pe(){return!(l.unstable_now()-Ie<be)}function He(){if(X!==null){var $=l.unstable_now();Ie=$;var ae=!0;try{ae=X(!0,$)}finally{ae?Fe():(F=!1,X=null)}}else F=!1}var Fe;if(typeof T=="function")Fe=function(){T(He)};else if(typeof MessageChannel<"u"){var te=new MessageChannel,Qe=te.port2;te.port1.onmessage=He,Fe=function(){Qe.postMessage(null)}}else Fe=function(){m(He,0)};function ue($){X=$,F||(F=!0,Fe())}function ze($,ae){G=m(function(){$(l.unstable_now())},ae)}l.unstable_IdlePriority=5,l.unstable_ImmediatePriority=1,l.unstable_LowPriority=4,l.unstable_NormalPriority=3,l.unstable_Profiling=null,l.unstable_UserBlockingPriority=2,l.unstable_cancelCallback=function($){$.callback=null},l.unstable_continueExecution=function(){c||v||(c=!0,ue(M))},l.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):be=0<$?Math.floor(1e3/$):5},l.unstable_getCurrentPriorityLevel=function(){return x},l.unstable_getFirstCallbackNode=function(){return d(C)},l.unstable_next=function($){switch(x){case 1:case 2:case 3:var ae=3;break;default:ae=x}var Y=x;x=ae;try{return $()}finally{x=Y}},l.unstable_pauseExecution=function(){},l.unstable_requestPaint=function(){},l.unstable_runWithPriority=function($,ae){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var Y=x;x=$;try{return ae()}finally{x=Y}},l.unstable_scheduleCallback=function($,ae,Y){var S=l.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?S+Y:S):Y=S,$){case 1:var B=-1;break;case 2:B=250;break;case 5:B=1073741823;break;case 4:B=1e4;break;default:B=5e3}return B=Y+B,$={id:E++,callback:ae,priorityLevel:$,startTime:Y,expirationTime:B,sortIndex:-1},Y>S?($.sortIndex=Y,u(z,$),d(C)===null&&$===d(z)&&(h?(L(G),G=-1):h=!0,ze(j,Y-S))):($.sortIndex=B,u(C,$),c||v||(c=!0,ue(M))),$},l.unstable_shouldYield=pe,l.unstable_wrapCallback=function($){var ae=x;return function(){var Y=x;x=ae;try{return $.apply(this,arguments)}finally{x=Y}}}})(fl)),fl}var zc;function om(){return zc||(zc=1,ml.exports=nm()),ml.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pc;function rm(){if(Pc)return dt;Pc=1;var l=Fl(),u=om();function d(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,o=1;o<arguments.length;o++)t+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var k=new Set,p={};function N(e,t){_(e,t),_(e+"Capture",t)}function _(e,t){for(p[e]=t,e=0;e<t.length;e++)k.add(t[e])}var g=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),C=Object.prototype.hasOwnProperty,z=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,E={},b={};function x(e){return C.call(b,e)?!0:C.call(E,e)?!1:z.test(e)?b[e]=!0:(E[e]=!0,!1)}function v(e,t,o,r){if(o!==null&&o.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:o!==null?!o.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function c(e,t,o,r){if(t===null||typeof t>"u"||v(e,t,o,r))return!0;if(r)return!1;if(o!==null)switch(o.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function h(e,t,o,r,i,a,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=o,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=s}var m={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){m[e]=new h(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];m[t]=new h(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){m[e]=new h(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){m[e]=new h(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){m[e]=new h(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){m[e]=new h(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){m[e]=new h(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){m[e]=new h(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){m[e]=new h(e,5,!1,e.toLowerCase(),null,!1,!1)});var L=/[\-:]([a-z])/g;function T(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(L,T);m[t]=new h(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(L,T);m[t]=new h(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(L,T);m[t]=new h(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){m[e]=new h(e,1,!1,e.toLowerCase(),null,!1,!1)}),m.xlinkHref=new h("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){m[e]=new h(e,1,!1,e.toLowerCase(),null,!0,!0)});function H(e,t,o,r){var i=m.hasOwnProperty(t)?m[t]:null;(i!==null?i.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(c(t,o,i,r)&&(o=null),r||i===null?x(t)&&(o===null?e.removeAttribute(t):e.setAttribute(t,""+o)):i.mustUseProperty?e[i.propertyName]=o===null?i.type===3?!1:"":o:(t=i.attributeName,r=i.attributeNamespace,o===null?e.removeAttribute(t):(i=i.type,o=i===3||i===4&&o===!0?"":""+o,r?e.setAttributeNS(r,t,o):e.setAttribute(t,o))))}var j=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,M=Symbol.for("react.element"),F=Symbol.for("react.portal"),X=Symbol.for("react.fragment"),G=Symbol.for("react.strict_mode"),be=Symbol.for("react.profiler"),Ie=Symbol.for("react.provider"),pe=Symbol.for("react.context"),He=Symbol.for("react.forward_ref"),Fe=Symbol.for("react.suspense"),te=Symbol.for("react.suspense_list"),Qe=Symbol.for("react.memo"),ue=Symbol.for("react.lazy"),ze=Symbol.for("react.offscreen"),$=Symbol.iterator;function ae(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var Y=Object.assign,S;function B(e){if(S===void 0)try{throw Error()}catch(o){var t=o.stack.trim().match(/\n( *(at )?)/);S=t&&t[1]||""}return`
`+S+e}var ce=!1;function me(e,t){if(!e||ce)return"";ce=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(O){var r=O}Reflect.construct(e,[],t)}else{try{t.call()}catch(O){r=O}e.call(t.prototype)}else{try{throw Error()}catch(O){r=O}e()}}catch(O){if(O&&r&&typeof O.stack=="string"){for(var i=O.stack.split(`
`),a=r.stack.split(`
`),s=i.length-1,f=a.length-1;1<=s&&0<=f&&i[s]!==a[f];)f--;for(;1<=s&&0<=f;s--,f--)if(i[s]!==a[f]){if(s!==1||f!==1)do if(s--,f--,0>f||i[s]!==a[f]){var y=`
`+i[s].replace(" at new "," at ");return e.displayName&&y.includes("<anonymous>")&&(y=y.replace("<anonymous>",e.displayName)),y}while(1<=s&&0<=f);break}}}finally{ce=!1,Error.prepareStackTrace=o}return(e=e?e.displayName||e.name:"")?B(e):""}function he(e){switch(e.tag){case 5:return B(e.type);case 16:return B("Lazy");case 13:return B("Suspense");case 19:return B("SuspenseList");case 0:case 2:case 15:return e=me(e.type,!1),e;case 11:return e=me(e.type.render,!1),e;case 1:return e=me(e.type,!0),e;default:return""}}function ge(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case X:return"Fragment";case F:return"Portal";case be:return"Profiler";case G:return"StrictMode";case Fe:return"Suspense";case te:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case pe:return(e.displayName||"Context")+".Consumer";case Ie:return(e._context.displayName||"Context")+".Provider";case He:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Qe:return t=e.displayName||null,t!==null?t:ge(e.type)||"Memo";case ue:t=e._payload,e=e._init;try{return ge(e(t))}catch{}}return null}function we(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ge(t);case 8:return t===G?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function ye(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Se(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ye(e){var t=Se(e)?"checked":"value",o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var i=o.get,a=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(s){r=""+s,a.call(this,s)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return r},setValue:function(s){r=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Rn(e){e._valueTracker||(e._valueTracker=Ye(e))}function or(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var o=t.getValue(),r="";return e&&(r=Se(e)?e.checked?"true":"false":e.value),e=r,e!==o?(t.setValue(e),!0):!1}function Jt(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function co(e,t){var o=t.checked;return Y({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??e._wrapperState.initialChecked})}function rr(e,t){var o=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;o=ye(t.value!=null?t.value:o),e._wrapperState={initialChecked:r,initialValue:o,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function An(e,t){t=t.checked,t!=null&&H(e,"checked",t,!1)}function po(e,t){An(e,t);var o=ye(t.value),r=t.type;if(o!=null)r==="number"?(o===0&&e.value===""||e.value!=o)&&(e.value=""+o):e.value!==""+o&&(e.value=""+o);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?uo(e,t.type,o):t.hasOwnProperty("defaultValue")&&uo(e,t.type,ye(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Et(e,t,o){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,o||t===e.value||(e.value=t),e.defaultValue=t}o=e.name,o!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,o!==""&&(e.name=o)}function uo(e,t,o){(t!=="number"||Jt(e.ownerDocument)!==e)&&(o==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+o&&(e.defaultValue=""+o))}var hn=Array.isArray;function Te(e,t,o,r){if(e=e.options,t){t={};for(var i=0;i<o.length;i++)t["$"+o[i]]=!0;for(o=0;o<e.length;o++)i=t.hasOwnProperty("$"+e[o].value),e[o].selected!==i&&(e[o].selected=i),i&&r&&(e[o].defaultSelected=!0)}else{for(o=""+ye(o),t=null,i=0;i<e.length;i++){if(e[i].value===o){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function mo(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(d(91));return Y({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function ir(e,t){var o=t.value;if(o==null){if(o=t.children,t=t.defaultValue,o!=null){if(t!=null)throw Error(d(92));if(hn(o)){if(1<o.length)throw Error(d(93));o=o[0]}t=o}t==null&&(t=""),o=t}e._wrapperState={initialValue:ye(o)}}function ar(e,t){var o=ye(t.value),r=ye(t.defaultValue);o!=null&&(o=""+o,o!==e.value&&(e.value=o),t.defaultValue==null&&e.defaultValue!==o&&(e.defaultValue=o)),r!=null&&(e.defaultValue=""+r)}function lr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function sr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function On(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?sr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var In,A=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,o,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,o,r,i)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(In=In||document.createElement("div"),In.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=In.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function I(e,t){if(t){var o=e.firstChild;if(o&&o===e.lastChild&&o.nodeType===3){o.nodeValue=t;return}}e.textContent=t}var ee={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},de=["Webkit","ms","Moz","O"];Object.keys(ee).forEach(function(e){de.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ee[t]=ee[e]})});function Ne(e,t,o){return t==null||typeof t=="boolean"||t===""?"":o||typeof t!="number"||t===0||ee.hasOwnProperty(e)&&ee[e]?(""+t).trim():t+"px"}function It(e,t){e=e.style;for(var o in t)if(t.hasOwnProperty(o)){var r=o.indexOf("--")===0,i=Ne(o,t[o],r);o==="float"&&(o="cssFloat"),r?e.setProperty(o,i):e[o]=i}}var Dn=Y({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function fo(e,t){if(t){if(Dn[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(d(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(d(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(d(61))}if(t.style!=null&&typeof t.style!="object")throw Error(d(62))}}function ho(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var le=null;function ke(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var go=null,Ht=null,Ln=null;function Bl(e){if(e=$o(e)){if(typeof go!="function")throw Error(d(280));var t=e.stateNode;t&&(t=Rr(t),go(e.stateNode,e.type,t))}}function Vl(e){Ht?Ln?Ln.push(e):Ln=[e]:Ht=e}function Ul(){if(Ht){var e=Ht,t=Ln;if(Ln=Ht=null,Bl(e),t)for(e=0;e<t.length;e++)Bl(t[e])}}function Jl(e,t){return e(t)}function Hl(){}var Ei=!1;function Wl(e,t,o){if(Ei)return e(t,o);Ei=!0;try{return Jl(e,t,o)}finally{Ei=!1,(Ht!==null||Ln!==null)&&(Hl(),Ul())}}function xo(e,t){var o=e.stateNode;if(o===null)return null;var r=Rr(o);if(r===null)return null;o=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(o&&typeof o!="function")throw Error(d(231,t,typeof o));return o}var _i=!1;if(g)try{var vo={};Object.defineProperty(vo,"passive",{get:function(){_i=!0}}),window.addEventListener("test",vo,vo),window.removeEventListener("test",vo,vo)}catch{_i=!1}function ip(e,t,o,r,i,a,s,f,y){var O=Array.prototype.slice.call(arguments,3);try{t.apply(o,O)}catch(U){this.onError(U)}}var yo=!1,dr=null,cr=!1,zi=null,ap={onError:function(e){yo=!0,dr=e}};function lp(e,t,o,r,i,a,s,f,y){yo=!1,dr=null,ip.apply(ap,arguments)}function sp(e,t,o,r,i,a,s,f,y){if(lp.apply(this,arguments),yo){if(yo){var O=dr;yo=!1,dr=null}else throw Error(d(198));cr||(cr=!0,zi=O)}}function gn(e){var t=e,o=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(o=t.return),e=t.return;while(e)}return t.tag===3?o:null}function Gl(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ql(e){if(gn(e)!==e)throw Error(d(188))}function dp(e){var t=e.alternate;if(!t){if(t=gn(e),t===null)throw Error(d(188));return t!==e?null:e}for(var o=e,r=t;;){var i=o.return;if(i===null)break;var a=i.alternate;if(a===null){if(r=i.return,r!==null){o=r;continue}break}if(i.child===a.child){for(a=i.child;a;){if(a===o)return Ql(i),e;if(a===r)return Ql(i),t;a=a.sibling}throw Error(d(188))}if(o.return!==r.return)o=i,r=a;else{for(var s=!1,f=i.child;f;){if(f===o){s=!0,o=i,r=a;break}if(f===r){s=!0,r=i,o=a;break}f=f.sibling}if(!s){for(f=a.child;f;){if(f===o){s=!0,o=a,r=i;break}if(f===r){s=!0,r=a,o=i;break}f=f.sibling}if(!s)throw Error(d(189))}}if(o.alternate!==r)throw Error(d(190))}if(o.tag!==3)throw Error(d(188));return o.stateNode.current===o?e:t}function Yl(e){return e=dp(e),e!==null?Kl(e):null}function Kl(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Kl(e);if(t!==null)return t;e=e.sibling}return null}var ql=u.unstable_scheduleCallback,Xl=u.unstable_cancelCallback,cp=u.unstable_shouldYield,pp=u.unstable_requestPaint,De=u.unstable_now,up=u.unstable_getCurrentPriorityLevel,Pi=u.unstable_ImmediatePriority,Zl=u.unstable_UserBlockingPriority,pr=u.unstable_NormalPriority,mp=u.unstable_LowPriority,es=u.unstable_IdlePriority,ur=null,_t=null;function fp(e){if(_t&&typeof _t.onCommitFiberRoot=="function")try{_t.onCommitFiberRoot(ur,e,void 0,(e.current.flags&128)===128)}catch{}}var bt=Math.clz32?Math.clz32:xp,hp=Math.log,gp=Math.LN2;function xp(e){return e>>>=0,e===0?32:31-(hp(e)/gp|0)|0}var mr=64,fr=4194304;function bo(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function hr(e,t){var o=e.pendingLanes;if(o===0)return 0;var r=0,i=e.suspendedLanes,a=e.pingedLanes,s=o&268435455;if(s!==0){var f=s&~i;f!==0?r=bo(f):(a&=s,a!==0&&(r=bo(a)))}else s=o&~i,s!==0?r=bo(s):a!==0&&(r=bo(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&i)===0&&(i=r&-r,a=t&-t,i>=a||i===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=o&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)o=31-bt(t),i=1<<o,r|=e[o],t&=~i;return r}function vp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function yp(e,t){for(var o=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes;0<a;){var s=31-bt(a),f=1<<s,y=i[s];y===-1?((f&o)===0||(f&r)!==0)&&(i[s]=vp(f,t)):y<=t&&(e.expiredLanes|=f),a&=~f}}function Ri(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ts(){var e=mr;return mr<<=1,(mr&4194240)===0&&(mr=64),e}function Ai(e){for(var t=[],o=0;31>o;o++)t.push(e);return t}function wo(e,t,o){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-bt(t),e[t]=o}function bp(e,t){var o=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<o;){var i=31-bt(o),a=1<<i;t[i]=0,r[i]=-1,e[i]=-1,o&=~a}}function Oi(e,t){var o=e.entangledLanes|=t;for(e=e.entanglements;o;){var r=31-bt(o),i=1<<r;i&t|e[r]&t&&(e[r]|=t),o&=~i}}var je=0;function ns(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var os,Ii,rs,is,as,Di=!1,gr=[],Wt=null,Gt=null,Qt=null,jo=new Map,No=new Map,Yt=[],wp="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ls(e,t){switch(e){case"focusin":case"focusout":Wt=null;break;case"dragenter":case"dragleave":Gt=null;break;case"mouseover":case"mouseout":Qt=null;break;case"pointerover":case"pointerout":jo.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":No.delete(t.pointerId)}}function So(e,t,o,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:o,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=$o(t),t!==null&&Ii(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function jp(e,t,o,r,i){switch(t){case"focusin":return Wt=So(Wt,e,t,o,r,i),!0;case"dragenter":return Gt=So(Gt,e,t,o,r,i),!0;case"mouseover":return Qt=So(Qt,e,t,o,r,i),!0;case"pointerover":var a=i.pointerId;return jo.set(a,So(jo.get(a)||null,e,t,o,r,i)),!0;case"gotpointercapture":return a=i.pointerId,No.set(a,So(No.get(a)||null,e,t,o,r,i)),!0}return!1}function ss(e){var t=xn(e.target);if(t!==null){var o=gn(t);if(o!==null){if(t=o.tag,t===13){if(t=Gl(o),t!==null){e.blockedOn=t,as(e.priority,function(){rs(o)});return}}else if(t===3&&o.stateNode.current.memoizedState.isDehydrated){e.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}e.blockedOn=null}function xr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var o=Ti(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(o===null){o=e.nativeEvent;var r=new o.constructor(o.type,o);le=r,o.target.dispatchEvent(r),le=null}else return t=$o(o),t!==null&&Ii(t),e.blockedOn=o,!1;t.shift()}return!0}function ds(e,t,o){xr(e)&&o.delete(t)}function Np(){Di=!1,Wt!==null&&xr(Wt)&&(Wt=null),Gt!==null&&xr(Gt)&&(Gt=null),Qt!==null&&xr(Qt)&&(Qt=null),jo.forEach(ds),No.forEach(ds)}function ko(e,t){e.blockedOn===t&&(e.blockedOn=null,Di||(Di=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Np)))}function Co(e){function t(i){return ko(i,e)}if(0<gr.length){ko(gr[0],e);for(var o=1;o<gr.length;o++){var r=gr[o];r.blockedOn===e&&(r.blockedOn=null)}}for(Wt!==null&&ko(Wt,e),Gt!==null&&ko(Gt,e),Qt!==null&&ko(Qt,e),jo.forEach(t),No.forEach(t),o=0;o<Yt.length;o++)r=Yt[o],r.blockedOn===e&&(r.blockedOn=null);for(;0<Yt.length&&(o=Yt[0],o.blockedOn===null);)ss(o),o.blockedOn===null&&Yt.shift()}var Tn=j.ReactCurrentBatchConfig,vr=!0;function Sp(e,t,o,r){var i=je,a=Tn.transition;Tn.transition=null;try{je=1,Li(e,t,o,r)}finally{je=i,Tn.transition=a}}function kp(e,t,o,r){var i=je,a=Tn.transition;Tn.transition=null;try{je=4,Li(e,t,o,r)}finally{je=i,Tn.transition=a}}function Li(e,t,o,r){if(vr){var i=Ti(e,t,o,r);if(i===null)ea(e,t,r,yr,o),ls(e,r);else if(jp(i,e,t,o,r))r.stopPropagation();else if(ls(e,r),t&4&&-1<wp.indexOf(e)){for(;i!==null;){var a=$o(i);if(a!==null&&os(a),a=Ti(e,t,o,r),a===null&&ea(e,t,r,yr,o),a===i)break;i=a}i!==null&&r.stopPropagation()}else ea(e,t,r,null,o)}}var yr=null;function Ti(e,t,o,r){if(yr=null,e=ke(r),e=xn(e),e!==null)if(t=gn(e),t===null)e=null;else if(o=t.tag,o===13){if(e=Gl(t),e!==null)return e;e=null}else if(o===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return yr=e,null}function cs(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(up()){case Pi:return 1;case Zl:return 4;case pr:case mp:return 16;case es:return 536870912;default:return 16}default:return 16}}var Kt=null,$i=null,br=null;function ps(){if(br)return br;var e,t=$i,o=t.length,r,i="value"in Kt?Kt.value:Kt.textContent,a=i.length;for(e=0;e<o&&t[e]===i[e];e++);var s=o-e;for(r=1;r<=s&&t[o-r]===i[a-r];r++);return br=i.slice(e,1<r?1-r:void 0)}function wr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function jr(){return!0}function us(){return!1}function ct(e){function t(o,r,i,a,s){this._reactName=o,this._targetInst=i,this.type=r,this.nativeEvent=a,this.target=s,this.currentTarget=null;for(var f in e)e.hasOwnProperty(f)&&(o=e[f],this[f]=o?o(a):a[f]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?jr:us,this.isPropagationStopped=us,this}return Y(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=jr)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=jr)},persist:function(){},isPersistent:jr}),t}var $n={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Fi=ct($n),Eo=Y({},$n,{view:0,detail:0}),Cp=ct(Eo),Mi,Bi,_o,Nr=Y({},Eo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ui,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==_o&&(_o&&e.type==="mousemove"?(Mi=e.screenX-_o.screenX,Bi=e.screenY-_o.screenY):Bi=Mi=0,_o=e),Mi)},movementY:function(e){return"movementY"in e?e.movementY:Bi}}),ms=ct(Nr),Ep=Y({},Nr,{dataTransfer:0}),_p=ct(Ep),zp=Y({},Eo,{relatedTarget:0}),Vi=ct(zp),Pp=Y({},$n,{animationName:0,elapsedTime:0,pseudoElement:0}),Rp=ct(Pp),Ap=Y({},$n,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Op=ct(Ap),Ip=Y({},$n,{data:0}),fs=ct(Ip),Dp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Lp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Tp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function $p(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Tp[e])?!!t[e]:!1}function Ui(){return $p}var Fp=Y({},Eo,{key:function(e){if(e.key){var t=Dp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=wr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Lp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ui,charCode:function(e){return e.type==="keypress"?wr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?wr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Mp=ct(Fp),Bp=Y({},Nr,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hs=ct(Bp),Vp=Y({},Eo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ui}),Up=ct(Vp),Jp=Y({},$n,{propertyName:0,elapsedTime:0,pseudoElement:0}),Hp=ct(Jp),Wp=Y({},Nr,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Gp=ct(Wp),Qp=[9,13,27,32],Ji=g&&"CompositionEvent"in window,zo=null;g&&"documentMode"in document&&(zo=document.documentMode);var Yp=g&&"TextEvent"in window&&!zo,gs=g&&(!Ji||zo&&8<zo&&11>=zo),xs=" ",vs=!1;function ys(e,t){switch(e){case"keyup":return Qp.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function bs(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Fn=!1;function Kp(e,t){switch(e){case"compositionend":return bs(t);case"keypress":return t.which!==32?null:(vs=!0,xs);case"textInput":return e=t.data,e===xs&&vs?null:e;default:return null}}function qp(e,t){if(Fn)return e==="compositionend"||!Ji&&ys(e,t)?(e=ps(),br=$i=Kt=null,Fn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return gs&&t.locale!=="ko"?null:t.data;default:return null}}var Xp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ws(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Xp[e.type]:t==="textarea"}function js(e,t,o,r){Vl(r),t=_r(t,"onChange"),0<t.length&&(o=new Fi("onChange","change",null,o,r),e.push({event:o,listeners:t}))}var Po=null,Ro=null;function Zp(e){Ms(e,0)}function Sr(e){var t=Jn(e);if(or(t))return e}function eu(e,t){if(e==="change")return t}var Ns=!1;if(g){var Hi;if(g){var Wi="oninput"in document;if(!Wi){var Ss=document.createElement("div");Ss.setAttribute("oninput","return;"),Wi=typeof Ss.oninput=="function"}Hi=Wi}else Hi=!1;Ns=Hi&&(!document.documentMode||9<document.documentMode)}function ks(){Po&&(Po.detachEvent("onpropertychange",Cs),Ro=Po=null)}function Cs(e){if(e.propertyName==="value"&&Sr(Ro)){var t=[];js(t,Ro,e,ke(e)),Wl(Zp,t)}}function tu(e,t,o){e==="focusin"?(ks(),Po=t,Ro=o,Po.attachEvent("onpropertychange",Cs)):e==="focusout"&&ks()}function nu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Sr(Ro)}function ou(e,t){if(e==="click")return Sr(t)}function ru(e,t){if(e==="input"||e==="change")return Sr(t)}function iu(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var wt=typeof Object.is=="function"?Object.is:iu;function Ao(e,t){if(wt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var o=Object.keys(e),r=Object.keys(t);if(o.length!==r.length)return!1;for(r=0;r<o.length;r++){var i=o[r];if(!C.call(t,i)||!wt(e[i],t[i]))return!1}return!0}function Es(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function _s(e,t){var o=Es(e);e=0;for(var r;o;){if(o.nodeType===3){if(r=e+o.textContent.length,e<=t&&r>=t)return{node:o,offset:t-e};e=r}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=Es(o)}}function zs(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?zs(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ps(){for(var e=window,t=Jt();t instanceof e.HTMLIFrameElement;){try{var o=typeof t.contentWindow.location.href=="string"}catch{o=!1}if(o)e=t.contentWindow;else break;t=Jt(e.document)}return t}function Gi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function au(e){var t=Ps(),o=e.focusedElem,r=e.selectionRange;if(t!==o&&o&&o.ownerDocument&&zs(o.ownerDocument.documentElement,o)){if(r!==null&&Gi(o)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in o)o.selectionStart=t,o.selectionEnd=Math.min(e,o.value.length);else if(e=(t=o.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=o.textContent.length,a=Math.min(r.start,i);r=r.end===void 0?a:Math.min(r.end,i),!e.extend&&a>r&&(i=r,r=a,a=i),i=_s(o,a);var s=_s(o,r);i&&s&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=o;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<t.length;o++)e=t[o],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var lu=g&&"documentMode"in document&&11>=document.documentMode,Mn=null,Qi=null,Oo=null,Yi=!1;function Rs(e,t,o){var r=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Yi||Mn==null||Mn!==Jt(r)||(r=Mn,"selectionStart"in r&&Gi(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Oo&&Ao(Oo,r)||(Oo=r,r=_r(Qi,"onSelect"),0<r.length&&(t=new Fi("onSelect","select",null,t,o),e.push({event:t,listeners:r}),t.target=Mn)))}function kr(e,t){var o={};return o[e.toLowerCase()]=t.toLowerCase(),o["Webkit"+e]="webkit"+t,o["Moz"+e]="moz"+t,o}var Bn={animationend:kr("Animation","AnimationEnd"),animationiteration:kr("Animation","AnimationIteration"),animationstart:kr("Animation","AnimationStart"),transitionend:kr("Transition","TransitionEnd")},Ki={},As={};g&&(As=document.createElement("div").style,"AnimationEvent"in window||(delete Bn.animationend.animation,delete Bn.animationiteration.animation,delete Bn.animationstart.animation),"TransitionEvent"in window||delete Bn.transitionend.transition);function Cr(e){if(Ki[e])return Ki[e];if(!Bn[e])return e;var t=Bn[e],o;for(o in t)if(t.hasOwnProperty(o)&&o in As)return Ki[e]=t[o];return e}var Os=Cr("animationend"),Is=Cr("animationiteration"),Ds=Cr("animationstart"),Ls=Cr("transitionend"),Ts=new Map,$s="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function qt(e,t){Ts.set(e,t),N(t,[e])}for(var qi=0;qi<$s.length;qi++){var Xi=$s[qi],su=Xi.toLowerCase(),du=Xi[0].toUpperCase()+Xi.slice(1);qt(su,"on"+du)}qt(Os,"onAnimationEnd"),qt(Is,"onAnimationIteration"),qt(Ds,"onAnimationStart"),qt("dblclick","onDoubleClick"),qt("focusin","onFocus"),qt("focusout","onBlur"),qt(Ls,"onTransitionEnd"),_("onMouseEnter",["mouseout","mouseover"]),_("onMouseLeave",["mouseout","mouseover"]),_("onPointerEnter",["pointerout","pointerover"]),_("onPointerLeave",["pointerout","pointerover"]),N("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),N("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),N("onBeforeInput",["compositionend","keypress","textInput","paste"]),N("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),N("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),N("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Io="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),cu=new Set("cancel close invalid load scroll toggle".split(" ").concat(Io));function Fs(e,t,o){var r=e.type||"unknown-event";e.currentTarget=o,sp(r,t,void 0,e),e.currentTarget=null}function Ms(e,t){t=(t&4)!==0;for(var o=0;o<e.length;o++){var r=e[o],i=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var s=r.length-1;0<=s;s--){var f=r[s],y=f.instance,O=f.currentTarget;if(f=f.listener,y!==a&&i.isPropagationStopped())break e;Fs(i,f,O),a=y}else for(s=0;s<r.length;s++){if(f=r[s],y=f.instance,O=f.currentTarget,f=f.listener,y!==a&&i.isPropagationStopped())break e;Fs(i,f,O),a=y}}}if(cr)throw e=zi,cr=!1,zi=null,e}function Ee(e,t){var o=t[aa];o===void 0&&(o=t[aa]=new Set);var r=e+"__bubble";o.has(r)||(Bs(t,e,2,!1),o.add(r))}function Zi(e,t,o){var r=0;t&&(r|=4),Bs(o,e,r,t)}var Er="_reactListening"+Math.random().toString(36).slice(2);function Do(e){if(!e[Er]){e[Er]=!0,k.forEach(function(o){o!=="selectionchange"&&(cu.has(o)||Zi(o,!1,e),Zi(o,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Er]||(t[Er]=!0,Zi("selectionchange",!1,t))}}function Bs(e,t,o,r){switch(cs(t)){case 1:var i=Sp;break;case 4:i=kp;break;default:i=Li}o=i.bind(null,t,o,e),i=void 0,!_i||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(t,o,{capture:!0,passive:i}):e.addEventListener(t,o,!0):i!==void 0?e.addEventListener(t,o,{passive:i}):e.addEventListener(t,o,!1)}function ea(e,t,o,r,i){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var f=r.stateNode.containerInfo;if(f===i||f.nodeType===8&&f.parentNode===i)break;if(s===4)for(s=r.return;s!==null;){var y=s.tag;if((y===3||y===4)&&(y=s.stateNode.containerInfo,y===i||y.nodeType===8&&y.parentNode===i))return;s=s.return}for(;f!==null;){if(s=xn(f),s===null)return;if(y=s.tag,y===5||y===6){r=a=s;continue e}f=f.parentNode}}r=r.return}Wl(function(){var O=a,U=ke(o),J=[];e:{var V=Ts.get(e);if(V!==void 0){var Q=Fi,q=e;switch(e){case"keypress":if(wr(o)===0)break e;case"keydown":case"keyup":Q=Mp;break;case"focusin":q="focus",Q=Vi;break;case"focusout":q="blur",Q=Vi;break;case"beforeblur":case"afterblur":Q=Vi;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Q=ms;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Q=_p;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Q=Up;break;case Os:case Is:case Ds:Q=Rp;break;case Ls:Q=Hp;break;case"scroll":Q=Cp;break;case"wheel":Q=Gp;break;case"copy":case"cut":case"paste":Q=Op;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Q=hs}var Z=(t&4)!==0,Le=!Z&&e==="scroll",P=Z?V!==null?V+"Capture":null:V;Z=[];for(var w=O,R;w!==null;){R=w;var W=R.stateNode;if(R.tag===5&&W!==null&&(R=W,P!==null&&(W=xo(w,P),W!=null&&Z.push(Lo(w,W,R)))),Le)break;w=w.return}0<Z.length&&(V=new Q(V,q,null,o,U),J.push({event:V,listeners:Z}))}}if((t&7)===0){e:{if(V=e==="mouseover"||e==="pointerover",Q=e==="mouseout"||e==="pointerout",V&&o!==le&&(q=o.relatedTarget||o.fromElement)&&(xn(q)||q[Dt]))break e;if((Q||V)&&(V=U.window===U?U:(V=U.ownerDocument)?V.defaultView||V.parentWindow:window,Q?(q=o.relatedTarget||o.toElement,Q=O,q=q?xn(q):null,q!==null&&(Le=gn(q),q!==Le||q.tag!==5&&q.tag!==6)&&(q=null)):(Q=null,q=O),Q!==q)){if(Z=ms,W="onMouseLeave",P="onMouseEnter",w="mouse",(e==="pointerout"||e==="pointerover")&&(Z=hs,W="onPointerLeave",P="onPointerEnter",w="pointer"),Le=Q==null?V:Jn(Q),R=q==null?V:Jn(q),V=new Z(W,w+"leave",Q,o,U),V.target=Le,V.relatedTarget=R,W=null,xn(U)===O&&(Z=new Z(P,w+"enter",q,o,U),Z.target=R,Z.relatedTarget=Le,W=Z),Le=W,Q&&q)t:{for(Z=Q,P=q,w=0,R=Z;R;R=Vn(R))w++;for(R=0,W=P;W;W=Vn(W))R++;for(;0<w-R;)Z=Vn(Z),w--;for(;0<R-w;)P=Vn(P),R--;for(;w--;){if(Z===P||P!==null&&Z===P.alternate)break t;Z=Vn(Z),P=Vn(P)}Z=null}else Z=null;Q!==null&&Vs(J,V,Q,Z,!1),q!==null&&Le!==null&&Vs(J,Le,q,Z,!0)}}e:{if(V=O?Jn(O):window,Q=V.nodeName&&V.nodeName.toLowerCase(),Q==="select"||Q==="input"&&V.type==="file")var ne=eu;else if(ws(V))if(Ns)ne=ru;else{ne=nu;var re=tu}else(Q=V.nodeName)&&Q.toLowerCase()==="input"&&(V.type==="checkbox"||V.type==="radio")&&(ne=ou);if(ne&&(ne=ne(e,O))){js(J,ne,o,U);break e}re&&re(e,V,O),e==="focusout"&&(re=V._wrapperState)&&re.controlled&&V.type==="number"&&uo(V,"number",V.value)}switch(re=O?Jn(O):window,e){case"focusin":(ws(re)||re.contentEditable==="true")&&(Mn=re,Qi=O,Oo=null);break;case"focusout":Oo=Qi=Mn=null;break;case"mousedown":Yi=!0;break;case"contextmenu":case"mouseup":case"dragend":Yi=!1,Rs(J,o,U);break;case"selectionchange":if(lu)break;case"keydown":case"keyup":Rs(J,o,U)}var ie;if(Ji)e:{switch(e){case"compositionstart":var se="onCompositionStart";break e;case"compositionend":se="onCompositionEnd";break e;case"compositionupdate":se="onCompositionUpdate";break e}se=void 0}else Fn?ys(e,o)&&(se="onCompositionEnd"):e==="keydown"&&o.keyCode===229&&(se="onCompositionStart");se&&(gs&&o.locale!=="ko"&&(Fn||se!=="onCompositionStart"?se==="onCompositionEnd"&&Fn&&(ie=ps()):(Kt=U,$i="value"in Kt?Kt.value:Kt.textContent,Fn=!0)),re=_r(O,se),0<re.length&&(se=new fs(se,e,null,o,U),J.push({event:se,listeners:re}),ie?se.data=ie:(ie=bs(o),ie!==null&&(se.data=ie)))),(ie=Yp?Kp(e,o):qp(e,o))&&(O=_r(O,"onBeforeInput"),0<O.length&&(U=new fs("onBeforeInput","beforeinput",null,o,U),J.push({event:U,listeners:O}),U.data=ie))}Ms(J,t)})}function Lo(e,t,o){return{instance:e,listener:t,currentTarget:o}}function _r(e,t){for(var o=t+"Capture",r=[];e!==null;){var i=e,a=i.stateNode;i.tag===5&&a!==null&&(i=a,a=xo(e,o),a!=null&&r.unshift(Lo(e,a,i)),a=xo(e,t),a!=null&&r.push(Lo(e,a,i))),e=e.return}return r}function Vn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Vs(e,t,o,r,i){for(var a=t._reactName,s=[];o!==null&&o!==r;){var f=o,y=f.alternate,O=f.stateNode;if(y!==null&&y===r)break;f.tag===5&&O!==null&&(f=O,i?(y=xo(o,a),y!=null&&s.unshift(Lo(o,y,f))):i||(y=xo(o,a),y!=null&&s.push(Lo(o,y,f)))),o=o.return}s.length!==0&&e.push({event:t,listeners:s})}var pu=/\r\n?/g,uu=/\u0000|\uFFFD/g;function Us(e){return(typeof e=="string"?e:""+e).replace(pu,`
`).replace(uu,"")}function zr(e,t,o){if(t=Us(t),Us(e)!==t&&o)throw Error(d(425))}function Pr(){}var ta=null,na=null;function oa(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ra=typeof setTimeout=="function"?setTimeout:void 0,mu=typeof clearTimeout=="function"?clearTimeout:void 0,Js=typeof Promise=="function"?Promise:void 0,fu=typeof queueMicrotask=="function"?queueMicrotask:typeof Js<"u"?function(e){return Js.resolve(null).then(e).catch(hu)}:ra;function hu(e){setTimeout(function(){throw e})}function ia(e,t){var o=t,r=0;do{var i=o.nextSibling;if(e.removeChild(o),i&&i.nodeType===8)if(o=i.data,o==="/$"){if(r===0){e.removeChild(i),Co(t);return}r--}else o!=="$"&&o!=="$?"&&o!=="$!"||r++;o=i}while(o);Co(t)}function Xt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Hs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var o=e.data;if(o==="$"||o==="$!"||o==="$?"){if(t===0)return e;t--}else o==="/$"&&t++}e=e.previousSibling}return null}var Un=Math.random().toString(36).slice(2),zt="__reactFiber$"+Un,To="__reactProps$"+Un,Dt="__reactContainer$"+Un,aa="__reactEvents$"+Un,gu="__reactListeners$"+Un,xu="__reactHandles$"+Un;function xn(e){var t=e[zt];if(t)return t;for(var o=e.parentNode;o;){if(t=o[Dt]||o[zt]){if(o=t.alternate,t.child!==null||o!==null&&o.child!==null)for(e=Hs(e);e!==null;){if(o=e[zt])return o;e=Hs(e)}return t}e=o,o=e.parentNode}return null}function $o(e){return e=e[zt]||e[Dt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Jn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(d(33))}function Rr(e){return e[To]||null}var la=[],Hn=-1;function Zt(e){return{current:e}}function _e(e){0>Hn||(e.current=la[Hn],la[Hn]=null,Hn--)}function Ce(e,t){Hn++,la[Hn]=e.current,e.current=t}var en={},Ke=Zt(en),rt=Zt(!1),vn=en;function Wn(e,t){var o=e.type.contextTypes;if(!o)return en;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},a;for(a in o)i[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function it(e){return e=e.childContextTypes,e!=null}function Ar(){_e(rt),_e(Ke)}function Ws(e,t,o){if(Ke.current!==en)throw Error(d(168));Ce(Ke,t),Ce(rt,o)}function Gs(e,t,o){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return o;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(d(108,we(e)||"Unknown",i));return Y({},o,r)}function Or(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||en,vn=Ke.current,Ce(Ke,e),Ce(rt,rt.current),!0}function Qs(e,t,o){var r=e.stateNode;if(!r)throw Error(d(169));o?(e=Gs(e,t,vn),r.__reactInternalMemoizedMergedChildContext=e,_e(rt),_e(Ke),Ce(Ke,e)):_e(rt),Ce(rt,o)}var Lt=null,Ir=!1,sa=!1;function Ys(e){Lt===null?Lt=[e]:Lt.push(e)}function vu(e){Ir=!0,Ys(e)}function tn(){if(!sa&&Lt!==null){sa=!0;var e=0,t=je;try{var o=Lt;for(je=1;e<o.length;e++){var r=o[e];do r=r(!0);while(r!==null)}Lt=null,Ir=!1}catch(i){throw Lt!==null&&(Lt=Lt.slice(e+1)),ql(Pi,tn),i}finally{je=t,sa=!1}}return null}var Gn=[],Qn=0,Dr=null,Lr=0,ft=[],ht=0,yn=null,Tt=1,$t="";function bn(e,t){Gn[Qn++]=Lr,Gn[Qn++]=Dr,Dr=e,Lr=t}function Ks(e,t,o){ft[ht++]=Tt,ft[ht++]=$t,ft[ht++]=yn,yn=e;var r=Tt;e=$t;var i=32-bt(r)-1;r&=~(1<<i),o+=1;var a=32-bt(t)+i;if(30<a){var s=i-i%5;a=(r&(1<<s)-1).toString(32),r>>=s,i-=s,Tt=1<<32-bt(t)+i|o<<i|r,$t=a+e}else Tt=1<<a|o<<i|r,$t=e}function da(e){e.return!==null&&(bn(e,1),Ks(e,1,0))}function ca(e){for(;e===Dr;)Dr=Gn[--Qn],Gn[Qn]=null,Lr=Gn[--Qn],Gn[Qn]=null;for(;e===yn;)yn=ft[--ht],ft[ht]=null,$t=ft[--ht],ft[ht]=null,Tt=ft[--ht],ft[ht]=null}var pt=null,ut=null,Pe=!1,jt=null;function qs(e,t){var o=yt(5,null,null,0);o.elementType="DELETED",o.stateNode=t,o.return=e,t=e.deletions,t===null?(e.deletions=[o],e.flags|=16):t.push(o)}function Xs(e,t){switch(e.tag){case 5:var o=e.type;return t=t.nodeType!==1||o.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,pt=e,ut=Xt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,pt=e,ut=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(o=yn!==null?{id:Tt,overflow:$t}:null,e.memoizedState={dehydrated:t,treeContext:o,retryLane:1073741824},o=yt(18,null,null,0),o.stateNode=t,o.return=e,e.child=o,pt=e,ut=null,!0):!1;default:return!1}}function pa(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ua(e){if(Pe){var t=ut;if(t){var o=t;if(!Xs(e,t)){if(pa(e))throw Error(d(418));t=Xt(o.nextSibling);var r=pt;t&&Xs(e,t)?qs(r,o):(e.flags=e.flags&-4097|2,Pe=!1,pt=e)}}else{if(pa(e))throw Error(d(418));e.flags=e.flags&-4097|2,Pe=!1,pt=e}}}function Zs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;pt=e}function Tr(e){if(e!==pt)return!1;if(!Pe)return Zs(e),Pe=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!oa(e.type,e.memoizedProps)),t&&(t=ut)){if(pa(e))throw ed(),Error(d(418));for(;t;)qs(e,t),t=Xt(t.nextSibling)}if(Zs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(d(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var o=e.data;if(o==="/$"){if(t===0){ut=Xt(e.nextSibling);break e}t--}else o!=="$"&&o!=="$!"&&o!=="$?"||t++}e=e.nextSibling}ut=null}}else ut=pt?Xt(e.stateNode.nextSibling):null;return!0}function ed(){for(var e=ut;e;)e=Xt(e.nextSibling)}function Yn(){ut=pt=null,Pe=!1}function ma(e){jt===null?jt=[e]:jt.push(e)}var yu=j.ReactCurrentBatchConfig;function Fo(e,t,o){if(e=o.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(d(309));var r=o.stateNode}if(!r)throw Error(d(147,e));var i=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(s){var f=i.refs;s===null?delete f[a]:f[a]=s},t._stringRef=a,t)}if(typeof e!="string")throw Error(d(284));if(!o._owner)throw Error(d(290,e))}return e}function $r(e,t){throw e=Object.prototype.toString.call(t),Error(d(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function td(e){var t=e._init;return t(e._payload)}function nd(e){function t(P,w){if(e){var R=P.deletions;R===null?(P.deletions=[w],P.flags|=16):R.push(w)}}function o(P,w){if(!e)return null;for(;w!==null;)t(P,w),w=w.sibling;return null}function r(P,w){for(P=new Map;w!==null;)w.key!==null?P.set(w.key,w):P.set(w.index,w),w=w.sibling;return P}function i(P,w){return P=cn(P,w),P.index=0,P.sibling=null,P}function a(P,w,R){return P.index=R,e?(R=P.alternate,R!==null?(R=R.index,R<w?(P.flags|=2,w):R):(P.flags|=2,w)):(P.flags|=1048576,w)}function s(P){return e&&P.alternate===null&&(P.flags|=2),P}function f(P,w,R,W){return w===null||w.tag!==6?(w=rl(R,P.mode,W),w.return=P,w):(w=i(w,R),w.return=P,w)}function y(P,w,R,W){var ne=R.type;return ne===X?U(P,w,R.props.children,W,R.key):w!==null&&(w.elementType===ne||typeof ne=="object"&&ne!==null&&ne.$$typeof===ue&&td(ne)===w.type)?(W=i(w,R.props),W.ref=Fo(P,w,R),W.return=P,W):(W=si(R.type,R.key,R.props,null,P.mode,W),W.ref=Fo(P,w,R),W.return=P,W)}function O(P,w,R,W){return w===null||w.tag!==4||w.stateNode.containerInfo!==R.containerInfo||w.stateNode.implementation!==R.implementation?(w=il(R,P.mode,W),w.return=P,w):(w=i(w,R.children||[]),w.return=P,w)}function U(P,w,R,W,ne){return w===null||w.tag!==7?(w=_n(R,P.mode,W,ne),w.return=P,w):(w=i(w,R),w.return=P,w)}function J(P,w,R){if(typeof w=="string"&&w!==""||typeof w=="number")return w=rl(""+w,P.mode,R),w.return=P,w;if(typeof w=="object"&&w!==null){switch(w.$$typeof){case M:return R=si(w.type,w.key,w.props,null,P.mode,R),R.ref=Fo(P,null,w),R.return=P,R;case F:return w=il(w,P.mode,R),w.return=P,w;case ue:var W=w._init;return J(P,W(w._payload),R)}if(hn(w)||ae(w))return w=_n(w,P.mode,R,null),w.return=P,w;$r(P,w)}return null}function V(P,w,R,W){var ne=w!==null?w.key:null;if(typeof R=="string"&&R!==""||typeof R=="number")return ne!==null?null:f(P,w,""+R,W);if(typeof R=="object"&&R!==null){switch(R.$$typeof){case M:return R.key===ne?y(P,w,R,W):null;case F:return R.key===ne?O(P,w,R,W):null;case ue:return ne=R._init,V(P,w,ne(R._payload),W)}if(hn(R)||ae(R))return ne!==null?null:U(P,w,R,W,null);$r(P,R)}return null}function Q(P,w,R,W,ne){if(typeof W=="string"&&W!==""||typeof W=="number")return P=P.get(R)||null,f(w,P,""+W,ne);if(typeof W=="object"&&W!==null){switch(W.$$typeof){case M:return P=P.get(W.key===null?R:W.key)||null,y(w,P,W,ne);case F:return P=P.get(W.key===null?R:W.key)||null,O(w,P,W,ne);case ue:var re=W._init;return Q(P,w,R,re(W._payload),ne)}if(hn(W)||ae(W))return P=P.get(R)||null,U(w,P,W,ne,null);$r(w,W)}return null}function q(P,w,R,W){for(var ne=null,re=null,ie=w,se=w=0,Je=null;ie!==null&&se<R.length;se++){ie.index>se?(Je=ie,ie=null):Je=ie.sibling;var ve=V(P,ie,R[se],W);if(ve===null){ie===null&&(ie=Je);break}e&&ie&&ve.alternate===null&&t(P,ie),w=a(ve,w,se),re===null?ne=ve:re.sibling=ve,re=ve,ie=Je}if(se===R.length)return o(P,ie),Pe&&bn(P,se),ne;if(ie===null){for(;se<R.length;se++)ie=J(P,R[se],W),ie!==null&&(w=a(ie,w,se),re===null?ne=ie:re.sibling=ie,re=ie);return Pe&&bn(P,se),ne}for(ie=r(P,ie);se<R.length;se++)Je=Q(ie,P,se,R[se],W),Je!==null&&(e&&Je.alternate!==null&&ie.delete(Je.key===null?se:Je.key),w=a(Je,w,se),re===null?ne=Je:re.sibling=Je,re=Je);return e&&ie.forEach(function(pn){return t(P,pn)}),Pe&&bn(P,se),ne}function Z(P,w,R,W){var ne=ae(R);if(typeof ne!="function")throw Error(d(150));if(R=ne.call(R),R==null)throw Error(d(151));for(var re=ne=null,ie=w,se=w=0,Je=null,ve=R.next();ie!==null&&!ve.done;se++,ve=R.next()){ie.index>se?(Je=ie,ie=null):Je=ie.sibling;var pn=V(P,ie,ve.value,W);if(pn===null){ie===null&&(ie=Je);break}e&&ie&&pn.alternate===null&&t(P,ie),w=a(pn,w,se),re===null?ne=pn:re.sibling=pn,re=pn,ie=Je}if(ve.done)return o(P,ie),Pe&&bn(P,se),ne;if(ie===null){for(;!ve.done;se++,ve=R.next())ve=J(P,ve.value,W),ve!==null&&(w=a(ve,w,se),re===null?ne=ve:re.sibling=ve,re=ve);return Pe&&bn(P,se),ne}for(ie=r(P,ie);!ve.done;se++,ve=R.next())ve=Q(ie,P,se,ve.value,W),ve!==null&&(e&&ve.alternate!==null&&ie.delete(ve.key===null?se:ve.key),w=a(ve,w,se),re===null?ne=ve:re.sibling=ve,re=ve);return e&&ie.forEach(function(Xu){return t(P,Xu)}),Pe&&bn(P,se),ne}function Le(P,w,R,W){if(typeof R=="object"&&R!==null&&R.type===X&&R.key===null&&(R=R.props.children),typeof R=="object"&&R!==null){switch(R.$$typeof){case M:e:{for(var ne=R.key,re=w;re!==null;){if(re.key===ne){if(ne=R.type,ne===X){if(re.tag===7){o(P,re.sibling),w=i(re,R.props.children),w.return=P,P=w;break e}}else if(re.elementType===ne||typeof ne=="object"&&ne!==null&&ne.$$typeof===ue&&td(ne)===re.type){o(P,re.sibling),w=i(re,R.props),w.ref=Fo(P,re,R),w.return=P,P=w;break e}o(P,re);break}else t(P,re);re=re.sibling}R.type===X?(w=_n(R.props.children,P.mode,W,R.key),w.return=P,P=w):(W=si(R.type,R.key,R.props,null,P.mode,W),W.ref=Fo(P,w,R),W.return=P,P=W)}return s(P);case F:e:{for(re=R.key;w!==null;){if(w.key===re)if(w.tag===4&&w.stateNode.containerInfo===R.containerInfo&&w.stateNode.implementation===R.implementation){o(P,w.sibling),w=i(w,R.children||[]),w.return=P,P=w;break e}else{o(P,w);break}else t(P,w);w=w.sibling}w=il(R,P.mode,W),w.return=P,P=w}return s(P);case ue:return re=R._init,Le(P,w,re(R._payload),W)}if(hn(R))return q(P,w,R,W);if(ae(R))return Z(P,w,R,W);$r(P,R)}return typeof R=="string"&&R!==""||typeof R=="number"?(R=""+R,w!==null&&w.tag===6?(o(P,w.sibling),w=i(w,R),w.return=P,P=w):(o(P,w),w=rl(R,P.mode,W),w.return=P,P=w),s(P)):o(P,w)}return Le}var Kn=nd(!0),od=nd(!1),Fr=Zt(null),Mr=null,qn=null,fa=null;function ha(){fa=qn=Mr=null}function ga(e){var t=Fr.current;_e(Fr),e._currentValue=t}function xa(e,t,o){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===o)break;e=e.return}}function Xn(e,t){Mr=e,fa=qn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(at=!0),e.firstContext=null)}function gt(e){var t=e._currentValue;if(fa!==e)if(e={context:e,memoizedValue:t,next:null},qn===null){if(Mr===null)throw Error(d(308));qn=e,Mr.dependencies={lanes:0,firstContext:e}}else qn=qn.next=e;return t}var wn=null;function va(e){wn===null?wn=[e]:wn.push(e)}function rd(e,t,o,r){var i=t.interleaved;return i===null?(o.next=o,va(t)):(o.next=i.next,i.next=o),t.interleaved=o,Ft(e,r)}function Ft(e,t){e.lanes|=t;var o=e.alternate;for(o!==null&&(o.lanes|=t),o=e,e=e.return;e!==null;)e.childLanes|=t,o=e.alternate,o!==null&&(o.childLanes|=t),o=e,e=e.return;return o.tag===3?o.stateNode:null}var nn=!1;function ya(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function id(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Mt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function on(e,t,o){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(xe&2)!==0){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,Ft(e,o)}return i=r.interleaved,i===null?(t.next=t,va(r)):(t.next=i.next,i.next=t),r.interleaved=t,Ft(e,o)}function Br(e,t,o){if(t=t.updateQueue,t!==null&&(t=t.shared,(o&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,o|=r,t.lanes=o,Oi(e,o)}}function ad(e,t){var o=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,o===r)){var i=null,a=null;if(o=o.firstBaseUpdate,o!==null){do{var s={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};a===null?i=a=s:a=a.next=s,o=o.next}while(o!==null);a===null?i=a=t:a=a.next=t}else i=a=t;o={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=o;return}e=o.lastBaseUpdate,e===null?o.firstBaseUpdate=t:e.next=t,o.lastBaseUpdate=t}function Vr(e,t,o,r){var i=e.updateQueue;nn=!1;var a=i.firstBaseUpdate,s=i.lastBaseUpdate,f=i.shared.pending;if(f!==null){i.shared.pending=null;var y=f,O=y.next;y.next=null,s===null?a=O:s.next=O,s=y;var U=e.alternate;U!==null&&(U=U.updateQueue,f=U.lastBaseUpdate,f!==s&&(f===null?U.firstBaseUpdate=O:f.next=O,U.lastBaseUpdate=y))}if(a!==null){var J=i.baseState;s=0,U=O=y=null,f=a;do{var V=f.lane,Q=f.eventTime;if((r&V)===V){U!==null&&(U=U.next={eventTime:Q,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,next:null});e:{var q=e,Z=f;switch(V=t,Q=o,Z.tag){case 1:if(q=Z.payload,typeof q=="function"){J=q.call(Q,J,V);break e}J=q;break e;case 3:q.flags=q.flags&-65537|128;case 0:if(q=Z.payload,V=typeof q=="function"?q.call(Q,J,V):q,V==null)break e;J=Y({},J,V);break e;case 2:nn=!0}}f.callback!==null&&f.lane!==0&&(e.flags|=64,V=i.effects,V===null?i.effects=[f]:V.push(f))}else Q={eventTime:Q,lane:V,tag:f.tag,payload:f.payload,callback:f.callback,next:null},U===null?(O=U=Q,y=J):U=U.next=Q,s|=V;if(f=f.next,f===null){if(f=i.shared.pending,f===null)break;V=f,f=V.next,V.next=null,i.lastBaseUpdate=V,i.shared.pending=null}}while(!0);if(U===null&&(y=J),i.baseState=y,i.firstBaseUpdate=O,i.lastBaseUpdate=U,t=i.shared.interleaved,t!==null){i=t;do s|=i.lane,i=i.next;while(i!==t)}else a===null&&(i.shared.lanes=0);Sn|=s,e.lanes=s,e.memoizedState=J}}function ld(e,t,o){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],i=r.callback;if(i!==null){if(r.callback=null,r=o,typeof i!="function")throw Error(d(191,i));i.call(r)}}}var Mo={},Pt=Zt(Mo),Bo=Zt(Mo),Vo=Zt(Mo);function jn(e){if(e===Mo)throw Error(d(174));return e}function ba(e,t){switch(Ce(Vo,t),Ce(Bo,e),Ce(Pt,Mo),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:On(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=On(t,e)}_e(Pt),Ce(Pt,t)}function Zn(){_e(Pt),_e(Bo),_e(Vo)}function sd(e){jn(Vo.current);var t=jn(Pt.current),o=On(t,e.type);t!==o&&(Ce(Bo,e),Ce(Pt,o))}function wa(e){Bo.current===e&&(_e(Pt),_e(Bo))}var Re=Zt(0);function Ur(e){for(var t=e;t!==null;){if(t.tag===13){var o=t.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ja=[];function Na(){for(var e=0;e<ja.length;e++)ja[e]._workInProgressVersionPrimary=null;ja.length=0}var Jr=j.ReactCurrentDispatcher,Sa=j.ReactCurrentBatchConfig,Nn=0,Ae=null,Me=null,Ve=null,Hr=!1,Uo=!1,Jo=0,bu=0;function qe(){throw Error(d(321))}function ka(e,t){if(t===null)return!1;for(var o=0;o<t.length&&o<e.length;o++)if(!wt(e[o],t[o]))return!1;return!0}function Ca(e,t,o,r,i,a){if(Nn=a,Ae=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Jr.current=e===null||e.memoizedState===null?Su:ku,e=o(r,i),Uo){a=0;do{if(Uo=!1,Jo=0,25<=a)throw Error(d(301));a+=1,Ve=Me=null,t.updateQueue=null,Jr.current=Cu,e=o(r,i)}while(Uo)}if(Jr.current=Qr,t=Me!==null&&Me.next!==null,Nn=0,Ve=Me=Ae=null,Hr=!1,t)throw Error(d(300));return e}function Ea(){var e=Jo!==0;return Jo=0,e}function Rt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ve===null?Ae.memoizedState=Ve=e:Ve=Ve.next=e,Ve}function xt(){if(Me===null){var e=Ae.alternate;e=e!==null?e.memoizedState:null}else e=Me.next;var t=Ve===null?Ae.memoizedState:Ve.next;if(t!==null)Ve=t,Me=e;else{if(e===null)throw Error(d(310));Me=e,e={memoizedState:Me.memoizedState,baseState:Me.baseState,baseQueue:Me.baseQueue,queue:Me.queue,next:null},Ve===null?Ae.memoizedState=Ve=e:Ve=Ve.next=e}return Ve}function Ho(e,t){return typeof t=="function"?t(e):t}function _a(e){var t=xt(),o=t.queue;if(o===null)throw Error(d(311));o.lastRenderedReducer=e;var r=Me,i=r.baseQueue,a=o.pending;if(a!==null){if(i!==null){var s=i.next;i.next=a.next,a.next=s}r.baseQueue=i=a,o.pending=null}if(i!==null){a=i.next,r=r.baseState;var f=s=null,y=null,O=a;do{var U=O.lane;if((Nn&U)===U)y!==null&&(y=y.next={lane:0,action:O.action,hasEagerState:O.hasEagerState,eagerState:O.eagerState,next:null}),r=O.hasEagerState?O.eagerState:e(r,O.action);else{var J={lane:U,action:O.action,hasEagerState:O.hasEagerState,eagerState:O.eagerState,next:null};y===null?(f=y=J,s=r):y=y.next=J,Ae.lanes|=U,Sn|=U}O=O.next}while(O!==null&&O!==a);y===null?s=r:y.next=f,wt(r,t.memoizedState)||(at=!0),t.memoizedState=r,t.baseState=s,t.baseQueue=y,o.lastRenderedState=r}if(e=o.interleaved,e!==null){i=e;do a=i.lane,Ae.lanes|=a,Sn|=a,i=i.next;while(i!==e)}else i===null&&(o.lanes=0);return[t.memoizedState,o.dispatch]}function za(e){var t=xt(),o=t.queue;if(o===null)throw Error(d(311));o.lastRenderedReducer=e;var r=o.dispatch,i=o.pending,a=t.memoizedState;if(i!==null){o.pending=null;var s=i=i.next;do a=e(a,s.action),s=s.next;while(s!==i);wt(a,t.memoizedState)||(at=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),o.lastRenderedState=a}return[a,r]}function dd(){}function cd(e,t){var o=Ae,r=xt(),i=t(),a=!wt(r.memoizedState,i);if(a&&(r.memoizedState=i,at=!0),r=r.queue,Pa(md.bind(null,o,r,e),[e]),r.getSnapshot!==t||a||Ve!==null&&Ve.memoizedState.tag&1){if(o.flags|=2048,Wo(9,ud.bind(null,o,r,i,t),void 0,null),Ue===null)throw Error(d(349));(Nn&30)!==0||pd(o,t,i)}return i}function pd(e,t,o){e.flags|=16384,e={getSnapshot:t,value:o},t=Ae.updateQueue,t===null?(t={lastEffect:null,stores:null},Ae.updateQueue=t,t.stores=[e]):(o=t.stores,o===null?t.stores=[e]:o.push(e))}function ud(e,t,o,r){t.value=o,t.getSnapshot=r,fd(t)&&hd(e)}function md(e,t,o){return o(function(){fd(t)&&hd(e)})}function fd(e){var t=e.getSnapshot;e=e.value;try{var o=t();return!wt(e,o)}catch{return!0}}function hd(e){var t=Ft(e,1);t!==null&&Ct(t,e,1,-1)}function gd(e){var t=Rt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ho,lastRenderedState:e},t.queue=e,e=e.dispatch=Nu.bind(null,Ae,e),[t.memoizedState,e]}function Wo(e,t,o,r){return e={tag:e,create:t,destroy:o,deps:r,next:null},t=Ae.updateQueue,t===null?(t={lastEffect:null,stores:null},Ae.updateQueue=t,t.lastEffect=e.next=e):(o=t.lastEffect,o===null?t.lastEffect=e.next=e:(r=o.next,o.next=e,e.next=r,t.lastEffect=e)),e}function xd(){return xt().memoizedState}function Wr(e,t,o,r){var i=Rt();Ae.flags|=e,i.memoizedState=Wo(1|t,o,void 0,r===void 0?null:r)}function Gr(e,t,o,r){var i=xt();r=r===void 0?null:r;var a=void 0;if(Me!==null){var s=Me.memoizedState;if(a=s.destroy,r!==null&&ka(r,s.deps)){i.memoizedState=Wo(t,o,a,r);return}}Ae.flags|=e,i.memoizedState=Wo(1|t,o,a,r)}function vd(e,t){return Wr(8390656,8,e,t)}function Pa(e,t){return Gr(2048,8,e,t)}function yd(e,t){return Gr(4,2,e,t)}function bd(e,t){return Gr(4,4,e,t)}function wd(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function jd(e,t,o){return o=o!=null?o.concat([e]):null,Gr(4,4,wd.bind(null,t,e),o)}function Ra(){}function Nd(e,t){var o=xt();t=t===void 0?null:t;var r=o.memoizedState;return r!==null&&t!==null&&ka(t,r[1])?r[0]:(o.memoizedState=[e,t],e)}function Sd(e,t){var o=xt();t=t===void 0?null:t;var r=o.memoizedState;return r!==null&&t!==null&&ka(t,r[1])?r[0]:(e=e(),o.memoizedState=[e,t],e)}function kd(e,t,o){return(Nn&21)===0?(e.baseState&&(e.baseState=!1,at=!0),e.memoizedState=o):(wt(o,t)||(o=ts(),Ae.lanes|=o,Sn|=o,e.baseState=!0),t)}function wu(e,t){var o=je;je=o!==0&&4>o?o:4,e(!0);var r=Sa.transition;Sa.transition={};try{e(!1),t()}finally{je=o,Sa.transition=r}}function Cd(){return xt().memoizedState}function ju(e,t,o){var r=sn(e);if(o={lane:r,action:o,hasEagerState:!1,eagerState:null,next:null},Ed(e))_d(t,o);else if(o=rd(e,t,o,r),o!==null){var i=tt();Ct(o,e,r,i),zd(o,t,r)}}function Nu(e,t,o){var r=sn(e),i={lane:r,action:o,hasEagerState:!1,eagerState:null,next:null};if(Ed(e))_d(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var s=t.lastRenderedState,f=a(s,o);if(i.hasEagerState=!0,i.eagerState=f,wt(f,s)){var y=t.interleaved;y===null?(i.next=i,va(t)):(i.next=y.next,y.next=i),t.interleaved=i;return}}catch{}finally{}o=rd(e,t,i,r),o!==null&&(i=tt(),Ct(o,e,r,i),zd(o,t,r))}}function Ed(e){var t=e.alternate;return e===Ae||t!==null&&t===Ae}function _d(e,t){Uo=Hr=!0;var o=e.pending;o===null?t.next=t:(t.next=o.next,o.next=t),e.pending=t}function zd(e,t,o){if((o&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,o|=r,t.lanes=o,Oi(e,o)}}var Qr={readContext:gt,useCallback:qe,useContext:qe,useEffect:qe,useImperativeHandle:qe,useInsertionEffect:qe,useLayoutEffect:qe,useMemo:qe,useReducer:qe,useRef:qe,useState:qe,useDebugValue:qe,useDeferredValue:qe,useTransition:qe,useMutableSource:qe,useSyncExternalStore:qe,useId:qe,unstable_isNewReconciler:!1},Su={readContext:gt,useCallback:function(e,t){return Rt().memoizedState=[e,t===void 0?null:t],e},useContext:gt,useEffect:vd,useImperativeHandle:function(e,t,o){return o=o!=null?o.concat([e]):null,Wr(4194308,4,wd.bind(null,t,e),o)},useLayoutEffect:function(e,t){return Wr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Wr(4,2,e,t)},useMemo:function(e,t){var o=Rt();return t=t===void 0?null:t,e=e(),o.memoizedState=[e,t],e},useReducer:function(e,t,o){var r=Rt();return t=o!==void 0?o(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=ju.bind(null,Ae,e),[r.memoizedState,e]},useRef:function(e){var t=Rt();return e={current:e},t.memoizedState=e},useState:gd,useDebugValue:Ra,useDeferredValue:function(e){return Rt().memoizedState=e},useTransition:function(){var e=gd(!1),t=e[0];return e=wu.bind(null,e[1]),Rt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,o){var r=Ae,i=Rt();if(Pe){if(o===void 0)throw Error(d(407));o=o()}else{if(o=t(),Ue===null)throw Error(d(349));(Nn&30)!==0||pd(r,t,o)}i.memoizedState=o;var a={value:o,getSnapshot:t};return i.queue=a,vd(md.bind(null,r,a,e),[e]),r.flags|=2048,Wo(9,ud.bind(null,r,a,o,t),void 0,null),o},useId:function(){var e=Rt(),t=Ue.identifierPrefix;if(Pe){var o=$t,r=Tt;o=(r&~(1<<32-bt(r)-1)).toString(32)+o,t=":"+t+"R"+o,o=Jo++,0<o&&(t+="H"+o.toString(32)),t+=":"}else o=bu++,t=":"+t+"r"+o.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ku={readContext:gt,useCallback:Nd,useContext:gt,useEffect:Pa,useImperativeHandle:jd,useInsertionEffect:yd,useLayoutEffect:bd,useMemo:Sd,useReducer:_a,useRef:xd,useState:function(){return _a(Ho)},useDebugValue:Ra,useDeferredValue:function(e){var t=xt();return kd(t,Me.memoizedState,e)},useTransition:function(){var e=_a(Ho)[0],t=xt().memoizedState;return[e,t]},useMutableSource:dd,useSyncExternalStore:cd,useId:Cd,unstable_isNewReconciler:!1},Cu={readContext:gt,useCallback:Nd,useContext:gt,useEffect:Pa,useImperativeHandle:jd,useInsertionEffect:yd,useLayoutEffect:bd,useMemo:Sd,useReducer:za,useRef:xd,useState:function(){return za(Ho)},useDebugValue:Ra,useDeferredValue:function(e){var t=xt();return Me===null?t.memoizedState=e:kd(t,Me.memoizedState,e)},useTransition:function(){var e=za(Ho)[0],t=xt().memoizedState;return[e,t]},useMutableSource:dd,useSyncExternalStore:cd,useId:Cd,unstable_isNewReconciler:!1};function Nt(e,t){if(e&&e.defaultProps){t=Y({},t),e=e.defaultProps;for(var o in e)t[o]===void 0&&(t[o]=e[o]);return t}return t}function Aa(e,t,o,r){t=e.memoizedState,o=o(r,t),o=o==null?t:Y({},t,o),e.memoizedState=o,e.lanes===0&&(e.updateQueue.baseState=o)}var Yr={isMounted:function(e){return(e=e._reactInternals)?gn(e)===e:!1},enqueueSetState:function(e,t,o){e=e._reactInternals;var r=tt(),i=sn(e),a=Mt(r,i);a.payload=t,o!=null&&(a.callback=o),t=on(e,a,i),t!==null&&(Ct(t,e,i,r),Br(t,e,i))},enqueueReplaceState:function(e,t,o){e=e._reactInternals;var r=tt(),i=sn(e),a=Mt(r,i);a.tag=1,a.payload=t,o!=null&&(a.callback=o),t=on(e,a,i),t!==null&&(Ct(t,e,i,r),Br(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var o=tt(),r=sn(e),i=Mt(o,r);i.tag=2,t!=null&&(i.callback=t),t=on(e,i,r),t!==null&&(Ct(t,e,r,o),Br(t,e,r))}};function Pd(e,t,o,r,i,a,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,s):t.prototype&&t.prototype.isPureReactComponent?!Ao(o,r)||!Ao(i,a):!0}function Rd(e,t,o){var r=!1,i=en,a=t.contextType;return typeof a=="object"&&a!==null?a=gt(a):(i=it(t)?vn:Ke.current,r=t.contextTypes,a=(r=r!=null)?Wn(e,i):en),t=new t(o,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Yr,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=a),t}function Ad(e,t,o,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(o,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(o,r),t.state!==e&&Yr.enqueueReplaceState(t,t.state,null)}function Oa(e,t,o,r){var i=e.stateNode;i.props=o,i.state=e.memoizedState,i.refs={},ya(e);var a=t.contextType;typeof a=="object"&&a!==null?i.context=gt(a):(a=it(t)?vn:Ke.current,i.context=Wn(e,a)),i.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Aa(e,t,a,o),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&Yr.enqueueReplaceState(i,i.state,null),Vr(e,o,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function eo(e,t){try{var o="",r=t;do o+=he(r),r=r.return;while(r);var i=o}catch(a){i=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:i,digest:null}}function Ia(e,t,o){return{value:e,source:null,stack:o??null,digest:t??null}}function Da(e,t){try{console.error(t.value)}catch(o){setTimeout(function(){throw o})}}var Eu=typeof WeakMap=="function"?WeakMap:Map;function Od(e,t,o){o=Mt(-1,o),o.tag=3,o.payload={element:null};var r=t.value;return o.callback=function(){ni||(ni=!0,Ka=r),Da(e,t)},o}function Id(e,t,o){o=Mt(-1,o),o.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=t.value;o.payload=function(){return r(i)},o.callback=function(){Da(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(o.callback=function(){Da(e,t),typeof r!="function"&&(an===null?an=new Set([this]):an.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),o}function Dd(e,t,o){var r=e.pingCache;if(r===null){r=e.pingCache=new Eu;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(o)||(i.add(o),e=Bu.bind(null,e,t,o),t.then(e,e))}function Ld(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Td(e,t,o,r,i){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(t=Mt(-1,1),t.tag=2,on(o,t,1))),o.lanes|=1),e):(e.flags|=65536,e.lanes=i,e)}var _u=j.ReactCurrentOwner,at=!1;function et(e,t,o,r){t.child=e===null?od(t,null,o,r):Kn(t,e.child,o,r)}function $d(e,t,o,r,i){o=o.render;var a=t.ref;return Xn(t,i),r=Ca(e,t,o,r,a,i),o=Ea(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Bt(e,t,i)):(Pe&&o&&da(t),t.flags|=1,et(e,t,r,i),t.child)}function Fd(e,t,o,r,i){if(e===null){var a=o.type;return typeof a=="function"&&!ol(a)&&a.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(t.tag=15,t.type=a,Md(e,t,a,r,i)):(e=si(o.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&i)===0){var s=a.memoizedProps;if(o=o.compare,o=o!==null?o:Ao,o(s,r)&&e.ref===t.ref)return Bt(e,t,i)}return t.flags|=1,e=cn(a,r),e.ref=t.ref,e.return=t,t.child=e}function Md(e,t,o,r,i){if(e!==null){var a=e.memoizedProps;if(Ao(a,r)&&e.ref===t.ref)if(at=!1,t.pendingProps=r=a,(e.lanes&i)!==0)(e.flags&131072)!==0&&(at=!0);else return t.lanes=e.lanes,Bt(e,t,i)}return La(e,t,o,r,i)}function Bd(e,t,o){var r=t.pendingProps,i=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ce(no,mt),mt|=o;else{if((o&1073741824)===0)return e=a!==null?a.baseLanes|o:o,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Ce(no,mt),mt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:o,Ce(no,mt),mt|=r}else a!==null?(r=a.baseLanes|o,t.memoizedState=null):r=o,Ce(no,mt),mt|=r;return et(e,t,i,o),t.child}function Vd(e,t){var o=t.ref;(e===null&&o!==null||e!==null&&e.ref!==o)&&(t.flags|=512,t.flags|=2097152)}function La(e,t,o,r,i){var a=it(o)?vn:Ke.current;return a=Wn(t,a),Xn(t,i),o=Ca(e,t,o,r,a,i),r=Ea(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Bt(e,t,i)):(Pe&&r&&da(t),t.flags|=1,et(e,t,o,i),t.child)}function Ud(e,t,o,r,i){if(it(o)){var a=!0;Or(t)}else a=!1;if(Xn(t,i),t.stateNode===null)qr(e,t),Rd(t,o,r),Oa(t,o,r,i),r=!0;else if(e===null){var s=t.stateNode,f=t.memoizedProps;s.props=f;var y=s.context,O=o.contextType;typeof O=="object"&&O!==null?O=gt(O):(O=it(o)?vn:Ke.current,O=Wn(t,O));var U=o.getDerivedStateFromProps,J=typeof U=="function"||typeof s.getSnapshotBeforeUpdate=="function";J||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(f!==r||y!==O)&&Ad(t,s,r,O),nn=!1;var V=t.memoizedState;s.state=V,Vr(t,r,s,i),y=t.memoizedState,f!==r||V!==y||rt.current||nn?(typeof U=="function"&&(Aa(t,o,U,r),y=t.memoizedState),(f=nn||Pd(t,o,f,r,V,y,O))?(J||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=y),s.props=r,s.state=y,s.context=O,r=f):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{s=t.stateNode,id(e,t),f=t.memoizedProps,O=t.type===t.elementType?f:Nt(t.type,f),s.props=O,J=t.pendingProps,V=s.context,y=o.contextType,typeof y=="object"&&y!==null?y=gt(y):(y=it(o)?vn:Ke.current,y=Wn(t,y));var Q=o.getDerivedStateFromProps;(U=typeof Q=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(f!==J||V!==y)&&Ad(t,s,r,y),nn=!1,V=t.memoizedState,s.state=V,Vr(t,r,s,i);var q=t.memoizedState;f!==J||V!==q||rt.current||nn?(typeof Q=="function"&&(Aa(t,o,Q,r),q=t.memoizedState),(O=nn||Pd(t,o,O,r,V,q,y)||!1)?(U||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,q,y),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,q,y)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||f===e.memoizedProps&&V===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||f===e.memoizedProps&&V===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=q),s.props=r,s.state=q,s.context=y,r=O):(typeof s.componentDidUpdate!="function"||f===e.memoizedProps&&V===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||f===e.memoizedProps&&V===e.memoizedState||(t.flags|=1024),r=!1)}return Ta(e,t,o,r,a,i)}function Ta(e,t,o,r,i,a){Vd(e,t);var s=(t.flags&128)!==0;if(!r&&!s)return i&&Qs(t,o,!1),Bt(e,t,a);r=t.stateNode,_u.current=t;var f=s&&typeof o.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&s?(t.child=Kn(t,e.child,null,a),t.child=Kn(t,null,f,a)):et(e,t,f,a),t.memoizedState=r.state,i&&Qs(t,o,!0),t.child}function Jd(e){var t=e.stateNode;t.pendingContext?Ws(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ws(e,t.context,!1),ba(e,t.containerInfo)}function Hd(e,t,o,r,i){return Yn(),ma(i),t.flags|=256,et(e,t,o,r),t.child}var $a={dehydrated:null,treeContext:null,retryLane:0};function Fa(e){return{baseLanes:e,cachePool:null,transitions:null}}function Wd(e,t,o){var r=t.pendingProps,i=Re.current,a=!1,s=(t.flags&128)!==0,f;if((f=s)||(f=e!==null&&e.memoizedState===null?!1:(i&2)!==0),f?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),Ce(Re,i&1),e===null)return ua(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(s=r.children,e=r.fallback,a?(r=t.mode,a=t.child,s={mode:"hidden",children:s},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=s):a=di(s,r,0,null),e=_n(e,r,o,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Fa(o),t.memoizedState=$a,e):Ma(t,s));if(i=e.memoizedState,i!==null&&(f=i.dehydrated,f!==null))return zu(e,t,s,r,f,i,o);if(a){a=r.fallback,s=t.mode,i=e.child,f=i.sibling;var y={mode:"hidden",children:r.children};return(s&1)===0&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=y,t.deletions=null):(r=cn(i,y),r.subtreeFlags=i.subtreeFlags&14680064),f!==null?a=cn(f,a):(a=_n(a,s,o,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,s=e.child.memoizedState,s=s===null?Fa(o):{baseLanes:s.baseLanes|o,cachePool:null,transitions:s.transitions},a.memoizedState=s,a.childLanes=e.childLanes&~o,t.memoizedState=$a,r}return a=e.child,e=a.sibling,r=cn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=o),r.return=t,r.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=r,t.memoizedState=null,r}function Ma(e,t){return t=di({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Kr(e,t,o,r){return r!==null&&ma(r),Kn(t,e.child,null,o),e=Ma(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function zu(e,t,o,r,i,a,s){if(o)return t.flags&256?(t.flags&=-257,r=Ia(Error(d(422))),Kr(e,t,s,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,i=t.mode,r=di({mode:"visible",children:r.children},i,0,null),a=_n(a,i,s,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&Kn(t,e.child,null,s),t.child.memoizedState=Fa(s),t.memoizedState=$a,a);if((t.mode&1)===0)return Kr(e,t,s,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var f=r.dgst;return r=f,a=Error(d(419)),r=Ia(a,r,void 0),Kr(e,t,s,r)}if(f=(s&e.childLanes)!==0,at||f){if(r=Ue,r!==null){switch(s&-s){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=(i&(r.suspendedLanes|s))!==0?0:i,i!==0&&i!==a.retryLane&&(a.retryLane=i,Ft(e,i),Ct(r,e,i,-1))}return nl(),r=Ia(Error(d(421))),Kr(e,t,s,r)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=Vu.bind(null,e),i._reactRetry=t,null):(e=a.treeContext,ut=Xt(i.nextSibling),pt=t,Pe=!0,jt=null,e!==null&&(ft[ht++]=Tt,ft[ht++]=$t,ft[ht++]=yn,Tt=e.id,$t=e.overflow,yn=t),t=Ma(t,r.children),t.flags|=4096,t)}function Gd(e,t,o){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),xa(e.return,t,o)}function Ba(e,t,o,r,i){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:o,tailMode:i}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=o,a.tailMode=i)}function Qd(e,t,o){var r=t.pendingProps,i=r.revealOrder,a=r.tail;if(et(e,t,r.children,o),r=Re.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Gd(e,o,t);else if(e.tag===19)Gd(e,o,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(Ce(Re,r),(t.mode&1)===0)t.memoizedState=null;else switch(i){case"forwards":for(o=t.child,i=null;o!==null;)e=o.alternate,e!==null&&Ur(e)===null&&(i=o),o=o.sibling;o=i,o===null?(i=t.child,t.child=null):(i=o.sibling,o.sibling=null),Ba(t,!1,i,o,a);break;case"backwards":for(o=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Ur(e)===null){t.child=i;break}e=i.sibling,i.sibling=o,o=i,i=e}Ba(t,!0,o,null,a);break;case"together":Ba(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function qr(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Bt(e,t,o){if(e!==null&&(t.dependencies=e.dependencies),Sn|=t.lanes,(o&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(d(153));if(t.child!==null){for(e=t.child,o=cn(e,e.pendingProps),t.child=o,o.return=t;e.sibling!==null;)e=e.sibling,o=o.sibling=cn(e,e.pendingProps),o.return=t;o.sibling=null}return t.child}function Pu(e,t,o){switch(t.tag){case 3:Jd(t),Yn();break;case 5:sd(t);break;case 1:it(t.type)&&Or(t);break;case 4:ba(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;Ce(Fr,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(Ce(Re,Re.current&1),t.flags|=128,null):(o&t.child.childLanes)!==0?Wd(e,t,o):(Ce(Re,Re.current&1),e=Bt(e,t,o),e!==null?e.sibling:null);Ce(Re,Re.current&1);break;case 19:if(r=(o&t.childLanes)!==0,(e.flags&128)!==0){if(r)return Qd(e,t,o);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Ce(Re,Re.current),r)break;return null;case 22:case 23:return t.lanes=0,Bd(e,t,o)}return Bt(e,t,o)}var Yd,Va,Kd,qd;Yd=function(e,t){for(var o=t.child;o!==null;){if(o.tag===5||o.tag===6)e.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===t)break;for(;o.sibling===null;){if(o.return===null||o.return===t)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},Va=function(){},Kd=function(e,t,o,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,jn(Pt.current);var a=null;switch(o){case"input":i=co(e,i),r=co(e,r),a=[];break;case"select":i=Y({},i,{value:void 0}),r=Y({},r,{value:void 0}),a=[];break;case"textarea":i=mo(e,i),r=mo(e,r),a=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Pr)}fo(o,r);var s;o=null;for(O in i)if(!r.hasOwnProperty(O)&&i.hasOwnProperty(O)&&i[O]!=null)if(O==="style"){var f=i[O];for(s in f)f.hasOwnProperty(s)&&(o||(o={}),o[s]="")}else O!=="dangerouslySetInnerHTML"&&O!=="children"&&O!=="suppressContentEditableWarning"&&O!=="suppressHydrationWarning"&&O!=="autoFocus"&&(p.hasOwnProperty(O)?a||(a=[]):(a=a||[]).push(O,null));for(O in r){var y=r[O];if(f=i!=null?i[O]:void 0,r.hasOwnProperty(O)&&y!==f&&(y!=null||f!=null))if(O==="style")if(f){for(s in f)!f.hasOwnProperty(s)||y&&y.hasOwnProperty(s)||(o||(o={}),o[s]="");for(s in y)y.hasOwnProperty(s)&&f[s]!==y[s]&&(o||(o={}),o[s]=y[s])}else o||(a||(a=[]),a.push(O,o)),o=y;else O==="dangerouslySetInnerHTML"?(y=y?y.__html:void 0,f=f?f.__html:void 0,y!=null&&f!==y&&(a=a||[]).push(O,y)):O==="children"?typeof y!="string"&&typeof y!="number"||(a=a||[]).push(O,""+y):O!=="suppressContentEditableWarning"&&O!=="suppressHydrationWarning"&&(p.hasOwnProperty(O)?(y!=null&&O==="onScroll"&&Ee("scroll",e),a||f===y||(a=[])):(a=a||[]).push(O,y))}o&&(a=a||[]).push("style",o);var O=a;(t.updateQueue=O)&&(t.flags|=4)}},qd=function(e,t,o,r){o!==r&&(t.flags|=4)};function Go(e,t){if(!Pe)switch(e.tailMode){case"hidden":t=e.tail;for(var o=null;t!==null;)t.alternate!==null&&(o=t),t=t.sibling;o===null?e.tail=null:o.sibling=null;break;case"collapsed":o=e.tail;for(var r=null;o!==null;)o.alternate!==null&&(r=o),o=o.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Xe(e){var t=e.alternate!==null&&e.alternate.child===e.child,o=0,r=0;if(t)for(var i=e.child;i!==null;)o|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)o|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=o,t}function Ru(e,t,o){var r=t.pendingProps;switch(ca(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Xe(t),null;case 1:return it(t.type)&&Ar(),Xe(t),null;case 3:return r=t.stateNode,Zn(),_e(rt),_e(Ke),Na(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Tr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,jt!==null&&(Za(jt),jt=null))),Va(e,t),Xe(t),null;case 5:wa(t);var i=jn(Vo.current);if(o=t.type,e!==null&&t.stateNode!=null)Kd(e,t,o,r,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(d(166));return Xe(t),null}if(e=jn(Pt.current),Tr(t)){r=t.stateNode,o=t.type;var a=t.memoizedProps;switch(r[zt]=t,r[To]=a,e=(t.mode&1)!==0,o){case"dialog":Ee("cancel",r),Ee("close",r);break;case"iframe":case"object":case"embed":Ee("load",r);break;case"video":case"audio":for(i=0;i<Io.length;i++)Ee(Io[i],r);break;case"source":Ee("error",r);break;case"img":case"image":case"link":Ee("error",r),Ee("load",r);break;case"details":Ee("toggle",r);break;case"input":rr(r,a),Ee("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},Ee("invalid",r);break;case"textarea":ir(r,a),Ee("invalid",r)}fo(o,a),i=null;for(var s in a)if(a.hasOwnProperty(s)){var f=a[s];s==="children"?typeof f=="string"?r.textContent!==f&&(a.suppressHydrationWarning!==!0&&zr(r.textContent,f,e),i=["children",f]):typeof f=="number"&&r.textContent!==""+f&&(a.suppressHydrationWarning!==!0&&zr(r.textContent,f,e),i=["children",""+f]):p.hasOwnProperty(s)&&f!=null&&s==="onScroll"&&Ee("scroll",r)}switch(o){case"input":Rn(r),Et(r,a,!0);break;case"textarea":Rn(r),lr(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Pr)}r=i,t.updateQueue=r,r!==null&&(t.flags|=4)}else{s=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=sr(o)),e==="http://www.w3.org/1999/xhtml"?o==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=s.createElement(o,{is:r.is}):(e=s.createElement(o),o==="select"&&(s=e,r.multiple?s.multiple=!0:r.size&&(s.size=r.size))):e=s.createElementNS(e,o),e[zt]=t,e[To]=r,Yd(e,t,!1,!1),t.stateNode=e;e:{switch(s=ho(o,r),o){case"dialog":Ee("cancel",e),Ee("close",e),i=r;break;case"iframe":case"object":case"embed":Ee("load",e),i=r;break;case"video":case"audio":for(i=0;i<Io.length;i++)Ee(Io[i],e);i=r;break;case"source":Ee("error",e),i=r;break;case"img":case"image":case"link":Ee("error",e),Ee("load",e),i=r;break;case"details":Ee("toggle",e),i=r;break;case"input":rr(e,r),i=co(e,r),Ee("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=Y({},r,{value:void 0}),Ee("invalid",e);break;case"textarea":ir(e,r),i=mo(e,r),Ee("invalid",e);break;default:i=r}fo(o,i),f=i;for(a in f)if(f.hasOwnProperty(a)){var y=f[a];a==="style"?It(e,y):a==="dangerouslySetInnerHTML"?(y=y?y.__html:void 0,y!=null&&A(e,y)):a==="children"?typeof y=="string"?(o!=="textarea"||y!=="")&&I(e,y):typeof y=="number"&&I(e,""+y):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(p.hasOwnProperty(a)?y!=null&&a==="onScroll"&&Ee("scroll",e):y!=null&&H(e,a,y,s))}switch(o){case"input":Rn(e),Et(e,r,!1);break;case"textarea":Rn(e),lr(e);break;case"option":r.value!=null&&e.setAttribute("value",""+ye(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Te(e,!!r.multiple,a,!1):r.defaultValue!=null&&Te(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=Pr)}switch(o){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Xe(t),null;case 6:if(e&&t.stateNode!=null)qd(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(d(166));if(o=jn(Vo.current),jn(Pt.current),Tr(t)){if(r=t.stateNode,o=t.memoizedProps,r[zt]=t,(a=r.nodeValue!==o)&&(e=pt,e!==null))switch(e.tag){case 3:zr(r.nodeValue,o,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&zr(r.nodeValue,o,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(o.nodeType===9?o:o.ownerDocument).createTextNode(r),r[zt]=t,t.stateNode=r}return Xe(t),null;case 13:if(_e(Re),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Pe&&ut!==null&&(t.mode&1)!==0&&(t.flags&128)===0)ed(),Yn(),t.flags|=98560,a=!1;else if(a=Tr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(d(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(d(317));a[zt]=t}else Yn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Xe(t),a=!1}else jt!==null&&(Za(jt),jt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=o,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Re.current&1)!==0?Be===0&&(Be=3):nl())),t.updateQueue!==null&&(t.flags|=4),Xe(t),null);case 4:return Zn(),Va(e,t),e===null&&Do(t.stateNode.containerInfo),Xe(t),null;case 10:return ga(t.type._context),Xe(t),null;case 17:return it(t.type)&&Ar(),Xe(t),null;case 19:if(_e(Re),a=t.memoizedState,a===null)return Xe(t),null;if(r=(t.flags&128)!==0,s=a.rendering,s===null)if(r)Go(a,!1);else{if(Be!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=Ur(e),s!==null){for(t.flags|=128,Go(a,!1),r=s.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=o,o=t.child;o!==null;)a=o,e=r,a.flags&=14680066,s=a.alternate,s===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=s.childLanes,a.lanes=s.lanes,a.child=s.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=s.memoizedProps,a.memoizedState=s.memoizedState,a.updateQueue=s.updateQueue,a.type=s.type,e=s.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),o=o.sibling;return Ce(Re,Re.current&1|2),t.child}e=e.sibling}a.tail!==null&&De()>oo&&(t.flags|=128,r=!0,Go(a,!1),t.lanes=4194304)}else{if(!r)if(e=Ur(s),e!==null){if(t.flags|=128,r=!0,o=e.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),Go(a,!0),a.tail===null&&a.tailMode==="hidden"&&!s.alternate&&!Pe)return Xe(t),null}else 2*De()-a.renderingStartTime>oo&&o!==1073741824&&(t.flags|=128,r=!0,Go(a,!1),t.lanes=4194304);a.isBackwards?(s.sibling=t.child,t.child=s):(o=a.last,o!==null?o.sibling=s:t.child=s,a.last=s)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=De(),t.sibling=null,o=Re.current,Ce(Re,r?o&1|2:o&1),t):(Xe(t),null);case 22:case 23:return tl(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(mt&1073741824)!==0&&(Xe(t),t.subtreeFlags&6&&(t.flags|=8192)):Xe(t),null;case 24:return null;case 25:return null}throw Error(d(156,t.tag))}function Au(e,t){switch(ca(t),t.tag){case 1:return it(t.type)&&Ar(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Zn(),_e(rt),_e(Ke),Na(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return wa(t),null;case 13:if(_e(Re),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(d(340));Yn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return _e(Re),null;case 4:return Zn(),null;case 10:return ga(t.type._context),null;case 22:case 23:return tl(),null;case 24:return null;default:return null}}var Xr=!1,Ze=!1,Ou=typeof WeakSet=="function"?WeakSet:Set,K=null;function to(e,t){var o=e.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(r){Oe(e,t,r)}else o.current=null}function Ua(e,t,o){try{o()}catch(r){Oe(e,t,r)}}var Xd=!1;function Iu(e,t){if(ta=vr,e=Ps(),Gi(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var r=o.getSelection&&o.getSelection();if(r&&r.rangeCount!==0){o=r.anchorNode;var i=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{o.nodeType,a.nodeType}catch{o=null;break e}var s=0,f=-1,y=-1,O=0,U=0,J=e,V=null;t:for(;;){for(var Q;J!==o||i!==0&&J.nodeType!==3||(f=s+i),J!==a||r!==0&&J.nodeType!==3||(y=s+r),J.nodeType===3&&(s+=J.nodeValue.length),(Q=J.firstChild)!==null;)V=J,J=Q;for(;;){if(J===e)break t;if(V===o&&++O===i&&(f=s),V===a&&++U===r&&(y=s),(Q=J.nextSibling)!==null)break;J=V,V=J.parentNode}J=Q}o=f===-1||y===-1?null:{start:f,end:y}}else o=null}o=o||{start:0,end:0}}else o=null;for(na={focusedElem:e,selectionRange:o},vr=!1,K=t;K!==null;)if(t=K,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,K=e;else for(;K!==null;){t=K;try{var q=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(q!==null){var Z=q.memoizedProps,Le=q.memoizedState,P=t.stateNode,w=P.getSnapshotBeforeUpdate(t.elementType===t.type?Z:Nt(t.type,Z),Le);P.__reactInternalSnapshotBeforeUpdate=w}break;case 3:var R=t.stateNode.containerInfo;R.nodeType===1?R.textContent="":R.nodeType===9&&R.documentElement&&R.removeChild(R.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(d(163))}}catch(W){Oe(t,t.return,W)}if(e=t.sibling,e!==null){e.return=t.return,K=e;break}K=t.return}return q=Xd,Xd=!1,q}function Qo(e,t,o){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var a=i.destroy;i.destroy=void 0,a!==void 0&&Ua(t,o,a)}i=i.next}while(i!==r)}}function Zr(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var o=t=t.next;do{if((o.tag&e)===e){var r=o.create;o.destroy=r()}o=o.next}while(o!==t)}}function Ja(e){var t=e.ref;if(t!==null){var o=e.stateNode;switch(e.tag){case 5:e=o;break;default:e=o}typeof t=="function"?t(e):t.current=e}}function Zd(e){var t=e.alternate;t!==null&&(e.alternate=null,Zd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[zt],delete t[To],delete t[aa],delete t[gu],delete t[xu])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function ec(e){return e.tag===5||e.tag===3||e.tag===4}function tc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||ec(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ha(e,t,o){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?o.nodeType===8?o.parentNode.insertBefore(e,t):o.insertBefore(e,t):(o.nodeType===8?(t=o.parentNode,t.insertBefore(e,o)):(t=o,t.appendChild(e)),o=o._reactRootContainer,o!=null||t.onclick!==null||(t.onclick=Pr));else if(r!==4&&(e=e.child,e!==null))for(Ha(e,t,o),e=e.sibling;e!==null;)Ha(e,t,o),e=e.sibling}function Wa(e,t,o){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?o.insertBefore(e,t):o.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Wa(e,t,o),e=e.sibling;e!==null;)Wa(e,t,o),e=e.sibling}var We=null,St=!1;function rn(e,t,o){for(o=o.child;o!==null;)nc(e,t,o),o=o.sibling}function nc(e,t,o){if(_t&&typeof _t.onCommitFiberUnmount=="function")try{_t.onCommitFiberUnmount(ur,o)}catch{}switch(o.tag){case 5:Ze||to(o,t);case 6:var r=We,i=St;We=null,rn(e,t,o),We=r,St=i,We!==null&&(St?(e=We,o=o.stateNode,e.nodeType===8?e.parentNode.removeChild(o):e.removeChild(o)):We.removeChild(o.stateNode));break;case 18:We!==null&&(St?(e=We,o=o.stateNode,e.nodeType===8?ia(e.parentNode,o):e.nodeType===1&&ia(e,o),Co(e)):ia(We,o.stateNode));break;case 4:r=We,i=St,We=o.stateNode.containerInfo,St=!0,rn(e,t,o),We=r,St=i;break;case 0:case 11:case 14:case 15:if(!Ze&&(r=o.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var a=i,s=a.destroy;a=a.tag,s!==void 0&&((a&2)!==0||(a&4)!==0)&&Ua(o,t,s),i=i.next}while(i!==r)}rn(e,t,o);break;case 1:if(!Ze&&(to(o,t),r=o.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=o.memoizedProps,r.state=o.memoizedState,r.componentWillUnmount()}catch(f){Oe(o,t,f)}rn(e,t,o);break;case 21:rn(e,t,o);break;case 22:o.mode&1?(Ze=(r=Ze)||o.memoizedState!==null,rn(e,t,o),Ze=r):rn(e,t,o);break;default:rn(e,t,o)}}function oc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var o=e.stateNode;o===null&&(o=e.stateNode=new Ou),t.forEach(function(r){var i=Uu.bind(null,e,r);o.has(r)||(o.add(r),r.then(i,i))})}}function kt(e,t){var o=t.deletions;if(o!==null)for(var r=0;r<o.length;r++){var i=o[r];try{var a=e,s=t,f=s;e:for(;f!==null;){switch(f.tag){case 5:We=f.stateNode,St=!1;break e;case 3:We=f.stateNode.containerInfo,St=!0;break e;case 4:We=f.stateNode.containerInfo,St=!0;break e}f=f.return}if(We===null)throw Error(d(160));nc(a,s,i),We=null,St=!1;var y=i.alternate;y!==null&&(y.return=null),i.return=null}catch(O){Oe(i,t,O)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)rc(t,e),t=t.sibling}function rc(e,t){var o=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(kt(t,e),At(e),r&4){try{Qo(3,e,e.return),Zr(3,e)}catch(Z){Oe(e,e.return,Z)}try{Qo(5,e,e.return)}catch(Z){Oe(e,e.return,Z)}}break;case 1:kt(t,e),At(e),r&512&&o!==null&&to(o,o.return);break;case 5:if(kt(t,e),At(e),r&512&&o!==null&&to(o,o.return),e.flags&32){var i=e.stateNode;try{I(i,"")}catch(Z){Oe(e,e.return,Z)}}if(r&4&&(i=e.stateNode,i!=null)){var a=e.memoizedProps,s=o!==null?o.memoizedProps:a,f=e.type,y=e.updateQueue;if(e.updateQueue=null,y!==null)try{f==="input"&&a.type==="radio"&&a.name!=null&&An(i,a),ho(f,s);var O=ho(f,a);for(s=0;s<y.length;s+=2){var U=y[s],J=y[s+1];U==="style"?It(i,J):U==="dangerouslySetInnerHTML"?A(i,J):U==="children"?I(i,J):H(i,U,J,O)}switch(f){case"input":po(i,a);break;case"textarea":ar(i,a);break;case"select":var V=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!a.multiple;var Q=a.value;Q!=null?Te(i,!!a.multiple,Q,!1):V!==!!a.multiple&&(a.defaultValue!=null?Te(i,!!a.multiple,a.defaultValue,!0):Te(i,!!a.multiple,a.multiple?[]:"",!1))}i[To]=a}catch(Z){Oe(e,e.return,Z)}}break;case 6:if(kt(t,e),At(e),r&4){if(e.stateNode===null)throw Error(d(162));i=e.stateNode,a=e.memoizedProps;try{i.nodeValue=a}catch(Z){Oe(e,e.return,Z)}}break;case 3:if(kt(t,e),At(e),r&4&&o!==null&&o.memoizedState.isDehydrated)try{Co(t.containerInfo)}catch(Z){Oe(e,e.return,Z)}break;case 4:kt(t,e),At(e);break;case 13:kt(t,e),At(e),i=e.child,i.flags&8192&&(a=i.memoizedState!==null,i.stateNode.isHidden=a,!a||i.alternate!==null&&i.alternate.memoizedState!==null||(Ya=De())),r&4&&oc(e);break;case 22:if(U=o!==null&&o.memoizedState!==null,e.mode&1?(Ze=(O=Ze)||U,kt(t,e),Ze=O):kt(t,e),At(e),r&8192){if(O=e.memoizedState!==null,(e.stateNode.isHidden=O)&&!U&&(e.mode&1)!==0)for(K=e,U=e.child;U!==null;){for(J=K=U;K!==null;){switch(V=K,Q=V.child,V.tag){case 0:case 11:case 14:case 15:Qo(4,V,V.return);break;case 1:to(V,V.return);var q=V.stateNode;if(typeof q.componentWillUnmount=="function"){r=V,o=V.return;try{t=r,q.props=t.memoizedProps,q.state=t.memoizedState,q.componentWillUnmount()}catch(Z){Oe(r,o,Z)}}break;case 5:to(V,V.return);break;case 22:if(V.memoizedState!==null){lc(J);continue}}Q!==null?(Q.return=V,K=Q):lc(J)}U=U.sibling}e:for(U=null,J=e;;){if(J.tag===5){if(U===null){U=J;try{i=J.stateNode,O?(a=i.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(f=J.stateNode,y=J.memoizedProps.style,s=y!=null&&y.hasOwnProperty("display")?y.display:null,f.style.display=Ne("display",s))}catch(Z){Oe(e,e.return,Z)}}}else if(J.tag===6){if(U===null)try{J.stateNode.nodeValue=O?"":J.memoizedProps}catch(Z){Oe(e,e.return,Z)}}else if((J.tag!==22&&J.tag!==23||J.memoizedState===null||J===e)&&J.child!==null){J.child.return=J,J=J.child;continue}if(J===e)break e;for(;J.sibling===null;){if(J.return===null||J.return===e)break e;U===J&&(U=null),J=J.return}U===J&&(U=null),J.sibling.return=J.return,J=J.sibling}}break;case 19:kt(t,e),At(e),r&4&&oc(e);break;case 21:break;default:kt(t,e),At(e)}}function At(e){var t=e.flags;if(t&2){try{e:{for(var o=e.return;o!==null;){if(ec(o)){var r=o;break e}o=o.return}throw Error(d(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(I(i,""),r.flags&=-33);var a=tc(e);Wa(e,a,i);break;case 3:case 4:var s=r.stateNode.containerInfo,f=tc(e);Ha(e,f,s);break;default:throw Error(d(161))}}catch(y){Oe(e,e.return,y)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Du(e,t,o){K=e,ic(e)}function ic(e,t,o){for(var r=(e.mode&1)!==0;K!==null;){var i=K,a=i.child;if(i.tag===22&&r){var s=i.memoizedState!==null||Xr;if(!s){var f=i.alternate,y=f!==null&&f.memoizedState!==null||Ze;f=Xr;var O=Ze;if(Xr=s,(Ze=y)&&!O)for(K=i;K!==null;)s=K,y=s.child,s.tag===22&&s.memoizedState!==null?sc(i):y!==null?(y.return=s,K=y):sc(i);for(;a!==null;)K=a,ic(a),a=a.sibling;K=i,Xr=f,Ze=O}ac(e)}else(i.subtreeFlags&8772)!==0&&a!==null?(a.return=i,K=a):ac(e)}}function ac(e){for(;K!==null;){var t=K;if((t.flags&8772)!==0){var o=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ze||Zr(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ze)if(o===null)r.componentDidMount();else{var i=t.elementType===t.type?o.memoizedProps:Nt(t.type,o.memoizedProps);r.componentDidUpdate(i,o.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&ld(t,a,r);break;case 3:var s=t.updateQueue;if(s!==null){if(o=null,t.child!==null)switch(t.child.tag){case 5:o=t.child.stateNode;break;case 1:o=t.child.stateNode}ld(t,s,o)}break;case 5:var f=t.stateNode;if(o===null&&t.flags&4){o=f;var y=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":y.autoFocus&&o.focus();break;case"img":y.src&&(o.src=y.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var O=t.alternate;if(O!==null){var U=O.memoizedState;if(U!==null){var J=U.dehydrated;J!==null&&Co(J)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(d(163))}Ze||t.flags&512&&Ja(t)}catch(V){Oe(t,t.return,V)}}if(t===e){K=null;break}if(o=t.sibling,o!==null){o.return=t.return,K=o;break}K=t.return}}function lc(e){for(;K!==null;){var t=K;if(t===e){K=null;break}var o=t.sibling;if(o!==null){o.return=t.return,K=o;break}K=t.return}}function sc(e){for(;K!==null;){var t=K;try{switch(t.tag){case 0:case 11:case 15:var o=t.return;try{Zr(4,t)}catch(y){Oe(t,o,y)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var i=t.return;try{r.componentDidMount()}catch(y){Oe(t,i,y)}}var a=t.return;try{Ja(t)}catch(y){Oe(t,a,y)}break;case 5:var s=t.return;try{Ja(t)}catch(y){Oe(t,s,y)}}}catch(y){Oe(t,t.return,y)}if(t===e){K=null;break}var f=t.sibling;if(f!==null){f.return=t.return,K=f;break}K=t.return}}var Lu=Math.ceil,ei=j.ReactCurrentDispatcher,Ga=j.ReactCurrentOwner,vt=j.ReactCurrentBatchConfig,xe=0,Ue=null,$e=null,Ge=0,mt=0,no=Zt(0),Be=0,Yo=null,Sn=0,ti=0,Qa=0,Ko=null,lt=null,Ya=0,oo=1/0,Vt=null,ni=!1,Ka=null,an=null,oi=!1,ln=null,ri=0,qo=0,qa=null,ii=-1,ai=0;function tt(){return(xe&6)!==0?De():ii!==-1?ii:ii=De()}function sn(e){return(e.mode&1)===0?1:(xe&2)!==0&&Ge!==0?Ge&-Ge:yu.transition!==null?(ai===0&&(ai=ts()),ai):(e=je,e!==0||(e=window.event,e=e===void 0?16:cs(e.type)),e)}function Ct(e,t,o,r){if(50<qo)throw qo=0,qa=null,Error(d(185));wo(e,o,r),((xe&2)===0||e!==Ue)&&(e===Ue&&((xe&2)===0&&(ti|=o),Be===4&&dn(e,Ge)),st(e,r),o===1&&xe===0&&(t.mode&1)===0&&(oo=De()+500,Ir&&tn()))}function st(e,t){var o=e.callbackNode;yp(e,t);var r=hr(e,e===Ue?Ge:0);if(r===0)o!==null&&Xl(o),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(o!=null&&Xl(o),t===1)e.tag===0?vu(cc.bind(null,e)):Ys(cc.bind(null,e)),fu(function(){(xe&6)===0&&tn()}),o=null;else{switch(ns(r)){case 1:o=Pi;break;case 4:o=Zl;break;case 16:o=pr;break;case 536870912:o=es;break;default:o=pr}o=vc(o,dc.bind(null,e))}e.callbackPriority=t,e.callbackNode=o}}function dc(e,t){if(ii=-1,ai=0,(xe&6)!==0)throw Error(d(327));var o=e.callbackNode;if(ro()&&e.callbackNode!==o)return null;var r=hr(e,e===Ue?Ge:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=li(e,r);else{t=r;var i=xe;xe|=2;var a=uc();(Ue!==e||Ge!==t)&&(Vt=null,oo=De()+500,Cn(e,t));do try{Fu();break}catch(f){pc(e,f)}while(!0);ha(),ei.current=a,xe=i,$e!==null?t=0:(Ue=null,Ge=0,t=Be)}if(t!==0){if(t===2&&(i=Ri(e),i!==0&&(r=i,t=Xa(e,i))),t===1)throw o=Yo,Cn(e,0),dn(e,r),st(e,De()),o;if(t===6)dn(e,r);else{if(i=e.current.alternate,(r&30)===0&&!Tu(i)&&(t=li(e,r),t===2&&(a=Ri(e),a!==0&&(r=a,t=Xa(e,a))),t===1))throw o=Yo,Cn(e,0),dn(e,r),st(e,De()),o;switch(e.finishedWork=i,e.finishedLanes=r,t){case 0:case 1:throw Error(d(345));case 2:En(e,lt,Vt);break;case 3:if(dn(e,r),(r&130023424)===r&&(t=Ya+500-De(),10<t)){if(hr(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){tt(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=ra(En.bind(null,e,lt,Vt),t);break}En(e,lt,Vt);break;case 4:if(dn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,i=-1;0<r;){var s=31-bt(r);a=1<<s,s=t[s],s>i&&(i=s),r&=~a}if(r=i,r=De()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Lu(r/1960))-r,10<r){e.timeoutHandle=ra(En.bind(null,e,lt,Vt),r);break}En(e,lt,Vt);break;case 5:En(e,lt,Vt);break;default:throw Error(d(329))}}}return st(e,De()),e.callbackNode===o?dc.bind(null,e):null}function Xa(e,t){var o=Ko;return e.current.memoizedState.isDehydrated&&(Cn(e,t).flags|=256),e=li(e,t),e!==2&&(t=lt,lt=o,t!==null&&Za(t)),e}function Za(e){lt===null?lt=e:lt.push.apply(lt,e)}function Tu(e){for(var t=e;;){if(t.flags&16384){var o=t.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var r=0;r<o.length;r++){var i=o[r],a=i.getSnapshot;i=i.value;try{if(!wt(a(),i))return!1}catch{return!1}}}if(o=t.child,t.subtreeFlags&16384&&o!==null)o.return=t,t=o;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function dn(e,t){for(t&=~Qa,t&=~ti,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var o=31-bt(t),r=1<<o;e[o]=-1,t&=~r}}function cc(e){if((xe&6)!==0)throw Error(d(327));ro();var t=hr(e,0);if((t&1)===0)return st(e,De()),null;var o=li(e,t);if(e.tag!==0&&o===2){var r=Ri(e);r!==0&&(t=r,o=Xa(e,r))}if(o===1)throw o=Yo,Cn(e,0),dn(e,t),st(e,De()),o;if(o===6)throw Error(d(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,En(e,lt,Vt),st(e,De()),null}function el(e,t){var o=xe;xe|=1;try{return e(t)}finally{xe=o,xe===0&&(oo=De()+500,Ir&&tn())}}function kn(e){ln!==null&&ln.tag===0&&(xe&6)===0&&ro();var t=xe;xe|=1;var o=vt.transition,r=je;try{if(vt.transition=null,je=1,e)return e()}finally{je=r,vt.transition=o,xe=t,(xe&6)===0&&tn()}}function tl(){mt=no.current,_e(no)}function Cn(e,t){e.finishedWork=null,e.finishedLanes=0;var o=e.timeoutHandle;if(o!==-1&&(e.timeoutHandle=-1,mu(o)),$e!==null)for(o=$e.return;o!==null;){var r=o;switch(ca(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ar();break;case 3:Zn(),_e(rt),_e(Ke),Na();break;case 5:wa(r);break;case 4:Zn();break;case 13:_e(Re);break;case 19:_e(Re);break;case 10:ga(r.type._context);break;case 22:case 23:tl()}o=o.return}if(Ue=e,$e=e=cn(e.current,null),Ge=mt=t,Be=0,Yo=null,Qa=ti=Sn=0,lt=Ko=null,wn!==null){for(t=0;t<wn.length;t++)if(o=wn[t],r=o.interleaved,r!==null){o.interleaved=null;var i=r.next,a=o.pending;if(a!==null){var s=a.next;a.next=i,r.next=s}o.pending=r}wn=null}return e}function pc(e,t){do{var o=$e;try{if(ha(),Jr.current=Qr,Hr){for(var r=Ae.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Hr=!1}if(Nn=0,Ve=Me=Ae=null,Uo=!1,Jo=0,Ga.current=null,o===null||o.return===null){Be=1,Yo=t,$e=null;break}e:{var a=e,s=o.return,f=o,y=t;if(t=Ge,f.flags|=32768,y!==null&&typeof y=="object"&&typeof y.then=="function"){var O=y,U=f,J=U.tag;if((U.mode&1)===0&&(J===0||J===11||J===15)){var V=U.alternate;V?(U.updateQueue=V.updateQueue,U.memoizedState=V.memoizedState,U.lanes=V.lanes):(U.updateQueue=null,U.memoizedState=null)}var Q=Ld(s);if(Q!==null){Q.flags&=-257,Td(Q,s,f,a,t),Q.mode&1&&Dd(a,O,t),t=Q,y=O;var q=t.updateQueue;if(q===null){var Z=new Set;Z.add(y),t.updateQueue=Z}else q.add(y);break e}else{if((t&1)===0){Dd(a,O,t),nl();break e}y=Error(d(426))}}else if(Pe&&f.mode&1){var Le=Ld(s);if(Le!==null){(Le.flags&65536)===0&&(Le.flags|=256),Td(Le,s,f,a,t),ma(eo(y,f));break e}}a=y=eo(y,f),Be!==4&&(Be=2),Ko===null?Ko=[a]:Ko.push(a),a=s;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var P=Od(a,y,t);ad(a,P);break e;case 1:f=y;var w=a.type,R=a.stateNode;if((a.flags&128)===0&&(typeof w.getDerivedStateFromError=="function"||R!==null&&typeof R.componentDidCatch=="function"&&(an===null||!an.has(R)))){a.flags|=65536,t&=-t,a.lanes|=t;var W=Id(a,f,t);ad(a,W);break e}}a=a.return}while(a!==null)}fc(o)}catch(ne){t=ne,$e===o&&o!==null&&($e=o=o.return);continue}break}while(!0)}function uc(){var e=ei.current;return ei.current=Qr,e===null?Qr:e}function nl(){(Be===0||Be===3||Be===2)&&(Be=4),Ue===null||(Sn&268435455)===0&&(ti&268435455)===0||dn(Ue,Ge)}function li(e,t){var o=xe;xe|=2;var r=uc();(Ue!==e||Ge!==t)&&(Vt=null,Cn(e,t));do try{$u();break}catch(i){pc(e,i)}while(!0);if(ha(),xe=o,ei.current=r,$e!==null)throw Error(d(261));return Ue=null,Ge=0,Be}function $u(){for(;$e!==null;)mc($e)}function Fu(){for(;$e!==null&&!cp();)mc($e)}function mc(e){var t=xc(e.alternate,e,mt);e.memoizedProps=e.pendingProps,t===null?fc(e):$e=t,Ga.current=null}function fc(e){var t=e;do{var o=t.alternate;if(e=t.return,(t.flags&32768)===0){if(o=Ru(o,t,mt),o!==null){$e=o;return}}else{if(o=Au(o,t),o!==null){o.flags&=32767,$e=o;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Be=6,$e=null;return}}if(t=t.sibling,t!==null){$e=t;return}$e=t=e}while(t!==null);Be===0&&(Be=5)}function En(e,t,o){var r=je,i=vt.transition;try{vt.transition=null,je=1,Mu(e,t,o,r)}finally{vt.transition=i,je=r}return null}function Mu(e,t,o,r){do ro();while(ln!==null);if((xe&6)!==0)throw Error(d(327));o=e.finishedWork;var i=e.finishedLanes;if(o===null)return null;if(e.finishedWork=null,e.finishedLanes=0,o===e.current)throw Error(d(177));e.callbackNode=null,e.callbackPriority=0;var a=o.lanes|o.childLanes;if(bp(e,a),e===Ue&&($e=Ue=null,Ge=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||oi||(oi=!0,vc(pr,function(){return ro(),null})),a=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||a){a=vt.transition,vt.transition=null;var s=je;je=1;var f=xe;xe|=4,Ga.current=null,Iu(e,o),rc(o,e),au(na),vr=!!ta,na=ta=null,e.current=o,Du(o),pp(),xe=f,je=s,vt.transition=a}else e.current=o;if(oi&&(oi=!1,ln=e,ri=i),a=e.pendingLanes,a===0&&(an=null),fp(o.stateNode),st(e,De()),t!==null)for(r=e.onRecoverableError,o=0;o<t.length;o++)i=t[o],r(i.value,{componentStack:i.stack,digest:i.digest});if(ni)throw ni=!1,e=Ka,Ka=null,e;return(ri&1)!==0&&e.tag!==0&&ro(),a=e.pendingLanes,(a&1)!==0?e===qa?qo++:(qo=0,qa=e):qo=0,tn(),null}function ro(){if(ln!==null){var e=ns(ri),t=vt.transition,o=je;try{if(vt.transition=null,je=16>e?16:e,ln===null)var r=!1;else{if(e=ln,ln=null,ri=0,(xe&6)!==0)throw Error(d(331));var i=xe;for(xe|=4,K=e.current;K!==null;){var a=K,s=a.child;if((K.flags&16)!==0){var f=a.deletions;if(f!==null){for(var y=0;y<f.length;y++){var O=f[y];for(K=O;K!==null;){var U=K;switch(U.tag){case 0:case 11:case 15:Qo(8,U,a)}var J=U.child;if(J!==null)J.return=U,K=J;else for(;K!==null;){U=K;var V=U.sibling,Q=U.return;if(Zd(U),U===O){K=null;break}if(V!==null){V.return=Q,K=V;break}K=Q}}}var q=a.alternate;if(q!==null){var Z=q.child;if(Z!==null){q.child=null;do{var Le=Z.sibling;Z.sibling=null,Z=Le}while(Z!==null)}}K=a}}if((a.subtreeFlags&2064)!==0&&s!==null)s.return=a,K=s;else e:for(;K!==null;){if(a=K,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:Qo(9,a,a.return)}var P=a.sibling;if(P!==null){P.return=a.return,K=P;break e}K=a.return}}var w=e.current;for(K=w;K!==null;){s=K;var R=s.child;if((s.subtreeFlags&2064)!==0&&R!==null)R.return=s,K=R;else e:for(s=w;K!==null;){if(f=K,(f.flags&2048)!==0)try{switch(f.tag){case 0:case 11:case 15:Zr(9,f)}}catch(ne){Oe(f,f.return,ne)}if(f===s){K=null;break e}var W=f.sibling;if(W!==null){W.return=f.return,K=W;break e}K=f.return}}if(xe=i,tn(),_t&&typeof _t.onPostCommitFiberRoot=="function")try{_t.onPostCommitFiberRoot(ur,e)}catch{}r=!0}return r}finally{je=o,vt.transition=t}}return!1}function hc(e,t,o){t=eo(o,t),t=Od(e,t,1),e=on(e,t,1),t=tt(),e!==null&&(wo(e,1,t),st(e,t))}function Oe(e,t,o){if(e.tag===3)hc(e,e,o);else for(;t!==null;){if(t.tag===3){hc(t,e,o);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(an===null||!an.has(r))){e=eo(o,e),e=Id(t,e,1),t=on(t,e,1),e=tt(),t!==null&&(wo(t,1,e),st(t,e));break}}t=t.return}}function Bu(e,t,o){var r=e.pingCache;r!==null&&r.delete(t),t=tt(),e.pingedLanes|=e.suspendedLanes&o,Ue===e&&(Ge&o)===o&&(Be===4||Be===3&&(Ge&130023424)===Ge&&500>De()-Ya?Cn(e,0):Qa|=o),st(e,t)}function gc(e,t){t===0&&((e.mode&1)===0?t=1:(t=fr,fr<<=1,(fr&130023424)===0&&(fr=4194304)));var o=tt();e=Ft(e,t),e!==null&&(wo(e,t,o),st(e,o))}function Vu(e){var t=e.memoizedState,o=0;t!==null&&(o=t.retryLane),gc(e,o)}function Uu(e,t){var o=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(o=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(d(314))}r!==null&&r.delete(t),gc(e,o)}var xc;xc=function(e,t,o){if(e!==null)if(e.memoizedProps!==t.pendingProps||rt.current)at=!0;else{if((e.lanes&o)===0&&(t.flags&128)===0)return at=!1,Pu(e,t,o);at=(e.flags&131072)!==0}else at=!1,Pe&&(t.flags&1048576)!==0&&Ks(t,Lr,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;qr(e,t),e=t.pendingProps;var i=Wn(t,Ke.current);Xn(t,o),i=Ca(null,t,r,e,i,o);var a=Ea();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,it(r)?(a=!0,Or(t)):a=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,ya(t),i.updater=Yr,t.stateNode=i,i._reactInternals=t,Oa(t,r,e,o),t=Ta(null,t,r,!0,a,o)):(t.tag=0,Pe&&a&&da(t),et(null,t,i,o),t=t.child),t;case 16:r=t.elementType;e:{switch(qr(e,t),e=t.pendingProps,i=r._init,r=i(r._payload),t.type=r,i=t.tag=Hu(r),e=Nt(r,e),i){case 0:t=La(null,t,r,e,o);break e;case 1:t=Ud(null,t,r,e,o);break e;case 11:t=$d(null,t,r,e,o);break e;case 14:t=Fd(null,t,r,Nt(r.type,e),o);break e}throw Error(d(306,r,""))}return t;case 0:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Nt(r,i),La(e,t,r,i,o);case 1:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Nt(r,i),Ud(e,t,r,i,o);case 3:e:{if(Jd(t),e===null)throw Error(d(387));r=t.pendingProps,a=t.memoizedState,i=a.element,id(e,t),Vr(t,r,null,o);var s=t.memoizedState;if(r=s.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){i=eo(Error(d(423)),t),t=Hd(e,t,r,o,i);break e}else if(r!==i){i=eo(Error(d(424)),t),t=Hd(e,t,r,o,i);break e}else for(ut=Xt(t.stateNode.containerInfo.firstChild),pt=t,Pe=!0,jt=null,o=od(t,null,r,o),t.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(Yn(),r===i){t=Bt(e,t,o);break e}et(e,t,r,o)}t=t.child}return t;case 5:return sd(t),e===null&&ua(t),r=t.type,i=t.pendingProps,a=e!==null?e.memoizedProps:null,s=i.children,oa(r,i)?s=null:a!==null&&oa(r,a)&&(t.flags|=32),Vd(e,t),et(e,t,s,o),t.child;case 6:return e===null&&ua(t),null;case 13:return Wd(e,t,o);case 4:return ba(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Kn(t,null,r,o):et(e,t,r,o),t.child;case 11:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Nt(r,i),$d(e,t,r,i,o);case 7:return et(e,t,t.pendingProps,o),t.child;case 8:return et(e,t,t.pendingProps.children,o),t.child;case 12:return et(e,t,t.pendingProps.children,o),t.child;case 10:e:{if(r=t.type._context,i=t.pendingProps,a=t.memoizedProps,s=i.value,Ce(Fr,r._currentValue),r._currentValue=s,a!==null)if(wt(a.value,s)){if(a.children===i.children&&!rt.current){t=Bt(e,t,o);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var f=a.dependencies;if(f!==null){s=a.child;for(var y=f.firstContext;y!==null;){if(y.context===r){if(a.tag===1){y=Mt(-1,o&-o),y.tag=2;var O=a.updateQueue;if(O!==null){O=O.shared;var U=O.pending;U===null?y.next=y:(y.next=U.next,U.next=y),O.pending=y}}a.lanes|=o,y=a.alternate,y!==null&&(y.lanes|=o),xa(a.return,o,t),f.lanes|=o;break}y=y.next}}else if(a.tag===10)s=a.type===t.type?null:a.child;else if(a.tag===18){if(s=a.return,s===null)throw Error(d(341));s.lanes|=o,f=s.alternate,f!==null&&(f.lanes|=o),xa(s,o,t),s=a.sibling}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===t){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}et(e,t,i.children,o),t=t.child}return t;case 9:return i=t.type,r=t.pendingProps.children,Xn(t,o),i=gt(i),r=r(i),t.flags|=1,et(e,t,r,o),t.child;case 14:return r=t.type,i=Nt(r,t.pendingProps),i=Nt(r.type,i),Fd(e,t,r,i,o);case 15:return Md(e,t,t.type,t.pendingProps,o);case 17:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Nt(r,i),qr(e,t),t.tag=1,it(r)?(e=!0,Or(t)):e=!1,Xn(t,o),Rd(t,r,i),Oa(t,r,i,o),Ta(null,t,r,!0,e,o);case 19:return Qd(e,t,o);case 22:return Bd(e,t,o)}throw Error(d(156,t.tag))};function vc(e,t){return ql(e,t)}function Ju(e,t,o,r){this.tag=e,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yt(e,t,o,r){return new Ju(e,t,o,r)}function ol(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Hu(e){if(typeof e=="function")return ol(e)?1:0;if(e!=null){if(e=e.$$typeof,e===He)return 11;if(e===Qe)return 14}return 2}function cn(e,t){var o=e.alternate;return o===null?(o=yt(e.tag,t,e.key,e.mode),o.elementType=e.elementType,o.type=e.type,o.stateNode=e.stateNode,o.alternate=e,e.alternate=o):(o.pendingProps=t,o.type=e.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=e.flags&14680064,o.childLanes=e.childLanes,o.lanes=e.lanes,o.child=e.child,o.memoizedProps=e.memoizedProps,o.memoizedState=e.memoizedState,o.updateQueue=e.updateQueue,t=e.dependencies,o.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},o.sibling=e.sibling,o.index=e.index,o.ref=e.ref,o}function si(e,t,o,r,i,a){var s=2;if(r=e,typeof e=="function")ol(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case X:return _n(o.children,i,a,t);case G:s=8,i|=8;break;case be:return e=yt(12,o,t,i|2),e.elementType=be,e.lanes=a,e;case Fe:return e=yt(13,o,t,i),e.elementType=Fe,e.lanes=a,e;case te:return e=yt(19,o,t,i),e.elementType=te,e.lanes=a,e;case ze:return di(o,i,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ie:s=10;break e;case pe:s=9;break e;case He:s=11;break e;case Qe:s=14;break e;case ue:s=16,r=null;break e}throw Error(d(130,e==null?e:typeof e,""))}return t=yt(s,o,t,i),t.elementType=e,t.type=r,t.lanes=a,t}function _n(e,t,o,r){return e=yt(7,e,r,t),e.lanes=o,e}function di(e,t,o,r){return e=yt(22,e,r,t),e.elementType=ze,e.lanes=o,e.stateNode={isHidden:!1},e}function rl(e,t,o){return e=yt(6,e,null,t),e.lanes=o,e}function il(e,t,o){return t=yt(4,e.children!==null?e.children:[],e.key,t),t.lanes=o,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Wu(e,t,o,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ai(0),this.expirationTimes=Ai(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ai(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function al(e,t,o,r,i,a,s,f,y){return e=new Wu(e,t,o,f,y),t===1?(t=1,a===!0&&(t|=8)):t=0,a=yt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},ya(a),e}function Gu(e,t,o){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:F,key:r==null?null:""+r,children:e,containerInfo:t,implementation:o}}function yc(e){if(!e)return en;e=e._reactInternals;e:{if(gn(e)!==e||e.tag!==1)throw Error(d(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(it(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(d(171))}if(e.tag===1){var o=e.type;if(it(o))return Gs(e,o,t)}return t}function bc(e,t,o,r,i,a,s,f,y){return e=al(o,r,!0,e,i,a,s,f,y),e.context=yc(null),o=e.current,r=tt(),i=sn(o),a=Mt(r,i),a.callback=t??null,on(o,a,i),e.current.lanes=i,wo(e,i,r),st(e,r),e}function ci(e,t,o,r){var i=t.current,a=tt(),s=sn(i);return o=yc(o),t.context===null?t.context=o:t.pendingContext=o,t=Mt(a,s),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=on(i,t,s),e!==null&&(Ct(e,i,s,a),Br(e,i,s)),s}function pi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function wc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var o=e.retryLane;e.retryLane=o!==0&&o<t?o:t}}function ll(e,t){wc(e,t),(e=e.alternate)&&wc(e,t)}function Qu(){return null}var jc=typeof reportError=="function"?reportError:function(e){console.error(e)};function sl(e){this._internalRoot=e}ui.prototype.render=sl.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(d(409));ci(e,t,null,null)},ui.prototype.unmount=sl.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;kn(function(){ci(null,e,null,null)}),t[Dt]=null}};function ui(e){this._internalRoot=e}ui.prototype.unstable_scheduleHydration=function(e){if(e){var t=is();e={blockedOn:null,target:e,priority:t};for(var o=0;o<Yt.length&&t!==0&&t<Yt[o].priority;o++);Yt.splice(o,0,e),o===0&&ss(e)}};function dl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function mi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Nc(){}function Yu(e,t,o,r,i){if(i){if(typeof r=="function"){var a=r;r=function(){var O=pi(s);a.call(O)}}var s=bc(t,r,e,0,null,!1,!1,"",Nc);return e._reactRootContainer=s,e[Dt]=s.current,Do(e.nodeType===8?e.parentNode:e),kn(),s}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var f=r;r=function(){var O=pi(y);f.call(O)}}var y=al(e,0,!1,null,null,!1,!1,"",Nc);return e._reactRootContainer=y,e[Dt]=y.current,Do(e.nodeType===8?e.parentNode:e),kn(function(){ci(t,y,o,r)}),y}function fi(e,t,o,r,i){var a=o._reactRootContainer;if(a){var s=a;if(typeof i=="function"){var f=i;i=function(){var y=pi(s);f.call(y)}}ci(t,s,e,i)}else s=Yu(o,t,e,i,r);return pi(s)}os=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var o=bo(t.pendingLanes);o!==0&&(Oi(t,o|1),st(t,De()),(xe&6)===0&&(oo=De()+500,tn()))}break;case 13:kn(function(){var r=Ft(e,1);if(r!==null){var i=tt();Ct(r,e,1,i)}}),ll(e,1)}},Ii=function(e){if(e.tag===13){var t=Ft(e,134217728);if(t!==null){var o=tt();Ct(t,e,134217728,o)}ll(e,134217728)}},rs=function(e){if(e.tag===13){var t=sn(e),o=Ft(e,t);if(o!==null){var r=tt();Ct(o,e,t,r)}ll(e,t)}},is=function(){return je},as=function(e,t){var o=je;try{return je=e,t()}finally{je=o}},go=function(e,t,o){switch(t){case"input":if(po(e,o),t=o.name,o.type==="radio"&&t!=null){for(o=e;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<o.length;t++){var r=o[t];if(r!==e&&r.form===e.form){var i=Rr(r);if(!i)throw Error(d(90));or(r),po(r,i)}}}break;case"textarea":ar(e,o);break;case"select":t=o.value,t!=null&&Te(e,!!o.multiple,t,!1)}},Jl=el,Hl=kn;var Ku={usingClientEntryPoint:!1,Events:[$o,Jn,Rr,Vl,Ul,el]},Xo={findFiberByHostInstance:xn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},qu={bundleType:Xo.bundleType,version:Xo.version,rendererPackageName:Xo.rendererPackageName,rendererConfig:Xo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:j.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Yl(e),e===null?null:e.stateNode},findFiberByHostInstance:Xo.findFiberByHostInstance||Qu,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var hi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!hi.isDisabled&&hi.supportsFiber)try{ur=hi.inject(qu),_t=hi}catch{}}return dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ku,dt.createPortal=function(e,t){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!dl(t))throw Error(d(200));return Gu(e,t,null,o)},dt.createRoot=function(e,t){if(!dl(e))throw Error(d(299));var o=!1,r="",i=jc;return t!=null&&(t.unstable_strictMode===!0&&(o=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=al(e,1,!1,null,null,o,!1,r,i),e[Dt]=t.current,Do(e.nodeType===8?e.parentNode:e),new sl(t)},dt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(d(188)):(e=Object.keys(e).join(","),Error(d(268,e)));return e=Yl(t),e=e===null?null:e.stateNode,e},dt.flushSync=function(e){return kn(e)},dt.hydrate=function(e,t,o){if(!mi(t))throw Error(d(200));return fi(null,e,t,!0,o)},dt.hydrateRoot=function(e,t,o){if(!dl(e))throw Error(d(405));var r=o!=null&&o.hydratedSources||null,i=!1,a="",s=jc;if(o!=null&&(o.unstable_strictMode===!0&&(i=!0),o.identifierPrefix!==void 0&&(a=o.identifierPrefix),o.onRecoverableError!==void 0&&(s=o.onRecoverableError)),t=bc(t,null,e,1,o??null,i,!1,a,s),e[Dt]=t.current,Do(e),r)for(e=0;e<r.length;e++)o=r[e],i=o._getVersion,i=i(o._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[o,i]:t.mutableSourceEagerHydrationData.push(o,i);return new ui(t)},dt.render=function(e,t,o){if(!mi(t))throw Error(d(200));return fi(null,e,t,!1,o)},dt.unmountComponentAtNode=function(e){if(!mi(e))throw Error(d(40));return e._reactRootContainer?(kn(function(){fi(null,null,e,!1,function(){e._reactRootContainer=null,e[Dt]=null})}),!0):!1},dt.unstable_batchedUpdates=el,dt.unstable_renderSubtreeIntoContainer=function(e,t,o,r){if(!mi(o))throw Error(d(200));if(e==null||e._reactInternals===void 0)throw Error(d(38));return fi(e,t,o,!1,r)},dt.version="18.3.1-next-f1338f8080-20240426",dt}var Rc;function im(){if(Rc)return ul.exports;Rc=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(u){console.error(u)}}return l(),ul.exports=rm(),ul.exports}var Ac;function am(){if(Ac)return gi;Ac=1;var l=im();return gi.createRoot=l.createRoot,gi.hydrateRoot=l.hydrateRoot,gi}var lm=am();const sm=tp(lm);function dm(l){try{return new Date(l).toLocaleString("pt-BR")}catch{return l}}function cm(){const[l,u]=D.useState([]),[d,k]=D.useState(""),[p,N]=D.useState("Todos"),[_,g]=D.useState("");async function C(){var v;if(!((v=window.ytalsegAPI)!=null&&v.listarPDFs)){g("Histórico disponível apenas no aplicativo instalado.");return}const x=await window.ytalsegAPI.listarPDFs();x.ok&&u(x.historico||[])}D.useEffect(()=>{C()},[]);const z=D.useMemo(()=>l.filter(x=>{const v=p==="Todos"||x.tipo===p,h=`${x.nome} ${x.caminho} ${x.tipo}`.toLowerCase().includes(d.toLowerCase());return v&&h}),[l,d,p]);async function E(x){var c,h;const v=await((h=(c=window.ytalsegAPI)==null?void 0:c.abrirPDF)==null?void 0:h.call(c,x.caminho));v&&!v.ok&&g(v.erro||"Não consegui abrir o PDF.")}async function b(x){var c,h;const v=await((h=(c=window.ytalsegAPI)==null?void 0:c.abrirPastaPDF)==null?void 0:h.call(c,x.caminho));v&&!v.ok&&g(v.erro||"Não consegui abrir a pasta.")}return n.jsxs("div",{className:"hist-page",children:[n.jsx("style",{children:`
        .hist-page {
          display: grid;
          gap: 16px;
        }

        .hist-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: end;
          flex-wrap: wrap;
        }

        .hist-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .hist-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .hist-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .hist-input,
        .hist-select {
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 800;
          background: white;
        }

        .hist-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111;
        }

        .hist-btn-green {
          background: #00B050;
          color: white;
        }

        .hist-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          overflow: hidden;
        }

        .hist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .hist-table th {
          text-align: left;
          background: #f9fafb;
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 1000;
          color: #374151;
        }

        .hist-table td {
          padding: 12px;
          border-bottom: 1px solid #eef0f2;
          font-weight: 750;
          vertical-align: middle;
        }

        .hist-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #166534;
          font-size: 12px;
          font-weight: 1000;
        }

        .hist-badge.interno {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .hist-path {
          max-width: 420px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
          font-size: 12px;
        }

        .hist-empty {
          padding: 22px;
          color: #6b7280;
          font-weight: 900;
        }

        .hist-msg {
          padding: 12px;
          border-radius: 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          font-weight: 900;
        }
      `}),n.jsxs("div",{className:"hist-head",children:[n.jsxs("div",{className:"hist-title",children:[n.jsx("h1",{children:"Histórico de PDFs"}),n.jsx("p",{children:"Lista automática dos PDFs Cliente e Interno gerados pelo aplicativo."})]}),n.jsxs("div",{className:"hist-actions",children:[n.jsx("input",{className:"hist-input",placeholder:"Buscar PDF...",value:d,onChange:x=>k(x.target.value)}),n.jsxs("select",{className:"hist-select",value:p,onChange:x=>N(x.target.value),children:[n.jsx("option",{children:"Todos"}),n.jsx("option",{children:"Cliente"}),n.jsx("option",{children:"Interno"})]}),n.jsx("button",{className:"hist-btn hist-btn-green",onClick:C,children:"Atualizar"})]})]}),_&&n.jsx("div",{className:"hist-msg",children:_}),n.jsxs("div",{className:"hist-card",children:[n.jsxs("table",{className:"hist-table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Tipo"}),n.jsx("th",{children:"Arquivo"}),n.jsx("th",{children:"Gerado em"}),n.jsx("th",{children:"Caminho"}),n.jsx("th",{children:"Ações"})]})}),n.jsx("tbody",{children:z.map(x=>n.jsxs("tr",{children:[n.jsx("td",{children:n.jsx("span",{className:`hist-badge ${x.tipo==="Interno"?"interno":""}`,children:x.tipo})}),n.jsx("td",{children:x.nome}),n.jsx("td",{children:dm(x.criadoEm)}),n.jsx("td",{children:n.jsx("div",{className:"hist-path",title:x.caminho,children:x.caminho})}),n.jsx("td",{children:n.jsxs("div",{className:"hist-actions",children:[n.jsx("button",{className:"hist-btn",onClick:()=>E(x),children:"Abrir"}),n.jsx("button",{className:"hist-btn",onClick:()=>b(x),children:"Pasta"})]})})]},x.id))})]}),z.length===0&&n.jsx("div",{className:"hist-empty",children:"Nenhum PDF encontrado ainda. Gere um PDF Cliente ou Interno para aparecer aqui."})]})]})}const hl=""+new URL("logo-t_EOwCrC.png",import.meta.url).href,pm=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`;async function um({cliente:l,referencia:u,valor:d,descricao:k="Relatório aprovado"}){const p={cliente:l,referencia:u,descricao:k,valor:Number(d||0),status:"pendente",dataEmissao:new Date().toISOString().slice(0,10),dataRecebimento:""},_=await(await fetch(`${pm}/financeiro`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)})).json();if(_.status==="erro")throw new Error(_.erro||"Erro ao enviar para financeiro.");return!0}const gl=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,un="#00B050",Ot={diariaNormal:560,diariaNoturna:560,sabado:400,domingoFeriado:350,hora20:672,hora50:840,hora100:1120,adicionalNoturno:140};function nt(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(l||0)}function mm(l){const u=nt(l);return u.length>=16?"valor-nota valor-nota-gg":u.length>=14?"valor-nota valor-nota-g":u.length>=12?"valor-nota valor-nota-m":"valor-nota"}function Ml(l){if(!l)return"-";const u=l.toLowerCase();return u.includes("seg")?"Segunda-feira":u.includes("ter")?"Terça-feira":u.includes("qua")?"Quarta-feira":u.includes("qui")?"Quinta-feira":u.includes("sex")?"Sexta-feira":u.includes("sáb")||u.includes("sab")?"Sábado":u.includes("dom")?"Domingo":l}function fm(l){const u=Ml(l).toLowerCase();return u.includes("sáb")||u.includes("sab")?"sabado":u.includes("dom")?"domingo":"diaria"}function hm(l,u){return new Date(u,l,0).getDate()}function np(l){return["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"][Math.max(0,Math.min(11,l-1))]}function gm(l,u){return`${np(l)} / ${u}`}function xm(l,u,d){return["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"][new Date(d,u-1,l).getDay()]}function Oc(l){return{diariaNormal:(l==null?void 0:l.diaria_diurna)??Ot.diariaNormal,diariaNoturna:(l==null?void 0:l.diaria_noturna)??Ot.diariaNoturna,sabado:(l==null?void 0:l.sabado)??Ot.sabado,domingoFeriado:(l==null?void 0:l.domingo_feriado)??Ot.domingoFeriado,hora20:(l==null?void 0:l.hora_20)??Ot.hora20,hora50:(l==null?void 0:l.hora_50)??Ot.hora50,hora100:(l==null?void 0:l.hora_100)??Ot.hora100,adicionalNoturno:(l==null?void 0:l.adicional_noturno)??Ot.adicionalNoturno}}function Tl(l,u,d=!1,k=Ot){return d?k.domingoFeriado:l==="sabado"?k.sabado:l==="domingo"?k.domingoFeriado:u==="noturna"?k.diariaNoturna:k.diariaNormal}function xl(l,u=!1,d=Ot){return Tl(l,"noturna",u,d)*.25}function zn(l,u=3,d=2026){return Array.from({length:hm(u,d)}).map((k,p)=>{const N=p+1,_=String(N).padStart(2,"0"),g=l.find(b=>{var x;return(x=b.data)==null?void 0:x.startsWith(`${_}/`)}),C=Ml((g==null?void 0:g.semana)||xm(N,u,d)),z=(g==null?void 0:g.tipo_dia)||fm(C),E=!!(g!=null&&g.periodo_noturno);return{data:(g==null?void 0:g.data)||`${_}/${String(u).padStart(2,"0")}/${d}`,semana:C,tipo_dia:z,feriado:!1,diurna:!!(g!=null&&g.periodo_diurno),noturna:E,extra20:!1,extra50:!1,extra100:!1,adicional:E&&((g==null?void 0:g.adicional_noturno)??0)>0}})}function vm(){const[l,u]=D.useState(1.3),[d,k]=D.useState(null),[p,N]=D.useState(null),_=new Date,[g,C]=D.useState(_.getMonth()+1),[z,E]=D.useState(_.getFullYear()),[b,x]=D.useState(zn([],_.getMonth()+1,_.getFullYear())),[v,c]=D.useState([]),[h,m]=D.useState(!1),[L,T]=D.useState(""),[H,j]=D.useState(""),[M,F]=D.useState([]),[X,G]=D.useState("geoambiental"),[be,Ie]=D.useState(!1),[pe,He]=D.useState({id:"",nome:"",cnpj:"",diaria_diurna:0,diaria_noturna:0,sabado:0,domingo_feriado:0,hora_20:0,hora_50:0,hora_100:0,adicional_noturno:0,usa_adicional_noturno:!0,feriado_usa_valor_domingo:!0});async function Fe(){var A,I;try{const de=await(await fetch(`${gl}/empresas`)).json();de.status==="ok"&&(F(de.empresas||[]),(I=(A=de.empresas)==null?void 0:A[0])!=null&&I.id&&!de.empresas.find(Ne=>Ne.id===X)&&G(de.empresas[0].id))}catch{F([])}}D.useEffect(()=>{Fe()},[]);const te=M.find(A=>A.id===X)||null,Qe=gm(g,z),ue=Oc(te);function ze(A){const I=Oc(te),ee=I.hora20>0&&I.adicionalNoturno===0;return A.map(de=>({...de,extra20:de.extra20||ee&&de.noturna,adicional:I.adicionalNoturno>0?de.adicional:!1}))}const $=D.useMemo(()=>{const A=b.filter(le=>le.diurna).length,I=b.filter(le=>le.noturna).length,ee=b.reduce((le,ke)=>le+(ke.adicional?xl(ke.tipo_dia,ke.feriado,ue):0),0),de=b.filter(le=>le.extra20).length*ue.hora20,Ne=b.filter(le=>le.extra50).length*ue.hora50,It=b.filter(le=>le.extra100).length*ue.hora100,Dn=b.reduce((le,ke)=>{const go=ke.diurna?Tl(ke.tipo_dia,"diurna",ke.feriado,ue):0,Ht=ke.noturna?Tl(ke.tipo_dia,"noturna",ke.feriado,ue):0;return le+go+Ht},0),fo=b.filter(le=>le.tipo_dia==="sabado").reduce((le,ke)=>le+(ke.diurna?ue.sabado:0)+(ke.noturna?ue.sabado:0)+(ke.adicional?xl(ke.tipo_dia,ke.feriado,ue):0),0),ho=b.filter(le=>le.tipo_dia==="domingo"||le.feriado).reduce((le,ke)=>le+(ke.diurna?ue.domingoFeriado:0)+(ke.noturna?ue.domingoFeriado:0)+(ke.adicional?xl(ke.tipo_dia,ke.feriado,ue):0),0);return{dias_normais:b.filter(le=>le.tipo_dia==="diaria"&&!le.feriado&&(le.diurna||le.noturna)).length,sabados:b.filter(le=>le.tipo_dia==="sabado"&&(le.diurna||le.noturna)).length,domingos_feriados:b.filter(le=>(le.tipo_dia==="domingo"||le.feriado)&&(le.diurna||le.noturna)).length,feriados:b.filter(le=>le.feriado).length,periodos_diurnos:A,periodos_noturnos:I,extras20:b.filter(le=>le.extra20).length,extras50:b.filter(le=>le.extra50).length,extras100:b.filter(le=>le.extra100).length,total_diarias:Dn,total_sabados:fo,total_domingos_feriados:ho,total_20:de,total_50:Ne,total_100:It,total_adicional_noturno:ee,valor_total:Dn+de+Ne+It+ee}},[b,te]),ae=b,Y=D.useMemo(()=>v.reduce((A,I)=>A+Number(I.valor||0),0),[v]),S=($.valor_total||0)+Y,B=b.some(A=>A.diurna||A.noturna||A.feriado||A.extra20||A.extra50||A.extra100||A.adicional),ce="ytalseg_relatorio_rascunho_v11";D.useEffect(()=>{try{const A=localStorage.getItem(ce);if(!A)return;const I=JSON.parse(A);Array.isArray(I.diasEditaveis)&&x(I.diasEditaveis),Array.isArray(I.servicos)&&c(I.servicos),I.resultado&&N(I.resultado),I.empresaId&&G(I.empresaId),I.salvoEm?j(`Rascunho recuperado automaticamente (${new Date(I.salvoEm).toLocaleString("pt-BR")}).`):j("Rascunho recuperado automaticamente.")}catch{j("")}},[]),D.useEffect(()=>{try{const A={salvoEm:new Date().toISOString(),empresaId:X,resultado:p,diasEditaveis:b,servicos:v};localStorage.setItem(ce,JSON.stringify(A)),j("Rascunho salvo automaticamente.")}catch{j("Não foi possível salvar o rascunho automático.")}},[X,p,b,v]);function me(){window.confirm("Tem certeza que deseja apagar o rascunho automático?")&&(localStorage.removeItem(ce),j("Rascunho limpo."))}function he(){window.confirm("Limpar toda a tabela de dias, serviços e resultado atual?")&&(k(null),N(null),c([]),T(""),x(zn([],g,z)),localStorage.removeItem(ce),j("Tabela completa limpa. Novo relatório pronto."))}async function ge(){var A;try{if((A=window.ytalsegAPI)!=null&&A.gerarBackup){const I=await window.ytalsegAPI.gerarBackup();I.ok?j(`Backup gerado com sucesso: ${I.pasta||""}`):j(I.erro||"Não foi possível gerar backup.")}else j("Backup manual disponível apenas no aplicativo instalado.")}catch{j("Erro ao gerar backup.")}}function we(A){try{const I="ytalseg_relatorios_versoes_v11_2",ee=JSON.parse(localStorage.getItem(I)||"[]"),de={id:Date.now(),tipo:A,cliente:(te==null?void 0:te.nome)||"Cliente não informado",referencia:Qe,valor:S,criadoEm:new Date().toISOString(),empresaId:X,resultado:p,diasEditaveis:b,servicos:v};ee.unshift(de),localStorage.setItem(I,JSON.stringify(ee.slice(0,50)))}catch{}}function ye(){return{origem:"YTALSEG-RELATORIO-V66",salvoEm:new Date().toISOString(),cliente:(te==null?void 0:te.nome)||"Cliente não informado",referencia:Qe,valor:S,empresaId:X,mesAnalise:g,anoAnalise:z,resultado:p,diasEditaveis:b,servicos:v}}function Se(){try{const A=ye(),I=new Blob([JSON.stringify(A,null,2)],{type:"application/json;charset=utf-8"}),ee=URL.createObjectURL(I),de=document.createElement("a"),Ne=((te==null?void 0:te.nome)||"cliente").replace(/[^a-z0-9]+/gi,"_");de.href=ee,de.download=`relatorio-editavel-${Ne}-${Qe.replace(/[^a-z0-9]+/gi,"_")}.json`,de.click(),URL.revokeObjectURL(ee),j("Backup editável do relatório salvo. Você pode abrir esse arquivo depois e continuar a edição.")}catch{j("Não foi possível salvar o backup editável do relatório.")}}function Ye(A){const I=(A==null?void 0:A.dados)||A;if(!I)throw new Error("Arquivo vazio.");I.empresaId&&G(I.empresaId),I.mesAnalise&&C(Number(I.mesAnalise)),I.anoAnalise&&E(Number(I.anoAnalise)),I.resultado&&N(I.resultado),Array.isArray(I.diasEditaveis)?x(I.diasEditaveis):x(zn([],Number(I.mesAnalise||g),Number(I.anoAnalise||z))),Array.isArray(I.servicos)&&c(I.servicos),k(null),T(""),j(`Relatório carregado para edição${I.referencia?` (${I.referencia})`:""}.`)}function Rn(A){var de;const I=(de=A.target.files)==null?void 0:de[0];if(A.target.value="",!I)return;const ee=new FileReader;ee.onload=()=>{try{const Ne=JSON.parse(String(ee.result||"{}"));Ye(Ne)}catch(Ne){T((Ne==null?void 0:Ne.message)||"Backup inválido. Selecione um JSON gerado pelo próprio relatório.")}},ee.readAsText(I,"utf-8")}function or(){try{const A=JSON.parse(localStorage.getItem("ytalseg_relatorios_versoes_v11_2")||"[]");if(!Array.isArray(A)||A.length===0){j("Nenhum relatório salvo no histórico local ainda.");return}Ye(A[0])}catch{j("Não foi possível abrir o último relatório salvo.")}}function Jt(A){const I=[];return te!=null&&te.nome||I.push("cliente/empresa não selecionado"),(!S||S<=0)&&I.push("valor da nota zerado"),!B&&v.length===0&&I.push("sem dias trabalhados e sem serviços diversos"),v.some(Ne=>Number(Ne.valor||0)>0&&!String(Ne.descricao||"").trim())&&I.push("serviço diverso com valor, mas sem descrição"),I.length===0?!0:window.confirm(`Atenção antes de gerar PDF ${A.toUpperCase()}:

- ${I.join(`
- `)}

Deseja continuar mesmo assim?`)}async function co(){var A;if(!d){T("Selecione um PDF.");return}m(!0),T(""),N(null);try{const I=new FormData;I.append("file",d),I.append("empresa_id",X),I.append("mes",String(g)),I.append("ano",String(z));const de=await(await fetch(`${gl}/upload-pdf`,{method:"POST",body:I})).json();if(de.status==="erro")throw new Error(de.erro);N(de),x(ze(zn(((A=de.calculo)==null?void 0:A.dias_detectados)||[])))}catch(I){T(I.message||"Erro ao processar PDF.")}finally{m(!1)}}function rr(){c([...v,{data:"",descricao:"",valor:0}])}function An(A,I,ee){c(de=>de.map((Ne,It)=>It===A?{...Ne,[I]:I==="valor"?Number(ee||0):ee}:Ne))}function po(A){c(I=>I.filter((ee,de)=>de!==A))}function Et(A,I,ee){x(de=>de.map((Ne,It)=>{if(It!==A)return Ne;if(I==="noturna"){const Dn=ue.hora20>0&&ue.adicionalNoturno===0;return{...Ne,noturna:ee,adicional:!!(ee&&ue.adicionalNoturno>0),extra20:ee&&Dn?!0:Ne.extra20}}return I==="adicional"?{...Ne,adicional:ee&&Ne.noturna}:{...Ne,[I]:ee}}))}function uo(){He({id:"",nome:"",cnpj:"",diaria_diurna:0,diaria_noturna:0,sabado:0,domingo_feriado:0,hora_20:0,hora_50:0,hora_100:0,adicional_noturno:0,usa_adicional_noturno:!0,feriado_usa_valor_domingo:!0}),Ie(!0)}function hn(){te&&(He({id:te.id,nome:te.nome,cnpj:te.cnpj||"",diaria_diurna:te.diaria_diurna||0,diaria_noturna:te.diaria_noturna||0,sabado:te.sabado||0,domingo_feriado:te.domingo_feriado||0,hora_20:te.hora_20||0,hora_50:te.hora_50||0,hora_100:te.hora_100||0,adicional_noturno:te.adicional_noturno||0,usa_adicional_noturno:te.usa_adicional_noturno??!0,feriado_usa_valor_domingo:te.feriado_usa_valor_domingo??!0}),Ie(!0))}function Te(A,I){He(ee=>({...ee,[A]:I}))}async function mo(){if(!pe.nome.trim()){T("Informe o nome da empresa.");return}try{T("");const A={...pe,diaria_diurna:Number(pe.diaria_diurna||0),diaria_noturna:Number(pe.diaria_noturna||0),sabado:Number(pe.sabado||0),domingo_feriado:Number(pe.domingo_feriado||0),hora_20:Number(pe.hora_20||0),hora_50:Number(pe.hora_50||0),hora_100:Number(pe.hora_100||0),adicional_noturno:Number(pe.adicional_noturno||0)},ee=await(await fetch(`${gl}/empresas`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(A)})).json();if(ee.status==="erro")throw new Error(ee.erro);await Fe(),G(ee.id),Ie(!1)}catch(A){T(A.message||"Erro ao salvar empresa.")}}function ir(){x(A=>A.map(I=>({...I,extra20:I.noturna?!0:I.extra20})))}function ar(){x(A=>A.map(I=>({...I,extra20:!1})))}function lr(){T(""),N({filename:"Relatório manual",status:"manual",texto_extraido_preview:"",calculo:{dias_detectados:[],resumo:{dias_normais:0,sabados:0,domingos_feriados:0,total_diarias:0,total_sabados:0,total_domingos_feriados:0,valor_total:0}}}),x(zn([],g,z))}async function sr(){if(Jt("cliente")){try{um({cliente:(te==null?void 0:te.nome)||"Cliente não informado",referencia:Qe,valor:S,descricao:"Relatório aprovado"})}catch{}we("cliente"),document.body.classList.add("modo-cliente"),document.body.classList.remove("modo-interno"),setTimeout(async()=>{var A;try{if((A=window.ytalsegAPI)!=null&&A.salvarPDF){const I=await window.ytalsegAPI.salvarPDF(`Relatorio_Cliente_${(te==null?void 0:te.nome)||"cliente"}.pdf`);I!=null&&I.ok?j(`PDF cliente salvo: ${I.path||""}`):I!=null&&I.erro&&I.erro!=="cancelado"&&j(`Erro ao salvar PDF cliente: ${I.erro}`)}else window.print()}catch{j("Erro ao gerar PDF cliente.")}finally{document.body.classList.remove("modo-cliente")}},250)}}function On(A){Jt(A)&&(A==="cliente"?(document.body.classList.add("modo-cliente"),document.body.classList.remove("modo-interno")):(document.body.classList.add("modo-interno"),document.body.classList.remove("modo-cliente")),j(`Visualização ${A} aberta. Confira o relatório antes de salvar.`),setTimeout(async()=>{var I;try{if((I=window.ytalsegAPI)!=null&&I.visualizarPDF){const ee=`Preview_${A}_${(te==null?void 0:te.nome)||"relatorio"}.pdf`,de=await window.ytalsegAPI.visualizarPDF(ee);de!=null&&de.ok?j(`Visualização ${A} aberta em PDF.`):de!=null&&de.erro&&de.erro!=="cancelado"&&j(`Erro na visualização ${A}: ${de.erro}`)}else window.print()}catch{j(`Erro ao abrir visualização ${A}.`)}finally{setTimeout(()=>{document.body.classList.remove("modo-cliente"),document.body.classList.remove("modo-interno")},600)}},150))}async function In(){Jt("interno")&&(we("interno"),document.body.classList.add("modo-interno"),document.body.classList.remove("modo-cliente"),setTimeout(async()=>{var A;try{if((A=window.ytalsegAPI)!=null&&A.salvarPDF){const I=await window.ytalsegAPI.salvarPDF(`Relatorio_Interno_${(te==null?void 0:te.nome)||"interno"}.pdf`);I!=null&&I.ok?j(`PDF interno salvo: ${I.path||""}`):I!=null&&I.erro&&I.erro!=="cancelado"&&j(`Erro ao salvar PDF interno: ${I.erro}`)}else window.print()}catch{j("Erro ao gerar PDF interno.")}finally{document.body.classList.remove("modo-interno")}},250))}return n.jsxs("div",{className:"page preview-mode",children:[n.jsx("style",{children:`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #f3f4f6;
          font-family: Arial, sans-serif;
          color: #111;
        }

        .page {
          padding: 18px;
        }

        .sheet {
          position: relative;
          max-width: 1250px;
          margin: auto;
          background: white;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 12px 35px rgba(0,0,0,.10);
          overflow: hidden;
        }
.logo-topo{
  width:100px;
  height:100px;
  object-fit:contain;
}

.logo-card{
  width:162px !important;
  height:162px !important;
  object-fit:contain !important;
}

.logo-watermark{
  width:100%;
  height:100%;
  object-fit:contain;
  opacity:.115;
}
.watermark{
  position:absolute;
  top:53%;
  left:50%;
  transform:translate(-50%,-50%);
  width:980px;
  height:980px;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9;
  pointer-events:none;
}
       
       .content {
  position: relative;
  z-index: 1;
}

        .top {
          display: grid;
          grid-template-columns: 1fr 1.2fr 110px;
          gap: 22px;
          align-items: center;
          margin-bottom: 20px;
        }

        .brand {
          font-size: 64px;
          font-weight: 900;
          letter-spacing: -2px;
          color: ${un};
          line-height: .9;
        }

        .brand-sub {
          font-size: 13px;
          font-weight: 800;
          margin-top: 8px;
        }

        .title {
          color: ${un};
          font-size: 42px;
          font-weight: 900;
          border-left: 2px solid ${un};
          padding-left: 28px;
        }

        .seal{
width:90px;
height:90px;
display:flex;
align-items:center;
justify-content:center;
overflow:hidden;
border:none;
background:none;
}

        .upload {
          background: #f8fafc;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .toolbar-grid {
          display:grid;
          grid-template-columns: 132px 104px minmax(210px, .85fr) minmax(230px, 1fr);
          gap:8px;
          align-items:end;
        }

        .toolbar-grid > div { min-width: 0; }

        .toolbar-action { width: 100%; min-height: 35px; padding: 8px 10px; font-size: 11.5px; }

        .toolbar-label {
          display:block;
          font-size:11px;
          font-weight:900;
          color:#006b34;
          margin-bottom:3px;
        }

        .empresa-select {
          width:100%;
          border:1px solid #ccc;
          border-radius:6px;
          padding:7px 8px;
          font-size:12px;
          font-weight:800;
          background:white;
          height:35px;
        }

        .cadastro-box {
          margin-top:12px;
          padding:12px;
          border:1px solid #cfd8d3;
          border-radius:12px;
          background:#ffffff;
        }

        .cadastro-title {
          color:#006b34;
          font-size:15px;
          font-weight:900;
          margin-bottom:10px;
        }

        .cadastro-grid {
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap:10px;
        }

        .cadastro-grid label {
          display:block;
          font-size:11px;
          font-weight:900;
          color:#333;
          margin-bottom:4px;
        }

        .cadastro-grid input {
          width:100%;
          border:1px solid #ccc;
          border-radius:6px;
          padding:7px;
          font-size:12px;
        }

        .check-line {
          display:flex;
          align-items:center;
          gap:6px;
          font-size:12px;
          font-weight:800;
          margin-top:20px;
        }

        .check-line input {
          width:auto;
        }

        input {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 7px 8px;
          font-size: 12px;
          height: 35px;
        }

        input[type="file"] {
          padding: 6px 8px;
          font-size: 11px;
        }

        button {
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-main,
        .btn-gray,
        .btn-red { background: ${un}; color: white; }

        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
          gap: 8px;
          margin: 10px 0 6px;
          align-items: stretch;
        }

        .actions button,
        .actions label {
          justify-content: center;
          min-height: 38px;
          font-size: 12px;
          text-align: center;
        }

        .action-group {
          position: relative;
        }

        .action-group summary {
          min-height: 38px;
          border-radius: 8px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 900;
          text-align: center;
          cursor: pointer;
          list-style: none;
          background: ${un};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-group summary::-webkit-details-marker { display: none; }

        .action-group-menu {
          position: absolute;
          z-index: 30;
          left: 0;
          right: 0;
          top: calc(100% + 6px);
          display: grid;
          gap: 6px;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 12px 28px rgba(0,0,0,.16);
        }

        .action-group-menu button,
        .action-group-menu label {
          width: 100%;
          min-height: 36px;
        }

        @media (max-width: 1280px) {
          .toolbar-grid {
            grid-template-columns: 120px 96px minmax(190px, .85fr) minmax(210px, 1fr);
          }
        }

        @media (max-width: 1050px) {
          .toolbar-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .info {
          display: grid;
          grid-template-columns: 1.25fr 1fr 1.1fr 1.1fr;
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 18px;
        }

        .info div {
          padding: 14px;
          border-right: 1px solid #ccc;
        }

        .info div:last-child {
          border-right: none;
        }

        .label {
          color: ${un};
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .value {
          font-size: 17px;
          font-weight: 800;
          margin-top: 7px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.9fr 1fr;
          gap: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background: rgba(255,255,255,.52);
          color: #555;
          padding: 8px 5px;
          font-weight: 900;
        }

        td {
          border: 1px solid rgba(190,190,190,.55);
          padding: 6px 5px;
          text-align: center;
          background: rgba(255,255,255,.20);
        }

        .left { text-align: left; }
        .right { text-align: right; }

        .total-row td {
          background: ${un};
          color: white;
          font-weight: 900;
        }

        .panel {
          border: 1px solid rgba(180,180,180,.55);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
          background: rgba(255,255,255,.30);
          backdrop-filter: blur(1px);
        }

        .panel-title {
          background: rgba(255,255,255,.48);
          color: #00853d;
          font-size: 16px;
          font-weight: 900;
          padding: 11px;
          text-align: center;
        }

        .obs {
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 14px;
          margin-top: 16px;
          background: white;
        }

        .obs h3 {
          color: ${un};
          margin: 0 0 6px;
        }

        .obs p {
          margin: 3px 0 10px;
        }

        .footer-final {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 18px;
          margin-top: 18px;
        }

        .ytalseg-card-final{
  display:grid;
  grid-template-columns: 165px 1fr;
  min-height:130px;
  border-radius:24px;
  overflow:hidden;
  background:rgba(255,255,255,.88);
  box-shadow:0 8px 24px rgba(0,0,0,.12);
  border:1px solid #d7d7d7;
}

        .logo-area-final{
  background:white;
  display:flex;
  align-items:center;
  justify-content:center;
  padding-left:8px;
}

.logo-circle-final{
  width:162px !important;
  height:162px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
}

        .info-area-final{
  padding:14px 18px;
  border-right:6px solid #00B050;
  border-top-right-radius:80px;
  border-bottom-right-radius:80px;
}

        .info-area-final h2{
  margin:0;
  color:#00B050;
  font-size:30px;
  font-weight:900;
}

.info-area-final p{
  margin:2px 0;
  font-size:13px;
  color:#111;
  font-weight:600;
}

.rep-line{
  display:grid;
  grid-template-columns:92px 1fr;
  max-width:360px;
  font-size:13px;
  margin-top:2px;
  color:#111;
  font-weight:700;
}

        .email-line {
          margin-top: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .nota-final {
          background: linear-gradient(135deg, #ffe76a, #ffc400);
          border: 1px solid #d8a900;
          border-radius: 18px;
          display: grid;
          grid-template-columns: 105px 1fr;
          align-items: center;
          padding: 18px;
          color: #06351d;
          box-shadow: 0 8px 24px rgba(0,0,0,.12);
        }

        .nota-icon {
          font-size: 58px;
          text-align: center;
        }

        .nota-final span {
          display: block;
          font-size: 24px;
          font-weight: 900;
        }

        .nota-final strong {
          display: block;
          font-size: 58px;
          font-weight: 900;
        }

        .print-only {
          display: none;
        }

        .checkbox-small {
          width:auto !important;
          transform:scale(.85);
          padding:0 !important;
          cursor:pointer;
        }

        .print-value {
          display:none;
        }

        .manual-hint{
          margin-top:6px;
          font-size:11px;
          color:#006b34;
          font-weight:800;
        }



        .rascunho-status {
          width: 202mm;
          max-width: calc(100vw - 32px);
          margin: 0 auto 10px auto;
          padding: 9px 12px;
          border-radius: 12px;
          background: #ecfdf5;
          color: #166534;
          border: 1px solid rgba(0,176,80,.25);
          font-size: 12px;
          font-weight: 900;
        }

        @media print {
          .rascunho-status {
            display: none !important;
          }
        }

        .screen-toolbar{
          width:202mm;
          max-width: calc(100vw - 32px);
          margin:0 auto 14px auto;
        }

        /* PREVIEW A4: força a tela de edição a usar a mesma proporção da impressão */
        .preview-mode{
          padding:18px;
          background:#e5e7eb;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .preview-mode .sheet{
          width:202mm;
          min-height:289mm;
          height:auto;
          padding:5mm;
          margin:0 auto;
          box-shadow:0 12px 35px rgba(0,0,0,.16);
          border-radius:0;
          max-width:none;
          overflow:hidden;
          background:rgba(255,255,255,.92) !important;
        }

        .preview-mode .top{
          grid-template-columns:1fr 1fr 55px;
          gap:8px;
          margin-bottom:6px;
        }

        .preview-mode .brand{font-size:30px; letter-spacing:-1px;}
        .preview-mode .brand-sub{font-size:7px; margin-top:3px;}
        .preview-mode .title{font-size:24px; padding-left:10px;}
        .preview-mode .seal{width:52px; height:52px; border:none;}
        .preview-mode .logo-topo{width:52px; height:52px;}

        .preview-mode .info{margin-bottom:7px; background-color:rgba(255,255,255,.65) !important;}
        .preview-mode .info div{padding:5px;}
        .preview-mode .label{font-size:7px;}
        .preview-mode .value{font-size:9px; margin-top:2px;}

        .preview-mode .grid{grid-template-columns:1.85fr 1fr; gap:7px;}
        .preview-mode table{font-size:6.6px; background-color:transparent !important;}
        .preview-mode tbody,
        .preview-mode tr,
        .preview-mode td{background-color:rgba(255,255,255,.42) !important;}
        .preview-mode th,
        .preview-mode .panel-title,
        .preview-mode .total-row td{background-color:#00B050 !important; color:white !important;}
        .preview-mode th,
        .preview-mode td{padding:2.35px;}

        .preview-mode .panel table,
        .preview-mode .panel tbody,
        .preview-mode .panel tr,
        .preview-mode .panel td{background-color:rgba(255,255,255,.28) !important;}
        .preview-mode .panel-title{background-color:rgba(0,176,80,.90) !important;}
        .preview-mode .panel,
        .preview-mode .obs,
        .preview-mode .ytalseg-card-final,
        .preview-mode .nota-final{background-color:rgba(255,255,255,.20) !important;}
        .preview-mode .panel{margin-bottom:5px;}
        .preview-mode .panel-title{font-size:9px; padding:4px;}

        .preview-mode .obs{margin-top:5px; padding:5px;}
        .preview-mode .obs h3{font-size:9px; margin-bottom:1px;}
        .preview-mode .obs p{font-size:7px; margin:2px 0 3px;}
        .preview-mode .obs input{border:none; padding:1px; font-size:7px; background:transparent !important;}
        .preview-mode .obs th:last-child,
        .preview-mode .obs td:last-child{display:none;}

        .preview-mode .footer-final{margin-top:6px; grid-template-columns:1.05fr 1fr; gap:7px;}
        .preview-mode .ytalseg-card-final{min-height:95px; grid-template-columns:105px 1fr; border-radius:15px;}
        .preview-mode .logo-area-final{border-top-right-radius:45px; border-bottom-right-radius:45px;}
        .preview-mode .logo-circle-final{width:88px; height:88px; border-width:5px; font-size:9px;}
        .preview-mode .logo-card{width:88px; height:88px;}
        .preview-mode .info-area-final{padding:6px 10px; border-right-width:5px; border-top-right-radius:45px; border-bottom-right-radius:45px;}
        .preview-mode .info-area-final h2{font-size:16px;}
        .preview-mode .info-area-final p{font-size:7px; margin:1px 0;}
        .preview-mode .info-area-final strong{margin-top:3px; font-size:7px;}
        .preview-mode .rep-line{grid-template-columns:55px 1fr; font-size:7px; margin-top:1px;}
        .preview-mode .email-line{margin-top:2px; font-size:7px;}

        .preview-mode .nota-final{min-height:95px; padding:8px; border-radius:12px; grid-template-columns:55px 1fr;}
        .preview-mode .nota-icon{font-size:32px;}
        .preview-mode .nota-final span{font-size:13px;}
        .preview-mode .nota-final strong{font-size:42px;}

        .preview-mode .watermark{
          position:absolute !important;
          top:53% !important;
          left:50% !important;
          transform:translate(-50%,-50%) !important;
          width:980px !important;
          height:980px !important;
          z-index:9 !important;
        }
        .preview-mode .logo-watermark{width:100% !important; height:100% !important; object-fit:contain !important; opacity:.115 !important;}


        /* V10.13.4 VISUAL - recuperação sem mexer em cálculo */
        .screen-toolbar{
          position: sticky;
          top: 0;
          z-index: 50;
          background: #e5e7eb;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .preview-mode{
          min-height: 100vh;
          overflow: auto;
          align-items: center !important;
        }

        .preview-mode .sheet{
          transition: transform .15s ease;
        }

        .preview-mode .logo-topo{
          width: 72px !important;
          height: 72px !important;
        }

        .preview-mode .seal{
          width: 72px !important;
          height: 72px !important;
        }

        .preview-mode .logo-circle-final{
          width: 112px !important;
          height: 112px !important;
        }

        .preview-mode .logo-card{
          width: 112px !important;
          height: 112px !important;
        }

        .preview-mode .ytalseg-card-final{
          min-height: 112px !important;
          grid-template-columns: 125px 1fr !important;
        }

        .preview-mode .nota-final{
          min-height: 112px !important;
          grid-template-columns: 1fr !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .preview-mode .nota-icon{
          display: none !important;
        }

        .preview-mode .nota-final strong{
          font-size: 44px !important;
          white-space: nowrap !important;
        }


        /* V10.13.4 AJUSTE LOGO + ZOOM */
        .preview-mode .top{
          grid-template-columns:1fr 1.15fr !important;
          gap:12px !important;
          margin-bottom:8px !important;
        }

        .preview-mode .brand{
          font-size:38px !important;
          letter-spacing:-1px !important;
        }

        .preview-mode .brand-sub{
          font-size:9px !important;
          margin-top:4px !important;
          max-width:280px !important;
        }

        .preview-mode .title{
          font-size:32px !important;
          padding-left:14px !important;
        }

        .preview-mode .seal,
        .preview-mode .logo-topo{
          display:none !important;
        }

        .preview-mode .ytalseg-card-final{
          min-height:126px !important;
          grid-template-columns:155px 1fr !important;
        }

        .preview-mode .logo-circle-final{
          width:140px !important;
          height:140px !important;
        }

        .preview-mode .logo-card{
          width:140px !important;
          height:140px !important;
        }

        .preview-mode .nota-final{
          grid-template-columns:1fr !important;
          text-align:center !important;
        }

        .preview-mode .nota-icon{
          display:none !important;
        }


        /* V10.13.5 FINAL LIMPO - cabeçalho sem logo pequena */
        .seal,
        .logo-topo {
          display: none !important;
        }

        .top {
          grid-template-columns: 1fr 1.15fr !important;
          gap: 14px !important;
        }

        .brand {
          font-size: 40px !important;
          letter-spacing: -1px !important;
        }

        .brand-sub {
          font-size: 10px !important;
          max-width: 320px !important;
        }

        .title {
          font-size: 34px !important;
          padding-left: 16px !important;
        }

        .preview-mode .top {
          grid-template-columns: 1fr 1.15fr !important;
          gap: 12px !important;
        }

        .preview-mode .brand {
          font-size: 38px !important;
        }

        .preview-mode .brand-sub {
          font-size: 9px !important;
          max-width: 300px !important;
        }

        .preview-mode .title {
          font-size: 32px !important;
          padding-left: 14px !important;
        }

        .nota-icon {
          display: none !important;
        }

        .nota-final {
          grid-template-columns: 1fr !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .preview-mode .nota-final {
          grid-template-columns: 1fr !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .preview-mode .nota-final strong {
          white-space: nowrap !important;
        }

        .preview-mode .logo-circle-final {
          width: 150px !important;
          height: 150px !important;
        }

        .preview-mode .logo-card {
          width: 150px !important;
          height: 150px !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 165px 1fr !important;
        }


        /* V10.13.6 AJUSTE FINAL VISUAL - aplicado sem mexer em cálculo */
        .seal,
        .logo-topo {
          display: none !important;
        }

        .top {
          grid-template-columns: 1fr 1.2fr !important;
          gap: 14px !important;
        }

        .brand {
          font-size: 40px !important;
          letter-spacing: -1px !important;
        }

        .brand-sub {
          font-size: 10px !important;
          max-width: 330px !important;
          line-height: 1.25 !important;
        }

        .title {
          font-size: 34px !important;
          padding-left: 16px !important;
        }

        .ytalseg-card-final {
          grid-template-columns: 180px 1fr !important;
          min-height: 142px !important;
        }

        .logo-area-final {
          padding: 8px 10px !important;
        }

        .logo-circle-final,
        .logo-card {
          width: 160px !important;
          height: 160px !important;
        }

        .info-area-final {
          padding: 16px 20px !important;
          line-height: 1.35 !important;
        }

        .info-area-final h2 {
          margin-bottom: 6px !important;
        }

        .info-area-final p {
          margin: 3px 0 5px !important;
          line-height: 1.35 !important;
        }

        .info-area-final strong {
          display: block !important;
          margin-top: 6px !important;
          margin-bottom: 6px !important;
          line-height: 1.25 !important;
        }

        .rep-line {
          line-height: 1.35 !important;
          margin-top: 3px !important;
        }

        .email-line {
          margin-top: 7px !important;
          line-height: 1.3 !important;
        }

        .nota-icon {
          display: none !important;
        }

        .nota-final {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
          grid-template-columns: 1fr !important;
          padding: 22px !important;
        }

        .nota-final strong {
          font-size: 46px !important;
          white-space: nowrap !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 180px 1fr !important;
          min-height: 142px !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          width: 160px !important;
          height: 160px !important;
        }

        .preview-mode .info-area-final {
          padding: 16px 20px !important;
          line-height: 1.35 !important;
        }

        .preview-mode .info-area-final p,
        .preview-mode .rep-line,
        .preview-mode .email-line {
          line-height: 1.35 !important;
        }


        /* V10.13.7 CARD FINAL IGUAL + RESUMO CONDICIONAL */
        .footer-final {
          align-items: stretch !important;
        }

        .ytalseg-card-final {
          grid-template-columns: 185px 1fr !important;
          min-height: 150px !important;
          border-radius: 22px !important;
        }

        .logo-area-final {
          padding: 10px 14px !important;
        }

        .logo-circle-final,
        .logo-card {
          width: 165px !important;
          height: 165px !important;
        }

        .info-area-final {
          padding: 16px 20px !important;
          line-height: 1.38 !important;
        }

        .info-area-final h2 {
          font-size: 28px !important;
          margin: 0 0 6px !important;
          line-height: 1.05 !important;
        }

        .info-area-final p {
          font-size: 13px !important;
          margin: 2px 0 5px !important;
          line-height: 1.32 !important;
        }

        .info-area-final strong {
          display: block !important;
          font-size: 13px !important;
          margin: 7px 0 6px !important;
          line-height: 1.25 !important;
        }

        .rep-line {
          grid-template-columns: 88px 1fr !important;
          font-size: 13px !important;
          margin-top: 3px !important;
          line-height: 1.35 !important;
        }

        .email-line {
          font-size: 13px !important;
          margin-top: 7px !important;
          line-height: 1.3 !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 150px 1fr !important;
          min-height: 118px !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          width: 132px !important;
          height: 132px !important;
        }

        .preview-mode .info-area-final {
          padding: 10px 14px !important;
          line-height: 1.34 !important;
        }

        .preview-mode .info-area-final h2 {
          font-size: 20px !important;
          margin-bottom: 4px !important;
        }

        .preview-mode .info-area-final p,
        .preview-mode .rep-line,
        .preview-mode .email-line {
          font-size: 8.5px !important;
          line-height: 1.32 !important;
        }

        .preview-mode .rep-line {
          grid-template-columns: 62px 1fr !important;
        }

        .preview-mode .info-area-final strong {
          font-size: 8.5px !important;
          margin: 4px 0 3px !important;
        }

        .nota-final {
          min-height: 150px !important;
        }

        .preview-mode .nota-final {
          min-height: 118px !important;
        }


        /* V10.13.8 VALOR DA NOTA RESPONSIVO */
        .footer-final {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
        }

        .ytalseg-card-final,
        .nota-final {
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nota-final {
          box-sizing: border-box !important;
          padding: 18px 14px !important;
          max-width: 100% !important;
        }

        .nota-final span {
          white-space: nowrap !important;
        }

        .nota-final .valor-nota {
          display: block !important;
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: 1 !important;
          font-size: clamp(24px, 5vw, 46px) !important;
          letter-spacing: -1px !important;
        }

        .nota-final .valor-nota-m {
          font-size: clamp(23px, 4.5vw, 40px) !important;
        }

        .nota-final .valor-nota-g {
          font-size: clamp(21px, 4vw, 34px) !important;
          letter-spacing: -1.3px !important;
        }

        .nota-final .valor-nota-gg {
          font-size: clamp(19px, 3.5vw, 30px) !important;
          letter-spacing: -1.6px !important;
        }

        .preview-mode .nota-final {
          padding: 12px 10px !important;
        }

        .preview-mode .nota-final .valor-nota {
          font-size: clamp(22px, 4.5vw, 42px) !important;
        }

        .preview-mode .nota-final .valor-nota-m {
          font-size: clamp(20px, 4vw, 36px) !important;
        }

        .preview-mode .nota-final .valor-nota-g {
          font-size: clamp(18px, 3.5vw, 31px) !important;
        }

        .preview-mode .nota-final .valor-nota-gg {
          font-size: clamp(16px, 3vw, 27px) !important;
        }


        /* V10.13.9 CARD HARMÔNICO - logo maior + menos área branca */
        .footer-final {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr) !important;
          gap: 14px !important;
        }

        .ytalseg-card-final {
          grid-template-columns: 245px 1fr !important;
          min-height: 180px !important;
          border-radius: 24px !important;
          overflow: hidden !important;
        }

        .logo-area-final {
          padding: 10px 18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .logo-circle-final,
        .logo-card {
          width: 220px !important;
          height: 220px !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain !important;
        }

        .info-area-final {
          padding: 18px 22px !important;
          line-height: 1.34 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .info-area-final h2 {
          font-size: 30px !important;
          margin: 0 0 8px !important;
          line-height: 1 !important;
        }

        .info-area-final p {
          font-size: 13px !important;
          margin: 2px 0 5px !important;
          line-height: 1.28 !important;
        }

        .info-area-final strong {
          font-size: 13px !important;
          margin: 7px 0 5px !important;
        }

        .rep-line {
          grid-template-columns: 92px 1fr !important;
          font-size: 13px !important;
          line-height: 1.28 !important;
          margin-top: 2px !important;
        }

        .email-line {
          font-size: 13px !important;
          margin-top: 6px !important;
          line-height: 1.25 !important;
        }

        .nota-final {
          min-height: 180px !important;
          padding: 18px 14px !important;
        }

        .preview-mode .footer-final {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr) !important;
          gap: 8px !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 145px 1fr !important;
          min-height: 118px !important;
          border-radius: 16px !important;
        }

        .preview-mode .logo-area-final {
          padding: 6px 10px !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          width: 132px !important;
          height: 132px !important;
        }

        .preview-mode .info-area-final {
          padding: 8px 12px !important;
          line-height: 1.24 !important;
        }

        .preview-mode .info-area-final h2 {
          font-size: 19px !important;
          margin-bottom: 4px !important;
        }

        .preview-mode .info-area-final p,
        .preview-mode .rep-line,
        .preview-mode .email-line,
        .preview-mode .info-area-final strong {
          font-size: 7.6px !important;
          line-height: 1.22 !important;
        }

        .preview-mode .rep-line {
          grid-template-columns: 56px 1fr !important;
          margin-top: 1px !important;
        }

        .preview-mode .email-line {
          margin-top: 3px !important;
        }

        .preview-mode .nota-final {
          min-height: 118px !important;
        }

       @page {
  size: A4 portrait;
  margin: 4mm;
}

@media print {

  /* V10.13.9 CARD HARMÔNICO PRINT */
  .footer-final,
  body.modo-cliente .footer-final,
  body.modo-interno .footer-final {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr) !important;
    gap: 7px !important;
  }

  .ytalseg-card-final,
  body.modo-cliente .ytalseg-card-final,
  body.modo-interno .ytalseg-card-final {
    grid-template-columns: 39mm 1fr !important;
    min-height: 34mm !important;
    border-radius: 16px !important;
  }

  .logo-area-final,
  body.modo-cliente .logo-area-final,
  body.modo-interno .logo-area-final {
    padding: 3mm !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .logo-circle-final,
  .logo-card,
  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card,
  body.modo-interno .logo-circle-final,
  body.modo-interno .logo-card {
    width: 35mm !important;
    height: 35mm !important;
    object-fit: contain !important;
  }

  .info-area-final,
  body.modo-cliente .info-area-final,
  body.modo-interno .info-area-final {
    padding: 5px 8px !important;
    line-height: 1.24 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  .info-area-final h2,
  body.modo-cliente .info-area-final h2,
  body.modo-interno .info-area-final h2 {
    font-size: 15px !important;
    margin: 0 0 2px !important;
  }

  .info-area-final p,
  .rep-line,
  .email-line,
  .info-area-final strong,
  body.modo-cliente .info-area-final p,
  body.modo-cliente .rep-line,
  body.modo-cliente .email-line,
  body.modo-cliente .info-area-final strong,
  body.modo-interno .info-area-final p,
  body.modo-interno .rep-line,
  body.modo-interno .email-line,
  body.modo-interno .info-area-final strong {
    font-size: 6.8px !important;
    line-height: 1.18 !important;
    margin-top: 1px !important;
  }

  .rep-line,
  body.modo-cliente .rep-line,
  body.modo-interno .rep-line {
    grid-template-columns: 47px 1fr !important;
  }

  .nota-final,
  body.modo-cliente .nota-final,
  body.modo-interno .nota-final {
    min-height: 34mm !important;
  }

  /* V10.13.8 VALOR DA NOTA RESPONSIVO PRINT */
  .footer-final {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  }

  .ytalseg-card-final,
  .nota-final {
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .nota-final {
    padding: 6px 5px !important;
    max-width: 100% !important;
  }

  .nota-final span {
    white-space: nowrap !important;
  }

  .nota-final .valor-nota {
    display: block !important;
    max-width: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-align: center !important;
    line-height: 1 !important;
    font-size: 32px !important;
    letter-spacing: -1px !important;
  }

  .nota-final .valor-nota-m {
    font-size: 28px !important;
  }

  .nota-final .valor-nota-g {
    font-size: 24px !important;
    letter-spacing: -1.3px !important;
  }

  .nota-final .valor-nota-gg {
    font-size: 21px !important;
    letter-spacing: -1.6px !important;
  }

  body.modo-cliente .nota-final .valor-nota {
    font-size: 40px !important;
  }

  body.modo-cliente .nota-final .valor-nota-m {
    font-size: 35px !important;
  }

  body.modo-cliente .nota-final .valor-nota-g {
    font-size: 30px !important;
  }

  body.modo-cliente .nota-final .valor-nota-gg {
    font-size: 26px !important;
  }

  body.modo-cliente .obs {
    break-inside: avoid !important;
  }

  /* V10.13.7 CARD FINAL IGUAL PRINT */
  .ytalseg-card-final,
  body.modo-cliente .ytalseg-card-final,
  body.modo-interno .ytalseg-card-final {
    grid-template-columns: 34mm 1fr !important;
    min-height: 31mm !important;
    border-radius: 16px !important;
  }

  .logo-circle-final,
  .logo-card,
  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card,
  body.modo-interno .logo-circle-final,
  body.modo-interno .logo-card {
    width: 31mm !important;
    height: 31mm !important;
  }

  .info-area-final,
  body.modo-cliente .info-area-final,
  body.modo-interno .info-area-final {
    padding: 6px 9px !important;
    line-height: 1.3 !important;
  }

  .info-area-final h2,
  body.modo-cliente .info-area-final h2,
  body.modo-interno .info-area-final h2 {
    font-size: 16px !important;
    margin: 0 0 2px !important;
  }

  .info-area-final p,
  .rep-line,
  .email-line,
  body.modo-cliente .info-area-final p,
  body.modo-cliente .rep-line,
  body.modo-cliente .email-line,
  body.modo-interno .info-area-final p,
  body.modo-interno .rep-line,
  body.modo-interno .email-line {
    font-size: 7.2px !important;
    line-height: 1.28 !important;
    margin-top: 1px !important;
  }

  .info-area-final strong,
  body.modo-cliente .info-area-final strong,
  body.modo-interno .info-area-final strong {
    font-size: 7.2px !important;
    margin: 2px 0 2px !important;
  }

  .rep-line,
  body.modo-cliente .rep-line,
  body.modo-interno .rep-line {
    grid-template-columns: 50px 1fr !important;
  }

  .email-line,
  body.modo-cliente .email-line,
  body.modo-interno .email-line {
    margin-top: 2px !important;
  }

  .nota-final,
  body.modo-cliente .nota-final,
  body.modo-interno .nota-final {
    min-height: 31mm !important;
  }

  /* V10.13.6 AJUSTE FINAL VISUAL PRINT */
  .sheet {
    transform: none !important;
    margin-bottom: 0 !important;
  }

  .seal,
  .logo-topo {
    display: none !important;
  }

  .top {
    grid-template-columns: 1fr 1.2fr !important;
    gap: 10px !important;
  }

  .brand {
    font-size: 38px !important;
  }

  .brand-sub {
    font-size: 8.5px !important;
    max-width: 310px !important;
    line-height: 1.25 !important;
  }

  .title {
    font-size: 32px !important;
    padding-left: 14px !important;
  }

  .ytalseg-card-final {
    grid-template-columns: 38mm 1fr !important;
    min-height: 34mm !important;
  }

  .logo-circle-final,
  .logo-card {
    width: 36mm !important;
    height: 36mm !important;
  }

  .info-area-final {
    padding: 7px 11px !important;
    line-height: 1.35 !important;
  }

  .info-area-final h2 {
    margin-bottom: 3px !important;
  }

  .info-area-final p {
    margin: 1.5px 0 3px !important;
    line-height: 1.32 !important;
  }

  .info-area-final strong {
    display: block !important;
    margin-top: 3px !important;
    margin-bottom: 3px !important;
  }

  .rep-line {
    line-height: 1.32 !important;
    margin-top: 1.5px !important;
  }

  .email-line {
    margin-top: 3px !important;
    line-height: 1.3 !important;
  }

  .nota-icon {
    display: none !important;
  }

  .nota-final {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    grid-template-columns: 1fr !important;
    padding: 8px !important;
  }

  .nota-final strong {
    white-space: nowrap !important;
  }

  body.modo-cliente .ytalseg-card-final {
    grid-template-columns: 40mm 1fr !important;
    min-height: 35mm !important;
  }

  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card {
    width: 38mm !important;
    height: 38mm !important;
  }

  /* V10.13.5 FINAL LIMPO PRINT */
  .seal,
  .logo-topo {
    display: none !important;
  }

  .top {
    grid-template-columns: 1fr 1.15fr !important;
    gap: 10px !important;
  }

  .brand {
    font-size: 38px !important;
  }

  .brand-sub {
    font-size: 8.5px !important;
    max-width: 300px !important;
  }

  .title {
    font-size: 32px !important;
    padding-left: 14px !important;
  }

  .nota-icon {
    display: none !important;
  }

  .nota-final {
    grid-template-columns: 1fr !important;
    text-align: center !important;
    justify-content: center !important;
  }

  body.modo-cliente .brand {
    font-size: 42px !important;
  }

  body.modo-cliente .title {
    font-size: 34px !important;
  }

  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card {
    width: 38mm !important;
    height: 38mm !important;
  }

  /* V10.13.4 AJUSTE LOGO + ZOOM PRINT */
  .top{
    grid-template-columns:1fr 1.15fr !important;
    gap:10px !important;
    margin-bottom:7px !important;
  }

  .brand{
    font-size:36px !important;
  }

  .brand-sub{
    font-size:8px !important;
    max-width:280px !important;
  }

  .title{
    font-size:30px !important;
    padding-left:12px !important;
  }

  .seal,
  .logo-topo{
    display:none !important;
  }

  .nota-icon{
    display:none !important;
  }

  .nota-final{
    grid-template-columns:1fr !important;
    text-align:center !important;
  }

  body.modo-cliente .brand{
    font-size:42px !important;
  }

  body.modo-cliente .brand-sub{
    font-size:9px !important;
    max-width:290px !important;
  }

  body.modo-cliente .title{
    font-size:34px !important;
  }

  body.modo-cliente .ytalseg-card-final{
    min-height:34mm !important;
    grid-template-columns:40mm 1fr !important;
  }

  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card{
    width:38mm !important;
    height:38mm !important;
  }

  .sheet {
    transform: none !important;
    margin-bottom: 0 !important;
  }

  .nota-icon {
    display: none !important;
  }

  .nota-final {
    grid-template-columns: 1fr !important;
    text-align: center !important;
    justify-content: center !important;
  }
  html, body {
    width: 210mm;
    height: 297mm;
    background: white;
    overflow: hidden;
  }

  body {
    margin: 0;
  }

  .page {
    padding: 0;
    background: white;
  }

  .sheet {
    width: 202mm;
    min-height: 289mm;
    height: auto;
    padding: 5mm;
    margin: 0 auto;
    box-shadow: none;
    border-radius: 0;
    max-width: none;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.92) !important;
  }

  .upload,
  .actions,
  .btn-red,
  button {
    display: none !important;
  }

  .checkbox-small {
    display: none !important;
  }

  .print-value {
    display: inline !important;
  }

  .checkbox-small {
    display:none !important;
  }

  .print-value {
    display:inline !important;
  }

  .manual-hint {
    display:none !important;
  }


  .top {
    grid-template-columns: 1fr 1fr 55px;
    gap: 8px;
    margin-bottom: 6px;
  }

  .brand {
    font-size: 30px;
    letter-spacing: -1px;
  }

  .brand-sub {
    font-size: 7px;
    margin-top: 3px;
  }

  .title {
    font-size: 24px;
    padding-left: 10px;
  }

 .seal {
  width:52px;
  height:52px;
  border:none;
}

  .info {
    margin-bottom: 7px;
    background-color: rgba(255, 255, 255, 0.65) !important;
  }

  .info div {
    padding: 5px;
  }

  .label {
    font-size: 7px;
  }

  .value {
    font-size: 9px;
    margin-top: 2px;
  }

  .grid {
    grid-template-columns: 1.85fr 1fr;
    gap: 7px;
  }

  table {
    font-size: 6.6px;
    background-color: transparent !important;
  }

  tbody,
  tr,
  td {
    background-color: rgba(255, 255, 255, 0.42) !important;
  }

  th {
    background-color: rgba(255,255,255,.45) !important;
    color: #555 !important;
  }

  .panel-title {
    background-color: rgba(255,255,255,.45) !important;
    color: #00853d !important;
  }

  .total-row td {
    background-color: #00B050 !important;
    color: white !important;
  }

  th,
  td {
    padding: 2.35px;
  }

  .panel table,
  .panel tbody,
  .panel tr,
  .panel td {
    background-color: rgba(255,255,255,.18) !important;
  }

  .panel-title {
    background-color: rgba(0,176,80,.90) !important;
  }

  .panel,
  .obs,
  .ytalseg-card-final,
  .nota-final {
    background-color: rgba(255,255,255,.20) !important;
  }

  .panel {
    margin-bottom: 5px;
  }

  .panel-title {
    font-size: 9px;
    padding: 4px;
  }

  .obs {
    margin-top: 5px;
    padding: 5px;
  }

  .obs h3 {
    font-size: 9px;
    margin-bottom: 1px;
  }

  .obs p {
    font-size: 7px;
    margin: 2px 0 3px;
  }

  .obs input {
    border: none;
    padding: 1px;
    font-size: 7px;
    background: transparent !important;
  }

  .obs th:last-child,
  .obs td:last-child {
    display: none;
  }

  .footer-final {
    margin-top: 6px;
    grid-template-columns: 1.05fr 1fr;
    gap: 7px;
  }

  .ytalseg-card-final {
    min-height: 70px;
    grid-template-columns: 82px 1fr;
    border-radius: 15px;
  }

  .logo-area-final {
    border-top-right-radius: 45px;
    border-bottom-right-radius: 45px;
  }

  .logo-area-final{
  background:white !important;
  border-top-right-radius:0 !important;
  border-bottom-right-radius:0 !important;
}

.logo-circle-final{
  width:142px !important;
  height:142px !important;
  background:transparent !important;
  padding:0 !important;
}

.logo-card{
  width:142px !important;
  height:142px !important;
}


  .info-area-final h2 {
    font-size: 13px;
  }

  .info-area-final p {
    font-size: 7px;
    margin: 1px 0;
  }

  .info-area-final strong {
    margin-top: 3px;
    font-size: 7px;
  }

  .rep-line {
    grid-template-columns: 55px 1fr;
    font-size: 7px;
    margin-top: 1px;
  }

  .email-line {
    margin-top: 2px;
    font-size: 7px;
  }

  .nota-final {
    min-height: 70px;
    padding: 8px;
    border-radius: 12px;
    grid-template-columns: 55px 1fr;
  }

  .nota-icon {
    font-size: 32px;
  }

  .nota-final span {
    font-size: 13px;
  }

  .nota-final strong {
    font-size: 31px;
  }


 .watermark{
  position:absolute !important;
  top:53% !important;
  left:50% !important;
  transform:translate(-50%,-50%) !important;
  width:980px !important;
  height:980px !important;
  z-index:9 !important;
}

.logo-watermark{
  width:100% !important;
  height:100% !important;
  object-fit:contain !important;
  opacity:.115 !important;
}

  .content {
  z-index: 1 !important;
}

  body.modo-cliente .grid {
    display: block;
  }

  body.modo-cliente .grid > .panel:first-child {
    display: none !important;
  }

  body.modo-cliente .obs {
    margin-top: 10px;
  }

  body.modo-cliente .footer-final {
    margin-top: 14px;
  }

  body.modo-cliente .ytalseg-card-final {
    min-height: 95px;
    grid-template-columns: 95px 1fr;
  }

  body.modo-cliente .logo-circle-final {
    width: 112px;
    height: 112px;
  }

  body.modo-cliente .nota-final {
    min-height: 105px;
  }

  body.modo-cliente .nota-final strong {
    font-size: 42px;
  }

  body.modo-cliente .watermark {
  top: 52% !important;
  left: 50% !important;
  transform: translate(-50%,-50%) !important;
  width: 980px !important;
  height: 980px !important;
  z-index: 9 !important;
}

body.modo-cliente .logo-watermark {
  opacity: 0.115 !important;
}

  body.modo-interno .grid > .panel:first-child {
    display: block;
  }

  /* ================================ */
  /* PDF CLIENTE PREMIUM - A4 EXECUTIVO */
  /* ================================ */

  body.modo-cliente .tabela-valores {
    display: none !important;
  }

  body.modo-cliente .sheet {
    min-height: 289mm !important;
    height: 289mm !important;
    display: flex !important;
    flex-direction: column !important;
  }

  body.modo-cliente .content {
    min-height: 279mm !important;
    display: flex !important;
    flex-direction: column !important;
  }

  body.modo-cliente .top {
    margin-bottom: 9mm !important;
  }

  body.modo-cliente .brand {
    font-size: 36px !important;
  }

  body.modo-cliente .brand-sub {
    font-size: 8px !important;
  }

  body.modo-cliente .title {
    font-size: 29px !important;
  }

  body.modo-cliente .info {
    margin-bottom: 10mm !important;
  }

  body.modo-cliente .info div {
    padding: 7px !important;
  }

  body.modo-cliente .label {
    font-size: 8px !important;
  }

  body.modo-cliente .value {
    font-size: 11px !important;
  }

  body.modo-cliente .grid {
    display: block !important;
    margin-top: 2mm !important;
  }

  body.modo-cliente .grid > .panel:first-child {
    display: none !important;
  }

  body.modo-cliente .grid > div:last-child {
    width: 100% !important;
  }

  body.modo-cliente .grid > div:last-child .panel {
    width: 100% !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) {
    margin-top: 0 !important;
    margin-bottom: 10mm !important;
    border-radius: 12px !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) .panel-title {
    font-size: 13px !important;
    padding: 7px !important;
    letter-spacing: .4px !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) table {
    font-size: 10px !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) td {
    padding: 6px 8px !important;
    height: 8.5mm !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) tr.total-row td {
    font-size: 11px !important;
    height: 9.5mm !important;
  }

  body.modo-cliente .obs {
    margin-top: 0 !important;
    margin-bottom: auto !important;
    padding: 8px !important;
    min-height: 32mm !important;
    border-radius: 12px !important;
  }

  body.modo-cliente .obs h3 {
    font-size: 11px !important;
  }

  body.modo-cliente .obs p {
    font-size: 8px !important;
    margin-bottom: 5px !important;
  }

  body.modo-cliente .obs table {
    font-size: 9px !important;
  }

  body.modo-cliente .obs th,
  body.modo-cliente .obs td {
    padding: 5px !important;
    height: 7mm !important;
  }

  body.modo-cliente .footer-final {
    margin-top: auto !important;
    padding-top: 8mm !important;
    grid-template-columns: 1fr 1.05fr !important;
    gap: 8px !important;
    align-items: stretch !important;
  }

  body.modo-cliente .ytalseg-card-final {
    min-height: 32mm !important;
    grid-template-columns: 34mm 1fr !important;
    border-radius: 16px !important;
  }

  body.modo-cliente .logo-circle-final {
    width: 31mm !important;
    height: 31mm !important;
  }

  body.modo-cliente .logo-card {
    width: 31mm !important;
    height: 31mm !important;
  }

  body.modo-cliente .info-area-final {
    padding: 7px 10px !important;
  }

  body.modo-cliente .info-area-final h2 {
    font-size: 17px !important;
  }

  body.modo-cliente .info-area-final p,
  body.modo-cliente .rep-line,
  body.modo-cliente .email-line {
    font-size: 7.5px !important;
  }

  body.modo-cliente .nota-final {
    min-height: 32mm !important;
    border-radius: 16px !important;
    grid-template-columns: 28mm 1fr !important;
  }

  body.modo-cliente .nota-icon {
    font-size: 34px !important;
  }

  body.modo-cliente .nota-final span {
    font-size: 15px !important;
  }

  body.modo-cliente .nota-final strong {
    font-size: 45px !important;
  }

  body.modo-cliente .watermark {
    top: 58% !important;
    width: 980px !important;
    height: 980px !important;
    opacity: 1 !important;
  }

  body.modo-cliente .logo-watermark {
    opacity: 0.105 !important;
  }

}
           

        /* V10.13.9.2 - SOMENTE LOGO DO CARD AJUSTADO
           Fica no FINAL do CSS para vencer os overrides anteriores. */
        .logo-area-final {
          overflow: hidden !important;
        }

        .logo-circle-final {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transform: scale(1.30) !important;
          transform-origin: center center !important;
        }

        .logo-card {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          transform: scale(1.30) !important;
          transform-origin: center center !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          transform: scale(1.30) !important;
        }

        @media print {
          .logo-area-final {
            overflow: hidden !important;
          }

          .logo-circle-final,
          .logo-card,
          body.modo-cliente .logo-circle-final,
          body.modo-cliente .logo-card,
          body.modo-interno .logo-circle-final,
          body.modo-interno .logo-card {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            transform: scale(1.30) !important;
            transform-origin: center center !important;
          }
        }


        /* V10.13.11 A4 COMPACTO + RESUMO VISÍVEL NA TELA */
        .preview-mode .panel {
          margin-bottom: 4px !important;
        }

        .preview-mode .grid {
          gap: 5px !important;
        }

        .preview-mode .obs {
          margin-top: 4px !important;
        }

        @page {
          size: A4 portrait;
          margin: 2mm !important;
        }

        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }

          .sheet {
            width: 206mm !important;
            min-height: 293mm !important;
            height: 293mm !important;
            padding: 3mm !important;
            margin: 0 auto !important;
            transform: none !important;
          }

          .top {
            margin-bottom: 4px !important;
          }

          .info {
            margin-bottom: 4px !important;
          }

          .grid {
            gap: 5px !important;
          }

          .panel {
            margin-bottom: 4px !important;
            border-radius: 8px !important;
          }

          .panel-title {
            padding: 3px !important;
            font-size: 8px !important;
          }

          th,
          td {
            padding: 1.55px 2.2px !important;
          }

          table {
            font-size: 5.9px !important;
          }

          .obs {
            margin-top: 4px !important;
            padding: 4px !important;
          }

          .obs h3 {
            font-size: 8px !important;
          }

          .obs p {
            font-size: 6.5px !important;
            margin: 1px 0 2px !important;
          }

          .obs th,
          .obs td {
            padding: 2px 3px !important;
            height: auto !important;
          }

          .footer-final {
            margin-top: 4px !important;
            gap: 5px !important;
          }

          .watermark {
            width: 900px !important;
            height: 900px !important;
          }
        }




        /* V73.1 DEFINITIVO - PRINCIPAL USA O MESMO PADRÃO VISUAL DO INTERNO/CLIENTE
           Regra aplicada só na tela principal de edição (.preview-mode sem modo-cliente/interno).
           Não altera o PDF cliente nem o PDF interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          margin-top: 8px !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 128px minmax(0, 1fr) !important;
          min-height: 118px !important;
          height: 118px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 6px 8px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: white !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 106px !important;
          height: 106px !important;
          max-width: 106px !important;
          max-height: 106px !important;
          transform: none !important;
          object-fit: contain !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          min-width: 0 !important;
          overflow: hidden !important;
          padding: 8px 9px !important;
          line-height: 1.22 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          border-top-right-radius: 45px !important;
          border-bottom-right-radius: 45px !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          font-size: 18px !important;
          line-height: 1 !important;
          margin: 0 0 3px !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 7.2px !important;
          line-height: 1.18 !important;
          margin-top: 1px !important;
          margin-bottom: 1px !important;
          white-space: nowrap !important;
          font-weight: 700 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          margin: 2px 0 2px !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 54px minmax(0, 1fr) !important;
          gap: 2px !important;
          align-items: center !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          margin-top: 2px !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          min-height: 118px !important;
          height: 118px !important;
          padding: 8px 10px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          display: block !important;
          font-size: 15px !important;
          line-height: 1.05 !important;
          margin-bottom: 4px !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: 1 !important;
          letter-spacing: -1px !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota { font-size: 42px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 37px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 32px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 27px !important; }

        /* V10.13.11.1 - OCULTAR RESUMO SOMENTE NO CLIENTE SEM DIAS */
        body.modo-cliente .sheet.sem-dias-trabalhados .resumo-cobranca-panel {
          display: none !important;
        }

        @media print {
          body.modo-cliente .sheet.sem-dias-trabalhados .resumo-cobranca-panel {
            display: none !important;
          }
        }


        /* V67 FINAL - A4 mais aproveitado, sem sombra, destaque nos nomes, CNPJ menor e preview antes de salvar */
        .preview-mode .sheet,
        .sheet { box-shadow: none !important; }

        .preview-mode .sheet {
          width: 206mm !important;
          min-height: 291mm !important;
          padding: 3.5mm !important;
        }

        .preview-mode .top { margin-bottom: 4px !important; }
        .preview-mode .info { margin-bottom: 5px !important; }
        .preview-mode .info div { padding: 4px 6px !important; }

        .info .value {
          font-size: 20px !important;
          font-weight: 1000 !important;
          color: #111827 !important;
          line-height: 1.15 !important;
          overflow-wrap: anywhere !important;
        }

        .cnpj-line {
          font-size: 14px !important;
          font-weight: 700 !important;
          line-height: 1.15 !important;
          margin-top: 6px !important;
          overflow-wrap: anywhere !important;
        }

        .preview-mode .info .value { font-size: 12px !important; font-weight: 1000 !important; }
        .preview-mode .cnpj-line { font-size: 10px !important; font-weight: 700 !important; margin-top: 3px !important; }
        .preview-mode .grid { gap: 5px !important; }
        .preview-mode .panel { margin-bottom: 3px !important; }
        .preview-mode .footer-final { margin-top: 4px !important; }

        @page { size: A4 portrait; margin: 3mm !important; }

        @media print {
          .page, .preview-mode { padding: 0 !important; background: #fff !important; }
          .sheet {
            width: 204mm !important;
            min-height: 291mm !important;
            padding: 3mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .top { margin-bottom: 4px !important; }
          .info { margin-bottom: 5px !important; }
          .info div { padding: 4px 6px !important; }
          .info .value { font-size: 12px !important; font-weight: 1000 !important; line-height: 1.15 !important; }
          .cnpj-line { font-size: 9.5px !important; font-weight: 700 !important; margin-top: 2px !important; }
          .grid { gap: 5px !important; }
          .panel { margin-bottom: 3px !important; }
          .footer-final { margin-top: 4px !important; }
        }



        /* V68 FIX: rodapé cliente/interno sem quebrar */
        .footer-final,
        .preview-mode .footer-final,
        body.modo-cliente .footer-final,
        body.modo-interno .footer-final {
          display:grid !important;
          grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;
          gap:12px !important;
          align-items:stretch !important;
          width:100% !important;
          max-width:100% !important;
          box-sizing:border-box !important;
        }
        .ytalseg-card-final,.nota-final,
        .preview-mode .ytalseg-card-final,.preview-mode .nota-final,
        body.modo-cliente .ytalseg-card-final,body.modo-cliente .nota-final,
        body.modo-interno .ytalseg-card-final,body.modo-interno .nota-final {
          min-width:0 !important; max-width:100% !important; width:100% !important;
          min-height:128px !important; box-sizing:border-box !important; overflow:hidden !important;
        }
        .ytalseg-card-final,.preview-mode .ytalseg-card-final,
        body.modo-cliente .ytalseg-card-final,body.modo-interno .ytalseg-card-final {
          grid-template-columns:150px minmax(0,1fr) !important;
        }
        .logo-area-final,.preview-mode .logo-area-final,
        body.modo-cliente .logo-area-final,body.modo-interno .logo-area-final { padding:6px 8px !important; }
        .logo-circle-final,.logo-card,.preview-mode .logo-circle-final,.preview-mode .logo-card,
        body.modo-cliente .logo-circle-final,body.modo-cliente .logo-card,
        body.modo-interno .logo-circle-final,body.modo-interno .logo-card {
          width:128px !important; height:128px !important; max-width:128px !important; max-height:128px !important; object-fit:contain !important;
        }
        .info-area-final,.preview-mode .info-area-final,
        body.modo-cliente .info-area-final,body.modo-interno .info-area-final {
          min-width:0 !important; padding:10px 14px !important; line-height:1.16 !important; justify-content:center !important;
        }
        .info-area-final h2,.preview-mode .info-area-final h2,
        body.modo-cliente .info-area-final h2,body.modo-interno .info-area-final h2 {
          font-size:22px !important; line-height:1 !important; margin:0 0 4px !important; font-weight:1000 !important;
        }
        .info-area-final p,.preview-mode .info-area-final p,
        body.modo-cliente .info-area-final p,body.modo-interno .info-area-final p {
          font-size:10.5px !important; line-height:1.15 !important; margin:1px 0 3px !important; font-weight:800 !important;
        }
        .info-area-final strong,.preview-mode .info-area-final strong,
        body.modo-cliente .info-area-final strong,body.modo-interno .info-area-final strong {
          font-size:10.5px !important; line-height:1.15 !important; margin:4px 0 3px !important; font-weight:1000 !important;
        }
        .rep-line,.preview-mode .rep-line,body.modo-cliente .rep-line,body.modo-interno .rep-line {
          display:grid !important; grid-template-columns:76px minmax(0,1fr) !important; column-gap:4px !important;
          max-width:100% !important; font-size:10.5px !important; line-height:1.15 !important; margin-top:2px !important;
          font-weight:900 !important; white-space:nowrap !important;
        }
        .rep-line span,.preview-mode .rep-line span,body.modo-cliente .rep-line span,body.modo-interno .rep-line span { white-space:nowrap !important; }
        .email-line,.preview-mode .email-line,body.modo-cliente .email-line,body.modo-interno .email-line {
          font-size:10px !important; line-height:1.12 !important; margin-top:4px !important; font-weight:900 !important; white-space:nowrap !important;
        }
        .nota-final,.preview-mode .nota-final,body.modo-cliente .nota-final,body.modo-interno .nota-final {
          display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; text-align:center !important; padding:10px 12px !important;
        }
        .nota-final span,.preview-mode .nota-final span,body.modo-cliente .nota-final span,body.modo-interno .nota-final span {
          display:block !important; width:100% !important; font-size:17px !important; line-height:1 !important; margin-bottom:8px !important; white-space:nowrap !important;
        }
        .nota-final .valor-nota,.preview-mode .nota-final .valor-nota,body.modo-cliente .nota-final .valor-nota,body.modo-interno .nota-final .valor-nota {
          display:block !important; width:100% !important; max-width:100% !important; overflow:hidden !important; white-space:nowrap !important; text-align:center !important;
          line-height:.96 !important; font-size:clamp(26px,4.7vw,48px) !important; letter-spacing:-1.4px !important; transform:scaleX(.92) !important; transform-origin:center !important;
        }
        .nota-final .valor-nota-m,.preview-mode .nota-final .valor-nota-m,body.modo-cliente .nota-final .valor-nota-m,body.modo-interno .nota-final .valor-nota-m {
          font-size:clamp(24px,4.1vw,42px) !important; transform:scaleX(.88) !important;
        }
        .nota-final .valor-nota-g,.nota-final .valor-nota-gg,.preview-mode .nota-final .valor-nota-g,.preview-mode .nota-final .valor-nota-gg,
        body.modo-cliente .nota-final .valor-nota-g,body.modo-cliente .nota-final .valor-nota-gg,
        body.modo-interno .nota-final .valor-nota-g,body.modo-interno .nota-final .valor-nota-gg {
          font-size:clamp(21px,3.5vw,34px) !important; transform:scaleX(.82) !important;
        }
        @media print {
          .footer-final,body.modo-cliente .footer-final,body.modo-interno .footer-final { grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important; gap:8px !important; }
          .ytalseg-card-final,.nota-final,body.modo-cliente .ytalseg-card-final,body.modo-cliente .nota-final,body.modo-interno .ytalseg-card-final,body.modo-interno .nota-final { min-height:30mm !important; max-height:34mm !important; }
          .ytalseg-card-final,body.modo-cliente .ytalseg-card-final,body.modo-interno .ytalseg-card-final { grid-template-columns:34mm minmax(0,1fr) !important; }
          .logo-circle-final,.logo-card,body.modo-cliente .logo-circle-final,body.modo-cliente .logo-card,body.modo-interno .logo-circle-final,body.modo-interno .logo-card { width:30mm !important; height:30mm !important; max-width:30mm !important; max-height:30mm !important; }
          .rep-line,body.modo-cliente .rep-line,body.modo-interno .rep-line { grid-template-columns:18mm minmax(0,1fr) !important; font-size:7.5px !important; white-space:nowrap !important; }
          .info-area-final h2,body.modo-cliente .info-area-final h2,body.modo-interno .info-area-final h2 { font-size:15px !important; }
          .info-area-final p,.info-area-final strong,.email-line,body.modo-cliente .info-area-final p,body.modo-cliente .info-area-final strong,body.modo-cliente .email-line,body.modo-interno .info-area-final p,body.modo-interno .info-area-final strong,body.modo-interno .email-line { font-size:7.5px !important; white-space:nowrap !important; }
          .nota-final .valor-nota,body.modo-cliente .nota-final .valor-nota,body.modo-interno .nota-final .valor-nota { font-size:31px !important; transform:scaleX(.86) !important; }
          .nota-final .valor-nota-m,body.modo-cliente .nota-final .valor-nota-m,body.modo-interno .nota-final .valor-nota-m { font-size:27px !important; transform:scaleX(.82) !important; }
          .nota-final .valor-nota-g,.nota-final .valor-nota-gg,body.modo-cliente .nota-final .valor-nota-g,body.modo-cliente .nota-final .valor-nota-gg,body.modo-interno .nota-final .valor-nota-g,body.modo-interno .nota-final .valor-nota-gg { font-size:23px !important; transform:scaleX(.76) !important; }
        }

        /* V70 CIRURGICO: padrão V66 aprovado + cards finais travados */
        .footer-final,
        .preview-mode .footer-final,
        body.modo-cliente .footer-final,
        body.modo-interno .footer-final {
          display: grid !important;
          grid-template-columns: calc(50% - 7px) calc(50% - 7px) !important;
          gap: 14px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
          margin-top: 14px !important;
          box-sizing: border-box !important;
        }

        .ytalseg-card-final,
        .nota-final,
        .preview-mode .ytalseg-card-final,
        .preview-mode .nota-final,
        body.modo-cliente .ytalseg-card-final,
        body.modo-cliente .nota-final,
        body.modo-interno .ytalseg-card-final,
        body.modo-interno .nota-final {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: 150px !important;
          min-height: 150px !important;
          max-height: 150px !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          flex: none !important;
        }

        .ytalseg-card-final,
        .preview-mode .ytalseg-card-final,
        body.modo-cliente .ytalseg-card-final,
        body.modo-interno .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 170px minmax(0, 1fr) !important;
          background: rgba(255,255,255,.88) !important;
          border: 1px solid #d7d7d7 !important;
          border-radius: 24px !important;
          box-shadow: none !important;
        }

        .logo-area-final,
        .preview-mode .logo-area-final,
        body.modo-cliente .logo-area-final,
        body.modo-interno .logo-area-final {
          padding: 8px 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
          min-width: 0 !important;
        }

        .logo-circle-final,
        .logo-card,
        .preview-mode .logo-circle-final,
        .preview-mode .logo-card,
        body.modo-cliente .logo-circle-final,
        body.modo-cliente .logo-card,
        body.modo-interno .logo-circle-final,
        body.modo-interno .logo-card {
          width: 132px !important;
          height: 132px !important;
          max-width: 132px !important;
          max-height: 132px !important;
          object-fit: contain !important;
          flex: 0 0 auto !important;
        }

        .info-area-final,
        .preview-mode .info-area-final,
        body.modo-cliente .info-area-final,
        body.modo-interno .info-area-final {
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          padding: 12px 16px !important;
          line-height: 1.16 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          border-right: 6px solid #00B050 !important;
          border-top-right-radius: 72px !important;
          border-bottom-right-radius: 72px !important;
        }

        .info-area-final h2,
        .preview-mode .info-area-final h2,
        body.modo-cliente .info-area-final h2,
        body.modo-interno .info-area-final h2 {
          font-size: 24px !important;
          line-height: 1 !important;
          margin: 0 0 5px !important;
          font-weight: 900 !important;
          color: #00B050 !important;
          letter-spacing: -0.2px !important;
          white-space: nowrap !important;
        }

        .info-area-final p,
        .preview-mode .info-area-final p,
        body.modo-cliente .info-area-final p,
        body.modo-interno .info-area-final p {
          font-size: 11px !important;
          line-height: 1.14 !important;
          margin: 1px 0 3px !important;
          font-weight: 600 !important;
          color: #111 !important;
          white-space: normal !important;
          overflow: hidden !important;
        }

        .info-area-final strong,
        .preview-mode .info-area-final strong,
        body.modo-cliente .info-area-final strong,
        body.modo-interno .info-area-final strong {
          display: block !important;
          font-size: 11px !important;
          line-height: 1.08 !important;
          margin: 4px 0 3px !important;
          font-weight: 800 !important;
          color: #111 !important;
        }

        .rep-line,
        .preview-mode .rep-line,
        body.modo-cliente .rep-line,
        body.modo-interno .rep-line {
          display: grid !important;
          grid-template-columns: 74px minmax(0, 1fr) !important;
          column-gap: 4px !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          margin-top: 2px !important;
          font-size: 11px !important;
          line-height: 1.08 !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
        }

        .rep-line span,
        .preview-mode .rep-line span,
        body.modo-cliente .rep-line span,
        body.modo-interno .rep-line span {
          min-width: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }

        .email-line,
        .preview-mode .email-line,
        body.modo-cliente .email-line,
        body.modo-interno .email-line {
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: clip !important;
          margin-top: 4px !important;
          font-size: 10.2px !important;
          line-height: 1.08 !important;
          font-weight: 600 !important;
          color: #111 !important;
        }

        .nota-final,
        .preview-mode .nota-final,
        body.modo-cliente .nota-final,
        body.modo-interno .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 12px 16px !important;
          border-radius: 24px !important;
          border: 1px solid #b88716 !important;
          box-shadow: none !important;
          background: #fff !important;
        }

        .nota-icon,
        .preview-mode .nota-icon,
        body.modo-cliente .nota-icon,
        body.modo-interno .nota-icon { display: none !important; }

        .nota-final > div,
        .preview-mode .nota-final > div,
        body.modo-cliente .nota-final > div,
        body.modo-interno .nota-final > div {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nota-final span,
        .preview-mode .nota-final span,
        body.modo-cliente .nota-final span,
        body.modo-interno .nota-final span {
          display: block !important;
          width: 100% !important;
          margin-bottom: 8px !important;
          font-size: 20px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .nota-final .valor-nota,
        .preview-mode .nota-final .valor-nota,
        body.modo-cliente .nota-final .valor-nota,
        body.modo-interno .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: 0.95 !important;
          font-size: 46px !important;
          letter-spacing: -1px !important;
          transform: none !important;
          font-weight: 1000 !important;
        }

        .nota-final .valor-nota-m,
        .preview-mode .nota-final .valor-nota-m,
        body.modo-cliente .nota-final .valor-nota-m,
        body.modo-interno .nota-final .valor-nota-m { font-size: 42px !important; letter-spacing: -1.2px !important; }

        .nota-final .valor-nota-g,
        .preview-mode .nota-final .valor-nota-g,
        body.modo-cliente .nota-final .valor-nota-g,
        body.modo-interno .nota-final .valor-nota-g { font-size: 36px !important; letter-spacing: -1.6px !important; }

        .nota-final .valor-nota-gg,
        .preview-mode .nota-final .valor-nota-gg,
        body.modo-cliente .nota-final .valor-nota-gg,
        body.modo-interno .nota-final .valor-nota-gg { font-size: 31px !important; letter-spacing: -1.9px !important; }

        @media print {
          .footer-final,
          body.modo-cliente .footer-final,
          body.modo-interno .footer-final { grid-template-columns: calc(50% - 3mm) calc(50% - 3mm) !important; gap: 6mm !important; margin-top: 3mm !important; }
          .ytalseg-card-final,
          .nota-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-cliente .nota-final,
          body.modo-interno .ytalseg-card-final,
          body.modo-interno .nota-final { height: 36mm !important; min-height: 36mm !important; max-height: 36mm !important; overflow: hidden !important; }
          .ytalseg-card-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-interno .ytalseg-card-final { grid-template-columns: 34mm minmax(0, 1fr) !important; border-radius: 13px !important; }
          .logo-area-final,
          body.modo-cliente .logo-area-final,
          body.modo-interno .logo-area-final { padding: 2mm !important; }
          .logo-circle-final,
          .logo-card,
          body.modo-cliente .logo-circle-final,
          body.modo-cliente .logo-card,
          body.modo-interno .logo-circle-final,
          body.modo-interno .logo-card { width: 30mm !important; height: 30mm !important; max-width: 30mm !important; max-height: 30mm !important; }
          .info-area-final,
          body.modo-cliente .info-area-final,
          body.modo-interno .info-area-final { padding: 4px 7px !important; border-right-width: 3px !important; border-top-right-radius: 28px !important; border-bottom-right-radius: 28px !important; line-height: 1.1 !important; }
          .info-area-final h2,
          body.modo-cliente .info-area-final h2,
          body.modo-interno .info-area-final h2 { font-size: 14px !important; margin-bottom: 2px !important; }
          .info-area-final p,
          body.modo-cliente .info-area-final p,
          body.modo-interno .info-area-final p { font-size: 6.8px !important; line-height: 1.1 !important; margin: 0 0 1.5px !important; font-weight: 600 !important; }
          .info-area-final strong,
          body.modo-cliente .info-area-final strong,
          body.modo-interno .info-area-final strong { font-size: 6.9px !important; line-height: 1.05 !important; margin: 2px 0 1px !important; font-weight: 800 !important; }
          .rep-line,
          body.modo-cliente .rep-line,
          body.modo-interno .rep-line { grid-template-columns: 15mm minmax(0,1fr) !important; column-gap: 1mm !important; font-size: 6.8px !important; line-height: 1.05 !important; margin-top: 1px !important; font-weight: 600 !important; }
          .email-line,
          body.modo-cliente .email-line,
          body.modo-interno .email-line { font-size: 6.2px !important; line-height: 1.05 !important; margin-top: 1.5px !important; font-weight: 600 !important; }
          .nota-final,
          body.modo-cliente .nota-final,
          body.modo-interno .nota-final { padding: 4px 7px !important; border-radius: 13px !important; }
          .nota-final span,
          body.modo-cliente .nota-final span,
          body.modo-interno .nota-final span { font-size: 12px !important; margin-bottom: 3px !important; }
          .nota-final .valor-nota,
          body.modo-cliente .nota-final .valor-nota,
          body.modo-interno .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; transform: none !important; }
          .nota-final .valor-nota-m,
          body.modo-cliente .nota-final .valor-nota-m,
          body.modo-interno .nota-final .valor-nota-m { font-size: 28px !important; }
          .nota-final .valor-nota-g,
          body.modo-cliente .nota-final .valor-nota-g,
          body.modo-interno .nota-final .valor-nota-g { font-size: 24px !important; }
          .nota-final .valor-nota-gg,
          body.modo-cliente .nota-final .valor-nota-gg,
          body.modo-interno .nota-final .valor-nota-gg { font-size: 21px !important; }
        }



        /* V72 FINAL LIMPO - padrão aprovado V66 com proteção contra esticar/quebrar cards
           Regra: não muda cálculo nem funções; só trava o rodapé visual dos relatórios. */
        .footer-final,
        .preview-mode .footer-final,
        body.modo-cliente .footer-final,
        body.modo-interno .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          margin-top: 18px !important;
          align-items: stretch !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .ytalseg-card-final,
        .preview-mode .ytalseg-card-final,
        body.modo-cliente .ytalseg-card-final,
        body.modo-interno .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 165px minmax(0, 1fr) !important;
          min-height: 130px !important;
          height: 130px !important;
          max-height: 130px !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-radius: 24px !important;
          background: rgba(255,255,255,.88) !important;
          box-shadow: none !important;
          border: 1px solid #d7d7d7 !important;
          box-sizing: border-box !important;
        }

        .logo-area-final,
        .preview-mode .logo-area-final,
        body.modo-cliente .logo-area-final,
        body.modo-interno .logo-area-final {
          background: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding-left: 8px !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .logo-circle-final,
        .logo-card,
        .preview-mode .logo-circle-final,
        .preview-mode .logo-card,
        body.modo-cliente .logo-circle-final,
        body.modo-cliente .logo-card,
        body.modo-interno .logo-circle-final,
        body.modo-interno .logo-card {
          width: 132px !important;
          height: 132px !important;
          max-width: 132px !important;
          max-height: 132px !important;
          object-fit: contain !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 0 auto !important;
        }

        .info-area-final,
        .preview-mode .info-area-final,
        body.modo-cliente .info-area-final,
        body.modo-interno .info-area-final {
          padding: 14px 18px !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-right: 6px solid #00B050 !important;
          border-top-right-radius: 80px !important;
          border-bottom-right-radius: 80px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }

        .info-area-final h2,
        .preview-mode .info-area-final h2,
        body.modo-cliente .info-area-final h2,
        body.modo-interno .info-area-final h2 {
          margin: 0 0 2px 0 !important;
          color: #00B050 !important;
          font-size: 30px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }

        .info-area-final p,
        .preview-mode .info-area-final p,
        body.modo-cliente .info-area-final p,
        body.modo-interno .info-area-final p {
          margin: 1px 0 !important;
          font-size: 13px !important;
          line-height: 1.12 !important;
          color: #111 !important;
          font-weight: 600 !important;
          white-space: normal !important;
          overflow: hidden !important;
        }

        .info-area-final strong,
        .preview-mode .info-area-final strong,
        body.modo-cliente .info-area-final strong,
        body.modo-interno .info-area-final strong {
          display: block !important;
          margin: 4px 0 2px !important;
          font-size: 13px !important;
          line-height: 1.06 !important;
          color: #111 !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .rep-line,
        .preview-mode .rep-line,
        body.modo-cliente .rep-line,
        body.modo-interno .rep-line {
          display: grid !important;
          grid-template-columns: 92px minmax(0, 1fr) !important;
          column-gap: 4px !important;
          width: 100% !important;
          max-width: 360px !important;
          min-width: 0 !important;
          overflow: hidden !important;
          font-size: 13px !important;
          line-height: 1.08 !important;
          margin-top: 1px !important;
          color: #111 !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
        }

        .rep-line span,
        .preview-mode .rep-line span,
        body.modo-cliente .rep-line span,
        body.modo-interno .rep-line span {
          min-width: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 700 !important;
        }

        .email-line,
        .preview-mode .email-line,
        body.modo-cliente .email-line,
        body.modo-interno .email-line {
          margin-top: 5px !important;
          font-size: 12.5px !important;
          line-height: 1.05 !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          color: #111 !important;
        }

        .nota-final,
        .preview-mode .nota-final,
        body.modo-cliente .nota-final,
        body.modo-interno .nota-final {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          min-height: 130px !important;
          height: 130px !important;
          max-height: 130px !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          padding: 18px !important;
          color: #111 !important;
          background: rgba(255,255,255,.88) !important;
          border: 1px solid #b88716 !important;
          border-radius: 24px !important;
          box-shadow: none !important;
          box-sizing: border-box !important;
        }

        .nota-icon,
        .preview-mode .nota-icon,
        body.modo-cliente .nota-icon,
        body.modo-interno .nota-icon { display: none !important; }

        .nota-final > div,
        .preview-mode .nota-final > div,
        body.modo-cliente .nota-final > div,
        body.modo-interno .nota-final > div {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nota-final span,
        .preview-mode .nota-final span,
        body.modo-cliente .nota-final span,
        body.modo-interno .nota-final span {
          display: block !important;
          width: 100% !important;
          font-size: 24px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          margin-bottom: 8px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .nota-final .valor-nota,
        .preview-mode .nota-final .valor-nota,
        body.modo-cliente .nota-final .valor-nota,
        body.modo-interno .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: .95 !important;
          font-size: clamp(36px, 4.2vw, 58px) !important;
          letter-spacing: -1.2px !important;
          transform: none !important;
          font-weight: 900 !important;
        }

        .nota-final .valor-nota-m,
        .preview-mode .nota-final .valor-nota-m,
        body.modo-cliente .nota-final .valor-nota-m,
        body.modo-interno .nota-final .valor-nota-m { font-size: clamp(34px, 3.8vw, 50px) !important; }

        .nota-final .valor-nota-g,
        .preview-mode .nota-final .valor-nota-g,
        body.modo-cliente .nota-final .valor-nota-g,
        body.modo-interno .nota-final .valor-nota-g { font-size: clamp(30px, 3.3vw, 44px) !important; letter-spacing: -1.5px !important; }

        .nota-final .valor-nota-gg,
        .preview-mode .nota-final .valor-nota-gg,
        body.modo-cliente .nota-final .valor-nota-gg,
        body.modo-interno .nota-final .valor-nota-gg { font-size: clamp(26px, 2.9vw, 38px) !important; letter-spacing: -1.8px !important; }

        @media print {
          .footer-final,
          body.modo-cliente .footer-final,
          body.modo-interno .footer-final {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
            gap: 5mm !important;
            margin-top: 3mm !important;
          }
          .ytalseg-card-final,
          .nota-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-cliente .nota-final,
          body.modo-interno .ytalseg-card-final,
          body.modo-interno .nota-final {
            height: 34mm !important;
            min-height: 34mm !important;
            max-height: 34mm !important;
            overflow: hidden !important;
          }
          .ytalseg-card-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-interno .ytalseg-card-final { grid-template-columns: 32mm minmax(0, 1fr) !important; border-radius: 13px !important; }
          .logo-area-final,
          body.modo-cliente .logo-area-final,
          body.modo-interno .logo-area-final { padding-left: 1.5mm !important; }
          .logo-circle-final,
          .logo-card,
          body.modo-cliente .logo-circle-final,
          body.modo-cliente .logo-card,
          body.modo-interno .logo-circle-final,
          body.modo-interno .logo-card { width: 29mm !important; height: 29mm !important; max-width: 29mm !important; max-height: 29mm !important; }
          .info-area-final,
          body.modo-cliente .info-area-final,
          body.modo-interno .info-area-final { padding: 3.5px 7px !important; border-right-width: 3px !important; border-top-right-radius: 28px !important; border-bottom-right-radius: 28px !important; }
          .info-area-final h2,
          body.modo-cliente .info-area-final h2,
          body.modo-interno .info-area-final h2 { font-size: 14px !important; margin-bottom: 1.5px !important; }
          .info-area-final p,
          body.modo-cliente .info-area-final p,
          body.modo-interno .info-area-final p { font-size: 6.8px !important; line-height: 1.08 !important; margin: 0 0 1px !important; font-weight: 600 !important; }
          .info-area-final strong,
          body.modo-cliente .info-area-final strong,
          body.modo-interno .info-area-final strong { font-size: 6.8px !important; line-height: 1.04 !important; margin: 1.5px 0 1px !important; font-weight: 800 !important; }
          .rep-line,
          body.modo-cliente .rep-line,
          body.modo-interno .rep-line { grid-template-columns: 15mm minmax(0, 1fr) !important; column-gap: 1mm !important; font-size: 6.7px !important; line-height: 1.04 !important; margin-top: 0.6px !important; font-weight: 700 !important; }
          .email-line,
          body.modo-cliente .email-line,
          body.modo-interno .email-line { font-size: 6.15px !important; line-height: 1.02 !important; margin-top: 1px !important; font-weight: 700 !important; }
          .nota-final,
          body.modo-cliente .nota-final,
          body.modo-interno .nota-final { padding: 3mm 4mm !important; border-radius: 13px !important; }
          .nota-final span,
          body.modo-cliente .nota-final span,
          body.modo-interno .nota-final span { font-size: 12px !important; margin-bottom: 2.5px !important; }
          .nota-final .valor-nota,
          body.modo-cliente .nota-final .valor-nota,
          body.modo-interno .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; }
          .nota-final .valor-nota-m,
          body.modo-cliente .nota-final .valor-nota-m,
          body.modo-interno .nota-final .valor-nota-m { font-size: 28px !important; }
          .nota-final .valor-nota-g,
          body.modo-cliente .nota-final .valor-nota-g,
          body.modo-interno .nota-final .valor-nota-g { font-size: 24px !important; }
          .nota-final .valor-nota-gg,
          body.modo-cliente .nota-final .valor-nota-gg,
          body.modo-interno .nota-final .valor-nota-gg { font-size: 21px !important; }
        }


        /* V73 CORREÇÃO FINAL: PRINCIPAL SOMENTE.
           Cliente e Interno continuam como estão. Esta regra só vale quando NÃO estiver em modo cliente/interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          margin-top: 18px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
          overflow: visible !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          height: 130px !important;
          min-height: 130px !important;
          max-height: 130px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 150px minmax(0, 1fr) !important;
          border-radius: 24px !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 6px 8px !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 118px !important;
          height: 118px !important;
          max-width: 118px !important;
          max-height: 118px !important;
          object-fit: contain !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          padding: 8px 12px !important;
          border-right: 5px solid #00B050 !important;
          border-top-right-radius: 65px !important;
          border-bottom-right-radius: 65px !important;
          overflow: hidden !important;
          justify-content: center !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          font-size: 24px !important;
          line-height: 1 !important;
          margin: 0 0 3px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p {
          font-size: 10.2px !important;
          line-height: 1.12 !important;
          margin: 0 0 2px !important;
          font-weight: 600 !important;
          white-space: normal !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          font-size: 10.2px !important;
          line-height: 1.05 !important;
          margin: 3px 0 2px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 76px minmax(0, 1fr) !important;
          column-gap: 4px !important;
          max-width: 100% !important;
          font-size: 10.2px !important;
          line-height: 1.06 !important;
          margin-top: 1px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line span {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 9.6px !important;
          line-height: 1.02 !important;
          margin-top: 3px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 12px 16px !important;
          border-radius: 24px !important;
          background: rgba(255,255,255,.88) !important;
          box-shadow: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          font-size: 20px !important;
          line-height: 1 !important;
          margin-bottom: 7px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota {
          font-size: 44px !important;
          line-height: .95 !important;
          letter-spacing: -1px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-align: center !important;
          transform: none !important;
          max-width: 100% !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 40px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 35px !important; letter-spacing: -1.3px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 31px !important; letter-spacing: -1.6px !important; }

        @media print {
          body:not(.modo-cliente):not(.modo-interno) .footer-final {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
            gap: 5mm !important;
            margin-top: 3mm !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final,
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            height: 34mm !important;
            min-height: 34mm !important;
            max-height: 34mm !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final {
            grid-template-columns: 32mm minmax(0, 1fr) !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .logo-circle-final,
          body:not(.modo-cliente):not(.modo-interno) .logo-card {
            width: 29mm !important;
            height: 29mm !important;
            max-width: 29mm !important;
            max-height: 29mm !important;
            object-fit: contain !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final {
            padding: 3.5px 7px !important;
            border-right-width: 3px !important;
            border-top-right-radius: 28px !important;
            border-bottom-right-radius: 28px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final h2 {
            font-size: 14px !important;
            line-height: 1 !important;
            margin-bottom: 1.5px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final p {
            font-size: 6.8px !important;
            line-height: 1.08 !important;
            margin: 0 0 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final strong {
            font-size: 6.8px !important;
            line-height: 1.04 !important;
            margin: 1.5px 0 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .rep-line {
            grid-template-columns: 15mm minmax(0, 1fr) !important;
            column-gap: 1mm !important;
            font-size: 6.7px !important;
            line-height: 1.04 !important;
            margin-top: 0.6px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .email-line {
            font-size: 6.15px !important;
            line-height: 1.02 !important;
            margin-top: 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            padding: 3mm 4mm !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final span {
            font-size: 12px !important;
            margin-bottom: 2.5px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-m { font-size: 28px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-g { font-size: 24px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-gg { font-size: 21px !important; }
        }


        /* V73 DEFINITIVO - CORRECAO CIRURGICA DO PRINCIPAL
           Cliente e Interno permanecem intactos. Estas regras so aplicam no relatorio principal. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
          gap: 10px !important;
          margin-top: 8px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
          overflow: visible !important;
          box-sizing: border-box !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          height: 105px !important;
          min-height: 105px !important;
          max-height: 105px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 120px minmax(0, 1fr) !important;
          border-radius: 16px !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 6px 8px !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 94px !important;
          height: 94px !important;
          max-width: 94px !important;
          max-height: 94px !important;
          object-fit: contain !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          padding: 6px 9px !important;
          border-right: 4px solid #00B050 !important;
          border-top-right-radius: 46px !important;
          border-bottom-right-radius: 46px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          min-width: 0 !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          font-size: 17px !important;
          line-height: 1 !important;
          margin: 0 0 2px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p {
          font-size: 7.3px !important;
          line-height: 1.12 !important;
          margin: 0 0 1px !important;
          font-weight: 600 !important;
          white-space: normal !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          font-size: 7.2px !important;
          line-height: 1.05 !important;
          margin: 2px 0 1px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 54px minmax(0, 1fr) !important;
          column-gap: 3px !important;
          max-width: 100% !important;
          font-size: 7.2px !important;
          line-height: 1.06 !important;
          margin-top: .5px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line span {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 6.7px !important;
          line-height: 1.02 !important;
          margin-top: 1.5px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 7px 10px !important;
          border-radius: 16px !important;
          background: rgba(255,255,255,.88) !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          font-size: 14px !important;
          line-height: 1 !important;
          margin-bottom: 4px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          font-size: 33px !important;
          line-height: .95 !important;
          letter-spacing: -1px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          text-align: center !important;
          transform: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 30px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 27px !important; letter-spacing: -1.2px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 24px !important; letter-spacing: -1.4px !important; }

        @media print {
          body:not(.modo-cliente):not(.modo-interno) .footer-final {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
            gap: 5mm !important;
            margin-top: 3mm !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final,
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            height: 34mm !important;
            min-height: 34mm !important;
            max-height: 34mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final {
            grid-template-columns: 34mm minmax(0, 1fr) !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .logo-circle-final,
          body:not(.modo-cliente):not(.modo-interno) .logo-card {
            width: 31mm !important;
            height: 31mm !important;
            max-width: 31mm !important;
            max-height: 31mm !important;
            object-fit: contain !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final {
            padding: 5px 8px !important;
            border-right-width: 4px !important;
            border-top-right-radius: 34px !important;
            border-bottom-right-radius: 34px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final h2 {
            font-size: 16px !important;
            line-height: 1 !important;
            margin: 0 0 2px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final p,
          body:not(.modo-cliente):not(.modo-interno) .info-area-final strong,
          body:not(.modo-cliente):not(.modo-interno) .rep-line,
          body:not(.modo-cliente):not(.modo-interno) .email-line {
            font-size: 7.1px !important;
            line-height: 1.18 !important;
            margin-top: 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .rep-line {
            grid-template-columns: 50px minmax(0,1fr) !important;
            column-gap: 3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .email-line {
            font-size: 6.5px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 3mm 4mm !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final span {
            font-size: 12px !important;
            margin-bottom: 2.5px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-m { font-size: 28px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-g { font-size: 24px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-gg { font-size: 21px !important; }
        }


        /* V75 DEFINITIVO - CORRECAO REAL DA TELA PRINCIPAL
           Cliente e interno ficam intocados. Essas regras vencem todos os ajustes antigos somente quando NÃO está em modo cliente/interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          margin-top: 16px !important;
          width: 100% !important;
          align-items: stretch !important;
          overflow: visible !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          height: 150px !important;
          min-height: 150px !important;
          max-height: 150px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          background: rgba(255,255,255,.88) !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 175px minmax(0, 1fr) !important;
          border-radius: 22px !important;
          border: 1px solid #d7d7d7 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 8px 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 138px !important;
          height: 138px !important;
          max-width: 138px !important;
          max-height: 138px !important;
          object-fit: contain !important;
          flex: 0 0 auto !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          padding: 11px 14px !important;
          border-right: 6px solid #00B050 !important;
          border-top-right-radius: 70px !important;
          border-bottom-right-radius: 70px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          min-width: 0 !important;
          color: #111 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          color: #00B050 !important;
          font-size: 28px !important;
          line-height: 1 !important;
          margin: 0 0 4px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p {
          font-size: 11.4px !important;
          line-height: 1.18 !important;
          margin: 1px 0 2px !important;
          font-weight: 600 !important;
          white-space: normal !important;
          overflow: visible !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          font-size: 11.3px !important;
          line-height: 1.1 !important;
          margin: 4px 0 3px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 82px minmax(0, 1fr) !important;
          column-gap: 6px !important;
          max-width: 100% !important;
          font-size: 11.2px !important;
          line-height: 1.12 !important;
          margin-top: 1px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: visible !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line span {
          white-space: nowrap !important;
          overflow: visible !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 10.6px !important;
          line-height: 1.1 !important;
          margin-top: 3px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 14px 18px !important;
          border-radius: 22px !important;
          border: 1px solid #d8a900 !important;
          background: rgba(255,255,255,.88) !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-icon {
          display: none !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          font-size: 24px !important;
          line-height: 1 !important;
          margin-bottom: 8px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          font-size: 54px !important;
          line-height: .96 !important;
          letter-spacing: -1px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          text-align: center !important;
          transform: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 50px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 44px !important; letter-spacing: -1.2px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 38px !important; letter-spacing: -1.4px !important; }



        /* V77 LIMPO: remover somente os cards YTALSEG/VALOR da tela principal.
           Cliente e interno continuam intactos porque usam body.modo-cliente/body.modo-interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: none !important;
        }
        @media print {
          body:not(.modo-cliente):not(.modo-interno) .footer-final {
            display: none !important;
          }
        }

        /* V78: somente tela principal - garantir total do relatório visível no RESUMO DE COBRANÇA.
           Não altera cliente/interno e não toca nos cards removidos da principal. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .resumo-cobranca-panel tr.total-row,
        body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row {
          display: table-row !important;
          visibility: visible !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .resumo-cobranca-panel tr.total-row td,
        body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row td {
          background: rgba(0,176,80,.12) !important;
          color: #111827 !important;
          font-weight: 1000 !important;
          font-size: 12px !important;
          border-top: 2px solid #00B050 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .resumo-cobranca-panel tr.total-row td:last-child,
        body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row td:last-child {
          text-align: center !important;
          font-size: 13px !important;
        }
        @media print {
          body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row {
            display: table-row !important;
            visibility: visible !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row td {
            background: rgba(0,176,80,.10) !important;
            color: #111827 !important;
            font-weight: 1000 !important;
            font-size: 8px !important;
            border-top: 1px solid #00B050 !important;
          }
        }

/* V81 PREMIUM: ajuste fino SOMENTE do texto do card YTALSEG em Cliente e Interno.
   Não altera largura, altura, logo, card valor ou tela principal. */
body.modo-cliente .ytalseg-card-final .info-area-final,
body.modo-interno .ytalseg-card-final .info-area-final{
  padding: 7px 12px !important;
  justify-content: center !important;
}
body.modo-cliente .ytalseg-card-final .info-area-final h2,
body.modo-interno .ytalseg-card-final .info-area-final h2{
  font-size: 24px !important;
  line-height: .96 !important;
  margin: 0 0 3px !important;
  letter-spacing: .2px !important;
  font-weight: 900 !important;
  white-space: nowrap !important;
}
body.modo-cliente .ytalseg-card-final .info-area-final p,
body.modo-interno .ytalseg-card-final .info-area-final p{
  font-size: 9.6px !important;
  line-height: 1.12 !important;
  margin: 0 0 1.5px !important;
  font-weight: 650 !important;
}
body.modo-cliente .ytalseg-card-final .info-area-final strong,
body.modo-interno .ytalseg-card-final .info-area-final strong{
  display: block !important;
  font-size: 9.3px !important;
  line-height: 1.06 !important;
  margin: 2.5px 0 1.5px !important;
  font-weight: 900 !important;
  white-space: nowrap !important;
}
body.modo-cliente .ytalseg-card-final .rep-line,
body.modo-interno .ytalseg-card-final .rep-line{
  display: grid !important;
  grid-template-columns: 74px minmax(0, 1fr) !important;
  column-gap: 5px !important;
  font-size: 9.3px !important;
  line-height: 1.08 !important;
  margin-top: 1px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}
body.modo-cliente .ytalseg-card-final .email-line,
body.modo-interno .ytalseg-card-final .email-line{
  font-size: 8.4px !important;
  line-height: 1.05 !important;
  margin-top: 2px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}
@media print{
  body.modo-cliente .ytalseg-card-final .info-area-final,
  body.modo-interno .ytalseg-card-final .info-area-final{
    padding: 4px 8px !important;
    justify-content: center !important;
  }
  body.modo-cliente .ytalseg-card-final .info-area-final h2,
  body.modo-interno .ytalseg-card-final .info-area-final h2{
    font-size: 17px !important;
    line-height: .96 !important;
    margin: 0 0 2px !important;
  }
  body.modo-cliente .ytalseg-card-final .info-area-final p,
  body.modo-interno .ytalseg-card-final .info-area-final p{
    font-size: 7.8px !important;
    line-height: 1.08 !important;
    margin: 0 0 1px !important;
    font-weight: 650 !important;
  }
  body.modo-cliente .ytalseg-card-final .info-area-final strong,
  body.modo-interno .ytalseg-card-final .info-area-final strong{
    font-size: 7.6px !important;
    line-height: 1.04 !important;
    margin: 1.5px 0 1px !important;
    font-weight: 900 !important;
    white-space: nowrap !important;
  }
  body.modo-cliente .ytalseg-card-final .rep-line,
  body.modo-interno .ytalseg-card-final .rep-line{
    grid-template-columns: 15.5mm minmax(0, 1fr) !important;
    column-gap: 1mm !important;
    font-size: 7.35px !important;
    line-height: 1.04 !important;
    margin-top: .5px !important;
    font-weight: 700 !important;
  }
  body.modo-cliente .ytalseg-card-final .email-line,
  body.modo-interno .ytalseg-card-final .email-line{
    font-size: 6.7px !important;
    line-height: 1.02 !important;
    margin-top: 1px !important;
    font-weight: 700 !important;
  }
}

      `}),n.jsx("div",{className:"screen-toolbar",children:n.jsxs("div",{className:"upload",children:[n.jsxs("div",{className:"toolbar-grid",children:[n.jsxs("div",{className:"toolbar-mes",children:[n.jsx("label",{className:"toolbar-label",children:"Mês da análise"}),n.jsx("select",{className:"empresa-select",value:g,onChange:A=>{const I=Number(A.target.value);C(I),x(zn([],I,z))},children:Array.from({length:12}).map((A,I)=>n.jsx("option",{value:I+1,children:np(I+1)},I+1))})]}),n.jsxs("div",{className:"toolbar-ano",children:[n.jsx("label",{className:"toolbar-label",children:"Ano da análise"}),n.jsx("input",{value:z,type:"number",onChange:A=>{const I=Number(A.target.value||new Date().getFullYear());E(I),x(zn([],g,I))}})]}),n.jsxs("div",{children:[n.jsx("label",{className:"toolbar-label",children:"PDF da folha"}),n.jsx("input",{type:"file",accept:"application/pdf",onChange:A=>{var I;return k(((I=A.target.files)==null?void 0:I[0])||null)}})]}),n.jsxs("div",{children:[n.jsx("label",{className:"toolbar-label",children:"Empresa / Cliente"}),n.jsx("select",{className:"empresa-select",value:X,onChange:A=>G(A.target.value),children:M.map(A=>n.jsx("option",{value:A.id,children:A.nome},A.id))})]})]}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn-main",onClick:co,children:h?"Processando...":"Processar PDF"}),n.jsx("button",{className:"btn-main",onClick:lr,children:"+ Relatório manual"}),n.jsx("button",{className:"btn-main",onClick:rr,children:"+ Adicionar serviços"}),n.jsxs("details",{className:"action-group",children:[n.jsx("summary",{children:"🏢 Empresas"}),n.jsxs("div",{className:"action-group-menu",children:[n.jsx("button",{className:"btn-gray",onClick:uo,children:"+ Cadastrar empresa"}),n.jsx("button",{className:"btn-gray",onClick:hn,disabled:!te,children:"✏️ Editar empresa"}),n.jsx("button",{className:"btn-gray",onClick:ir,children:"🌙 Aplicar 20% nas noturnas"})]})]}),n.jsxs("details",{className:"action-group",children:[n.jsx("summary",{children:"👁️ Visualizar / Salvar"}),n.jsxs("div",{className:"action-group-menu",children:[n.jsx("button",{className:"btn-gray",onClick:()=>On("cliente"),children:"👁️ Visualizar cliente"}),n.jsx("button",{className:"btn-gray",onClick:()=>On("interno"),children:"👁️ Visualizar interno"}),n.jsx("button",{className:"btn-gray",onClick:sr,children:"📄 Salvar PDF Cliente"}),n.jsx("button",{className:"btn-gray",onClick:In,children:"📊 Salvar PDF Interno"})]})]}),n.jsxs("details",{className:"action-group",children:[n.jsx("summary",{children:"💾 Editar / Backup"}),n.jsxs("div",{className:"action-group-menu",children:[n.jsx("button",{className:"btn-gray",onClick:ge,children:"Backup agora"}),n.jsx("button",{className:"btn-main",onClick:Se,children:"Salvar relatório editável"}),n.jsxs("label",{className:"btn-gray",style:{display:"inline-flex",alignItems:"center",cursor:"pointer"},children:["Abrir backup/relatório",n.jsx("input",{type:"file",accept:"application/json,.json",onChange:Rn,style:{display:"none"}})]}),n.jsx("button",{className:"btn-gray",onClick:or,children:"Editar último relatório"})]})]}),n.jsxs("details",{className:"action-group",children:[n.jsx("summary",{children:"🔎 Zoom"}),n.jsxs("div",{className:"action-group-menu",children:[n.jsx("button",{className:"btn-gray",onClick:()=>u(1.3),children:"Zoom 200%"}),n.jsx("button",{className:"btn-gray",onClick:()=>u(1.5),children:"Zoom 230%"}),n.jsx("button",{className:"btn-gray",onClick:()=>u(2),children:"Zoom 270%"})]})]}),n.jsxs("details",{className:"action-group",children:[n.jsx("summary",{children:"🧹 Limpar"}),n.jsxs("div",{className:"action-group-menu",children:[n.jsx("button",{className:"btn-red",onClick:he,children:"Limpar tabela"}),n.jsx("button",{className:"btn-gray",onClick:me,children:"Limpar rascunho"}),n.jsx("button",{className:"btn-gray",onClick:ar,children:"Limpar 20%"})]})]})]}),p&&n.jsx("div",{className:"manual-hint",children:"Conferência: use o PDF processado ou crie relatório manual, marque os dias/valores e gere o PDF."}),be&&n.jsxs("div",{className:"cadastro-box",children:[n.jsx("div",{className:"cadastro-title",children:pe.id?"Editar empresa":"Cadastrar nova empresa"}),n.jsxs("div",{className:"cadastro-grid",children:[n.jsxs("div",{children:[n.jsx("label",{children:"ID interno"}),n.jsx("input",{value:pe.id,placeholder:"ex: geoambiental",onChange:A=>Te("id",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Nome da empresa"}),n.jsx("input",{value:pe.nome,placeholder:"Nome do cliente",onChange:A=>Te("nome",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"CNPJ"}),n.jsx("input",{value:pe.cnpj,placeholder:"00.000.000/0000-00",onChange:A=>Te("cnpj",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Diária diurna"}),n.jsx("input",{type:"number",value:pe.diaria_diurna,onChange:A=>Te("diaria_diurna",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Diária noturna"}),n.jsx("input",{type:"number",value:pe.diaria_noturna,onChange:A=>Te("diaria_noturna",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Sábado"}),n.jsx("input",{type:"number",value:pe.sabado,onChange:A=>Te("sabado",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Domingo/Feriado"}),n.jsx("input",{type:"number",value:pe.domingo_feriado,onChange:A=>Te("domingo_feriado",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Adic. noturno 25% (auto por tipo de dia)"}),n.jsx("input",{type:"number",value:pe.adicional_noturno,onChange:A=>Te("adicional_noturno",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Hora 20%"}),n.jsx("input",{type:"number",value:pe.hora_20,onChange:A=>Te("hora_20",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Hora 50%"}),n.jsx("input",{type:"number",value:pe.hora_50,onChange:A=>Te("hora_50",A.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Hora 100%"}),n.jsx("input",{type:"number",value:pe.hora_100,onChange:A=>Te("hora_100",A.target.value)})]}),n.jsxs("div",{className:"check-line",children:[n.jsx("input",{type:"checkbox",checked:pe.usa_adicional_noturno,onChange:A=>Te("usa_adicional_noturno",A.target.checked)}),"Usa adicional noturno"]}),n.jsxs("div",{className:"check-line",children:[n.jsx("input",{type:"checkbox",checked:pe.feriado_usa_valor_domingo,onChange:A=>Te("feriado_usa_valor_domingo",A.target.checked)}),"Feriado usa valor domingo"]})]}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn-main",onClick:mo,children:"Salvar empresa"}),n.jsx("button",{className:"btn-gray",onClick:()=>Ie(!1),children:"Cancelar"})]})]}),L&&n.jsx("strong",{style:{color:"red"},children:L})]})}),H&&n.jsx("div",{className:"rascunho-status",children:H}),n.jsxs("div",{className:`sheet ${B?"":"sem-dias-trabalhados"}`,style:{transform:`scale(${l})`,transformOrigin:"top center"},children:[n.jsx("div",{className:"watermark",children:n.jsx("img",{src:hl,className:"logo-watermark"})}),n.jsxs("div",{className:"content",children:[n.jsxs("div",{className:"top",children:[n.jsxs("div",{children:[n.jsx("div",{className:"brand",children:"YTALSEG"}),n.jsx("div",{className:"brand-sub",children:"ASSESSORIA E CONSULTORIA EM SEGURANÇA DO TRABALHO"})]}),n.jsx("div",{className:"title",children:"RELATÓRIO DE HORAS"}),n.jsx("div",{className:"seal",children:n.jsx("img",{src:hl,className:"logo-topo"})})]}),n.jsxs("div",{className:"info",children:[n.jsxs("div",{children:[n.jsx("div",{className:"label",children:"Empresa / Cliente"}),n.jsx("div",{className:"value",children:(te==null?void 0:te.nome)||"GEOAMBIENTAL"}),n.jsxs("div",{className:"cnpj-line",children:["CNPJ: ",(te==null?void 0:te.cnpj)||"05.453.862/0001-93"]})]}),n.jsxs("div",{children:[n.jsx("div",{className:"label",children:"Mês / Referência"}),n.jsx("div",{className:"value",children:Qe})]}),n.jsxs("div",{children:[n.jsx("div",{className:"label",children:"Responsáveis técnicos"}),n.jsx("div",{className:"value",children:"Yatta, Valdemir e Darlan"})]}),n.jsxs("div",{children:[n.jsx("div",{className:"label",children:"Arquivo processado"}),n.jsx("div",{className:"value",children:(p==null?void 0:p.filename)||"-"})]})]}),n.jsxs("div",{className:"grid",children:[n.jsx("div",{className:"panel",children:n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"#"}),n.jsx("th",{children:"Dias da Semana"}),n.jsx("th",{children:"Feriado"}),n.jsx("th",{children:"Diurna"}),n.jsx("th",{children:"Noturna"}),n.jsx("th",{children:"20%"}),n.jsx("th",{children:"50%"}),n.jsx("th",{children:"100%"}),n.jsx("th",{children:"Adic. 25%"})]})}),n.jsxs("tbody",{children:[ae.map((A,I)=>n.jsxs("tr",{children:[n.jsx("td",{children:I+1}),n.jsx("td",{children:Ml(A.semana)}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.feriado,onChange:ee=>Et(I,"feriado",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.feriado?"F":"-"})]}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.diurna,onChange:ee=>Et(I,"diurna",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.diurna?"1":"-"})]}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.noturna,onChange:ee=>Et(I,"noturna",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.noturna?"1":"-"})]}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.extra20,onChange:ee=>Et(I,"extra20",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.extra20?"1":"-"})]}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.extra50,onChange:ee=>Et(I,"extra50",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.extra50?"1":"-"})]}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.extra100,onChange:ee=>Et(I,"extra100",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.extra100?"1":"-"})]}),n.jsxs("td",{children:[n.jsx("input",{className:"checkbox-small",type:"checkbox",checked:A.adicional,disabled:!A.noturna,onChange:ee=>Et(I,"adicional",ee.target.checked)}),n.jsx("span",{className:"print-value",children:A.adicional?nt(ue.adicionalNoturno):"-"})]})]},A.data)),n.jsxs("tr",{className:"total-row",children:[n.jsx("td",{colSpan:2,children:"TOTAL"}),n.jsx("td",{children:($==null?void 0:$.feriados)||0}),n.jsx("td",{children:($==null?void 0:$.periodos_diurnos)||0}),n.jsx("td",{children:($==null?void 0:$.periodos_noturnos)||0}),n.jsx("td",{children:($==null?void 0:$.extras20)||0}),n.jsx("td",{children:($==null?void 0:$.extras50)||0}),n.jsx("td",{children:($==null?void 0:$.extras100)||0}),n.jsx("td",{children:nt($.total_adicional_noturno||0)})]})]})]})}),n.jsxs("div",{children:[n.jsxs("div",{className:"panel tabela-valores",children:[n.jsx("div",{className:"panel-title",children:"TABELA DE VALORES"}),n.jsx("table",{children:n.jsx("tbody",{children:[["Diária Diurno (07:00 às 19:00)",ue.diariaNormal],["Diária Noturna (19:00 às 07:00)",ue.diariaNoturna],["Hora Extra 20%",ue.hora20],["Hora Extra 50%",ue.hora50],["Hora Extra 100%",ue.hora100],["Adicional Noturno 25%",ue.adicionalNoturno],["Sábado",ue.sabado],["Domingo / Feriado",ue.domingoFeriado]].map(([A,I])=>n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:A}),n.jsx("td",{children:nt(Number(I))})]},String(A)))})})]}),n.jsxs("div",{className:"panel resumo-cobranca-panel",children:[n.jsx("div",{className:"panel-title",children:"RESUMO DE COBRANÇA"}),n.jsx("table",{children:n.jsxs("tbody",{children:[n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Diárias Normais"}),n.jsx("td",{children:($==null?void 0:$.dias_normais)||0}),n.jsx("td",{children:nt(($==null?void 0:$.total_diarias)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Sábados"}),n.jsx("td",{children:($==null?void 0:$.sabados)||0}),n.jsx("td",{children:nt(($==null?void 0:$.total_sabados)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Domingos/Feriados"}),n.jsx("td",{children:($==null?void 0:$.domingos_feriados)||0}),n.jsx("td",{children:nt(($==null?void 0:$.total_domingos_feriados)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Extras 20%"}),n.jsx("td",{children:($==null?void 0:$.extras20)||0}),n.jsx("td",{children:nt(($==null?void 0:$.total_20)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Extras 50%"}),n.jsx("td",{children:($==null?void 0:$.extras50)||0}),n.jsx("td",{children:nt(($==null?void 0:$.total_50)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Extras 100%"}),n.jsx("td",{children:($==null?void 0:$.extras100)||0}),n.jsx("td",{children:nt(($==null?void 0:$.total_100)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Adic. Noturno"}),n.jsx("td",{children:b.filter(A=>A.adicional).length}),n.jsx("td",{children:nt(($==null?void 0:$.total_adicional_noturno)||0)})]}),n.jsxs("tr",{children:[n.jsx("td",{className:"left",children:"Serviços Diversos"}),n.jsx("td",{children:v.length}),n.jsx("td",{children:nt(Y)})]}),n.jsxs("tr",{className:"total-row",children:[n.jsx("td",{className:"left",children:"VALOR DA NOTA"}),n.jsx("td",{colSpan:2,children:nt(S)})]})]})})]})]})]}),n.jsxs("div",{className:"obs",children:[n.jsx("h3",{children:"OBSERVAÇÕES / SERVIÇOS DIVERSOS:"}),n.jsx("p",{children:" Serviços e valores a somar na nota."}),n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Data"}),n.jsx("th",{children:"Descrição do Serviço"}),n.jsx("th",{children:"Valor (R$)"}),n.jsx("th",{children:"Ação"})]})}),n.jsxs("tbody",{children:[v.length===0&&n.jsxs("tr",{children:[n.jsx("td",{children:" "}),n.jsx("td",{children:" "}),n.jsx("td",{children:" "}),n.jsx("td",{children:" "})]}),v.map((A,I)=>n.jsxs("tr",{children:[n.jsx("td",{children:n.jsx("input",{value:A.data,onChange:ee=>An(I,"data",ee.target.value)})}),n.jsx("td",{children:n.jsx("input",{value:A.descricao,onChange:ee=>An(I,"descricao",ee.target.value)})}),n.jsx("td",{children:n.jsx("input",{type:"number",value:A.valor,onChange:ee=>An(I,"valor",ee.target.value)})}),n.jsx("td",{children:n.jsx("button",{className:"btn-red",onClick:()=>po(I),children:"Remover"})})]},I))]})]}),n.jsxs("div",{style:{marginTop:8,fontWeight:800},children:["Total serviços diversos: ",nt(Y)]})]}),n.jsxs("div",{className:"footer-final",children:[n.jsxs("div",{className:"ytalseg-card-final",children:[n.jsx("div",{className:"logo-area-final",children:n.jsx("div",{className:"logo-circle-final",children:n.jsx("img",{src:hl,className:"logo-card"})})}),n.jsxs("div",{className:"info-area-final",children:[n.jsx("h2",{children:"YTALSEG"}),n.jsx("p",{children:"Assessoria e Consultoria em Segurança do Trabalho"}),n.jsx("p",{children:"CNPJ:18.315.702/0001-20"}),n.jsx("strong",{children:"REPRESENTANTES RESPONSÁVEIS:"}),n.jsxs("div",{className:"rep-line",children:[n.jsx("span",{children:"📞 Yatta "}),n.jsx("span",{children:"(11) 9 5789-8196 "})]}),n.jsxs("div",{className:"rep-line",children:[n.jsx("span",{children:"📞 Valdemir  "}),n.jsx("span",{children:"(11) 9 94711-9488 "})]}),n.jsxs("div",{className:"rep-line",children:[n.jsx("span",{children:"📞 Darlan "}),n.jsx("span",{children:"(11) 9 8407-7772 "})]}),n.jsx("div",{className:"email-line",children:"✉ Email: financeiro.ytalseg@gmail.com"})]})]}),n.jsxs("div",{className:"nota-final",children:[n.jsx("div",{className:"nota-icon",children:"📄💲"}),n.jsxs("div",{children:[n.jsx("span",{children:"VALOR DA NOTA"}),n.jsx("strong",{className:mm(S),children:nt(S)})]})]})]})]})]})]})}const vl=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,Ic="#00B050";function er(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function mn({titulo:l,valor:u,detalhe:d,tipo:k="normal"}){return n.jsxs("div",{className:`dash-card ${k}`,children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u}),n.jsx("p",{children:d})]})}function ym(){const l=new Date;return`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}`}function bm(){const[l,u]=D.useState([]),[d,k]=D.useState([]),[p,N]=D.useState([]),[_,g]=D.useState("");async function C(){try{g("");const[E,b,x]=await Promise.all([fetch(`${vl}/financeiro`),fetch(`${vl}/empresas`),fetch(`${vl}/equipe`).catch(()=>null)]),v=await E.json(),c=await b.json();if(v.status==="ok"&&u(v.lancamentos||[]),c.status==="ok"&&N(c.empresas||[]),x){const h=await x.json();h.status==="ok"&&k(h.equipe||[])}}catch{g("Não consegui carregar dados do backend SQLite. Confira se o backend está rodando.")}}D.useEffect(()=>{C()},[]);const z=D.useMemo(()=>{const E=ym(),b=l.filter(G=>(G.dataEmissao||"").startsWith(E)),x=b.length?b:l,v=x.reduce((G,be)=>G+Number(be.valor||0),0),c=x.filter(G=>G.status==="recebido").reduce((G,be)=>G+Number(be.valor||0),0),h=x.filter(G=>G.status==="pendente").reduce((G,be)=>G+Number(be.valor||0),0),m=new Set(x.map(G=>G.cliente).filter(Boolean)),L=d.filter(G=>G.ativo).length,T=d.filter(G=>G.validade),H=new Date,j=T.filter(G=>{const pe=(new Date(G.validade).getTime()-H.getTime())/(1e3*60*60*24);return pe>=0&&pe<=30}).length,M=T.filter(G=>new Date(G.validade)<H).length,F=Object.entries(x.reduce((G,be)=>{const Ie=be.cliente||"Sem cliente";return G[Ie]=(G[Ie]||0)+Number(be.valor||0),G},{})).sort((G,be)=>be[1]-G[1]).slice(0,5),X=x.filter(G=>G.status==="pendente").slice(0,6);return{total:v,recebido:c,pendente:h,qtdLancamentos:x.length,clientesAtivos:p.length||m.size,equipeAtiva:L,docsVencendo:j,docsVencidos:M,topClientes:F,pendencias:X}},[l,d,p]);return n.jsxs("div",{className:"dashboard-vivo",children:[n.jsx("style",{children:`
        .dashboard-vivo { display: grid; gap: 18px; }
        .dash-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
        .dash-head h1 { margin:0; font-size:34px; font-weight:1000; color:#111827; }
        .dash-head p { margin:6px 0 0; color:#6b7280; font-weight:700; }
        .head-actions { display:flex; gap:10px; align-items:center; }
        .live-pill { background:#eafff2; color:#006b34; border:1px solid rgba(0,176,80,.25); padding:9px 13px; border-radius:999px; font-size:12px; font-weight:1000; }
        .btn-refresh { border:0; background:${Ic}; color:white; font-weight:900; padding:10px 14px; border-radius:12px; cursor:pointer; }
        .cards { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:14px; }
        .dash-card { background:white; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .dash-card span { display:block; color:#6b7280; font-size:12px; font-weight:1000; text-transform:uppercase; }
        .dash-card strong { display:block; margin-top:8px; color:${Ic}; font-size:30px; font-weight:1000; }
        .dash-card p { margin:6px 0 0; color:#6b7280; font-size:12px; font-weight:700; }
        .dash-card.alerta strong { color:#b45309; }
        .dash-card.ok strong { color:#166534; }
        .dash-grid { display:grid; grid-template-columns: 1.2fr .9fr; gap:18px; }
        .panel { background:white; border:1px solid #e5e7eb; border-radius:24px; padding:20px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .panel h2 { margin:0 0 14px; font-size:21px; font-weight:1000; color:#111827; }
        .mini-table { width:100%; border-collapse:collapse; font-size:13px; }
        .mini-table th { text-align:left; background:#f9fafb; padding:10px; color:#374151; font-weight:1000; border-bottom:1px solid #e5e7eb; }
        .mini-table td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; }
        .mini-table tr:last-child td { border-bottom:0; }
        .status { display:inline-flex; padding:5px 9px; border-radius:999px; font-size:12px; font-weight:1000; background:#fef3c7; color:#92400e; }
        .empty { color:#6b7280; font-weight:700; padding:12px 0; }
        .alert-box { background:#fff7ed; color:#9a3412; border:1px solid #fed7aa; border-radius:16px; padding:12px; font-weight:900; margin-top:8px; }
        .ok-box { background:#ecfdf5; color:#166534; border:1px solid #bbf7d0; border-radius:16px; padding:12px; font-weight:900; margin-top:8px; }
        @media(max-width: 1100px) { .cards { grid-template-columns: 1fr 1fr; } .dash-grid { grid-template-columns:1fr; } }
        @media(max-width: 650px) { .cards { grid-template-columns:1fr; } }
      `}),n.jsxs("div",{className:"dash-head",children:[n.jsxs("div",{children:[n.jsx("h1",{children:"Dashboard Vivo"}),n.jsx("p",{children:"Indicadores reais puxados do SQLite: Financeiro, Clientes e Equipe."})]}),n.jsxs("div",{className:"head-actions",children:[n.jsx("button",{className:"btn-refresh",onClick:C,children:"Atualizar"}),n.jsx("div",{className:"live-pill",children:"SQLite conectado"})]})]}),_&&n.jsx("div",{className:"alert-box",children:_}),n.jsxs("div",{className:"cards",children:[n.jsx(mn,{titulo:"Faturamento lançado",valor:er(z.total),detalhe:`${z.qtdLancamentos} lançamentos`}),n.jsx(mn,{titulo:"Recebido",valor:er(z.recebido),detalhe:"Entradas confirmadas",tipo:"ok"}),n.jsx(mn,{titulo:"Pendente",valor:er(z.pendente),detalhe:"Valores em aberto",tipo:z.pendente>0?"alerta":"ok"}),n.jsx(mn,{titulo:"Clientes ativos",valor:String(z.clientesAtivos),detalhe:"Base de clientes cadastrada"}),n.jsx(mn,{titulo:"Equipe ativa",valor:String(z.equipeAtiva),detalhe:"Colaboradores ativos"}),n.jsx(mn,{titulo:"Docs vencendo",valor:String(z.docsVencendo),detalhe:"Próximos 30 dias",tipo:z.docsVencendo>0?"alerta":"ok"}),n.jsx(mn,{titulo:"Docs vencidos",valor:String(z.docsVencidos),detalhe:"Requer atenção",tipo:z.docsVencidos>0?"alerta":"ok"}),n.jsx(mn,{titulo:"Relatórios/Notas",valor:String(z.qtdLancamentos),detalhe:"Registros financeiros"})]}),n.jsxs("div",{className:"dash-grid",children:[n.jsxs("div",{className:"panel",children:[n.jsx("h2",{children:"Ranking de clientes por valor"}),z.topClientes.length===0?n.jsx("div",{className:"empty",children:"Ainda não há lançamentos financeiros."}):n.jsxs("table",{className:"mini-table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Valor"})]})}),n.jsx("tbody",{children:z.topClientes.map(([E,b])=>n.jsxs("tr",{children:[n.jsx("td",{children:E}),n.jsx("td",{children:er(b)})]},E))})]})]}),n.jsxs("div",{className:"panel",children:[n.jsx("h2",{children:"Pendências financeiras"}),z.pendencias.length===0?n.jsx("div",{className:"ok-box",children:"Nenhuma pendência financeira no momento."}):n.jsxs("table",{className:"mini-table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Valor"}),n.jsx("th",{children:"Status"})]})}),n.jsx("tbody",{children:z.pendencias.map(E=>n.jsxs("tr",{children:[n.jsx("td",{children:E.cliente}),n.jsx("td",{children:er(E.valor)}),n.jsx("td",{children:n.jsx("span",{className:"status",children:"Pendente"})})]},E.id))})]})]})]})]})}const wm="ytalseg_relatorios_versoes_v11_2";function xi(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function jm(){const[l,u]=D.useState([]);function d(){try{const N=JSON.parse(localStorage.getItem(wm)||"[]");u(Array.isArray(N)?N:[])}catch{u([])}}D.useEffect(()=>{d()},[]);const k=D.useMemo(()=>{const N=l.reduce((x,v)=>x+Number(v.valor||0),0),_=l.filter(x=>(x.status||"Rascunho")==="Pago").reduce((x,v)=>x+Number(v.valor||0),0),g=N-_,C=l.filter(x=>(x.status||"Rascunho")==="Enviado").length,z=l.filter(x=>(x.status||"Rascunho")==="Aprovado").length,E=l.filter(x=>(x.status||"Rascunho")==="Nota emitida").length,b=l.filter(x=>(x.status||"Rascunho")!=="Pago").length;return{total:N,pago:_,aberto:g,enviados:C,aprovados:z,notaEmitida:E,pendentes:b,quantidade:l.length}},[l]),p=D.useMemo(()=>l.filter(N=>(N.status||"Rascunho")!=="Pago").slice(0,8),[l]);return n.jsxs("div",{className:"dash-op-page",children:[n.jsx("style",{children:`
        .dash-op-page {
          display: grid;
          gap: 16px;
        }

        .dash-op-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: end;
          flex-wrap: wrap;
        }

        .dash-op-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .dash-op-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .dash-op-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #00B050;
          color: white;
        }

        .dash-op-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .dash-op-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 10px 22px rgba(0,0,0,.05);
        }

        .dash-op-card span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .dash-op-card strong {
          display: block;
          margin-top: 6px;
          color: #00B050;
          font-size: 26px;
          font-weight: 1000;
        }

        .dash-op-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .dash-op-panel h3 {
          margin: 0 0 12px;
          color: #111827;
          font-size: 20px;
          font-weight: 1000;
        }

        .dash-op-row {
          display: grid;
          grid-template-columns: 1.5fr .8fr .8fr .8fr;
          gap: 10px;
          padding: 10px 0;
          border-top: 1px solid #eef0f2;
          font-size: 13px;
          font-weight: 800;
          align-items: center;
        }

        .dash-op-row:first-of-type {
          border-top: none;
        }

        .dash-op-badge {
          display: inline-flex;
          justify-content: center;
          padding: 5px 9px;
          border-radius: 999px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 12px;
          font-weight: 1000;
        }

        .dash-op-empty {
          color: #6b7280;
          font-weight: 900;
          padding: 8px 0;
        }

        @media (max-width: 1000px) {
          .dash-op-cards {
            grid-template-columns: 1fr 1fr;
          }

          .dash-op-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .dash-op-cards {
            grid-template-columns: 1fr;
          }
        }
      `}),n.jsxs("div",{className:"dash-op-head",children:[n.jsxs("div",{className:"dash-op-title",children:[n.jsx("h1",{children:"Dashboard Operacional"}),n.jsx("p",{children:"Visão rápida dos relatórios, valores e pendências."})]}),n.jsx("button",{className:"dash-op-btn",onClick:d,children:"Atualizar"})]}),n.jsxs("div",{className:"dash-op-cards",children:[n.jsx(fn,{titulo:"Total geral",valor:xi(k.total)}),n.jsx(fn,{titulo:"Total pago",valor:xi(k.pago)}),n.jsx(fn,{titulo:"Em aberto",valor:xi(k.aberto)}),n.jsx(fn,{titulo:"Relatórios",valor:String(k.quantidade)}),n.jsx(fn,{titulo:"Enviados",valor:String(k.enviados)}),n.jsx(fn,{titulo:"Aprovados",valor:String(k.aprovados)}),n.jsx(fn,{titulo:"Nota emitida",valor:String(k.notaEmitida)}),n.jsx(fn,{titulo:"Pendentes",valor:String(k.pendentes)})]}),n.jsxs("div",{className:"dash-op-panel",children:[n.jsx("h3",{children:"Pendências operacionais"}),p.length===0&&n.jsx("div",{className:"dash-op-empty",children:"Nenhuma pendência encontrada."}),p.map(N=>n.jsxs("div",{className:"dash-op-row",children:[n.jsx("div",{children:N.cliente||"Cliente não informado"}),n.jsx("div",{children:xi(Number(N.valor||0))}),n.jsx("div",{children:N.tipo||"-"}),n.jsx("div",{children:n.jsx("span",{className:"dash-op-badge",children:N.status||"Rascunho"})})]},N.id))]})]})}function fn({titulo:l,valor:u}){return n.jsxs("div",{className:"dash-op-card",children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u})]})}const Nm="ytalseg_relatorios_versoes_v11_2",Sm=["Rascunho","Enviado","Aprovado","Nota emitida","Cobrado","Pago"];function io(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function km(l){if(!l)return"Sem data";try{return new Date(l).toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}catch{return"Sem data"}}function Cm(){const[l,u]=D.useState([]);function d(){try{const g=JSON.parse(localStorage.getItem(Nm)||"[]");u(Array.isArray(g)?g:[])}catch{u([])}}D.useEffect(()=>{d()},[]);const k=D.useMemo(()=>{const g=Sm.map(h=>{const m=l.filter(L=>(L.status||"Rascunho")===h);return{status:h,qtd:m.length,valor:m.reduce((L,T)=>L+Number(T.valor||0),0)}}),C=new Map;l.forEach(h=>{const m=km(h.criadoEm);C.set(m,(C.get(m)||0)+Number(h.valor||0))});const z=Array.from(C.entries()).map(([h,m])=>({mes:h,valor:m})).slice(0,8).reverse(),E=new Map;l.forEach(h=>{const m=h.cliente||"Cliente não informado";E.set(m,(E.get(m)||0)+Number(h.valor||0))});const b=Array.from(E.entries()).map(([h,m])=>({cliente:h,valor:m})).sort((h,m)=>m.valor-h.valor).slice(0,8),x=l.reduce((h,m)=>h+Number(m.valor||0),0),v=l.filter(h=>(h.status||"Rascunho")==="Pago").reduce((h,m)=>h+Number(m.valor||0),0),c=x-v;return{porStatus:g,porMes:z,porCliente:b,total:x,pago:v,aberto:c}},[l]),p=Math.max(...k.porStatus.map(g=>g.valor),1),N=Math.max(...k.porMes.map(g=>g.valor),1),_=Math.max(...k.porCliente.map(g=>g.valor),1);return n.jsxs("div",{className:"dash-graf-page",children:[n.jsx("style",{children:`
        .dash-graf-page {
          display: grid;
          gap: 16px;
        }

        .dash-graf-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: end;
          flex-wrap: wrap;
        }

        .dash-graf-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .dash-graf-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .dash-graf-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #00B050;
          color: white;
        }

        .dash-graf-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .dash-graf-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 10px 22px rgba(0,0,0,.05);
        }

        .dash-graf-card span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .dash-graf-card strong {
          display: block;
          margin-top: 6px;
          color: #00B050;
          font-size: 26px;
          font-weight: 1000;
        }

        .dash-graf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .dash-graf-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .dash-graf-panel.full {
          grid-column: 1 / -1;
        }

        .dash-graf-panel h3 {
          margin: 0 0 14px;
          color: #111827;
          font-size: 20px;
          font-weight: 1000;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 120px 1fr 120px;
          gap: 10px;
          align-items: center;
          padding: 9px 0;
          border-top: 1px solid #eef0f2;
          font-size: 13px;
          font-weight: 850;
        }

        .bar-row:first-of-type {
          border-top: none;
        }

        .bar-track {
          height: 14px;
          border-radius: 999px;
          background: #eef0f2;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #00B050, #58d68d);
        }

        .bar-value {
          text-align: right;
          color: #374151;
          font-weight: 1000;
        }

        .mini-chart {
          display: flex;
          align-items: end;
          gap: 10px;
          height: 220px;
          padding: 12px 4px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .mini-col-wrap {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          height: 100%;
        }

        .mini-col {
          width: 100%;
          max-width: 44px;
          min-height: 4px;
          border-radius: 10px 10px 0 0;
          background: linear-gradient(180deg, #00B050, #86efac);
        }

        .mini-label {
          margin-top: 8px;
          font-size: 11px;
          font-weight: 900;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70px;
        }

        .empty {
          color: #6b7280;
          font-weight: 900;
          padding: 10px 0;
        }

        @media (max-width: 1000px) {
          .dash-graf-cards,
          .dash-graf-grid {
            grid-template-columns: 1fr;
          }

          .dash-graf-panel.full {
            grid-column: auto;
          }

          .bar-row {
            grid-template-columns: 1fr;
          }

          .bar-value {
            text-align: left;
          }
        }
      `}),n.jsxs("div",{className:"dash-graf-head",children:[n.jsxs("div",{className:"dash-graf-title",children:[n.jsx("h1",{children:"Dashboard com Gráficos"}),n.jsx("p",{children:"Análise visual dos valores, status, clientes e evolução mensal."})]}),n.jsx("button",{className:"dash-graf-btn",onClick:d,children:"Atualizar"})]}),n.jsxs("div",{className:"dash-graf-cards",children:[n.jsx(yl,{titulo:"Total geral",valor:io(k.total)}),n.jsx(yl,{titulo:"Total pago",valor:io(k.pago)}),n.jsx(yl,{titulo:"Em aberto",valor:io(k.aberto)})]}),n.jsxs("div",{className:"dash-graf-grid",children:[n.jsxs("div",{className:"dash-graf-panel",children:[n.jsx("h3",{children:"Valores por status"}),k.porStatus.every(g=>g.valor===0)&&n.jsx("div",{className:"empty",children:"Sem dados ainda."}),k.porStatus.map(g=>n.jsxs("div",{className:"bar-row",children:[n.jsx("div",{children:g.status}),n.jsx("div",{className:"bar-track",children:n.jsx("div",{className:"bar-fill",style:{width:`${Math.max(3,g.valor/p*100)}%`}})}),n.jsx("div",{className:"bar-value",children:io(g.valor)})]},g.status))]}),n.jsxs("div",{className:"dash-graf-panel",children:[n.jsx("h3",{children:"Evolução mensal"}),k.porMes.length===0&&n.jsx("div",{className:"empty",children:"Sem dados ainda."}),n.jsx("div",{className:"mini-chart",children:k.porMes.map(g=>n.jsxs("div",{className:"mini-col-wrap",title:`${g.mes} - ${io(g.valor)}`,children:[n.jsx("div",{className:"mini-col",style:{height:`${Math.max(4,g.valor/N*190)}px`}}),n.jsx("div",{className:"mini-label",children:g.mes})]},g.mes))})]}),n.jsxs("div",{className:"dash-graf-panel full",children:[n.jsx("h3",{children:"Top clientes por valor"}),k.porCliente.length===0&&n.jsx("div",{className:"empty",children:"Sem dados ainda."}),k.porCliente.map(g=>n.jsxs("div",{className:"bar-row",children:[n.jsx("div",{title:g.cliente,children:g.cliente}),n.jsx("div",{className:"bar-track",children:n.jsx("div",{className:"bar-fill",style:{width:`${Math.max(3,g.valor/_*100)}%`}})}),n.jsx("div",{className:"bar-value",children:io(g.valor)})]},g.cliente))]})]})]})}function yl({titulo:l,valor:u}){return n.jsxs("div",{className:"dash-graf-card",children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u})]})}const Em="ytalseg_relatorios_versoes_v11_2",Dc="ytalseg_pacotes_cliente_v11_6",_m=["Pendente","Em separação","Enviado","Aprovado","Concluído"];function vi(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function Lc(l){if(!l)return"-";try{return new Date(l).toLocaleString("pt-BR")}catch{return l}}function zm(){const[l,u]=D.useState([]),[d,k]=D.useState([]),[p,N]=D.useState(""),[_,g]=D.useState(""),[C,z]=D.useState(""),[E,b]=D.useState("");function x(){try{const j=JSON.parse(localStorage.getItem(Em)||"[]"),M=JSON.parse(localStorage.getItem(Dc)||"[]");u(Array.isArray(j)?j:[]),k(Array.isArray(M)?M:[])}catch{u([]),k([])}}function v(j){k(j),localStorage.setItem(Dc,JSON.stringify(j))}D.useEffect(()=>{x()},[]);const c=D.useMemo(()=>l.filter(j=>(j.tipo||"").toLowerCase()==="cliente"),[l]),h=D.useMemo(()=>({total:d.reduce((M,F)=>M+Number(F.valor||0),0),concluidos:d.filter(M=>M.status==="Concluído").length,pendentes:d.filter(M=>M.status!=="Concluído").length}),[d]);function m(){const j=l.find(X=>String(X.id)===p),M=(j==null?void 0:j.cliente)||_.trim();if(!M){alert("Informe um cliente ou selecione um relatório.");return}const F={id:Date.now(),cliente:M,relatorioId:j==null?void 0:j.id,valor:(j==null?void 0:j.valor)||0,status:"Pendente",criadoEm:new Date().toISOString(),pdfCliente:!!j,notaFiscal:!1,comprovante:!1,observacoes:C};v([F,...d]),N(""),g(""),z("")}function L(j,M,F){v(d.map(X=>X.id===j?{...X,[M]:F}:X))}function T(j){window.confirm("Deseja remover este pacote do cliente?")&&v(d.filter(M=>M.id!==j))}function H(j){const M={origem:"pacote-cliente",cliente:j.cliente||"",valor:j.valor||0,pacoteId:j.id,status:j.status,criadoEm:j.criadoEm,mensagem:[`Olá, segue o pacote do cliente ${j.cliente||""} para conferência.`,"",`Valor: ${vi(j.valor)}`,`Status: ${j.status}`,"","Itens do pacote:",`- PDF Cliente: ${j.pdfCliente?"Sim":"Não"}`,`- Nota Fiscal: ${j.notaFiscal?"Sim":"Não"}`,`- Comprovante: ${j.comprovante?"Sim":"Não"}`,"",j.observacoes?`Observações: ${j.observacoes}`:""].filter(Boolean).join(`
`)};localStorage.setItem("ytalseg_envio_pdf_handoff_v14",JSON.stringify(M)),b("Pacote enviado para a tela Envio PDF. Abra o menu Envio PDF para continuar.")}return n.jsxs("div",{className:"pacote-page",children:[n.jsx("style",{children:`
        .pacote-page { display: grid; gap: 16px; }
        .pacote-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .pacote-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .pacote-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .pacote-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .pacote-card, .pacote-box, .pacote-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .pacote-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .pacote-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .pacote-form { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .pacote-form textarea { grid-column: 1 / -1; min-height: 74px; resize: vertical; }
        .pacote-input, .pacote-select, .pacote-textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .pacote-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .pacote-btn-green { background: #00B050; color: white; }
        .pacote-list { display: grid; gap: 12px; }
        .pacote-item-top { display: flex; justify-content: space-between; align-items: start; gap: 12px; flex-wrap: wrap; }
        .pacote-item h3 { margin: 0; color: #111827; font-size: 19px; font-weight: 1000; }
        .pacote-item small { display: block; margin-top: 4px; color: #6b7280; font-weight: 800; }
        .pacote-checks { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin-top: 12px; }
        .pacote-check { display: flex; align-items: center; gap: 8px; padding: 10px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 900; font-size: 13px; }
        .pacote-check input { width: auto; }
        .pacote-obs { margin-top: 12px; color: #374151; font-size: 13px; font-weight: 750; white-space: pre-wrap; }
        .pacote-empty { color: #6b7280; font-weight: 900; padding: 12px 0; }
        .pacote-status { background: #ecfdf5; color: #166534; border: 1px solid rgba(0,176,80,.25); border-radius: 14px; padding: 12px; font-weight: 900; }
        @media (max-width: 900px) { .pacote-cards, .pacote-form, .pacote-checks { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{className:"pacote-head",children:[n.jsxs("div",{className:"pacote-title",children:[n.jsx("h1",{children:"Pacote do Cliente"}),n.jsx("p",{children:"Organize a entrega final: PDF, nota fiscal, comprovante e status."})]}),n.jsx("button",{className:"pacote-btn pacote-btn-green",onClick:x,children:"Atualizar"})]}),n.jsxs("div",{className:"pacote-cards",children:[n.jsx(bl,{titulo:"Valor em pacotes",valor:vi(h.total)}),n.jsx(bl,{titulo:"Concluídos",valor:String(h.concluidos)}),n.jsx(bl,{titulo:"Pendentes",valor:String(h.pendentes)})]}),E&&n.jsx("div",{className:"pacote-status",children:E}),n.jsxs("div",{className:"pacote-box",children:[n.jsx("h3",{style:{marginTop:0},children:"Criar novo pacote"}),n.jsxs("div",{className:"pacote-form",children:[n.jsxs("select",{className:"pacote-select",value:p,onChange:j=>N(j.target.value),children:[n.jsx("option",{value:"",children:"Selecionar relatório cliente..."}),c.map(j=>n.jsxs("option",{value:String(j.id),children:[j.cliente||"Cliente"," — ",vi(j.valor)," — ",Lc(j.criadoEm)]},j.id))]}),n.jsx("input",{className:"pacote-input",placeholder:"Ou informar cliente manualmente",value:_,onChange:j=>g(j.target.value)}),n.jsx("textarea",{className:"pacote-textarea",placeholder:"Observações do pacote...",value:C,onChange:j=>z(j.target.value)}),n.jsx("button",{className:"pacote-btn pacote-btn-green",onClick:m,children:"Criar pacote"})]})]}),n.jsxs("div",{className:"pacote-list",children:[d.length===0&&n.jsx("div",{className:"pacote-box pacote-empty",children:"Nenhum pacote criado ainda."}),d.map(j=>n.jsxs("div",{className:"pacote-item",children:[n.jsxs("div",{className:"pacote-item-top",children:[n.jsxs("div",{children:[n.jsx("h3",{children:j.cliente}),n.jsxs("small",{children:[Lc(j.criadoEm)," • ",vi(j.valor)]})]}),n.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[n.jsx("select",{className:"pacote-select",value:j.status,onChange:M=>L(j.id,"status",M.target.value),children:_m.map(M=>n.jsx("option",{children:M},M))}),n.jsx("button",{className:"pacote-btn pacote-btn-green",onClick:()=>H(j),children:"Enviar agora"}),n.jsx("button",{className:"pacote-btn",onClick:()=>T(j.id),children:"Remover"})]})]}),n.jsxs("div",{className:"pacote-checks",children:[n.jsxs("label",{className:"pacote-check",children:[n.jsx("input",{type:"checkbox",checked:j.pdfCliente,onChange:M=>L(j.id,"pdfCliente",M.target.checked)}),"PDF Cliente"]}),n.jsxs("label",{className:"pacote-check",children:[n.jsx("input",{type:"checkbox",checked:j.notaFiscal,onChange:M=>L(j.id,"notaFiscal",M.target.checked)}),"Nota Fiscal"]}),n.jsxs("label",{className:"pacote-check",children:[n.jsx("input",{type:"checkbox",checked:j.comprovante,onChange:M=>L(j.id,"comprovante",M.target.checked)}),"Comprovante"]})]}),j.observacoes&&n.jsx("div",{className:"pacote-obs",children:j.observacoes})]},j.id))]})]})}function bl({titulo:l,valor:u}){return n.jsxs("div",{className:"pacote-card",children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u})]})}const Pm="ytalseg_relatorios_versoes_v11_2",Rm="ytalseg_pacotes_cliente_v11_6";function Tc(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function Am(l){if(!l)return"-";try{return new Date(l).toLocaleString("pt-BR")}catch{return l}}function Om(){const[l,u]=D.useState([]),[d,k]=D.useState([]),[p,N]=D.useState("Todas");function _(){try{const E=JSON.parse(localStorage.getItem(Pm)||"[]"),b=JSON.parse(localStorage.getItem(Rm)||"[]");u(Array.isArray(E)?E:[]),k(Array.isArray(b)?b:[])}catch{u([]),k([])}}D.useEffect(()=>{_()},[]);const g=D.useMemo(()=>{const E=[];return l.forEach(b=>{const x=b.status||"Rascunho";x!=="Pago"&&E.push({id:`rel-${b.id}`,origem:"Relatório",cliente:b.cliente||"Cliente não informado",valor:Number(b.valor||0),status:x,tipo:b.tipo||"-",criadoEm:b.criadoEm,motivo:x==="Rascunho"?"Relatório ainda em rascunho":x==="Enviado"?"Aguardando aprovação do cliente":x==="Aprovado"?"Aprovado, falta nota ou cobrança":x==="Nota emitida"?"Nota emitida, falta pagamento":x==="Cobrado"?"Cobrado, aguardando pagamento":"Pendente de conclusão"})}),d.forEach(b=>{if(b.status!=="Concluído"){const x=[b.pdfCliente?"":"PDF cliente",b.notaFiscal?"":"nota fiscal",b.comprovante?"":"comprovante"].filter(Boolean);E.push({id:`pac-${b.id}`,origem:"Pacote",cliente:b.cliente||"Cliente não informado",valor:Number(b.valor||0),status:b.status||"Pendente",tipo:"pacote",criadoEm:b.criadoEm,motivo:x.length?`Faltando: ${x.join(", ")}`:"Pacote ainda não concluído"})}}),E.sort((b,x)=>String(x.criadoEm||"").localeCompare(String(b.criadoEm||"")))},[l,d]),C=D.useMemo(()=>p==="Todas"?g:g.filter(E=>E.origem===p),[g,p]),z=D.useMemo(()=>{const E=C.reduce((b,x)=>b+Number(x.valor||0),0);return{quantidade:C.length,total:E,relatorios:g.filter(b=>b.origem==="Relatório").length,pacotes:g.filter(b=>b.origem==="Pacote").length}},[C,g]);return n.jsxs("div",{className:"pend-page",children:[n.jsx("style",{children:`
        .pend-page { display: grid; gap: 16px; }
        .pend-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .pend-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .pend-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .pend-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .pend-select, .pend-btn { border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 900; background: white; }
        .pend-btn { border: 0; cursor: pointer; background: #00B050; color: white; }
        .pend-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .pend-card, .pend-box { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .pend-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .pend-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .pend-list { display: grid; gap: 10px; }
        .pend-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); display: grid; grid-template-columns: 1.4fr .8fr .8fr 1.4fr; gap: 12px; align-items: center; }
        .pend-item h3 { margin: 0; color: #111827; font-size: 17px; font-weight: 1000; }
        .pend-item small { display: block; margin-top: 4px; color: #6b7280; font-weight: 800; }
        .pend-badge { display: inline-flex; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #fff7ed; color: #9a3412; font-size: 12px; font-weight: 1000; }
        .pend-empty { color: #6b7280; font-weight: 900; padding: 16px; }
        @media (max-width: 1000px) {
          .pend-cards { grid-template-columns: 1fr 1fr; }
          .pend-item { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .pend-cards { grid-template-columns: 1fr; }
        }
      `}),n.jsxs("div",{className:"pend-head",children:[n.jsxs("div",{className:"pend-title",children:[n.jsx("h1",{children:"Central de Pendências"}),n.jsx("p",{children:"Lista automática do que falta concluir em relatórios e pacotes."})]}),n.jsxs("div",{className:"pend-actions",children:[n.jsxs("select",{className:"pend-select",value:p,onChange:E=>N(E.target.value),children:[n.jsx("option",{children:"Todas"}),n.jsx("option",{children:"Relatório"}),n.jsx("option",{children:"Pacote"})]}),n.jsx("button",{className:"pend-btn",onClick:_,children:"Atualizar"})]})]}),n.jsxs("div",{className:"pend-cards",children:[n.jsx(yi,{titulo:"Pendências",valor:String(z.quantidade)}),n.jsx(yi,{titulo:"Valor pendente",valor:Tc(z.total)}),n.jsx(yi,{titulo:"Relatórios",valor:String(z.relatorios)}),n.jsx(yi,{titulo:"Pacotes",valor:String(z.pacotes)})]}),n.jsxs("div",{className:"pend-list",children:[C.length===0&&n.jsx("div",{className:"pend-box pend-empty",children:"Nenhuma pendência encontrada. Tudo certo por aqui."}),C.map(E=>n.jsxs("div",{className:"pend-item",children:[n.jsxs("div",{children:[n.jsx("h3",{children:E.cliente}),n.jsxs("small",{children:[E.origem," • ",E.tipo," • ",Am(E.criadoEm)]})]}),n.jsx("div",{children:Tc(E.valor)}),n.jsx("div",{children:n.jsx("span",{className:"pend-badge",children:E.status})}),n.jsx("div",{children:E.motivo})]},E.id))]})]})}function yi({titulo:l,valor:u}){return n.jsxs("div",{className:"pend-card",children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u})]})}const wl=[{key:"ytalseg_relatorios_versoes_v11_2",label:"Relatórios / versões"},{key:"ytalseg_pacotes_cliente_v11_6",label:"Pacotes do cliente"},{key:"ytalseg_config_v11_7",label:"Configurações do sistema"},{key:"ytalseg_relatorio_rascunho_v11",label:"Rascunho automático"},{key:"ytalseg_envio_pdf_handoff_v14",label:"Vínculo pacote → envio"}];function $c(l){if(!l)return"0 B";if(l<1024)return`${l} B`;const u=l/1024;return u<1024?`${u.toFixed(1)} KB`:`${(u/1024).toFixed(2)} MB`}function Im(l){if(!l)return 0;try{const u=JSON.parse(l);if(Array.isArray(u))return u.length;if(u&&typeof u=="object")return Object.keys(u).length}catch{return 1}return 1}function Dm(){const[l,u]=D.useState([]),[d,k]=D.useState("");function p(){const z=wl.map(E=>{const b=localStorage.getItem(E.key);return{key:E.key,label:E.label,existe:!!b,tamanho:b?new Blob([b]).size:0,registros:Im(b)}});u(z)}D.useEffect(()=>{p()},[]);const N=D.useMemo(()=>({bases:l.filter(z=>z.existe).length,registros:l.reduce((z,E)=>z+E.registros,0),tamanho:l.reduce((z,E)=>z+E.tamanho,0)}),[l]);function _(){const z={versao:"V17",geradoEm:new Date().toISOString(),dados:wl.reduce((v,c)=>(v[c.key]=localStorage.getItem(c.key),v),{})},E=new Blob([JSON.stringify(z,null,2)],{type:"application/json"}),b=URL.createObjectURL(E),x=document.createElement("a");x.href=b,x.download=`ytalseg_banco_local_v17_${Date.now()}.json`,x.click(),URL.revokeObjectURL(b),k("Banco local exportado com sucesso.")}function g(z){if(!z)return;const E=new FileReader;E.onload=()=>{try{const b=JSON.parse(String(E.result||"{}")),x=b.dados||b;Object.keys(x).forEach(v=>{wl.some(c=>c.key===v)&&(x[v]===null||x[v]===void 0?localStorage.removeItem(v):localStorage.setItem(v,String(x[v])))}),p(),k("Banco local importado com sucesso.")}catch{k("Erro ao importar banco local.")}},E.readAsText(z)}function C(z){window.confirm(`Deseja apagar a base local: ${z}?`)&&(localStorage.removeItem(z),p(),k("Base apagada."))}return n.jsxs("div",{className:"banco-page",children:[n.jsx("style",{children:`
        .banco-page { display: grid; gap: 16px; }
        .banco-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .banco-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .banco-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .banco-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .banco-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .banco-btn-green { background: #00B050; color: white; }
        .banco-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .banco-card, .banco-box { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .banco-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .banco-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .banco-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .banco-table th { text-align: left; background: #f9fafb; padding: 12px; color: #374151; font-weight: 1000; border-bottom: 1px solid #e5e7eb; }
        .banco-table td { padding: 12px; border-bottom: 1px solid #eef0f2; font-weight: 800; }
        .banco-badge { display: inline-flex; padding: 5px 9px; border-radius: 999px; font-size: 12px; font-weight: 1000; background: #ecfdf5; color: #166534; }
        .banco-badge.off { background: #f3f4f6; color: #6b7280; }
        .banco-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        @media (max-width: 900px) { .banco-cards { grid-template-columns: 1fr; } .banco-table { font-size: 12px; } }
      `}),n.jsxs("div",{className:"banco-head",children:[n.jsxs("div",{className:"banco-title",children:[n.jsx("h1",{children:"Banco Local"}),n.jsx("p",{children:"Controle, exportação e restauração dos dados locais do sistema."})]}),n.jsxs("div",{className:"banco-actions",children:[n.jsx("button",{className:"banco-btn banco-btn-green",onClick:_,children:"Exportar banco"}),n.jsxs("label",{className:"banco-btn",children:["Importar banco",n.jsx("input",{type:"file",accept:"application/json",style:{display:"none"},onChange:z=>{var E;return g(((E=z.target.files)==null?void 0:E[0])||null)}})]}),n.jsx("button",{className:"banco-btn",onClick:p,children:"Atualizar"})]})]}),d&&n.jsx("div",{className:"banco-status",children:d}),n.jsxs("div",{className:"banco-cards",children:[n.jsx(jl,{titulo:"Bases ativas",valor:String(N.bases)}),n.jsx(jl,{titulo:"Registros",valor:String(N.registros)}),n.jsx(jl,{titulo:"Tamanho",valor:$c(N.tamanho)})]}),n.jsx("div",{className:"banco-box",children:n.jsxs("table",{className:"banco-table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Base"}),n.jsx("th",{children:"Status"}),n.jsx("th",{children:"Registros"}),n.jsx("th",{children:"Tamanho"}),n.jsx("th",{children:"Ação"})]})}),n.jsx("tbody",{children:l.map(z=>n.jsxs("tr",{children:[n.jsxs("td",{children:[n.jsx("strong",{children:z.label}),n.jsx("br",{}),n.jsx("small",{children:z.key})]}),n.jsx("td",{children:n.jsx("span",{className:`banco-badge ${z.existe?"":"off"}`,children:z.existe?"Ativa":"Vazia"})}),n.jsx("td",{children:z.registros}),n.jsx("td",{children:$c(z.tamanho)}),n.jsx("td",{children:n.jsx("button",{className:"banco-btn",onClick:()=>C(z.key),children:"Limpar"})})]},z.key))})]})})]})}function jl({titulo:l,valor:u}){return n.jsxs("div",{className:"banco-card",children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u})]})}const Nl="ytalseg_auditoria_v18",Lm="ytalseg_relatorios_versoes_v11_2",Tm="ytalseg_pacotes_cliente_v11_6";function $m(l){if(!l)return"-";try{return new Date(l).toLocaleString("pt-BR")}catch{return l}}function Fm(){const l=[];try{const u=JSON.parse(localStorage.getItem(Lm)||"[]");Array.isArray(u)&&u.slice(0,80).forEach(d=>{l.push({id:Number(d.id||Date.now()),tipo:"Relatório",origem:"Relatórios",descricao:`${d.cliente||"Cliente não informado"} • ${d.tipo||"-"} • ${d.status||"Rascunho"} • R$ ${Number(d.valor||0).toFixed(2)}`,criadoEm:d.criadoEm||new Date().toISOString()})})}catch{}try{const u=JSON.parse(localStorage.getItem(Tm)||"[]");Array.isArray(u)&&u.slice(0,80).forEach(d=>{l.push({id:Number(d.id||Date.now()),tipo:"Pacote",origem:"Pacote Cliente",descricao:`${d.cliente||"Cliente não informado"} • ${d.status||"Pendente"} • PDF: ${d.pdfCliente?"sim":"não"} • NF: ${d.notaFiscal?"sim":"não"} • Comprovante: ${d.comprovante?"sim":"não"}`,criadoEm:d.criadoEm||new Date().toISOString()})})}catch{}return l.sort((u,d)=>String(d.criadoEm).localeCompare(String(u.criadoEm)))}function Mm(){const[l,u]=D.useState([]),[d,k]=D.useState("Todos"),[p,N]=D.useState(""),[_,g]=D.useState("");function C(){const c=(()=>{try{const T=JSON.parse(localStorage.getItem(Nl)||"[]");return Array.isArray(T)?T:[]}catch{return[]}})(),h=Fm(),m=[...c,...h],L=Array.from(new Map(m.map(T=>[`${T.tipo}-${T.id}-${T.criadoEm}`,T])).values());u(L.sort((T,H)=>String(H.criadoEm).localeCompare(String(T.criadoEm))).slice(0,200))}D.useEffect(()=>{C()},[]);const z=D.useMemo(()=>l.filter(c=>{const h=d==="Todos"||c.tipo===d,L=`${c.tipo} ${c.origem} ${c.descricao}`.toLowerCase().includes(p.toLowerCase());return h&&L}),[l,d,p]),E=D.useMemo(()=>({total:z.length,relatorios:l.filter(c=>c.tipo==="Relatório").length,pacotes:l.filter(c=>c.tipo==="Pacote").length,sistema:l.filter(c=>c.tipo==="Sistema").length}),[z,l]);function b(){const c=window.prompt("Descreva o evento para registrar na auditoria:");if(!(c!=null&&c.trim()))return;const m=[{id:Date.now(),tipo:"Sistema",origem:"Registro manual",descricao:c,criadoEm:new Date().toISOString()},...l].slice(0,200);u(m);const L=m.filter(T=>T.tipo==="Sistema");localStorage.setItem(Nl,JSON.stringify(L)),g("Evento registrado.")}function x(){const c={versao:"V18",geradoEm:new Date().toISOString(),logs:z},h=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),m=URL.createObjectURL(h),L=document.createElement("a");L.href=m,L.download=`ytalseg_auditoria_v18_${Date.now()}.json`,L.click(),URL.revokeObjectURL(m),g("Auditoria exportada.")}function v(){window.confirm("Deseja limpar apenas os registros manuais da auditoria?")&&(localStorage.removeItem(Nl),C(),g("Registros manuais apagados."))}return n.jsxs("div",{className:"audit-page",children:[n.jsx("style",{children:`
        .audit-page { display: grid; gap: 16px; }
        .audit-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .audit-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .audit-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .audit-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .audit-input, .audit-select, .audit-btn { border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 900; background: white; }
        .audit-btn { border: 0; cursor: pointer; background: #e5e7eb; color: #111; }
        .audit-btn-green { background: #00B050; color: white; }
        .audit-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .audit-card, .audit-box { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .audit-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .audit-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .audit-msg { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .audit-list { display: grid; gap: 10px; }
        .audit-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); display: grid; grid-template-columns: .7fr 1fr 2fr .9fr; gap: 12px; align-items: center; }
        .audit-badge { display: inline-flex; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 1000; }
        .audit-badge.pacote { background: #fff7ed; color: #9a3412; }
        .audit-badge.sistema { background: #ecfdf5; color: #166534; }
        .audit-empty { color: #6b7280; font-weight: 900; padding: 16px; }
        @media (max-width: 1000px) {
          .audit-cards { grid-template-columns: 1fr 1fr; }
          .audit-item { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) { .audit-cards { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{className:"audit-head",children:[n.jsxs("div",{className:"audit-title",children:[n.jsx("h1",{children:"Auditoria do Sistema"}),n.jsx("p",{children:"Rastreamento local de relatórios, pacotes e eventos importantes."})]}),n.jsxs("div",{className:"audit-actions",children:[n.jsx("input",{className:"audit-input",placeholder:"Buscar...",value:p,onChange:c=>N(c.target.value)}),n.jsxs("select",{className:"audit-select",value:d,onChange:c=>k(c.target.value),children:[n.jsx("option",{children:"Todos"}),n.jsx("option",{children:"Relatório"}),n.jsx("option",{children:"Pacote"}),n.jsx("option",{children:"Sistema"})]}),n.jsx("button",{className:"audit-btn audit-btn-green",onClick:C,children:"Atualizar"})]})]}),_&&n.jsx("div",{className:"audit-msg",children:_}),n.jsxs("div",{className:"audit-cards",children:[n.jsx(bi,{titulo:"Eventos filtrados",valor:String(E.total)}),n.jsx(bi,{titulo:"Relatórios",valor:String(E.relatorios)}),n.jsx(bi,{titulo:"Pacotes",valor:String(E.pacotes)}),n.jsx(bi,{titulo:"Sistema",valor:String(E.sistema)})]}),n.jsx("div",{className:"audit-box",children:n.jsxs("div",{className:"audit-actions",children:[n.jsx("button",{className:"audit-btn audit-btn-green",onClick:b,children:"Registrar evento"}),n.jsx("button",{className:"audit-btn",onClick:x,children:"Exportar auditoria"}),n.jsx("button",{className:"audit-btn",onClick:v,children:"Limpar eventos manuais"})]})}),n.jsxs("div",{className:"audit-list",children:[z.length===0&&n.jsx("div",{className:"audit-box audit-empty",children:"Nenhum evento encontrado."}),z.map(c=>n.jsxs("div",{className:"audit-item",children:[n.jsx("div",{children:n.jsx("span",{className:`audit-badge ${c.tipo==="Pacote"?"pacote":c.tipo==="Sistema"?"sistema":""}`,children:c.tipo})}),n.jsx("div",{children:n.jsx("strong",{children:c.origem})}),n.jsx("div",{children:c.descricao}),n.jsx("div",{children:$m(c.criadoEm)})]},`${c.tipo}-${c.id}-${c.criadoEm}`))]})]})}function bi({titulo:l,valor:u}){return n.jsxs("div",{className:"audit-card",children:[n.jsx("span",{children:l}),n.jsx("strong",{children:u})]})}const Sl="ytalseg_notificacoes_v19";function Bm(l){if(!l)return"-";try{return new Date(l).toLocaleString("pt-BR")}catch{return l}}function Vm(){const[l,u]=D.useState([]),[d,k]=D.useState("");function p(){try{const g=JSON.parse(localStorage.getItem(Sl)||"[]");u(Array.isArray(g)?g:[])}catch{u([])}}D.useEffect(()=>{p()},[]);function N(){const g=window.prompt("Título da notificação:");if(!g)return;const C=window.prompt("Descrição:");if(!C)return;const E=[{id:Date.now(),titulo:g,descricao:C,tipo:"info",criadoEm:new Date().toISOString()},...l].slice(0,100);u(E),localStorage.setItem(Sl,JSON.stringify(E)),k("Notificação adicionada.")}function _(){window.confirm("Limpar todas notificações?")&&(localStorage.removeItem(Sl),u([]),k("Notificações limpas."))}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Central de Notificações"}),d&&n.jsx("p",{children:d}),n.jsxs("div",{style:{marginTop:10},children:[n.jsx("button",{onClick:N,children:"Nova notificação"}),n.jsx("button",{onClick:_,children:"Limpar"})]}),n.jsxs("div",{style:{marginTop:20},children:[l.length===0&&n.jsx("p",{children:"Nenhuma notificação."}),l.map(g=>n.jsxs("div",{style:{border:"1px solid #ddd",padding:10,marginBottom:10},children:[n.jsx("strong",{children:g.titulo}),n.jsx("p",{children:g.descricao}),n.jsx("small",{children:Bm(g.criadoEm)})]},g.id))]})]})}const op="ytalseg_users_v33",Um="ytalseg_user_v20",Jm="ytalseg_auth";function rp(){return[{id:1,user:"admin",senha:"123",perfil:"admin",ativo:!0},{id:2,user:"operador",senha:"123",perfil:"operador",ativo:!0},{id:3,user:"financeiro",senha:"123",perfil:"financeiro",ativo:!0},{id:4,user:"consulta",senha:"123",perfil:"consulta",ativo:!0}]}function ki(l){localStorage.setItem(op,JSON.stringify(l))}function Fc(){const l=rp();try{const u=localStorage.getItem(op),d=u?JSON.parse(u):[];if(Array.isArray(d)&&d.length>0){const k=d.map((N,_)=>({id:N.id??Date.now()+_,user:String(N.user||N.nome||"").trim(),senha:String(N.senha||""),perfil:N.perfil||"consulta",ativo:N.ativo!==!1})).filter(N=>N.user);if(!k.some(N=>N.user.toLowerCase()==="admin"&&N.senha==="123"&&N.ativo!==!1)){const N=k.filter(g=>g.user.toLowerCase()!=="admin"),_=[l[0],...N];return ki(_),_}return ki(k),k}}catch{}return ki(l),l}function Hm({onLogin:l}){const[u,d]=D.useState(""),[k,p]=D.useState(""),[N,_]=D.useState(""),[g,C]=D.useState([]);D.useEffect(()=>{C(Fc())},[]);function z(){const E=u.trim().toLowerCase(),b=String(k||"");if(!E)return _("Informe o usuário.");if(!b)return _("Informe a senha.");let x=g.length?g:Fc(),v=x.find(h=>String(h.user||"").trim().toLowerCase()===E&&String(h.senha||"")===b&&h.ativo!==!1);if(!v&&E==="admin"&&b==="123"){const h=rp(),m=x.filter(L=>String(L.user||"").trim().toLowerCase()!=="admin");x=[h[0],...m],ki(x),C(x),v=h[0]}if(!v)return _("Usuário/senha inválidos ou usuário inativo.");const c={user:v.user,perfil:v.perfil||"consulta",loginEm:new Date().toISOString()};localStorage.setItem(Um,JSON.stringify(c)),localStorage.setItem(Jm,JSON.stringify(c)),l(v.user,v.perfil||"consulta")}return n.jsxs("div",{className:"login-page",children:[n.jsx("style",{children:`
        body { margin:0; font-family:Arial,sans-serif; background:#eef1f3; }
        .login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
        .login-card { width:100%; max-width:440px; background:white; border:1px solid #e5e7eb; border-radius:24px; padding:28px; box-shadow:0 16px 38px rgba(0,0,0,.10); }
        .login-logo-row { display:flex; align-items:center; gap:12px; width:100%; max-width:380px; margin:0 auto 18px; }
        .login-icon { width:50px; height:50px; border-radius:14px; background:#00B050; color:white; display:flex; align-items:center; justify-content:center; font-size:25px; font-weight:1000; box-shadow:0 8px 18px rgba(0,176,80,.25); flex:0 0 auto; }
        .login-logo { color:#00B050; font-size:42px; font-weight:1000; letter-spacing:-1px; line-height:.9; }
        .login-sub { color:#6b7280; font-weight:800; margin-top:4px; }
        .login-form-inner { width:100%; max-width:380px; margin:0 auto; }
        .login-label { display:block; font-size:12px; font-weight:1000; color:#006b34; margin:12px 0 6px; text-transform:uppercase; }
        .login-input { width:100%; box-sizing:border-box; border:1px solid #d1d5db; border-radius:12px; padding:12px 14px; font-size:15px; font-weight:800; }
        .login-btn { width:100%; box-sizing:border-box; border:0; border-radius:12px; padding:12px 14px; font-size:15px; font-weight:1000; cursor:pointer; background:#00B050; color:white; margin-top:16px; }
        .login-msg { margin-top:12px; color:#b91c1c; font-weight:900; }
      `}),n.jsxs("div",{className:"login-card",children:[n.jsxs("div",{className:"login-logo-row",children:[n.jsx("div",{className:"login-icon",children:"Y"}),n.jsxs("div",{children:[n.jsx("div",{className:"login-logo",children:"YTALSEG"}),n.jsx("div",{className:"login-sub",children:"ERP Interno Premium"})]})]}),n.jsxs("div",{className:"login-form-inner",children:[n.jsx("label",{className:"login-label",children:"Usuário"}),n.jsx("input",{className:"login-input",placeholder:"Digite seu usuário",value:u,onChange:E=>d(E.target.value),onKeyDown:E=>{E.key==="Enter"&&z()},autoFocus:!0}),n.jsx("label",{className:"login-label",children:"Senha"}),n.jsx("input",{className:"login-input",type:"password",placeholder:"Digite sua senha",value:k,onChange:E=>p(E.target.value),onKeyDown:E=>{E.key==="Enter"&&z()}}),n.jsx("button",{className:"login-btn",onClick:z,children:"Entrar"}),N&&n.jsx("div",{className:"login-msg",children:N})]})]})]})}const Wm=[{nome:"Admin",descricao:"Acesso total ao sistema.",acessos:["Dashboard","Relatórios","Pacote Cliente","Pendências","Financeiro","Banco Local","Auditoria","Notificações","Configurações","Envios"]},{nome:"Operador",descricao:"Foco na operação diária e emissão de relatórios.",acessos:["Dashboard","Relatórios","Pacote Cliente","Pendências","Envios","Notificações"]},{nome:"Financeiro",descricao:"Foco em cobrança, valores, pacotes e pendências.",acessos:["Dashboard","Financeiro","Pacote Cliente","Pendências","Banco Local","Auditoria"]},{nome:"Consulta",descricao:"Visualização segura, sem áreas sensíveis.",acessos:["Dashboard","Dashboard Operacional","Gráficos","Pendências","Notificações"]}];function Gm(){return n.jsxs("div",{className:"perm-page",children:[n.jsx("style",{children:`
        .perm-page {
          display: grid;
          gap: 16px;
        }

        .perm-head h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .perm-head p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .perm-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .perm-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .perm-card h2 {
          margin: 0;
          color: #00B050;
          font-size: 24px;
          font-weight: 1000;
        }

        .perm-card p {
          margin: 6px 0 12px;
          color: #6b7280;
          font-weight: 800;
        }

        .perm-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .perm-badge {
          padding: 7px 10px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #166534;
          font-size: 12px;
          font-weight: 1000;
        }

        .perm-alert {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          color: #374151;
          font-weight: 850;
          box-shadow: 0 10px 22px rgba(0,0,0,.05);
        }

        @media (max-width: 900px) {
          .perm-grid {
            grid-template-columns: 1fr;
          }
        }
      `}),n.jsxs("div",{className:"perm-head",children:[n.jsx("h1",{children:"Permissões do Sistema"}),n.jsx("p",{children:"Perfis de acesso da V21 para controlar o menu por usuário."})]}),n.jsxs("div",{className:"perm-alert",children:["Para trocar o perfil, clique em ",n.jsx("strong",{children:"Sair"})," no topo e entre novamente escolhendo outro perfil."]}),n.jsx("div",{className:"perm-grid",children:Wm.map(l=>n.jsxs("div",{className:"perm-card",children:[n.jsx("h2",{children:l.nome}),n.jsx("p",{children:l.descricao}),n.jsx("div",{className:"perm-list",children:l.acessos.map(u=>n.jsx("span",{className:"perm-badge",children:u},u))})]},l.nome))})]})}const Mc="ytalseg_auto_backup_v22";function Qm(){const[l,u]=D.useState("");function d(){const p={data:new Date().toISOString(),storage:{...localStorage}};localStorage.setItem(Mc,JSON.stringify(p)),u("Backup automático salvo.")}function k(){try{const p=localStorage.getItem(Mc);if(!p){u("Nenhum backup encontrado.");return}const _=JSON.parse(p).storage||{};Object.keys(_).forEach(g=>{localStorage.setItem(g,_[g])}),u("Backup restaurado.")}catch{u("Erro ao restaurar backup.")}}return D.useEffect(()=>{const p=setInterval(()=>{d()},3e4);return()=>clearInterval(p)},[]),n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Backup Automático"}),n.jsxs("p",{children:["Status: ",l]}),n.jsx("button",{onClick:d,children:"Gerar agora"}),n.jsx("button",{onClick:k,children:"Restaurar backup"})]})}const Ym="ytalseg_relatorios_versoes_v11_2",Bc="ytalseg_pacotes_cliente_v11_6",Km="ytalseg_envio_pdf_handoff_v14";function ao(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function wi(l){if(!l)return"-";try{return new Date(l).toLocaleString("pt-BR")}catch{return l}}function qm(){const[l,u]=D.useState([]),[d,k]=D.useState([]),[p,N]=D.useState(""),[_,g]=D.useState(""),[C,z]=D.useState(""),[E,b]=D.useState("");function x(){try{const j=JSON.parse(localStorage.getItem(Ym)||"[]"),M=JSON.parse(localStorage.getItem(Bc)||"[]");u(Array.isArray(j)?j:[]),k(Array.isArray(M)?M:[])}catch{u([]),k([])}}D.useEffect(()=>{x()},[]);const v=D.useMemo(()=>l.find(j=>String(j.id)===p),[l,p]),c=D.useMemo(()=>d.find(j=>String(j.id)===_),[d,_]),h=(c==null?void 0:c.cliente)||(v==null?void 0:v.cliente)||C||"",m=(c==null?void 0:c.valor)||(v==null?void 0:v.valor)||0;function L(){const j=h.trim();if(!j){b("Selecione um relatório, pacote ou informe um cliente manualmente.");return}const M=[`Olá, segue o material do cliente ${j} para conferência.`,"",`Valor: ${ao(m)}`,v?`Relatório: ${v.tipo||"-"} • ${v.status||"Rascunho"}`:"",c?`Pacote: ${c.status}`:"","",c?["Checklist do pacote:",`- PDF Cliente: ${c.pdfCliente?"Sim":"Não"}`,`- Nota Fiscal: ${c.notaFiscal?"Sim":"Não"}`,`- Comprovante: ${c.comprovante?"Sim":"Não"}`].join(`
`):"","",c!=null&&c.observacoes?`Observações: ${c.observacoes}`:""].filter(Boolean).join(`
`);localStorage.setItem(Km,JSON.stringify({origem:"fluxo-v23",cliente:j,valor:m,relatorioId:v==null?void 0:v.id,pacoteId:c==null?void 0:c.id,mensagem:M,criadoEm:new Date().toISOString()})),b("Fluxo preparado. Abra o menu Envio PDF para selecionar o PDF e enviar.")}function T(){var F;const j=h.trim();if(!j){b("Nada para copiar. Selecione um relatório, pacote ou informe cliente.");return}const M=[`Cliente: ${j}`,`Valor: ${ao(m)}`,v?`Relatório: ${wi(v.criadoEm)}`:"",c?`Pacote: ${wi(c.criadoEm)}`:""].filter(Boolean).join(`
`);(F=navigator.clipboard)==null||F.writeText(M),b("Resumo copiado.")}function H(){if(!c){b("Selecione um pacote para marcar como enviado.");return}const j=d.map(M=>M.id===c.id?{...M,status:"Enviado"}:M);k(j),localStorage.setItem(Bc,JSON.stringify(j)),b("Pacote marcado como Enviado.")}return n.jsxs("div",{className:"fluxo-page",children:[n.jsx("style",{children:`
        .fluxo-page { display: grid; gap: 16px; }
        .fluxo-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .fluxo-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .fluxo-box, .fluxo-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .fluxo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .fluxo-field { display: grid; gap: 6px; }
        .fluxo-field.full { grid-column: 1 / -1; }
        .fluxo-field label { font-size: 12px; font-weight: 1000; color: #006b34; text-transform: uppercase; }
        .fluxo-input, .fluxo-select { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .fluxo-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .fluxo-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .fluxo-btn-green { background: #00B050; color: white; }
        .fluxo-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .fluxo-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .fluxo-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; word-break: break-word; }
        .fluxo-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .fluxo-preview { white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px; color: #374151; font-size: 13px; font-weight: 800; line-height: 1.45; }
        @media (max-width: 900px) { .fluxo-grid, .fluxo-cards { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{className:"fluxo-head",children:[n.jsx("h1",{children:"Fluxo Automático"}),n.jsx("p",{children:"Prepare relatório, pacote e envio em um único painel."})]}),E&&n.jsx("div",{className:"fluxo-status",children:E}),n.jsxs("div",{className:"fluxo-cards",children:[n.jsxs("div",{className:"fluxo-card",children:[n.jsx("span",{children:"Cliente"}),n.jsx("strong",{children:h||"-"})]}),n.jsxs("div",{className:"fluxo-card",children:[n.jsx("span",{children:"Valor"}),n.jsx("strong",{children:ao(m)})]}),n.jsxs("div",{className:"fluxo-card",children:[n.jsx("span",{children:"Status pacote"}),n.jsx("strong",{children:(c==null?void 0:c.status)||"-"})]})]}),n.jsxs("div",{className:"fluxo-box",children:[n.jsxs("div",{className:"fluxo-grid",children:[n.jsx(kl,{label:"Relatório",children:n.jsxs("select",{className:"fluxo-select",value:p,onChange:j=>N(j.target.value),children:[n.jsx("option",{value:"",children:"Selecionar relatório..."}),l.map(j=>n.jsxs("option",{value:String(j.id),children:[j.cliente||"Cliente"," — ",j.tipo||"-"," — ",ao(j.valor)," — ",wi(j.criadoEm)]},j.id))]})}),n.jsx(kl,{label:"Pacote",children:n.jsxs("select",{className:"fluxo-select",value:_,onChange:j=>g(j.target.value),children:[n.jsx("option",{value:"",children:"Selecionar pacote..."}),d.map(j=>n.jsxs("option",{value:String(j.id),children:[j.cliente||"Cliente"," — ",j.status," — ",ao(j.valor)," — ",wi(j.criadoEm)]},j.id))]})}),n.jsx(kl,{label:"Cliente manual",full:!0,children:n.jsx("input",{className:"fluxo-input",placeholder:"Usar apenas se não tiver relatório/pacote",value:C,onChange:j=>z(j.target.value)})})]}),n.jsxs("div",{className:"fluxo-actions",children:[n.jsx("button",{className:"fluxo-btn fluxo-btn-green",onClick:L,children:"Preparar envio PDF"}),n.jsx("button",{className:"fluxo-btn",onClick:H,children:"Marcar pacote enviado"}),n.jsx("button",{className:"fluxo-btn",onClick:T,children:"Copiar resumo"}),n.jsx("button",{className:"fluxo-btn",onClick:x,children:"Atualizar dados"})]})]}),n.jsxs("div",{className:"fluxo-box",children:[n.jsx("h3",{style:{marginTop:0},children:"Prévia do fluxo"}),n.jsx("div",{className:"fluxo-preview",children:[`Cliente: ${h||"-"}`,`Valor: ${ao(m)}`,`Relatório: ${v?`${v.tipo||"-"} • ${v.status||"Rascunho"}`:"-"}`,`Pacote: ${c?`${c.status} • PDF ${c.pdfCliente?"OK":"pendente"} • NF ${c.notaFiscal?"OK":"pendente"} • Comprovante ${c.comprovante?"OK":"pendente"}`:"-"}`].join("\\n")})]})]})}function kl({label:l,full:u,children:d}){return n.jsxs("div",{className:`fluxo-field ${u?"full":""}`,children:[n.jsx("label",{children:l}),d]})}function Vc(){const[l,u]=D.useState(""),[d,k]=D.useState("");function p(){const g=`Olá ${l}, segue o material conforme combinado.`;k(g)}function N(){const g=`https://wa.me/?text=${encodeURIComponent(d)}`;window.open(g,"_blank")}function _(){const g=`mailto:?subject=Envio YTALSEG&body=${encodeURIComponent(d)}`;window.open(g)}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Envio Real"}),n.jsx("input",{placeholder:"Cliente",value:l,onChange:g=>u(g.target.value),style:{display:"block",marginBottom:10}}),n.jsx("textarea",{placeholder:"Mensagem",value:d,onChange:g=>k(g.target.value),style:{display:"block",width:"100%",height:100,marginBottom:10}}),n.jsx("button",{onClick:p,children:"Gerar mensagem"}),n.jsx("button",{onClick:N,children:"Enviar WhatsApp"}),n.jsx("button",{onClick:_,children:"Enviar E-mail"})]})}const Cl=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,Xm="#00B050",Uc={id:"",nome:"",cnpj:"",diaria_diurna:0,diaria_noturna:0,sabado:0,domingo_feriado:0,hora_20:0,hora_50:0,hora_100:0,adicional_noturno:0,usa_adicional_noturno:!0,feriado_usa_valor_domingo:!0};function lo(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function Zm(){const[l,u]=D.useState([]),[d,k]=D.useState(Uc),[p,N]=D.useState(!1),[_,g]=D.useState(""),[C,z]=D.useState("");async function E(){try{const L=await(await fetch(`${Cl}/empresas`)).json();L.status==="ok"&&u(L.empresas||[])}catch{g("Não consegui conectar no backend.")}}D.useEffect(()=>{E()},[]);function b(){k(Uc),N(!0),g(""),z("")}function x(m){k({id:m.id,nome:m.nome||"",cnpj:m.cnpj||"",diaria_diurna:m.diaria_diurna||0,diaria_noturna:m.diaria_noturna||0,sabado:m.sabado||0,domingo_feriado:m.domingo_feriado||0,hora_20:m.hora_20||0,hora_50:m.hora_50||0,hora_100:m.hora_100||0,adicional_noturno:m.adicional_noturno||0,usa_adicional_noturno:m.usa_adicional_noturno??!0,feriado_usa_valor_domingo:m.feriado_usa_valor_domingo??!0}),N(!0),g(""),z("")}function v(m,L){k(T=>({...T,[m]:L}))}async function c(){if(!d.nome.trim()){g("Informe o nome do cliente.");return}try{g(""),z("");const m={...d,diaria_diurna:Number(d.diaria_diurna||0),diaria_noturna:Number(d.diaria_noturna||0),sabado:Number(d.sabado||0),domingo_feriado:Number(d.domingo_feriado||0),hora_20:Number(d.hora_20||0),hora_50:Number(d.hora_50||0),hora_100:Number(d.hora_100||0),adicional_noturno:Number(d.adicional_noturno||0)},T=await(await fetch(`${Cl}/empresas`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).json();if(T.status==="erro")throw new Error(T.erro||"Erro ao salvar cliente.");z("Cliente salvo com sucesso."),N(!1),await E()}catch(m){g(m.message||"Erro ao salvar cliente.")}}async function h(m){if(confirm("Deseja excluir este cliente?"))try{const T=await(await fetch(`${Cl}/empresas/${m}`,{method:"DELETE"})).json();if(T.status==="erro")throw new Error(T.erro||"Erro ao excluir.");z("Cliente excluído."),await E()}catch(L){g(L.message||"Erro ao excluir cliente.")}}return n.jsxs("div",{className:"clientes-page",children:[n.jsx("style",{children:`
        .clientes-page {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .clientes-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
        }

        .clientes-header h1 {
          margin:0;
          font-size:30px;
          font-weight:1000;
          color:#111827;
        }

        .clientes-header p {
          margin:5px 0 0;
          color:#6b7280;
          font-weight:700;
        }

        .btn-primary {
          border:0;
          background:${Xm};
          color:white;
          font-weight:900;
          padding:12px 16px;
          border-radius:12px;
          cursor:pointer;
          box-shadow:0 8px 18px rgba(0,176,80,.22);
        }

        .btn-gray {
          border:0;
          background:#e5e7eb;
          color:#111;
          font-weight:900;
          padding:10px 13px;
          border-radius:10px;
          cursor:pointer;
        }

        .btn-red {
          border:0;
          background:#fee2e2;
          color:#991b1b;
          font-weight:900;
          padding:10px 13px;
          border-radius:10px;
          cursor:pointer;
        }

        .clientes-grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap:14px;
        }

        .cliente-card {
          background:white;
          border:1px solid #e5e7eb;
          border-radius:20px;
          padding:18px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
        }

        .cliente-top {
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:flex-start;
        }

        .cliente-nome {
          font-size:20px;
          font-weight:1000;
          color:#00B050;
        }

        .cliente-cnpj {
          color:#6b7280;
          font-size:13px;
          font-weight:800;
          margin-top:4px;
        }

        .valores-mini {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px;
          margin-top:14px;
        }

        .valor-box {
          background:#f9fafb;
          border:1px solid #edf0f2;
          border-radius:12px;
          padding:9px;
          min-width:0;
          overflow:hidden;
        }

        .valor-box span {
          display:block;
          color:#6b7280;
          font-size:11px;
          font-weight:900;
          text-transform:uppercase;
        }

        .valor-box strong {
          display:block;
          color:#111827;
          margin-top:3px;
          max-width:100%;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          font-size:clamp(12px, 2.8vw, 16px);
          letter-spacing:-.2px;
          font-variant-numeric:tabular-nums;
        }

        .card-actions {
          display:flex;
          gap:8px;
          margin-top:14px;
        }

        .form-box {
          background:white;
          border:1px solid #d9dde1;
          border-radius:22px;
          padding:18px;
          box-shadow:0 12px 26px rgba(0,0,0,.07);
        }

        .form-title {
          font-size:22px;
          font-weight:1000;
          color:#111827;
          margin-bottom:14px;
        }

        .form-grid {
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap:12px;
        }

        .field label {
          display:block;
          font-size:12px;
          font-weight:900;
          color:#374151;
          margin-bottom:5px;
        }

        .field input {
          width:100%;
          border:1px solid #d1d5db;
          border-radius:10px;
          padding:10px;
          font-size:13px;
        }

        .check-field {
          display:flex;
          align-items:center;
          gap:8px;
          font-size:13px;
          font-weight:900;
          color:#374151;
          padding-top:22px;
        }

        .check-field input {
          width:auto;
        }

        .form-actions {
          display:flex;
          gap:10px;
          margin-top:16px;
        }

        .msg-ok {
          color:#006b34;
          font-weight:900;
        }

        .msg-erro {
          color:#b91c1c;
          font-weight:900;
        }

        @media(max-width: 950px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media(max-width: 620px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}),n.jsxs("div",{className:"clientes-header",children:[n.jsxs("div",{children:[n.jsx("h1",{children:"Clientes"}),n.jsx("p",{children:"Cadastre empresas, CNPJ, valores por contrato e regras de cobrança."})]}),n.jsx("button",{className:"btn-primary",onClick:b,children:"+ Novo cliente"})]}),_&&n.jsx("div",{className:"msg-erro",children:_}),C&&n.jsx("div",{className:"msg-ok",children:C}),p&&n.jsxs("div",{className:"form-box",children:[n.jsx("div",{className:"form-title",children:d.id?"Editar cliente":"Novo cliente"}),n.jsxs("div",{className:"form-grid",children:[n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"ID interno"}),n.jsx("input",{value:d.id,placeholder:"ex: enprin",onChange:m=>v("id",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Nome"}),n.jsx("input",{value:d.nome,placeholder:"Nome da empresa",onChange:m=>v("nome",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"CNPJ"}),n.jsx("input",{value:d.cnpj,placeholder:"00.000.000/0000-00",onChange:m=>v("cnpj",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Diária diurna"}),n.jsx("input",{type:"number",value:d.diaria_diurna,onChange:m=>v("diaria_diurna",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Diária noturna"}),n.jsx("input",{type:"number",value:d.diaria_noturna,onChange:m=>v("diaria_noturna",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Sábado"}),n.jsx("input",{type:"number",value:d.sabado,onChange:m=>v("sabado",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Domingo/Feriado"}),n.jsx("input",{type:"number",value:d.domingo_feriado,onChange:m=>v("domingo_feriado",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Adic. noturno"}),n.jsx("input",{type:"number",value:d.adicional_noturno,onChange:m=>v("adicional_noturno",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Hora 20%"}),n.jsx("input",{type:"number",value:d.hora_20,onChange:m=>v("hora_20",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Hora 50%"}),n.jsx("input",{type:"number",value:d.hora_50,onChange:m=>v("hora_50",m.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Hora 100%"}),n.jsx("input",{type:"number",value:d.hora_100,onChange:m=>v("hora_100",m.target.value)})]}),n.jsxs("label",{className:"check-field",children:[n.jsx("input",{type:"checkbox",checked:d.usa_adicional_noturno,onChange:m=>v("usa_adicional_noturno",m.target.checked)}),"Usa adicional noturno"]}),n.jsxs("label",{className:"check-field",children:[n.jsx("input",{type:"checkbox",checked:d.feriado_usa_valor_domingo,onChange:m=>v("feriado_usa_valor_domingo",m.target.checked)}),"Feriado usa valor domingo"]})]}),n.jsxs("div",{className:"form-actions",children:[n.jsx("button",{className:"btn-primary",onClick:c,children:"Salvar cliente"}),n.jsx("button",{className:"btn-gray",onClick:()=>N(!1),children:"Cancelar"})]})]}),n.jsx("div",{className:"clientes-grid",children:l.map(m=>n.jsxs("div",{className:"cliente-card",children:[n.jsx("div",{className:"cliente-top",children:n.jsxs("div",{children:[n.jsx("div",{className:"cliente-nome",children:m.nome}),n.jsxs("div",{className:"cliente-cnpj",children:["CNPJ: ",m.cnpj||"-"]})]})}),n.jsxs("div",{className:"valores-mini",children:[n.jsxs("div",{className:"valor-box",children:[n.jsx("span",{children:"Diurna"}),n.jsx("strong",{children:lo(m.diaria_diurna)})]}),n.jsxs("div",{className:"valor-box",children:[n.jsx("span",{children:"Noturna"}),n.jsx("strong",{children:lo(m.diaria_noturna)})]}),n.jsxs("div",{className:"valor-box",children:[n.jsx("span",{children:"Sábado"}),n.jsx("strong",{children:lo(m.sabado)})]}),n.jsxs("div",{className:"valor-box",children:[n.jsx("span",{children:"Dom/Feriado"}),n.jsx("strong",{children:lo(m.domingo_feriado)})]}),n.jsxs("div",{className:"valor-box",children:[n.jsx("span",{children:"20%"}),n.jsx("strong",{children:lo(m.hora_20)})]}),n.jsxs("div",{className:"valor-box",children:[n.jsx("span",{children:"Adic. Noturno"}),n.jsx("strong",{children:lo(m.adicional_noturno)})]})]}),n.jsxs("div",{className:"card-actions",children:[n.jsx("button",{className:"btn-gray",onClick:()=>x(m),children:"Editar"}),n.jsx("button",{className:"btn-red",onClick:()=>h(m.id),children:"Excluir"})]})]},m.id))})]})}const El=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,Jc="#00B050";function ot(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function $l(){return new Date().toISOString().slice(0,10)}function so(l,u){if(!l||u==="recebido")return 0;const d=new Date($l()).getTime(),k=new Date(l).getTime();return Math.max(0,Math.floor((d-k)/(1e3*60*60*24)))}function ef(l){return l>=30?"CRÍTICA":l>=8?"ALTA":l>=1?"MÉDIA":"NORMAL"}function Hc(l,u){const d=`Valor: ${ot(l.valor)}
Referência: ${l.referencia}
PIX: 18.315.702/0001-20`;return u==="amigavel"?`Olá, tudo bem?

Segue lembrete amigável referente à nota pendente.
${d}

YTALSEG`:u==="firme"?`Olá, identificamos pendência financeira vencida.
Pedimos verificar programação de pagamento.
${d}

YTALSEG`:`Segue novamente nota fiscal e dados bancários.
${d}

YTALSEG`}function tf(){const[l,u]=D.useState([]),[d,k]=D.useState("");async function p(){try{const h=await(await fetch(`${El}/financeiro`)).json();h.status==="ok"&&u((h.lancamentos||[]).map(m=>({...m,vencimento:m.vencimento||"",observacao:m.observacao||"",nota:m.nota||"",formaPagamento:m.formaPagamento||"PIX",ultimoContato:m.ultimoContato||"",promessaPagamento:m.promessaPagamento||"",statusCobranca:m.statusCobranca||"Sem contato"})))}catch{k("Erro ao conectar backend.")}}D.useEffect(()=>{p()},[]);const N=D.useMemo(()=>{const c=l.filter(H=>H.status==="pendente"),h=c.filter(H=>H.vencimento===$l()).length,m=c.filter(H=>{const j=so(H.vencimento,H.status);return j>=1&&j<=7}).length,L=c.filter(H=>so(H.vencimento,H.status)>=30).length,T=c.reduce((H,j)=>H+Number(j.valor||0),0);return{hojeCount:h,a7:m,a30:L,total:T}},[l]);async function _(c){await navigator.clipboard.writeText(c),alert("Mensagem copiada.")}function g(c){const h=navigator;h.share?h.share({text:c}).catch(()=>{}):(navigator.clipboard.writeText(c),alert("Resumo copiado para colar no grupo do WhatsApp."))}function C(){const h=l.filter(m=>m.status==="pendente").slice(0,15).map(m=>`• ${m.cliente} - ${ot(m.valor)} - Venc.: ${m.vencimento||"sem venc."}`);g(`🔔 COBRANÇAS DE HOJE

${h.join(`
`)||"Nenhuma pendência."}

Checar pagamentos e retornos.`)}function z(){const h=l.filter(m=>m.status==="pendente"&&so(m.vencimento,m.status)>=30).map(m=>`• ${m.cliente} - ${ot(m.valor)} - ${so(m.vencimento,m.status)} dias`);g(`🚨 ATRASADOS +30 DIAS

${h.join(`
`)||"Nenhum crítico."}`)}function E(){const c=l.reduce((L,T)=>L+Number(T.valor||0),0),h=l.filter(L=>L.status==="recebido").reduce((L,T)=>L+Number(T.valor||0),0),m=l.filter(L=>L.status==="pendente").reduce((L,T)=>L+Number(T.valor||0),0);g(`📊 RESUMO FINANCEIRO

Faturado: ${ot(c)}
Recebido: ${ot(h)}
Pendente: ${ot(m)}

YTALSEG`)}function b(c,h){const m=Hc(c,h),L=`https://wa.me/?text=${encodeURIComponent(m)}`;window.open(L,"_blank")}async function x(c){await fetch(`${El}/financeiro`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)}),await p()}async function v(c){await fetch(`${El}/financeiro/${c.id}/status`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"recebido",dataRecebimento:$l()})}),await p()}return n.jsxs("div",{className:"page",children:[n.jsx("style",{children:`
        .page{display:grid;gap:18px}
        .head{display:flex;justify-content:space-between;align-items:center}
        .head h1{margin:0;font-size:30px;font-weight:1000}
        .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .card,.box{background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:18px}
        .card span{display:block;font-size:12px;color:#6b7280;font-weight:1000}
        .card strong{display:block;margin-top:8px;font-size:28px;color:${Jc};font-weight:1000}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#f9fafb;text-align:left;padding:10px;border-bottom:1px solid #e5e7eb}
        td{padding:10px;border-bottom:1px solid #edf0f2;vertical-align:top}
        .btn{border:0;padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:900;background:#e5e7eb}
        .btn-green{background:${Jc};color:#fff}
        .btn-red{background:#fee2e2;color:#991b1b}
        .actions{display:flex;gap:6px;flex-wrap:wrap}
        .pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:1000}
        .p0{background:#ecfccb;color:#365314}.p1{background:#fef3c7;color:#92400e}.p2{background:#fee2e2;color:#991b1b}
        input,select{width:100%;border:1px solid #d1d5db;border-radius:8px;padding:6px;font-size:12px}
      `}),n.jsxs("div",{className:"head",children:[n.jsx("h1",{children:"Financeiro Histórico PRO"}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn",onClick:C,children:"Grupo Hoje"}),n.jsx("button",{className:"btn",onClick:z,children:"Críticos"}),n.jsx("button",{className:"btn",onClick:E,children:"Resumo Grupo"}),n.jsx("button",{className:"btn",onClick:()=>{const c=new Date().toISOString().slice(0,10),h=l.filter(H=>H.status==="pendente"),m=h.filter(H=>H.vencimento===c),L=h.filter(H=>H.promessaPagamento===c),T=[...m.map(H=>`• VENCE HOJE: ${H.cliente} - ${ot(H.valor)}`),...L.map(H=>`• PROMETEU PAGAR: ${H.cliente} - ${ot(H.valor)}`),...h.slice(0,8).map(H=>`• COBRAR: ${H.cliente} - ${ot(H.valor)} - Venc.: ${H.vencimento||"sem venc."}`)];g(`📌 AGENDA DE COBRANÇA DE HOJE

${T.join(`
`)||"Nenhuma ação para hoje."}

Checar pagamentos e retornos.`)},children:"Agenda Hoje"}),n.jsx("button",{className:"btn btn-green",onClick:p,children:"Atualizar"})]})]}),d&&n.jsx("div",{children:d}),n.jsxs("div",{className:"cards",children:[n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Vencendo hoje"}),n.jsx("strong",{children:N.hojeCount})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Atrasadas 1-7 dias"}),n.jsx("strong",{children:N.a7})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Atrasadas +30 dias"}),n.jsx("strong",{children:N.a30})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Total a receber"}),n.jsx("strong",{children:ot(N.total)})]})]}),n.jsxs("div",{className:"cards",children:[n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Faturado mês"}),n.jsx("strong",{children:ot(l.reduce((c,h)=>c+Number(h.valor||0),0))})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Recebido mês"}),n.jsx("strong",{children:ot(l.filter(c=>c.status==="recebido").reduce((c,h)=>c+Number(h.valor||0),0))})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Pendente mês"}),n.jsx("strong",{children:ot(l.filter(c=>c.status==="pendente").reduce((c,h)=>c+Number(h.valor||0),0))})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Taxa recebimento"}),n.jsxs("strong",{children:[l.length?Math.round(l.filter(c=>c.status==="recebido").length/l.length*100):0,"%"]})]})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{style:{marginTop:0},children:"Agenda de Cobrança"}),n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Ação"}),n.jsx("th",{children:"Valor"}),n.jsx("th",{children:"Vencimento"}),n.jsx("th",{children:"Promessa"})]})}),n.jsx("tbody",{children:l.filter(c=>c.status==="pendente").slice(0,10).map(c=>{const h=new Date().toISOString().slice(0,10),m=c.promessaPagamento===h?"Prometeu pagar hoje":c.vencimento===h?"Vence hoje":so(c.vencimento,c.status)>0?"Cobrar atraso":"Acompanhar";return n.jsxs("tr",{children:[n.jsx("td",{children:c.cliente}),n.jsx("td",{children:m}),n.jsx("td",{children:ot(c.valor)}),n.jsx("td",{children:c.vencimento||"-"}),n.jsx("td",{children:c.promessaPagamento||"-"})]},`agenda-${c.id}`)})})]})]}),n.jsx("div",{className:"box",children:n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Valor"}),n.jsx("th",{children:"Venc."}),n.jsx("th",{children:"Atraso"}),n.jsx("th",{children:"Prioridade"}),n.jsx("th",{children:"Cobrança"}),n.jsx("th",{children:"Ações"})]})}),n.jsxs("tbody",{children:[l.filter(c=>c.status==="pendente").map(c=>{const h=so(c.vencimento,c.status),m=ef(h),L=h>=30?"p2":h>=1?"p1":"p0";return n.jsxs("tr",{children:[n.jsxs("td",{children:[n.jsx("div",{style:{fontWeight:900},children:c.cliente}),n.jsx("div",{children:c.referencia})]}),n.jsx("td",{children:ot(c.valor)}),n.jsx("td",{children:c.vencimento||"-"}),n.jsx("td",{children:h>0?`${h} dias`:"-"}),n.jsx("td",{children:n.jsx("span",{className:`pill ${L}`,children:m})}),n.jsxs("td",{style:{minWidth:220},children:[n.jsxs("select",{value:c.statusCobranca||"Sem contato",onChange:T=>x({...c,statusCobranca:T.target.value}),children:[n.jsx("option",{children:"Sem contato"}),n.jsx("option",{children:"Cobrado"}),n.jsx("option",{children:"Prometeu pagar"}),n.jsx("option",{children:"Negociação"})]}),n.jsx("input",{type:"date",value:c.ultimoContato||"",onChange:T=>x({...c,ultimoContato:T.target.value})}),n.jsx("input",{type:"date",value:c.promessaPagamento||"",onChange:T=>x({...c,promessaPagamento:T.target.value})})]}),n.jsx("td",{children:n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn btn-green",onClick:()=>b(c,"amigavel"),children:"WhatsApp"}),n.jsx("button",{className:"btn",onClick:()=>b(c,"firme"),children:"Firme"}),n.jsx("button",{className:"btn",onClick:()=>b(c,"reenvio"),children:"Reenviar"}),n.jsx("button",{className:"btn",onClick:()=>_(Hc(c,"amigavel")),children:"Copiar"}),n.jsx("button",{className:"btn btn-green",onClick:()=>v(c),children:"Receber"})]})})]},c.id)}),l.filter(c=>c.status==="pendente").length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:7,children:"Nenhuma pendência."})})]})]})})]})}const Wc="ytalseg_equipe_v10_5",Gc="#00B050",_l={id:"",nome:"",funcao:"",telefone:"",admissao:"",ativo:!0,diaria:0,comissao:0,documentos:"",validade:""};function Qc(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function nf(){const[l,u]=D.useState([]),[d,k]=D.useState(_l),[p,N]=D.useState(!1);D.useEffect(()=>{const v=localStorage.getItem(Wc);if(v)try{u(JSON.parse(v))}catch{u([])}},[]),D.useEffect(()=>{localStorage.setItem(Wc,JSON.stringify(l))},[l]);const _=D.useMemo(()=>{const v=l.filter(L=>L.ativo).length,c=l.filter(L=>!L.ativo).length,h=l.filter(L=>L.validade).length,m=l.length>0?l.reduce((L,T)=>L+Number(T.diaria||0),0)/l.length:0;return{ativos:v,inativos:c,docsVencendo:h,diariaMedia:m}},[l]);function g(){k(_l),N(!0)}function C(v){k(v),N(!0)}function z(v,c){k(h=>({...h,[v]:v==="diaria"||v==="comissao"?Number(c||0):v==="ativo"?!!c:c}))}function E(){if(!d.nome.trim()){alert("Informe o nome.");return}const v=d.id||crypto.randomUUID(),c={...d,id:v};u(h=>h.some(L=>L.id===v)?h.map(L=>L.id===v?c:L):[c,...h]),N(!1),k(_l)}function b(v){confirm("Excluir colaborador?")&&u(c=>c.filter(h=>h.id!==v))}function x(v){u(c=>c.map(h=>h.id===v?{...h,ativo:!h.ativo}:h))}return n.jsxs("div",{className:"equipe-page",children:[n.jsx("style",{children:`
        .equipe-page { display:grid; gap:18px; }

        .head {
          display:flex;
          justify-content:space-between;
          gap:16px;
          align-items:center;
        }

        .head h1 {
          margin:0;
          font-size:30px;
          font-weight:1000;
          color:#111827;
        }

        .head p {
          margin:5px 0 0;
          color:#6b7280;
          font-weight:700;
        }

        .btn-primary {
          border:0;
          background:${Gc};
          color:white;
          font-weight:900;
          padding:12px 16px;
          border-radius:12px;
          cursor:pointer;
          box-shadow:0 8px 18px rgba(0,176,80,.22);
        }

        .btn-gray {
          border:0;
          background:#e5e7eb;
          color:#111;
          font-weight:900;
          padding:10px 13px;
          border-radius:10px;
          cursor:pointer;
        }

        .btn-red {
          border:0;
          background:#fee2e2;
          color:#991b1b;
          font-weight:900;
          padding:10px 13px;
          border-radius:10px;
          cursor:pointer;
        }

        .cards {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
        }

        .card {
          background:white;
          border:1px solid #e5e7eb;
          border-radius:22px;
          padding:18px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
        }

        .card span {
          display:block;
          color:#6b7280;
          font-size:12px;
          font-weight:1000;
          text-transform:uppercase;
        }

        .card strong {
          display:block;
          margin-top:8px;
          color:${Gc};
          font-size:30px;
          font-weight:1000;
        }

        .form-box, .table-box {
          background:white;
          border:1px solid #e5e7eb;
          border-radius:22px;
          padding:18px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
        }

        .title {
          font-size:22px;
          font-weight:1000;
          margin-bottom:14px;
        }

        .grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }

        .field label {
          display:block;
          font-size:12px;
          font-weight:900;
          margin-bottom:5px;
          color:#374151;
        }

        .field input {
          width:100%;
          border:1px solid #d1d5db;
          border-radius:10px;
          padding:10px;
        }

        .check {
          display:flex;
          align-items:center;
          gap:8px;
          padding-top:22px;
          font-size:13px;
          font-weight:900;
        }

        .actions {
          display:flex;
          gap:10px;
          margin-top:16px;
        }

        table {
          width:100%;
          border-collapse:collapse;
          font-size:13px;
        }

        th {
          text-align:left;
          padding:12px;
          background:#f9fafb;
          border-bottom:1px solid #e5e7eb;
          font-weight:1000;
        }

        td {
          padding:12px;
          border-bottom:1px solid #edf0f2;
          font-weight:700;
        }

        tr:last-child td { border-bottom:0; }

        .status {
          padding:6px 10px;
          border-radius:999px;
          font-size:12px;
          font-weight:1000;
        }

        .ativo { background:#dcfce7; color:#166534; }
        .inativo { background:#fee2e2; color:#991b1b; }

        .row-actions {
          display:flex;
          gap:7px;
          flex-wrap:wrap;
        }

        @media(max-width:1050px){
          .cards,.grid{grid-template-columns:1fr 1fr;}
        }

        @media(max-width:650px){
          .cards,.grid{grid-template-columns:1fr;}
          .table-box{overflow:auto;}
        }
      `}),n.jsxs("div",{className:"head",children:[n.jsxs("div",{children:[n.jsx("h1",{children:"Equipe"}),n.jsx("p",{children:"Controle de técnicos, diária, comissão e documentos."})]}),n.jsx("button",{className:"btn-primary",onClick:g,children:"+ Novo colaborador"})]}),n.jsxs("div",{className:"cards",children:[n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Ativos"}),n.jsx("strong",{children:_.ativos})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Inativos"}),n.jsx("strong",{children:_.inativos})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Docs cadastrados"}),n.jsx("strong",{children:_.docsVencendo})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Diária média"}),n.jsx("strong",{children:Qc(_.diariaMedia)})]})]}),p&&n.jsxs("div",{className:"form-box",children:[n.jsx("div",{className:"title",children:d.id?"Editar colaborador":"Novo colaborador"}),n.jsxs("div",{className:"grid",children:[n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Nome"}),n.jsx("input",{value:d.nome,onChange:v=>z("nome",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Função"}),n.jsx("input",{value:d.funcao,onChange:v=>z("funcao",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Telefone"}),n.jsx("input",{value:d.telefone,onChange:v=>z("telefone",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Admissão"}),n.jsx("input",{type:"date",value:d.admissao,onChange:v=>z("admissao",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Diária"}),n.jsx("input",{type:"number",value:d.diaria,onChange:v=>z("diaria",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Comissão %"}),n.jsx("input",{type:"number",value:d.comissao,onChange:v=>z("comissao",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Documento"}),n.jsx("input",{value:d.documentos,placeholder:"NR10 / ASO / etc",onChange:v=>z("documentos",v.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Validade"}),n.jsx("input",{type:"date",value:d.validade,onChange:v=>z("validade",v.target.value)})]}),n.jsxs("label",{className:"check",children:[n.jsx("input",{type:"checkbox",checked:d.ativo,onChange:v=>z("ativo",v.target.checked)}),"Colaborador ativo"]})]}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn-primary",onClick:E,children:"Salvar"}),n.jsx("button",{className:"btn-gray",onClick:()=>N(!1),children:"Cancelar"})]})]}),n.jsx("div",{className:"table-box",children:n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Nome"}),n.jsx("th",{children:"Função"}),n.jsx("th",{children:"Telefone"}),n.jsx("th",{children:"Diária"}),n.jsx("th",{children:"Comissão"}),n.jsx("th",{children:"Documento"}),n.jsx("th",{children:"Status"}),n.jsx("th",{children:"Ações"})]})}),n.jsxs("tbody",{children:[l.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:8,children:"Nenhum colaborador cadastrado."})}),l.map(v=>n.jsxs("tr",{children:[n.jsx("td",{children:v.nome}),n.jsx("td",{children:v.funcao||"-"}),n.jsx("td",{children:v.telefone||"-"}),n.jsx("td",{children:Qc(v.diaria)}),n.jsxs("td",{children:[v.comissao,"%"]}),n.jsx("td",{children:v.documentos||"-"}),n.jsx("td",{children:n.jsx("span",{className:`status ${v.ativo?"ativo":"inativo"}`,children:v.ativo?"Ativo":"Inativo"})}),n.jsx("td",{children:n.jsxs("div",{className:"row-actions",children:[n.jsx("button",{className:"btn-gray",onClick:()=>C(v),children:"Editar"}),n.jsx("button",{className:"btn-gray",onClick:()=>x(v.id),children:v.ativo?"Inativar":"Ativar"}),n.jsx("button",{className:"btn-red",onClick:()=>b(v.id),children:"Excluir"})]})})]},v.id))]})]})})]})}const ji=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,Yc="#00B050";function Pn(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}const zl=(l,u)=>`REFERENTE A SERVIÇOS PRESTADOS EM ASSESSORIA E CONSULTORIA EM SEGURANÇA DO TRABALHO,
DURANTE O MÊS DE ${l||"____"}.
VENCIMENTO ${u||"__/__/____"}.

DADOS BANCÁRIOS PARA PAGAMENTO:

BANCO ITAÚ
AGÊNCIA 8078
CONTA CORRENTE 23126-6
PIX: 18.315.702/0001-20`,Kc={cliente:"",cnpj:"",email:"",endereco:"",municipio:"São Paulo",uf:"SP",referencia:"",vencimento:"",valor:0,pedidoCompra:"",codigoServico:"03115 - Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.",descricao:"",numeroNota:"",statusNota:"preparada"};function of(){const[l,u]=D.useState([]),[d,k]=D.useState([]),[p,N]=D.useState({...Kc}),[_,g]=D.useState(""),[C,z]=D.useState(""),[E,b]=D.useState("");async function x(){try{z("");const[F,X]=await Promise.all([fetch(`${ji}/empresas`),fetch(`${ji}/financeiro`).catch(()=>null)]),G=await F.json();if(G.status==="ok"&&u(G.empresas||[]),X){const be=await X.json();be.status==="ok"&&k(be.lancamentos||[])}}catch{z("Não consegui carregar clientes/financeiro. Confira o backend.")}}D.useEffect(()=>{x()},[]);const v=D.useMemo(()=>d.filter(F=>F.status==="pendente"),[d]);function c(F){g(F);const X=d.find(pe=>pe.id===F);if(!X)return;const G=l.find(pe=>{var He,Fe;return((He=pe.nome)==null?void 0:He.toLowerCase())===((Fe=X.cliente)==null?void 0:Fe.toLowerCase())}),be=X.referencia||"",Ie=X.vencimento||"";N({...Kc,cliente:(G==null?void 0:G.nome)||X.cliente||"",cnpj:(G==null?void 0:G.cnpj)||"",email:(G==null?void 0:G.email)||"",endereco:(G==null?void 0:G.endereco)||"",municipio:(G==null?void 0:G.municipio)||"",uf:(G==null?void 0:G.uf)||"",referencia:be,vencimento:Ie,valor:Number(X.valor||0),pedidoCompra:"",descricao:zl(be.toUpperCase(),Ie),statusNota:"preparada",numeroNota:X.nota||""})}function h(F,X){N(G=>({...G,[F]:F==="valor"?Number(X||0):X}))}async function m(F,X){await navigator.clipboard.writeText(F||""),b(`${X} copiado.`),setTimeout(()=>b(""),2e3)}function L(){const F=`
TOMADOR:
Razão Social: ${p.cliente}
CNPJ: ${p.cnpj}
E-mail: ${p.email}
Endereço: ${p.endereco}
Município/UF: ${p.municipio} - ${p.uf}

SERVIÇO:
Código: ${p.codigoServico}
Valor: ${Pn(p.valor)}
DISCRIMINAÇÃO:
${p.descricao}
`.trim();m(F,"Pacote da nota")}async function T(){if(!p.numeroNota.trim()){alert("Informe o número da nota emitida.");return}if(_){const F=d.find(X=>X.id===_);F&&await fetch(`${ji}/financeiro`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...F,nota:p.numeroNota,descricao:F.descricao||"Nota fiscal emitida"})})}N(F=>({...F,statusNota:"emitida"})),await x(),alert("Nota marcada como emitida no sistema.")}async function H(F){confirm("Excluir esta nota/lançamento?")&&(await fetch(`${ji}/financeiro/${F}`,{method:"DELETE"}),await x())}function j(F){g(F.id),c(F.id)}function M(){window.open("https://nfe.prefeitura.sp.gov.br/","_blank")}return n.jsxs("div",{className:"nota-page",children:[n.jsx("style",{children:`
        .nota-page { display:grid; gap:18px; }
        .head { display:flex; justify-content:space-between; align-items:center; gap:16px; }
        .head h1 { margin:0; font-size:30px; font-weight:1000; color:#111827; }
        .head p { margin:5px 0 0; color:#6b7280; font-weight:700; }
        .btn-primary { border:0; background:${Yc}; color:white; font-weight:900; padding:12px 16px; border-radius:12px; cursor:pointer; box-shadow:0 8px 18px rgba(0,176,80,.22); }
        .btn-gray { border:0; background:#e5e7eb; color:#111; font-weight:900; padding:10px 13px; border-radius:10px; cursor:pointer; }
        .btn-gold { border:0; background:#facc15; color:#1f2937; font-weight:1000; padding:12px 16px; border-radius:12px; cursor:pointer; }
        .grid { display:grid; grid-template-columns: .85fr 1.15fr; gap:18px; align-items:start; }
        .box { background:#fff; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .box h2 { margin:0 0 14px; font-size:22px; font-weight:1000; color:#111827; }
        .field { margin-bottom:12px; }
        .field label { display:block; font-size:12px; color:#374151; font-weight:1000; margin-bottom:5px; }
        .field input, .field select, .field textarea { width:100%; border:1px solid #d1d5db; border-radius:10px; padding:10px; font-size:13px; background:white; }
        .field textarea { min-height:160px; resize:vertical; font-family:Consolas, monospace; }
        .rows { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .mini-table { width:100%; border-collapse:collapse; font-size:13px; }
        .mini-table th { text-align:left; background:#f9fafb; padding:10px; border-bottom:1px solid #e5e7eb; }
        .mini-table td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; }
        .status { display:inline-flex; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:1000; background:#dcfce7; color:#166534; }
        .copy-ok { color:#006b34; font-weight:1000; }
        .preview { border:1px dashed #b7c2bd; background:#f8fafc; border-radius:14px; padding:14px; white-space:pre-wrap; font-family:Consolas, monospace; font-size:12px; }
        .valor { font-size:34px; font-weight:1000; color:${Yc}; }
        @media(max-width:1000px){ .grid,.rows{grid-template-columns:1fr;} }
      `}),n.jsxs("div",{className:"head",children:[n.jsxs("div",{children:[n.jsx("h1",{children:"Pré-Emissão NFS-e São Paulo"}),n.jsx("p",{children:"Prepare dados da nota a partir do relatório aprovado e financeiro."})]}),n.jsx("button",{className:"btn-primary",onClick:M,children:"Abrir Nota do Milhão"})]}),C&&n.jsx("div",{className:"box",style:{color:"#b91c1c",fontWeight:900},children:C}),n.jsxs("div",{className:"grid",children:[n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Lançamentos pendentes"}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Selecionar lançamento financeiro"}),n.jsxs("select",{value:_,onChange:F=>c(F.target.value),children:[n.jsx("option",{value:"",children:"Selecione..."}),v.map(F=>n.jsxs("option",{value:F.id,children:[F.cliente," - ",F.referencia," - ",Pn(F.valor)]},F.id))]})]}),n.jsxs("table",{className:"mini-table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Ref."}),n.jsx("th",{children:"Valor"})]})}),n.jsxs("tbody",{children:[v.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:3,children:"Nenhum lançamento pendente."})}),v.slice(0,8).map(F=>n.jsxs("tr",{children:[n.jsx("td",{children:F.cliente}),n.jsx("td",{children:F.referencia}),n.jsx("td",{children:Pn(F.valor)})]},F.id))]})]}),n.jsx("div",{className:"actions",children:n.jsx("button",{className:"btn-gray",onClick:x,children:"Atualizar"})})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Dados da NFS-e"}),n.jsxs("div",{className:"rows",children:[n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Tomador / Razão Social"}),n.jsx("input",{value:p.cliente,onChange:F=>h("cliente",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"CNPJ"}),n.jsx("input",{value:p.cnpj,onChange:F=>h("cnpj",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"E-mail"}),n.jsx("input",{value:p.email,onChange:F=>h("email",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Endereço"}),n.jsx("input",{value:p.endereco,onChange:F=>h("endereco",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Município"}),n.jsx("input",{value:p.municipio,onChange:F=>h("municipio",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"UF"}),n.jsx("input",{value:p.uf,onChange:F=>h("uf",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Referência"}),n.jsx("input",{value:p.referencia,onChange:F=>{h("referencia",F.target.value),h("descricao",zl(F.target.value.toUpperCase(),p.vencimento))}})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Vencimento"}),n.jsx("input",{value:p.vencimento,onChange:F=>{h("vencimento",F.target.value),h("descricao",zl(p.referencia.toUpperCase(),F.target.value))}})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Valor da nota"}),n.jsx("input",{type:"number",value:p.valor,onChange:F=>h("valor",F.target.value)})]})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Código do serviço"}),n.jsx("input",{value:p.codigoServico,onChange:F=>h("codigoServico",F.target.value)})]}),n.jsxs("div",{className:"field",children:[n.jsx("label",{children:"Discriminação dos serviços"}),n.jsx("div",{style:{fontSize:11,color:"#6b7280",fontWeight:800,marginBottom:6},children:"Se houver pedido de compra, digite manualmente na primeira linha da descrição."}),n.jsx("textarea",{value:p.descricao,onChange:F=>h("descricao",F.target.value)})]}),n.jsx("div",{className:"valor",children:Pn(p.valor)}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn-gray",onClick:()=>m(p.cliente,"Razão social"),children:"Copiar cliente"}),n.jsx("button",{className:"btn-gray",onClick:()=>m(p.cnpj,"CNPJ"),children:"Copiar CNPJ"}),n.jsx("button",{className:"btn-gray",onClick:()=>m(p.descricao,"Discriminação"),children:"Copiar discriminação"}),n.jsx("button",{className:"btn-gold",onClick:L,children:"Copiar pacote completo"})]}),E&&n.jsx("div",{className:"copy-ok",children:E}),n.jsxs("div",{className:"field",style:{marginTop:16},children:[n.jsx("label",{children:"Número da nota emitida"}),n.jsx("input",{value:p.numeroNota,onChange:F=>h("numeroNota",F.target.value),placeholder:"Ex: 00000824"})]}),n.jsx("div",{className:"actions",children:n.jsx("button",{className:"btn-primary",onClick:T,children:"Marcar nota como emitida"})}),p.statusNota==="emitida"&&n.jsx("div",{className:"status",children:"Nota emitida registrada"})]})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Histórico de notas e pendências"}),n.jsxs("table",{className:"mini-table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Referência"}),n.jsx("th",{children:"Valor"}),n.jsx("th",{children:"Nota"}),n.jsx("th",{children:"Status"}),n.jsx("th",{children:"Ações"})]})}),n.jsxs("tbody",{children:[d.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:6,children:"Nenhuma nota ou lançamento encontrado."})}),d.map(F=>n.jsxs("tr",{children:[n.jsx("td",{children:F.cliente}),n.jsx("td",{children:F.referencia||"-"}),n.jsx("td",{children:Pn(F.valor)}),n.jsx("td",{children:F.nota||"Pendente"}),n.jsx("td",{children:F.status}),n.jsx("td",{children:n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn-gray",onClick:()=>j(F),children:"Visualizar"}),n.jsx("button",{className:"btn-gray",onClick:()=>m(`Cliente: ${F.cliente}
Referência: ${F.referencia}
Valor: ${Pn(F.valor)}
Nota: ${F.nota||"Pendente"}`,"Dados da nota"),children:"Copiar"}),n.jsx("button",{className:"btn-gray",onClick:()=>H(F.id),children:"Excluir"})]})})]},`hist-${F.id}`))]})]})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Prévia do pacote para o portal"}),n.jsx("div",{className:"preview",children:`TOMADOR:
Razão Social: ${p.cliente||"-"}
CNPJ: ${p.cnpj||"-"}
E-mail: ${p.email||"-"}
Endereço: ${p.endereco||"-"}
Município/UF: ${p.municipio||"-"} - ${p.uf||"-"}

SERVIÇO:
Código: ${p.codigoServico}
Valor: ${Pn(p.valor)}
DISCRIMINAÇÃO:
${p.descricao||"-"}`})]})]})}const qc=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,Xc="#00B050";function nr(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function Ci(){return new Date().toISOString().slice(0,10)}function rf(l){if(!l)return 0;const u=new Date(Ci()).getTime(),d=new Date(l).getTime();return Math.max(0,Math.floor((u-d)/(1e3*60*60*24)))}function af(l){return`Olá, tudo bem?

Passando para verificar a aprovação do relatório ${l.referencia} no valor de ${nr(l.valor)}.

Fico no aguardo para sequência de emissão da nota.

YTALSEG`}function lf(){const[l,u]=D.useState([]),[d,k]=D.useState([]),[p,N]=D.useState(""),[_,g]=D.useState("");async function C(){try{N("");const H=await(await fetch(`${qc}/financeiro`)).json();H.status==="ok"&&u(H.lancamentos||[]);const j=localStorage.getItem("ytalseg_operacional_v10_13");k(j?JSON.parse(j):[])}catch{N("Não consegui carregar dados. Confira se o backend está rodando.")}}D.useEffect(()=>{C()},[]),D.useEffect(()=>{localStorage.setItem("ytalseg_operacional_v10_13",JSON.stringify(d))},[d]);const z=D.useMemo(()=>d.filter(T=>T.tipo==="aprovacao"&&T.status!=="aprovado"),[d]),E=D.useMemo(()=>{const T=l.filter(j=>j.status==="pendente"&&!j.nota).map(j=>({id:j.id,tipo:"nota",cliente:j.cliente,referencia:j.referencia,valor:j.valor,status:"sem nota",data:j.dataEmissao||Ci(),observacao:j.descricao||""})),H=d.filter(j=>j.tipo==="nota"&&j.status!=="emitida");return[...T,...H]},[l,d]),b=D.useMemo(()=>{const T=l.filter(M=>M.status==="pendente"&&M.vencimento).map(M=>({data:M.vencimento||"",tipo:"Vencimento",cliente:M.cliente,texto:`${M.referencia} - ${nr(M.valor)}`})),H=l.filter(M=>M.status==="pendente"&&M.promessaPagamento).map(M=>({data:M.promessaPagamento||"",tipo:"Promessa pagamento",cliente:M.cliente,texto:`${M.referencia} - ${nr(M.valor)}`})),j=d.filter(M=>M.tipo==="tarefa").map(M=>({data:M.data,tipo:"Tarefa",cliente:M.cliente,texto:M.observacao||M.referencia}));return[...T,...H,...j].filter(M=>M.data).sort((M,F)=>M.data.localeCompare(F.data)).slice(0,30)},[l,d]);function x(){const T=prompt("Cliente?");if(!T)return;const H=prompt("Referência? Ex: MARÇO / 2026")||"",j=Number(prompt("Valor?")||0);k(M=>[{id:crypto.randomUUID(),tipo:"aprovacao",cliente:T,referencia:H,valor:j,status:"aguardando",data:Ci(),observacao:""},...M])}function v(){const T=prompt("Cliente / assunto?");if(!T)return;const H=prompt("Data? AAAA-MM-DD")||Ci(),j=prompt("Tarefa?")||"";k(M=>[{id:crypto.randomUUID(),tipo:"tarefa",cliente:T,referencia:"",valor:0,status:"pendente",data:H,observacao:j},...M])}function c(T){k(H=>H.map(j=>j.id===T?{...j,status:"aprovado"}:j))}function h(T){k(H=>H.filter(j=>j.id!==T))}async function m(T){await navigator.clipboard.writeText(T),alert("Mensagem copiada.")}async function L(){try{const H=await(await fetch(`${qc}/backup`,{method:"POST"})).json();H.status==="ok"?g(`Backup criado: ${H.arquivo}`):g(H.erro||"Erro no backup.")}catch{g("Backend sem rota /backup. Substitua o main.py pela versão V10.13.")}}return n.jsxs("div",{className:"operacional-page",children:[n.jsx("style",{children:`
        .operacional-page { display:grid; gap:18px; }
        .head { display:flex; justify-content:space-between; gap:16px; align-items:center; }
        .head h1 { margin:0; font-size:30px; font-weight:1000; color:#111827; }
        .head p { margin:5px 0 0; color:#6b7280; font-weight:700; }
        .actions { display:flex; gap:10px; flex-wrap:wrap; }
        .btn { border:0; background:#e5e7eb; color:#111; font-weight:900; padding:10px 13px; border-radius:10px; cursor:pointer; }
        .btn-green { background:${Xc}; color:white; }
        .btn-red { background:#fee2e2; color:#991b1b; }
        .cards { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .card, .box { background:white; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .card span { display:block; color:#6b7280; font-size:12px; font-weight:1000; text-transform:uppercase; }
        .card strong { display:block; margin-top:8px; color:${Xc}; font-size:30px; font-weight:1000; }
        .grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        h2 { margin:0 0 14px; font-size:21px; font-weight:1000; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { text-align:left; background:#f9fafb; padding:10px; border-bottom:1px solid #e5e7eb; font-weight:1000; }
        td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; vertical-align:top; }
        .pill { display:inline-flex; padding:5px 9px; border-radius:999px; font-size:12px; font-weight:1000; background:#fef3c7; color:#92400e; }
        .warn { background:#fee2e2; color:#991b1b; }
        .msg { color:#006b34; font-weight:900; }
        @media(max-width:1050px){ .cards,.grid{grid-template-columns:1fr 1fr;} }
        @media(max-width:700px){ .cards,.grid{grid-template-columns:1fr;} }
      `}),n.jsxs("div",{className:"head",children:[n.jsxs("div",{children:[n.jsx("h1",{children:"Operacional Master"}),n.jsx("p",{children:"Aprovações, notas pendentes, backup e calendário em uma tela."})]}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn btn-green",onClick:C,children:"Atualizar"}),n.jsx("button",{className:"btn",onClick:x,children:"+ Aprovação"}),n.jsx("button",{className:"btn",onClick:v,children:"+ Tarefa"}),n.jsx("button",{className:"btn",onClick:L,children:"Backup agora"})]})]}),p&&n.jsx("div",{className:"box",style:{color:"#b91c1c",fontWeight:900},children:p}),_&&n.jsx("div",{className:"box msg",children:_}),n.jsxs("div",{className:"cards",children:[n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Aprovações pendentes"}),n.jsx("strong",{children:z.length})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Notas sem emitir"}),n.jsx("strong",{children:E.length})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Eventos calendário"}),n.jsx("strong",{children:b.length})]}),n.jsxs("div",{className:"card",children:[n.jsx("span",{children:"Financeiro pendente"}),n.jsx("strong",{children:l.filter(T=>T.status==="pendente").length})]})]}),n.jsxs("div",{className:"grid",children:[n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Aprovações Pendentes"}),n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Referência"}),n.jsx("th",{children:"Dias"}),n.jsx("th",{children:"Ações"})]})}),n.jsxs("tbody",{children:[z.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:4,children:"Nenhuma aprovação pendente."})}),z.map(T=>n.jsxs("tr",{children:[n.jsx("td",{children:T.cliente}),n.jsxs("td",{children:[T.referencia,n.jsx("br",{}),nr(T.valor)]}),n.jsxs("td",{children:[rf(T.data)," dias"]}),n.jsx("td",{children:n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn",onClick:()=>m(af(T)),children:"Cobrar"}),n.jsx("button",{className:"btn btn-green",onClick:()=>c(T.id),children:"Aprovar"}),n.jsx("button",{className:"btn btn-red",onClick:()=>h(T.id),children:"Excluir"})]})})]},T.id))]})]})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Nota Fiscal Pendente"}),n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Referência"}),n.jsx("th",{children:"Valor"}),n.jsx("th",{children:"Status"})]})}),n.jsxs("tbody",{children:[E.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:4,children:"Nenhuma nota pendente."})}),E.map(T=>n.jsxs("tr",{children:[n.jsx("td",{children:T.cliente}),n.jsx("td",{children:T.referencia}),n.jsx("td",{children:nr(T.valor)}),n.jsx("td",{children:n.jsx("span",{className:"pill warn",children:T.status})})]},`${T.id}-${T.tipo}`))]})]})]})]}),n.jsxs("div",{className:"grid",children:[n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Calendário Operacional"}),n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Data"}),n.jsx("th",{children:"Tipo"}),n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Detalhe"})]})}),n.jsxs("tbody",{children:[b.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:4,children:"Nenhum evento no calendário."})}),b.map((T,H)=>n.jsxs("tr",{children:[n.jsx("td",{children:T.data}),n.jsx("td",{children:n.jsx("span",{className:"pill",children:T.tipo})}),n.jsx("td",{children:T.cliente}),n.jsx("td",{children:T.texto})]},H))]})]})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Backup e Segurança"}),n.jsxs("p",{style:{fontWeight:700,color:"#4b5563"},children:["Use o botão ",n.jsx("b",{children:"Backup agora"})," para copiar o banco SQLite para a pasta de backups."]}),n.jsxs("p",{style:{fontWeight:700,color:"#4b5563"},children:["Banco principal esperado: ",n.jsx("b",{children:"backend/app/ytalseg_erp.db"})]}),n.jsx("div",{className:"actions",children:n.jsx("button",{className:"btn btn-green",onClick:L,children:"Criar backup agora"})})]})]})]})}const Pl=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://127.0.0.1:8000":`http://${window.location.hostname}:8000`,sf="#00B050",Rl="ytalseg_config_pro",Ni={empresa:"YTALSEG",cnpj:"18.315.702/0001-20",email:"financeiro.ytalseg@gmail.com",banco:"Banco Itaú",agencia:"8078",conta:"Conta Corrente 23126-6",pix:"18.315.702/0001-20",vencimentoPadrao:15,mensagemCobranca:`Olá, tudo bem?

Segue lembrete referente à pendência financeira.

YTALSEG`,descricaoNota:"REFERENTE A SERVIÇOS PRESTADOS EM ASSESSORIA E CONSULTORIA EM SEGURANÇA DO TRABALHO."};function df(l){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(l||0))}function cf(){const[l,u]=D.useState(Ni),[d,k]=D.useState([]),[p,N]=D.useState(""),[_,g]=D.useState("");D.useEffect(()=>{const c=localStorage.getItem(Rl);if(c)try{u({...Ni,...JSON.parse(c)})}catch{}b()},[]);function C(c,h){u(m=>({...m,[c]:h}))}function z(){localStorage.setItem(Rl,JSON.stringify(l)),N("Configurações salvas."),setTimeout(()=>N(""),2500)}function E(){confirm("Restaurar padrão?")&&(u(Ni),localStorage.setItem(Rl,JSON.stringify(Ni)))}async function b(){try{g("");const h=await(await fetch(`${Pl}/financeiro`)).json();h.status==="ok"&&k(h.lancamentos||[])}catch{g("Não consegui carregar notas/lançamentos.")}}async function x(c){confirm("Excluir esta nota/lançamento de teste?")&&(await fetch(`${Pl}/financeiro/${c}`,{method:"DELETE"}),N("Nota/lançamento excluído."),await b())}async function v(){try{const h=await(await fetch(`${Pl}/backup`,{method:"POST"})).json();N(h.status==="ok"?`Backup criado: ${h.arquivo}`:h.erro||"Erro no backup.")}catch{g("Backend sem rota /backup ou fora do ar.")}}return n.jsxs("div",{className:"config",children:[n.jsx("style",{children:`
        .config{display:grid;gap:18px}
        .head{display:flex;justify-content:space-between;align-items:center;gap:12px}
        h1{margin:0;font-size:30px;font-weight:1000}
        .sub{color:#6b7280;font-weight:700;margin-top:5px}
        .actions{display:flex;gap:10px;flex-wrap:wrap}
        .btn{border:0;background:#e5e7eb;color:#111;font-weight:900;padding:10px 13px;border-radius:10px;cursor:pointer}
        .green{background:${sf};color:white}.red{background:#fee2e2;color:#991b1b}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .box{background:white;border:1px solid #e5e7eb;border-radius:22px;padding:18px;box-shadow:0 10px 24px rgba(0,0,0,.06)}
        .box h2{margin:0 0 14px;font-size:21px}
        .form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        label{display:block;font-size:12px;font-weight:1000;color:#374151;margin-bottom:5px}
        input,textarea{width:100%;border:1px solid #d1d5db;border-radius:10px;padding:10px;font-size:13px}
        textarea{min-height:95px;resize:vertical}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{text-align:left;background:#f9fafb;padding:10px;border-bottom:1px solid #e5e7eb}
        td{padding:10px;border-bottom:1px solid #edf0f2;font-weight:700}
        .ok{background:#ecfdf5;color:#166534;border:1px solid #bbf7d0;border-radius:14px;padding:12px;font-weight:1000}
        .erro{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;border-radius:14px;padding:12px;font-weight:1000}
        @media(max-width:900px){.grid,.form{grid-template-columns:1fr}}
      `}),n.jsxs("div",{className:"head",children:[n.jsxs("div",{children:[n.jsx("h1",{children:"Configurações PRO"}),n.jsx("div",{className:"sub",children:"Empresa, financeiro, nota fiscal, backup e manutenção."})]}),n.jsxs("div",{className:"actions",children:[n.jsx("button",{className:"btn green",onClick:z,children:"Salvar"}),n.jsx("button",{className:"btn",onClick:E,children:"Restaurar"}),n.jsx("button",{className:"btn",onClick:v,children:"Backup agora"})]})]}),p&&n.jsx("div",{className:"ok",children:p}),_&&n.jsx("div",{className:"erro",children:_}),n.jsxs("div",{className:"grid",children:[n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Dados da empresa"}),n.jsxs("div",{className:"form",children:[n.jsxs("div",{children:[n.jsx("label",{children:"Empresa"}),n.jsx("input",{value:l.empresa,onChange:c=>C("empresa",c.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"CNPJ"}),n.jsx("input",{value:l.cnpj,onChange:c=>C("cnpj",c.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"E-mail"}),n.jsx("input",{value:l.email,onChange:c=>C("email",c.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Vencimento padrão em dias"}),n.jsx("input",{type:"number",value:l.vencimentoPadrao,onChange:c=>C("vencimentoPadrao",Number(c.target.value||0))})]})]})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Dados bancários"}),n.jsxs("div",{className:"form",children:[n.jsxs("div",{children:[n.jsx("label",{children:"Banco"}),n.jsx("input",{value:l.banco,onChange:c=>C("banco",c.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Agência"}),n.jsx("input",{value:l.agencia,onChange:c=>C("agencia",c.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"Conta"}),n.jsx("input",{value:l.conta,onChange:c=>C("conta",c.target.value)})]}),n.jsxs("div",{children:[n.jsx("label",{children:"PIX"}),n.jsx("input",{value:l.pix,onChange:c=>C("pix",c.target.value)})]})]})]})]}),n.jsxs("div",{className:"grid",children:[n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Mensagem de cobrança"}),n.jsx("textarea",{value:l.mensagemCobranca,onChange:c=>C("mensagemCobranca",c.target.value)})]}),n.jsxs("div",{className:"box",children:[n.jsx("h2",{children:"Descrição padrão da nota"}),n.jsx("textarea",{value:l.descricaoNota,onChange:c=>C("descricaoNota",c.target.value)}),n.jsx("p",{style:{fontWeight:800,color:"#6b7280"},children:"Pedido de compra continua manual na descrição quando existir."})]})]}),n.jsxs("div",{className:"box",children:[n.jsxs("div",{className:"head",style:{marginBottom:12},children:[n.jsxs("div",{children:[n.jsx("h2",{style:{margin:0},children:"Excluir nota / lançamento de teste"}),n.jsx("div",{className:"sub",children:"Use para apagar nota teste que entrou no financeiro."})]}),n.jsx("button",{className:"btn",onClick:b,children:"Atualizar lista"})]}),n.jsxs("table",{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"Cliente"}),n.jsx("th",{children:"Referência"}),n.jsx("th",{children:"Valor"}),n.jsx("th",{children:"Nota"}),n.jsx("th",{children:"Status"}),n.jsx("th",{children:"Ação"})]})}),n.jsxs("tbody",{children:[d.length===0&&n.jsx("tr",{children:n.jsx("td",{colSpan:6,children:"Nenhum lançamento encontrado."})}),d.map(c=>n.jsxs("tr",{children:[n.jsx("td",{children:c.cliente}),n.jsx("td",{children:c.referencia||"-"}),n.jsx("td",{children:df(c.valor)}),n.jsx("td",{children:c.nota||"-"}),n.jsx("td",{children:c.status}),n.jsx("td",{children:n.jsx("button",{className:"btn red",onClick:()=>x(c.id),children:"Excluir"})})]},c.id))]})]})]})]})}const Al="ytalseg_config_v11_7",Si={empresa:"",mesPadrao:"",pastaPDF:"",pastaBackup:"",observacoesPadrao:"",pix:"",responsavel:"",email:"",telefone:""};function pf(){const[l,u]=D.useState(Si),[d,k]=D.useState("");function p(){try{const C=JSON.parse(localStorage.getItem(Al)||"{}");u({...Si,...C})}catch{u(Si)}}function N(){localStorage.setItem(Al,JSON.stringify(l)),k("Configurações salvas com sucesso.")}function _(){window.confirm("Deseja limpar todas as configurações salvas?")&&(localStorage.removeItem(Al),u(Si),k("Configurações limpas."))}function g(C,z){u(E=>({...E,[C]:z}))}return D.useEffect(()=>{p()},[]),n.jsxs("div",{className:"config-page",children:[n.jsx("style",{children:`
        .config-page {
          display: grid;
          gap: 16px;
        }

        .config-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 14px;
          flex-wrap: wrap;
        }

        .config-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .config-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .config-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .config-field {
          display: grid;
          gap: 6px;
        }

        .config-field.full {
          grid-column: 1 / -1;
        }

        .config-field label {
          font-size: 12px;
          font-weight: 1000;
          color: #006b34;
          text-transform: uppercase;
        }

        .config-input,
        .config-textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 800;
          background: white;
        }

        .config-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .config-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .config-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111;
        }

        .config-btn-green {
          background: #00B050;
          color: white;
        }

        .config-msg {
          padding: 12px;
          border-radius: 14px;
          background: #ecfdf5;
          border: 1px solid rgba(0,176,80,.25);
          color: #166534;
          font-weight: 900;
        }

        .config-preview {
          display: grid;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #374151;
        }

        .config-preview strong {
          color: #111827;
        }

        @media (max-width: 900px) {
          .config-grid {
            grid-template-columns: 1fr;
          }
        }
      `}),n.jsx("div",{className:"config-head",children:n.jsxs("div",{className:"config-title",children:[n.jsx("h1",{children:"Configurações do Sistema"}),n.jsx("p",{children:"Dados padrão para relatórios, backups, PDFs e atendimento."})]})}),d&&n.jsx("div",{className:"config-msg",children:d}),n.jsxs("div",{className:"config-box",children:[n.jsxs("div",{className:"config-grid",children:[n.jsx(Ut,{label:"Empresa padrão",children:n.jsx("input",{className:"config-input",value:l.empresa,onChange:C=>g("empresa",C.target.value),placeholder:"Ex: YTALSEG"})}),n.jsx(Ut,{label:"Mês padrão",children:n.jsx("input",{className:"config-input",value:l.mesPadrao,onChange:C=>g("mesPadrao",C.target.value),placeholder:"Ex: Março / 2026"})}),n.jsx(Ut,{label:"Pasta padrão de PDFs",children:n.jsx("input",{className:"config-input",value:l.pastaPDF,onChange:C=>g("pastaPDF",C.target.value),placeholder:"Ex: C:\\\\YTALSEG\\\\PDFs"})}),n.jsx(Ut,{label:"Pasta padrão de backup",children:n.jsx("input",{className:"config-input",value:l.pastaBackup,onChange:C=>g("pastaBackup",C.target.value),placeholder:"Ex: C:\\\\YTALSEG\\\\Backups"})}),n.jsx(Ut,{label:"Pix / dados bancários",children:n.jsx("input",{className:"config-input",value:l.pix,onChange:C=>g("pix",C.target.value),placeholder:"Chave Pix ou dados bancários"})}),n.jsx(Ut,{label:"Responsável / assinatura",children:n.jsx("input",{className:"config-input",value:l.responsavel,onChange:C=>g("responsavel",C.target.value),placeholder:"Nome do responsável"})}),n.jsx(Ut,{label:"E-mail",children:n.jsx("input",{className:"config-input",value:l.email,onChange:C=>g("email",C.target.value),placeholder:"email@empresa.com"})}),n.jsx(Ut,{label:"Telefone",children:n.jsx("input",{className:"config-input",value:l.telefone,onChange:C=>g("telefone",C.target.value),placeholder:"(00) 00000-0000"})}),n.jsx(Ut,{label:"Observações padrão",full:!0,children:n.jsx("textarea",{className:"config-textarea",value:l.observacoesPadrao,onChange:C=>g("observacoesPadrao",C.target.value),placeholder:"Texto padrão para observações..."})})]}),n.jsxs("div",{className:"config-actions",children:[n.jsx("button",{className:"config-btn config-btn-green",onClick:N,children:"Salvar configurações"}),n.jsx("button",{className:"config-btn",onClick:p,children:"Recarregar"}),n.jsx("button",{className:"config-btn",onClick:_,children:"Limpar"})]})]}),n.jsxs("div",{className:"config-box",children:[n.jsx("h3",{style:{marginTop:0},children:"Prévia das configurações"}),n.jsxs("div",{className:"config-preview",children:[n.jsxs("div",{children:[n.jsx("strong",{children:"Empresa:"})," ",l.empresa||"-"]}),n.jsxs("div",{children:[n.jsx("strong",{children:"Mês padrão:"})," ",l.mesPadrao||"-"]}),n.jsxs("div",{children:[n.jsx("strong",{children:"Responsável:"})," ",l.responsavel||"-"]}),n.jsxs("div",{children:[n.jsx("strong",{children:"Pix / Banco:"})," ",l.pix||"-"]}),n.jsxs("div",{children:[n.jsx("strong",{children:"E-mail:"})," ",l.email||"-"]}),n.jsxs("div",{children:[n.jsx("strong",{children:"Telefone:"})," ",l.telefone||"-"]})]})]})]})}function Ut({label:l,full:u,children:d}){return n.jsxs("div",{className:`config-field ${u?"full":""}`,children:[n.jsx("label",{children:l}),d]})}function uf(){const[l,u]=D.useState("");function d(){u("Simulação: E-mail enviado com sucesso.")}function k(){u("Simulação: WhatsApp enviado com sucesso.")}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h2",{children:"Envio Automático"}),n.jsxs("div",{style:{display:"flex",gap:10},children:[n.jsx("button",{onClick:d,children:"Enviar por Email"}),n.jsx("button",{onClick:k,children:"Enviar por WhatsApp"})]}),l&&n.jsx("p",{style:{marginTop:20},children:l})]})}function Zc(l){if(!l)return"0 KB";const u=l/1024;return u<1024?`${u.toFixed(1)} KB`:`${(u/1024).toFixed(2)} MB`}function mf(){const[l,u]=D.useState(""),[d,k]=D.useState(""),[p,N]=D.useState(""),[_,g]=D.useState("Olá, segue em anexo/compartilhamento o relatório YTALSEG para conferência."),[C,z]=D.useState(null),[E,b]=D.useState(""),[x,v]=D.useState(null),c=D.useMemo(()=>C?{nome:C.name,tamanho:C.size,url:URL.createObjectURL(C)}:null,[C]);D.useEffect(()=>{try{const F=localStorage.getItem("ytalseg_envio_pdf_handoff_v14");if(!F)return;const X=JSON.parse(F);v(X),X.cliente&&u(X.cliente),X.mensagem&&g(X.mensagem),b("Dados recebidos do Pacote Cliente. Selecione o PDF e envie.")}catch{}},[]);function h(){localStorage.removeItem("ytalseg_envio_pdf_handoff_v14"),v(null),b("Vínculo com pacote removido desta tela.")}function m(){return l.trim()?C?!0:(b("Selecione o PDF do relatório antes de enviar."),!1):(b("Informe o cliente antes de enviar."),!1)}async function L(){const F=T();try{await navigator.clipboard.writeText(F),b("Mensagem copiada. Agora anexe o PDF no e-mail ou WhatsApp.")}catch{b("Não consegui copiar automaticamente. Copie manualmente a mensagem da tela.")}}function T(){return[`Cliente: ${l||"-"}`,"",_,"",C?`Arquivo: ${C.name} (${Zc(C.size)})`:"Arquivo: não selecionado"].join(`
`)}function H(){if(!m())return;const F=d.replace(/\D/g,""),X=encodeURIComponent(T()),G=F?`https://wa.me/55${F}?text=${X}`:`https://wa.me/?text=${X}`;window.open(G,"_blank"),b("WhatsApp aberto. Anexe o PDF selecionado manualmente na conversa.")}function j(){if(!m())return;const F=encodeURIComponent(`Relatório YTALSEG - ${l}`),X=encodeURIComponent(T()),G=p.trim();window.location.href=`mailto:${G}?subject=${F}&body=${X}`,b("E-mail aberto. Anexe o PDF selecionado manualmente antes de enviar.")}function M(){if(!c){b("Selecione um PDF primeiro.");return}window.open(c.url,"_blank"),b("PDF aberto para conferência.")}return n.jsxs("div",{className:"envio-pdf-page",children:[n.jsx("style",{children:`
        .envio-pdf-page {
          display: grid;
          gap: 16px;
        }

        .envio-pdf-head h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .envio-pdf-head p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .envio-pdf-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .envio-pdf-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .envio-pdf-field {
          display: grid;
          gap: 6px;
        }

        .envio-pdf-field.full {
          grid-column: 1 / -1;
        }

        .envio-pdf-field label {
          font-size: 12px;
          font-weight: 1000;
          color: #006b34;
          text-transform: uppercase;
        }

        .envio-pdf-input,
        .envio-pdf-textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 800;
          background: white;
        }

        .envio-pdf-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .envio-pdf-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .envio-pdf-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111;
        }

        .envio-pdf-btn-green {
          background: #00B050;
          color: white;
        }

        .envio-pdf-status {
          padding: 12px;
          border-radius: 14px;
          background: #ecfdf5;
          border: 1px solid rgba(0,176,80,.25);
          color: #166534;
          font-weight: 900;
        }

        .envio-pdf-file {
          padding: 12px;
          border-radius: 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #374151;
          font-size: 13px;
          font-weight: 850;
        }

        .envio-pdf-preview {
          white-space: pre-wrap;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
          color: #374151;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.45;
        }

        @media (max-width: 900px) {
          .envio-pdf-grid {
            grid-template-columns: 1fr;
          }
        }
      `}),n.jsxs("div",{className:"envio-pdf-head",children:[n.jsx("h1",{children:"Envio com PDF Real"}),n.jsx("p",{children:"Selecione o PDF gerado, prepare a mensagem e abra WhatsApp ou e-mail."})]}),E&&n.jsx("div",{className:"envio-pdf-status",children:E}),x&&n.jsxs("div",{className:"envio-pdf-status",children:[n.jsx("strong",{children:"Dados vinculados do Pacote Cliente:"}),n.jsx("br",{}),"Cliente: ",x.cliente||"-"," • Valor: ",x.valor?new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(x.valor||0)):"-"," • Status: ",x.status||"-",n.jsx("div",{style:{marginTop:10},children:n.jsx("button",{className:"envio-pdf-btn",onClick:h,children:"Limpar vínculo"})})]}),n.jsxs("div",{className:"envio-pdf-box",children:[n.jsxs("div",{className:"envio-pdf-grid",children:[n.jsx(tr,{label:"Cliente",children:n.jsx("input",{className:"envio-pdf-input",value:l,onChange:F=>u(F.target.value),placeholder:"Nome do cliente"})}),n.jsx(tr,{label:"Telefone WhatsApp",children:n.jsx("input",{className:"envio-pdf-input",value:d,onChange:F=>k(F.target.value),placeholder:"DDD + número"})}),n.jsx(tr,{label:"E-mail",children:n.jsx("input",{className:"envio-pdf-input",value:p,onChange:F=>N(F.target.value),placeholder:"cliente@email.com"})}),n.jsx(tr,{label:"PDF do relatório",children:n.jsx("input",{className:"envio-pdf-input",type:"file",accept:"application/pdf",onChange:F=>{var X;return z(((X=F.target.files)==null?void 0:X[0])||null)}})}),n.jsx(tr,{label:"Mensagem",full:!0,children:n.jsx("textarea",{className:"envio-pdf-textarea",value:_,onChange:F=>g(F.target.value)})})]}),c&&n.jsxs("div",{className:"envio-pdf-file",style:{marginTop:14},children:["PDF selecionado: ",n.jsx("strong",{children:c.nome})," — ",Zc(c.tamanho)]}),n.jsxs("div",{className:"envio-pdf-actions",children:[n.jsx("button",{className:"envio-pdf-btn envio-pdf-btn-green",onClick:H,children:"Abrir WhatsApp"}),n.jsx("button",{className:"envio-pdf-btn envio-pdf-btn-green",onClick:j,children:"Abrir e-mail"}),n.jsx("button",{className:"envio-pdf-btn",onClick:M,children:"Conferir PDF"}),n.jsx("button",{className:"envio-pdf-btn",onClick:L,children:"Copiar mensagem"})]})]}),n.jsxs("div",{className:"envio-pdf-box",children:[n.jsx("h3",{style:{marginTop:0},children:"Prévia da mensagem"}),n.jsx("div",{className:"envio-pdf-preview",children:T()})]})]})}function tr({label:l,full:u,children:d}){return n.jsxs("div",{className:`envio-pdf-field ${u?"full":""}`,children:[n.jsx("label",{children:l}),d]})}const Ol="#00B050",ep={admin:["dashboard","envio-completo-v25","dashboard-operacional","dashboard-graficos","pacote-cliente","fluxo-automatico","pendencias","alertas-v37","monitoramento-v38","dashboardpro-v39","logs-v40","backup-v41","banco-local","auditoria","notificacoes","permissoes","usuarios-v33","persistencia-v36","api-real-v46","diagnostico-v47","performance-v48","limpeza-v49","auditoria-v50","config-sistema","envio","envio-real","envio-pdf-real","relatorios","clientes","financeiro","equipe","notafiscal","operacional","configuracoes","historico-pdfs"],operador:["dashboard","dashboard-operacional","pacote-cliente","pendencias","notificacoes","envio","envio-real","envio-pdf-real","fluxo-automatico","relatorios","clientes","operacional","historico-pdfs"],financeiro:["dashboard","dashboard-graficos","pacote-cliente","pendencias","banco-local","auditoria","financeiro","notafiscal","historico-pdfs"],consulta:["dashboard","dashboard-operacional","dashboard-graficos","pendencias","notificacoes","historico-pdfs"]};function ff(){var c;const[l,u]=oe.useState(""),[d,k]=oe.useState("admin"),[p,N]=D.useState("dashboard"),[_,g]=oe.useState("Principal");oe.useEffect(()=>{const h=localStorage.getItem("ytalseg_user_v20");if(h)try{const m=JSON.parse(h);u(m.user||""),k(m.perfil||"admin")}catch{}},[]);function C(){localStorage.removeItem("ytalseg_user_v20"),u("")}const E=[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"dashboard-operacional",label:"Dashboard Operacional",icon:"📈"},{id:"dashboard-graficos",label:"Gráficos",icon:"📊"},{id:"pacote-cliente",label:"Pacote Cliente",icon:"📦"},{id:"pendencias",label:"Pendências",icon:"⚠️"},{id:"banco-local",label:"Banco Local",icon:"🗄️"},{id:"auditoria",label:"Auditoria",icon:"🧾"},{id:"logs-v40",label:"Logs do Sistema",icon:"🧾"},{id:"backup-v41",label:"Backup Seguro V41",icon:"💾"},{id:"cloudreal-status-v45-1",label:"Cloud Real Status",icon:"🌐"},{id:"api-real-v46",label:"API Real",icon:"🔌"},{id:"diagnostico-v47",label:"Diagnóstico",icon:"🩺"},{id:"performance-v48",label:"Performance",icon:"⚡"},{id:"limpeza-v49",label:"Limpeza Inteligente",icon:"🧹"},{id:"auditoria-v50",label:"Auditoria Avançada V50",icon:"📋"},{id:"notificacoes",label:"Notificações",icon:"🔔"},{id:"permissoes",label:"Permissões",icon:"🔐"},{id:"usuarios-v33",label:"Usuários / Login",icon:"👥"},{id:"persistencia-v36",label:"Persistência Real",icon:"🧠"},{id:"alertas-v37",label:"Alertas Inteligentes",icon:"🚨"},{id:"monitoramento-v38",label:"Monitoramento",icon:"📡"},{id:"dashboardpro-v39",label:"Dashboard PRO",icon:"📊"},{id:"backup",label:"Backup",icon:"💾"},{id:"fluxo-automatico",label:"Fluxo Automático",icon:"⚡"},{id:"envio-real-v24",label:"Envio Real V24",icon:"📨"},{id:"dashboard-v26",label:"Dashboard Avançado",icon:"📊"},{id:"banco-v27",label:"Banco Avançado",icon:"💾"},{id:"auditoria-v28",label:"Auditoria Avançada",icon:"📋"},{id:"multi-v29",label:"Multiusuário",icon:"👥"},{id:"acesso-v30",label:"Controle de Acesso",icon:"🔐"},{id:"notificacoes-v35",label:"Notificações V35",icon:"🔔"},{id:"envio-completo-v25",label:"Envio Completo",icon:"✅"},{id:"config-sistema",label:"Config Sistema",icon:"🛠️"},{id:"envio",label:"Envio",icon:"📤"},{id:"relatorios",label:"Relatórios",icon:"📄"},{id:"clientes",label:"Clientes",icon:"🏢"},{id:"financeiro",label:"Financeiro",icon:"💰"},{id:"equipe",label:"Equipe",icon:"👷"},{id:"notafiscal",label:"Nota Fiscal",icon:"🧾"},{id:"operacional",label:"Operacional",icon:"📅"},{id:"configuracoes",label:"Configurações",icon:"⚙️"},{id:"historico-pdfs",label:"Histórico PDFs",icon:"📁"}].filter(h=>{var m;return(m=ep[d])==null?void 0:m.includes(h.id)}),x=[{titulo:"Principal",icone:"🏠",ids:["dashboard","dashboard-operacional","dashboard-graficos","dashboardpro-v39"]},{titulo:"Operação",icone:"📁",ids:["relatorios","historico-pdfs","pacote-cliente","pendencias","envio","envio-real","envio-pdf-real","envio-real-v24","envio-completo-v25","fluxo-automatico","operacional"]},{titulo:"Gestão",icone:"👥",ids:["clientes","financeiro","equipe","notafiscal","usuarios-v33","permissoes","multi-v29","acesso-v30"]},{titulo:"Dados e Segurança",icone:"💾",ids:["banco-local","banco-v27","backup","backup-v41","persistencia-v36","cloudreal-status-v45-1","api-real-v46"]},{titulo:"Sistema",icone:"🛠️",ids:["auditoria","auditoria-v28","auditoria-v50","logs-v40","notificacoes","notificacoes-v35","alertas-v37","monitoramento-v38","diagnostico-v47","performance-v48","limpeza-v49","config-sistema","configuracoes","dashboard-v26"]}].map(h=>({...h,itens:h.ids.map(m=>E.find(L=>L.id===m)).filter(Boolean)})).filter(h=>h.itens.length>0),v=(c=ep[d])==null?void 0:c.includes(p);return oe.useEffect(()=>{v||N("dashboard")},[d,v]),oe.useEffect(()=>{const h=x.find(m=>m.itens.some(L=>L.id===p));h&&g(h.titulo)},[p]),l?n.jsxs("div",{className:"erp-root",children:[n.jsx("style",{children:`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #eef1f3;
          color: #111;
        }

        .erp-root {
          min-height: 100vh;
          display: flex;
          background: #eef1f3;
        }

        .sidebar {
          width: 270px;
          min-width: 270px;
          height: 100vh;
          max-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          border-right: 1px solid #dfe3e8;
          padding: 14px 12px;
          position: sticky;
          top: 0;
          box-shadow: 4px 0 22px rgba(0,0,0,.05);
          z-index: 50;
          scrollbar-width: thin;
        }

        .logo-area {
          padding: 8px 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 6px;
        }

        .logo-title {
          color: ${Ol};
          font-size: 28px;
          font-weight: 1000;
          letter-spacing: -1px;
          line-height: .9;
        }

        .logo-sub {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 900;
          color: #4b5563;
        }

        .menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .menu-group {
          margin-bottom: 6px;
        }

        .menu-group-title {
          margin: 14px 10px 6px;
          color: #6b7280;
          font-size: 11px;
          font-weight: 1000;
          text-transform: uppercase;
          letter-spacing: .6px;
        }

        .menu-group-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-left: 6px;
          border-left: 2px solid #e5e7eb;
          margin-left: 10px;
          margin-top: 6px;
        }

        .menu-folder-button {
          border: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #f9fafb;
          color: #111827;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 1000;
          text-align: left;
        }

        .menu-folder-button:hover {
          background: #f3f4f6;
        }

        .menu-folder-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu-folder-count {
          min-width: 24px;
          height: 24px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eafff2;
          color: #006b34;
          font-size: 11px;
          font-weight: 1000;
        }

        .menu-folder-arrow {
          color: #6b7280;
          font-weight: 1000;
        }

        .menu button {
          border: 0;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          color: #374151;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
          text-align: left;
        }

        .menu button:hover {
          background: #f3f4f6;
        }

        .menu button.active {
          background: ${Ol};
          color: #fff;
          box-shadow: 0 8px 22px rgba(0,176,80,.25);
        }

        .main {
          flex: 1;
          min-width: 0;
        }

        .topbar {
          min-height: 96px;
          background: rgba(255,255,255,.94);
          border-bottom: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: minmax(220px, 1fr) auto minmax(260px, auto);
          align-items: center;
          gap: 14px;
          padding: 14px 26px;
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(10px);
          overflow: visible;
        }

        .topbar h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 1000;
          color: #111827;
        }

        .pill {
          color: #006b34;
          background: #eafff2;
          border: 1px solid rgba(0,176,80,.25);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 1000;
          white-space: nowrap;
        }

        .topbar-user {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          min-width: 260px;
          white-space: nowrap;
          color: #111827;
          font-size: 14px;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 1180px) {
          .topbar { grid-template-columns: 1fr; align-items: start; }
          .topbar-user { justify-content: flex-start; min-width: 0; }
        }

        .topbar-user button {
          border: 0;
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111827;
        }

        .content {
          padding: 24px;
        }

        .dash-title {
          margin: 0;
          font-size: 34px;
          font-weight: 1000;
          color: #111827;
        }

        .dash-sub {
          margin-top: 6px;
          color: #6b7280;
          font-weight: 700;
          margin-bottom: 22px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .erp-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 12px 26px rgba(0,0,0,.06);
        }

        .erp-card-title {
          color: #6b7280;
          font-size: 13px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .erp-card-value {
          color: ${Ol};
          font-size: 32px;
          font-weight: 1000;
          margin-top: 8px;
        }

        .erp-card-detail {
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
        }

        .dash-grid {
          display: grid;
          grid-template-columns: 1.35fr .9fr;
          gap: 18px;
          margin-top: 18px;
        }

        .panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 12px 26px rgba(0,0,0,.06);
        }

        .panel h3 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .panel p {
          margin: 0;
          color: #6b7280;
          font-weight: 700;
          line-height: 1.5;
        }

        .placeholder {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 12px 26px rgba(0,0,0,.06);
        }

        .placeholder h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .placeholder p {
          margin: 0;
          color: #6b7280;
          font-weight: 700;
        }

        .relatorios-box {
          margin: -24px;
        }

        @media (max-width: 1100px) {
          .cards,
          .dash-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 820px) {
          .erp-root {
            display: block;
          }

          .sidebar {
            width: 100%;
            min-width: 0;
            height: auto;
            position: relative;
          }

          .cards,
          .dash-grid {
            grid-template-columns: 1fr;
          }
        }

        @media print {
          .sidebar,
          .topbar {
            display: none !important;
          }

          .erp-root,
          .main,
          .content,
          .relatorios-box {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}),n.jsxs("aside",{className:"sidebar",children:[n.jsxs("div",{className:"logo-area",children:[n.jsx("div",{className:"logo-title",children:"YTALSEG"}),n.jsx("div",{className:"logo-sub",children:"ERP Interno Premium"})]}),n.jsx("nav",{className:"menu",children:x.map(h=>{const m=_===h.titulo;return n.jsxs("div",{className:"menu-group",children:[n.jsxs("button",{type:"button",className:"menu-folder-button",onClick:()=>g(m?"":h.titulo),children:[n.jsxs("span",{className:"menu-folder-left",children:[n.jsx("span",{children:h.icone}),n.jsx("span",{children:h.titulo})]}),n.jsxs("span",{style:{display:"flex",alignItems:"center",gap:8},children:[n.jsx("span",{className:"menu-folder-count",children:h.itens.length}),n.jsx("span",{className:"menu-folder-arrow",children:m?"▲":"▼"})]})]}),m&&n.jsx("div",{className:"menu-group-items",children:h.itens.map(L=>n.jsxs("button",{className:p===L.id?"active":"",onClick:()=>N(L.id),children:[n.jsx("span",{children:L.icon}),L.label]},L.id))})]},h.titulo)})})]}),n.jsxs("main",{className:"main",children:[n.jsxs("header",{className:"topbar",children:[n.jsxs("h2",{children:[p==="dashboard"&&"Dashboard Geral",p==="api-real-v46"&&"API Real",p==="diagnostico-v47"&&"Diagnóstico",p==="performance-v48"&&"Performance",p==="limpeza-v49"&&"Limpeza Inteligente",p==="auditoria-v50"&&"Auditoria",p==="dashboard-operacional"&&"Dashboard Operacional",p==="dashboard-graficos"&&"Dashboard com Gráficos",p==="pacote-cliente"&&"Pacote do Cliente",p==="pendencias"&&"Central de Pendências",p==="banco-local"&&"Banco Local",p==="auditoria"&&"Auditoria do Sistema",p==="logs-v40"&&"Logs do Sistema",p==="backup-v41"&&"Backup V41",p==="notificacoes"&&"Notificações",p==="permissoes"&&"Permissões do Sistema",p==="usuarios-v33"&&"Usuários / Login",p==="persistencia-v36"&&"Persistência Real Electron",p==="alertas-v37"&&"Alertas Inteligentes",p==="monitoramento-v38"&&"Monitoramento",p==="dashboardpro-v39"&&"Dashboard PRO",p==="backup"&&"Backup Automático",p==="fluxo-automatico"&&"Fluxo Automático",p==="envio-real-v24"&&"Envio Real V24",p==="dashboard-v26"&&"Dashboard Avançado",p==="banco-v27"&&"Banco Avançado",p==="auditoria-v28"&&"Auditoria Avançada",p==="multi-v29"&&"Multiusuário",p==="acesso-v30"&&"Controle de Acesso",p==="notificacoes-v35"&&"Notificações V35",p==="envio-completo-v25"&&"Envio Completo 1 Clique",p==="config-sistema"&&"Configurações do Sistema",p==="envio"&&"Envio Automático",p==="envio-real"&&"Envio Real",p==="envio-pdf-real"&&"Envio com PDF Real",p==="relatorios"&&"Relatórios de Horas",p==="clientes"&&"Clientes",p==="financeiro"&&"Financeiro",p==="equipe"&&"Equipe",p==="notafiscal"&&"Nota Fiscal",p==="operacional"&&"Operacional",p==="configuracoes"&&"Configurações",p==="historico-pdfs"&&"Histórico de PDFs"]}),n.jsx("div",{className:"pill",children:"Sistema Interno YTALSEG"}),n.jsxs("div",{className:"topbar-user",children:[n.jsxs("strong",{children:["Usuário: ",l," • Perfil: ",d]}),n.jsx("button",{onClick:C,children:"Sair"})]})]}),n.jsxs("section",{className:"content",children:[p==="dashboard"&&n.jsx(bm,{}),p==="api-real-v46"&&n.jsx(Pf,{}),p==="diagnostico-v47"&&n.jsx(Rf,{}),p==="performance-v48"&&n.jsx(Af,{}),p==="limpeza-v49"&&n.jsx(Of,{}),p==="auditoria-v50"&&n.jsx(If,{}),p==="dashboard-operacional"&&n.jsx(jm,{}),p==="dashboard-graficos"&&n.jsx(Cm,{}),p==="pacote-cliente"&&n.jsx(zm,{}),p==="pendencias"&&n.jsx(Om,{}),p==="banco-local"&&n.jsx(Dm,{}),p==="auditoria"&&n.jsx(Mm,{}),p==="logs-v40"&&n.jsx(_f,{}),p==="backup-v41"&&n.jsx(zf,{}),p==="notificacoes"&&n.jsx(Vm,{}),p==="permissoes"&&n.jsx(Gm,{}),p==="usuarios-v33"&&n.jsx(jf,{}),p==="persistencia-v36"&&n.jsx(Sf,{}),p==="alertas-v37"&&n.jsx(kf,{}),p==="monitoramento-v38"&&n.jsx(Cf,{}),p==="dashboardpro-v39"&&n.jsx(Ef,{}),p==="backup"&&n.jsx(Qm,{}),p==="fluxo-automatico"&&n.jsx(qm,{}),p==="envio-real-v24"&&n.jsx(Vc,{}),p==="dashboard-v26"&&n.jsx(gf,{}),p==="banco-v27"&&n.jsx(xf,{}),p==="auditoria-v28"&&n.jsx(vf,{}),p==="multi-v29"&&n.jsx(yf,{}),p==="acesso-v30"&&n.jsx(bf,{perfil:d}),p==="notificacoes-v35"&&n.jsx(Nf,{}),p==="envio-completo-v25"&&n.jsx(hf,{}),p==="config-sistema"&&n.jsx(pf,{}),p==="envio"&&n.jsx(uf,{}),p==="envio-real"&&n.jsx(Vc,{}),p==="envio-pdf-real"&&n.jsx(mf,{}),p==="relatorios"&&n.jsx("div",{className:"relatorios-box",children:n.jsx(vm,{})}),p==="clientes"&&n.jsx(Zm,{}),p==="financeiro"&&n.jsx(tf,{}),p==="equipe"&&n.jsx(nf,{}),p==="notafiscal"&&n.jsx(of,{}),p==="operacional"&&n.jsx(lf,{}),p==="configuracoes"&&n.jsx(cf,{}),p==="historico-pdfs"&&n.jsx(cm,{})]})]})]}):n.jsx(Hm,{onLogin:(h,m)=>{u(h),k(m)}})}function hf(){const[l,u]=oe.useState(""),[d,k]=oe.useState(""),[p,N]=oe.useState(""),[_,g]=oe.useState(""),[C,z]=oe.useState("");function E(){const v=[`Olá, segue o material do cliente ${l||"cliente"} para conferência.`,"",C?`PDF selecionado: ${C}`:"","","Atenciosamente,","YTALSEG"].filter(Boolean).join(`
`);g(v)}function b(){const v=encodeURIComponent(_||`Olá, segue o material do cliente ${l||"cliente"} para conferência.`),c=d.replace(/\D/g,""),h=c?`https://wa.me/55${c}?text=${v}`:`https://wa.me/?text=${v}`;window.open(h,"_blank")}function x(){const v=encodeURIComponent(`Relatório YTALSEG - ${l||"Cliente"}`),c=encodeURIComponent(_||"Olá, segue o material para conferência.");window.location.href=`mailto:${p}?subject=${v}&body=${c}`}return n.jsxs("div",{className:"v25-inline",children:[n.jsx("style",{children:`
        .v25-inline { display: grid; gap: 16px; }
        .v25-inline h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .v25-inline p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .v25-box { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .v25-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .v25-field { display: grid; gap: 6px; }
        .v25-field.full { grid-column: 1 / -1; }
        .v25-field label { font-size: 12px; font-weight: 1000; color: #006b34; text-transform: uppercase; }
        .v25-input, .v25-textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .v25-textarea { min-height: 150px; resize: vertical; }
        .v25-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .v25-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .v25-btn-green { background: #00B050; color: white; }
        @media (max-width: 900px) { .v25-grid { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{children:[n.jsx("h1",{children:"Envio Completo"}),n.jsx("p",{children:"Versão embutida no App para eliminar erro de importação do módulo."})]}),n.jsxs("div",{className:"v25-box",children:[n.jsxs("div",{className:"v25-grid",children:[n.jsxs("div",{className:"v25-field",children:[n.jsx("label",{children:"Cliente"}),n.jsx("input",{className:"v25-input",value:l,onChange:v=>u(v.target.value),placeholder:"Nome do cliente"})]}),n.jsxs("div",{className:"v25-field",children:[n.jsx("label",{children:"WhatsApp"}),n.jsx("input",{className:"v25-input",value:d,onChange:v=>k(v.target.value),placeholder:"DDD + número"})]}),n.jsxs("div",{className:"v25-field",children:[n.jsx("label",{children:"E-mail"}),n.jsx("input",{className:"v25-input",value:p,onChange:v=>N(v.target.value),placeholder:"cliente@email.com"})]}),n.jsxs("div",{className:"v25-field",children:[n.jsx("label",{children:"PDF"}),n.jsx("input",{className:"v25-input",type:"file",accept:"application/pdf",onChange:v=>{var c,h;return z(((h=(c=v.target.files)==null?void 0:c[0])==null?void 0:h.name)||"")}})]}),n.jsxs("div",{className:"v25-field full",children:[n.jsx("label",{children:"Mensagem"}),n.jsx("textarea",{className:"v25-textarea",value:_,onChange:v=>g(v.target.value),placeholder:"Clique em gerar mensagem..."})]})]}),n.jsxs("div",{className:"v25-actions",children:[n.jsx("button",{className:"v25-btn v25-btn-green",onClick:E,children:"Gerar mensagem"}),n.jsx("button",{className:"v25-btn v25-btn-green",onClick:b,children:"Enviar WhatsApp"}),n.jsx("button",{className:"v25-btn v25-btn-green",onClick:x,children:"Enviar E-mail"})]})]})]})}function gf(){const[l,u]=oe.useState({envios:0,clientes:0,faturamento:0});oe.useEffect(()=>{try{const k=JSON.parse(localStorage.getItem("ytalseg_envios_v25")||"[]"),p=new Set(k.map(_=>_.cliente)),N=k.reduce((_,g)=>_+(g.valor||0),0);u({envios:k.length,clientes:p.size,faturamento:N})}catch{}},[]);function d(k){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(k||0)}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Dashboard Avançado"}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10},children:[n.jsx(Il,{titulo:"Envios",valor:l.envios}),n.jsx(Il,{titulo:"Clientes",valor:l.clientes}),n.jsx(Il,{titulo:"Faturamento",valor:d(l.faturamento)})]})]})}function Il({titulo:l,valor:u}){return n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",padding:20,borderRadius:12},children:[n.jsx("span",{children:l}),n.jsx("h2",{children:u})]})}function xf(){const[l,u]=oe.useState([]);oe.useEffect(()=>{try{const p=JSON.parse(localStorage.getItem("ytalseg_envios_v25")||"[]");u(p)}catch{}},[]);function d(){const p=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),N=URL.createObjectURL(p),_=document.createElement("a");_.href=N,_.download="backup_ytalseg.json",_.click()}function k(p){const N=p.target.files[0];if(!N)return;const _=new FileReader;_.onload=()=>{try{const g=JSON.parse(_.result);localStorage.setItem("ytalseg_envios_v25",JSON.stringify(g)),u(g)}catch{}},_.readAsText(N)}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Banco Avançado"}),n.jsx("button",{onClick:d,children:"Exportar dados"}),n.jsx("input",{type:"file",onChange:k}),n.jsx("pre",{style:{marginTop:20,maxHeight:300,overflow:"auto"},children:JSON.stringify(l.slice(0,10),null,2)})]})}function vf(){const[l,u]=oe.useState([]);oe.useEffect(()=>{try{const p=JSON.parse(localStorage.getItem("ytalseg_envios_v25")||"[]").map(N=>({id:N.id,cliente:N.cliente,valor:N.valor,canal:N.canal,data:N.criadoEm}));u(p)}catch{}},[]);function d(){localStorage.removeItem("ytalseg_envios_v25"),u([])}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Auditoria Avançada"}),n.jsx("button",{onClick:d,children:"Limpar histórico"}),n.jsxs("div",{style:{marginTop:20},children:[l.length===0&&n.jsx("div",{children:"Nenhum registro"}),l.slice(0,20).map(k=>n.jsxs("div",{style:{borderBottom:"1px solid #ddd",padding:10},children:[n.jsx("strong",{children:k.cliente})," - ",k.canal," - R$ ",k.valor," ",n.jsx("br",{}),n.jsx("small",{children:k.data})]},k.id))]})]})}function yf(){const[l,u]=oe.useState(""),[d,k]=oe.useState([]);oe.useEffect(()=>{const N=localStorage.getItem("ytalseg_user_v20")||"default";u(N);try{const _=JSON.parse(localStorage.getItem("ytalseg_envios_v25_"+N)||"[]");k(_)}catch{}},[]);function p(){const _=[{id:Date.now(),cliente:"Teste "+l,valor:Math.floor(Math.random()*1e3)},...d];k(_),localStorage.setItem("ytalseg_envios_v25_"+l,JSON.stringify(_))}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Multiusuário"}),n.jsxs("div",{children:["Usuário atual: ",l]}),n.jsx("button",{onClick:p,children:"Gerar dado usuário"}),n.jsx("pre",{style:{marginTop:20},children:JSON.stringify(d.slice(0,5),null,2)})]})}function bf({perfil:l}){const d={admin:["tudo"],operador:["envio","dashboard","auditoria"],financeiro:["financeiro","dashboard"],consulta:["dashboard"]}[l]||[];return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Controle de Acesso"}),n.jsxs("div",{children:["Perfil atual: ",l]}),n.jsxs("pre",{style:{marginTop:20},children:["Permissões: ",JSON.stringify(d,null,2)]})]})}function wf(){try{const u=JSON.parse(localStorage.getItem("ytalseg_users_v33")||"[]");if(Array.isArray(u)&&u.length>0)return u}catch{}const l=[{id:1,user:"admin",senha:"123",perfil:"admin",ativo:!0},{id:2,user:"operador",senha:"123",perfil:"operador",ativo:!0},{id:3,user:"financeiro",senha:"123",perfil:"financeiro",ativo:!0},{id:4,user:"consulta",senha:"123",perfil:"consulta",ativo:!0}];return localStorage.setItem("ytalseg_users_v33",JSON.stringify(l)),l}function jf(){const[l,u]=oe.useState([]);oe.useEffect(()=>{try{const _=JSON.parse(localStorage.getItem("ytalseg_users_v33")||"[]");u(_)}catch{}},[]);function d(_){u(_),localStorage.setItem("ytalseg_users_v33",JSON.stringify(_))}function k(){const _={id:Date.now(),user:"novo",senha:"123",perfil:"consulta",ativo:!0};d([_,...l])}function p(_,g,C){const z=l.map((E,b)=>b===_?{...E,[g]:C}:E);d(z)}function N(_){const g=l.filter((C,z)=>z!==_);d(g)}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Gestão de Usuários"}),n.jsx("button",{onClick:k,children:"Adicionar usuário"}),n.jsx("button",{onClick:()=>d(wf()),style:{marginLeft:8},children:"Inicializar usuários padrão"}),l.map((_,g)=>n.jsxs("div",{style:{border:"1px solid #ddd",padding:10,marginTop:10},children:[n.jsx("input",{value:_.user,onChange:C=>p(g,"user",C.target.value)}),n.jsx("input",{value:_.senha,onChange:C=>p(g,"senha",C.target.value)}),n.jsxs("select",{value:_.perfil,onChange:C=>p(g,"perfil",C.target.value),children:[n.jsx("option",{children:"admin"}),n.jsx("option",{children:"operador"}),n.jsx("option",{children:"financeiro"}),n.jsx("option",{children:"consulta"})]}),n.jsxs("label",{children:["Ativo",n.jsx("input",{type:"checkbox",checked:_.ativo,onChange:C=>p(g,"ativo",C.target.checked)})]}),n.jsx("button",{onClick:()=>N(g),children:"Excluir"})]},_.id))]})}function Nf(){const[l,u]=oe.useState([]);return oe.useEffect(()=>{try{const k=JSON.parse(localStorage.getItem("ytalseg_envios_v25")||"[]").slice(0,10).map(p=>({id:p.id,texto:`Envio realizado para ${p.cliente}`,data:p.criadoEm}));u(k)}catch{}},[]),n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Notificações"}),l.length===0&&n.jsx("div",{children:"Nenhuma notificação"}),l.map(d=>n.jsxs("div",{style:{borderBottom:"1px solid #ddd",padding:10},children:[n.jsx("strong",{children:d.texto}),n.jsx("div",{style:{fontSize:12},children:d.data})]},d.id))]})}function Sf(){var c;const l=["ytalseg_relatorios_versoes_v11_2","ytalseg_pacotes_cliente_v11_6","ytalseg_config_v11_7","ytalseg_users_v33","ytalseg_envios_v25","ytalseg_auditoria_v18","ytalseg_notificacoes_v19","ytalseg_auto_backup_v22"],[u,d]=oe.useState(""),[k,p]=oe.useState(""),[N,_]=oe.useState({chaves:0,registros:0});function g(){const h={};return l.forEach(m=>{const L=localStorage.getItem(m);if(L!==null)try{h[m]=JSON.parse(L)}catch{h[m]=L}}),h}function C(h){!h||typeof h!="object"||Object.keys(h).forEach(m=>{l.includes(m)&&localStorage.setItem(m,JSON.stringify(h[m]))})}function z(h){const m=Object.keys(h||{}).length,L=Object.values(h||{}).reduce((T,H)=>Array.isArray(H)?T+H.length:H&&typeof H=="object"?T+Object.keys(H).length:T+1,0);_({chaves:m,registros:L})}async function E(){try{const h=window.ytalsegAPI;if(!(h!=null&&h.salvarDados)){d("Persistência Electron disponível apenas no app instalado.");return}const m=g(),L=await h.salvarDados({dados:m});L.ok?(d("Dados salvos fora do navegador com sucesso."),p(L.path||""),z(m)):d(L.erro||"Não foi possível salvar.")}catch{d("Erro ao salvar dados.")}}async function b(){try{const h=window.ytalsegAPI;if(!(h!=null&&h.carregarDados)){d("Persistência Electron disponível apenas no app instalado.");return}const m=await h.carregarDados();m.ok?(C(m.dados||{}),z(m.dados||{}),p(m.path||""),d("Dados carregados do banco local Electron. Recarregue a tela se necessário.")):d(m.erro||"Não foi possível carregar.")}catch{d("Erro ao carregar dados.")}}async function x(){try{const h=window.ytalsegAPI;if(!(h!=null&&h.backupDados)){d("Backup Electron disponível apenas no app instalado.");return}const m=await h.backupDados();m.ok?(d("Backup exportado com sucesso."),p(m.path||"")):m.erro!=="cancelado"&&d(m.erro||"Não foi possível exportar backup.")}catch{d("Erro ao exportar backup.")}}async function v(){try{const h=window.ytalsegAPI;if(!(h!=null&&h.importarBackupDados)){d("Importação Electron disponível apenas no app instalado.");return}const m=await h.importarBackupDados();m.ok?(C(m.dados||{}),z(m.dados||{}),d("Backup importado com sucesso. Recarregue a tela se necessário."),p(m.path||"")):m.erro!=="cancelado"&&d(m.erro||"Não foi possível importar backup.")}catch{d("Erro ao importar backup.")}}return oe.useEffect(()=>{z(g())},[]),n.jsxs("div",{className:"persist-v36",children:[n.jsx("style",{children:`
        .persist-v36 { display: grid; gap: 16px; }
        .persist-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .persist-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .persist-box, .persist-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .persist-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .persist-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .persist-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; word-break: break-word; }
        .persist-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
        .persist-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .persist-btn-green { background: #00B050; color: white; }
        .persist-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .persist-path { color: #374151; font-weight: 800; word-break: break-all; font-size: 13px; }
        @media (max-width: 900px) { .persist-cards { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{className:"persist-head",children:[n.jsx("h1",{children:"Persistência Real Electron"}),n.jsx("p",{children:"Salva os dados fora do navegador em arquivo JSON dentro do app."})]}),u&&n.jsx("div",{className:"persist-status",children:u}),n.jsxs("div",{className:"persist-cards",children:[n.jsxs("div",{className:"persist-card",children:[n.jsx("span",{children:"Bases monitoradas"}),n.jsx("strong",{children:N.chaves})]}),n.jsxs("div",{className:"persist-card",children:[n.jsx("span",{children:"Registros estimados"}),n.jsx("strong",{children:N.registros})]}),n.jsxs("div",{className:"persist-card",children:[n.jsx("span",{children:"Status"}),n.jsx("strong",{children:(c=window.ytalsegAPI)!=null&&c.salvarDados?"Electron OK":"Web"})]})]}),n.jsxs("div",{className:"persist-box",children:[n.jsx("h3",{style:{marginTop:0},children:"Ações do banco real"}),n.jsxs("div",{className:"persist-actions",children:[n.jsx("button",{className:"persist-btn persist-btn-green",onClick:E,children:"Salvar no Electron"}),n.jsx("button",{className:"persist-btn persist-btn-green",onClick:b,children:"Carregar do Electron"}),n.jsx("button",{className:"persist-btn",onClick:x,children:"Exportar backup"}),n.jsx("button",{className:"persist-btn",onClick:v,children:"Importar backup"})]}),k&&n.jsxs("div",{style:{marginTop:14},children:[n.jsx("strong",{children:"Caminho:"}),n.jsx("div",{className:"persist-path",children:k})]})]})]})}function kf(){const[l,u]=oe.useState([]),[d,k]=oe.useState("");function p(x){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(x||0))}function N(x,v){try{const c=localStorage.getItem(x);return c?JSON.parse(c):v}catch{return v}}function _(){const x=[],v=N("ytalseg_pacotes_cliente_v11_6",[]),c=N("ytalseg_relatorios_versoes_v11_2",[]),h=N("ytalseg_envios_v25",[]),m=N("ytalseg_users_v33",[]);if(Array.isArray(v)&&v.forEach(L=>{L.pdfCliente||x.push({id:`pacote-pdf-${L.id}`,nivel:"alto",origem:"Pacote Cliente",titulo:"Pacote sem PDF do cliente",descricao:`${L.cliente||"Cliente"} está com PDF pendente.`,valor:L.valor||0}),L.notaFiscal||x.push({id:`pacote-nf-${L.id}`,nivel:"medio",origem:"Pacote Cliente",titulo:"Nota fiscal pendente",descricao:`${L.cliente||"Cliente"} ainda não possui nota fiscal marcada.`,valor:L.valor||0}),L.comprovante||x.push({id:`pacote-comp-${L.id}`,nivel:"medio",origem:"Pacote Cliente",titulo:"Comprovante pendente",descricao:`${L.cliente||"Cliente"} ainda não possui comprovante marcado.`,valor:L.valor||0}),(L.status||"").toLowerCase()!=="concluído"&&(L.status||"").toLowerCase()!=="concluido"&&x.push({id:`pacote-status-${L.id}`,nivel:"baixo",origem:"Pacote Cliente",titulo:"Pacote não concluído",descricao:`${L.cliente||"Cliente"} está com status: ${L.status||"Pendente"}.`,valor:L.valor||0})}),Array.isArray(c)&&c.forEach(L=>{const T=(L.status||"Rascunho").toLowerCase();T!=="pago"&&T!=="concluído"&&T!=="concluido"&&x.push({id:`rel-status-${L.id}`,nivel:T==="cobrado"?"alto":"medio",origem:"Relatórios",titulo:"Relatório com pendência",descricao:`${L.cliente||"Cliente"} está com status: ${L.status||"Rascunho"}.`,valor:L.valor||0})}),Array.isArray(h)&&h.length===0&&x.push({id:"envios-zero",nivel:"baixo",origem:"Envios",titulo:"Nenhum envio registrado",descricao:"Ainda não existe envio registrado no sistema.",valor:0}),Array.isArray(m)){const L=m.filter(H=>H.ativo===!1);L.length>0&&x.push({id:"usuarios-inativos",nivel:"baixo",origem:"Usuários",titulo:"Usuários inativos",descricao:`${L.length} usuário(s) inativo(s) no sistema.`,valor:0}),!m.some(H=>H.perfil==="admin"&&H.ativo!==!1)&&x.push({id:"sem-admin",nivel:"alto",origem:"Usuários",titulo:"Nenhum admin ativo",descricao:"Atenção: não existe usuário admin ativo cadastrado.",valor:0})}u(x),localStorage.setItem("ytalseg_alertas_v37",JSON.stringify(x)),k(`Alertas atualizados: ${x.length}`)}oe.useEffect(()=>{const x=N("ytalseg_alertas_v37",[]);Array.isArray(x)&&x.length>0?u(x):_()},[]);const g=l.reduce((x,v)=>x+Number(v.valor||0),0),C=l.filter(x=>x.nivel==="alto").length,z=l.filter(x=>x.nivel==="medio").length;function E(x){return x==="alto"?"#fee2e2":x==="medio"?"#fff7ed":"#eff6ff"}function b(x){return x==="alto"?"#991b1b":x==="medio"?"#9a3412":"#1d4ed8"}return n.jsxs("div",{className:"alertas-v37",children:[n.jsx("style",{children:`
        .alertas-v37 { display: grid; gap: 16px; }
        .alertas-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .alertas-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .alertas-box, .alertas-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .alertas-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .alertas-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .alertas-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; }
        .alertas-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .alertas-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .alertas-btn-green { background: #00B050; color: white; }
        .alertas-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .alerta-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; display: grid; grid-template-columns: .8fr 1fr 2fr .8fr; gap: 12px; align-items: center; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .alerta-badge { display: inline-flex; justify-content: center; padding: 7px 10px; border-radius: 999px; font-size: 12px; font-weight: 1000; }
        .alerta-title { font-weight: 1000; color: #111827; }
        .alerta-desc { color: #374151; font-weight: 800; font-size: 13px; }
        @media (max-width: 1000px) { .alertas-cards { grid-template-columns: 1fr 1fr; } .alerta-item { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .alertas-cards { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{className:"alertas-head",children:[n.jsx("h1",{children:"Alertas Inteligentes"}),n.jsx("p",{children:"Verificação automática de pacotes, relatórios, usuários e envios."})]}),d&&n.jsx("div",{className:"alertas-status",children:d}),n.jsxs("div",{className:"alertas-cards",children:[n.jsxs("div",{className:"alertas-card",children:[n.jsx("span",{children:"Total"}),n.jsx("strong",{children:l.length})]}),n.jsxs("div",{className:"alertas-card",children:[n.jsx("span",{children:"Altos"}),n.jsx("strong",{children:C})]}),n.jsxs("div",{className:"alertas-card",children:[n.jsx("span",{children:"Médios"}),n.jsx("strong",{children:z})]}),n.jsxs("div",{className:"alertas-card",children:[n.jsx("span",{children:"Valor envolvido"}),n.jsx("strong",{children:p(g)})]})]}),n.jsx("div",{className:"alertas-box",children:n.jsxs("div",{className:"alertas-actions",children:[n.jsx("button",{className:"alertas-btn alertas-btn-green",onClick:_,children:"Atualizar alertas"}),n.jsx("button",{className:"alertas-btn",onClick:()=>{u([]),localStorage.removeItem("ytalseg_alertas_v37"),k("Alertas limpos.")},children:"Limpar alertas"})]})}),n.jsxs("div",{style:{display:"grid",gap:10},children:[l.length===0&&n.jsx("div",{className:"alertas-box",children:"Nenhum alerta encontrado. Tudo certo por aqui."}),l.map(x=>n.jsxs("div",{className:"alerta-item",children:[n.jsx("div",{children:n.jsx("span",{className:"alerta-badge",style:{background:E(x.nivel),color:b(x.nivel)},children:String(x.nivel).toUpperCase()})}),n.jsx("div",{className:"alerta-title",children:x.origem}),n.jsxs("div",{children:[n.jsx("div",{className:"alerta-title",children:x.titulo}),n.jsx("div",{className:"alerta-desc",children:x.descricao})]}),n.jsx("div",{children:p(x.valor)})]},x.id))]})]})}function Cf(){const[l,u]=oe.useState({alertas:0,usuarios:0,envios:0});return oe.useEffect(()=>{try{const d=JSON.parse(localStorage.getItem("ytalseg_alertas_v37")||"[]"),k=JSON.parse(localStorage.getItem("ytalseg_users_v33")||"[]"),p=JSON.parse(localStorage.getItem("ytalseg_envios_v25")||"[]");u({alertas:d.length,usuarios:k.length,envios:p.length})}catch{}},[]),n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Central de Monitoramento"}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10},children:[n.jsx(Dl,{titulo:"Alertas",valor:l.alertas}),n.jsx(Dl,{titulo:"Usuários",valor:l.usuarios}),n.jsx(Dl,{titulo:"Envios",valor:l.envios})]})]})}function Dl({titulo:l,valor:u}){return n.jsxs("div",{style:{background:"#fff",padding:20,border:"1px solid #ddd",borderRadius:12},children:[n.jsx("span",{children:l}),n.jsx("h2",{children:u})]})}function Ef(){const[l,u]=oe.useState({envios:0,usuarios:0,alertas:0});return oe.useEffect(()=>{try{const d=JSON.parse(localStorage.getItem("ytalseg_envios_v25")||"[]"),k=JSON.parse(localStorage.getItem("ytalseg_users_v33")||"[]"),p=JSON.parse(localStorage.getItem("ytalseg_alertas_v37")||"[]");u({envios:d.length,usuarios:k.length,alertas:p.length})}catch{}},[]),n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Dashboard PRO"}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10},children:[n.jsx(Ll,{titulo:"Envios",valor:l.envios}),n.jsx(Ll,{titulo:"Usuários",valor:l.usuarios}),n.jsx(Ll,{titulo:"Alertas",valor:l.alertas})]}),n.jsxs("div",{style:{marginTop:20,background:"#fff",padding:20,border:"1px solid #ddd",borderRadius:12},children:[n.jsx("h3",{children:"Resumo"}),n.jsxs("p",{children:["Sistema em operação com ",l.envios," envios, ",l.usuarios," usuários e ",l.alertas," alertas."]})]})]})}function Ll({titulo:l,valor:u}){return n.jsxs("div",{style:{background:"#fff",padding:20,border:"1px solid #ddd",borderRadius:12},children:[n.jsx("span",{children:l}),n.jsx("h2",{children:u})]})}function _f(){const[l,u]=oe.useState([]),[d,k]=oe.useState("");function p(c,h){try{const m=localStorage.getItem(c);return m?JSON.parse(m):h}catch{return h}}function N(c){if(!c)return"-";try{return new Date(c).toLocaleString("pt-BR")}catch{return String(c)}}function _(){const c=[],h=p("ytalseg_envios_v25",[]),m=p("ytalseg_users_v33",[]),L=p("ytalseg_alertas_v37",[]),T=p("ytalseg_pacotes_cliente_v11_6",[]),H=p("ytalseg_relatorios_versoes_v11_2",[]);Array.isArray(h)&&h.forEach(M=>{c.push({id:`envio-${M.id||Math.random()}`,tipo:"Envio",usuario:M.usuario||"sistema",acao:`Envio via ${M.canal||"canal não informado"}`,detalhe:`${M.cliente||"Cliente"} • ${M.valor?new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(M.valor||0)):"sem valor"}`,data:M.criadoEm||new Date().toISOString()})}),Array.isArray(m)&&m.forEach(M=>{c.push({id:`usuario-${M.id||M.user}`,tipo:"Usuário",usuario:M.user||"-",acao:M.ativo===!1?"Usuário inativo":"Usuário ativo",detalhe:`Perfil: ${M.perfil||"consulta"}`,data:new Date().toISOString()})}),Array.isArray(L)&&L.forEach(M=>{c.push({id:`alerta-${M.id||Math.random()}`,tipo:"Alerta",usuario:"sistema",acao:`${String(M.nivel||"baixo").toUpperCase()} • ${M.titulo||"Alerta"}`,detalhe:`${M.origem||"-"} • ${M.descricao||"-"}`,data:new Date().toISOString()})}),Array.isArray(T)&&T.forEach(M=>{c.push({id:`pacote-${M.id||Math.random()}`,tipo:"Pacote",usuario:"sistema",acao:`Status: ${M.status||"Pendente"}`,detalhe:`${M.cliente||"Cliente"} • PDF: ${M.pdfCliente?"OK":"Pendente"} • NF: ${M.notaFiscal?"OK":"Pendente"} • Comprovante: ${M.comprovante?"OK":"Pendente"}`,data:M.criadoEm||new Date().toISOString()})}),Array.isArray(H)&&H.forEach(M=>{c.push({id:`relatorio-${M.id||Math.random()}`,tipo:"Relatório",usuario:"sistema",acao:`Status: ${M.status||"Rascunho"}`,detalhe:`${M.cliente||"Cliente"} • ${M.tipo||"-"} • ${M.valor?new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(M.valor||0)):"sem valor"}`,data:M.criadoEm||new Date().toISOString()})});const j=c.sort((M,F)=>String(F.data).localeCompare(String(M.data))).slice(0,300);u(j),localStorage.setItem("ytalseg_logs_v40",JSON.stringify(j)),k(`Logs atualizados: ${j.length}`)}function g(){const c=window.prompt("Descreva a ação para registrar no log:");if(!c)return;const h=p("ytalseg_auth",{}),L=[{id:`manual-${Date.now()}`,tipo:"Manual",usuario:h.user||"usuário",acao:c,detalhe:"Registro manual",data:new Date().toISOString()},...l].slice(0,300);u(L),localStorage.setItem("ytalseg_logs_v40",JSON.stringify(L)),k("Log manual registrado.")}function C(){const c=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),h=URL.createObjectURL(c),m=document.createElement("a");m.href=h,m.download=`ytalseg_logs_v40_${Date.now()}.json`,m.click(),URL.revokeObjectURL(h),k("Logs exportados.")}function z(){window.confirm("Deseja limpar os logs V40?")&&(u([]),localStorage.removeItem("ytalseg_logs_v40"),k("Logs limpos."))}oe.useEffect(()=>{const c=p("ytalseg_logs_v40",[]);Array.isArray(c)&&c.length>0?u(c):_()},[]);const E=l.length,b=l.filter(c=>c.tipo==="Envio").length,x=l.filter(c=>c.tipo==="Alerta").length,v=l.filter(c=>c.tipo==="Manual").length;return n.jsxs("div",{className:"logs-v40",children:[n.jsx("style",{children:`
        .logs-v40 { display: grid; gap: 16px; }
        .logs-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .logs-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .logs-box, .logs-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .logs-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .logs-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .logs-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; }
        .logs-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .logs-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .logs-btn-green { background: #00B050; color: white; }
        .logs-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .log-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 14px; display: grid; grid-template-columns: .8fr 1fr 1.4fr 2fr 1fr; gap: 12px; align-items: center; box-shadow: 0 8px 18px rgba(0,0,0,.04); font-size: 13px; }
        .log-badge { display: inline-flex; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 1000; }
        .log-main { font-weight: 1000; color: #111827; }
        .log-detail { color: #374151; font-weight: 800; }
        @media (max-width: 1000px) { .logs-cards { grid-template-columns: 1fr 1fr; } .log-item { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .logs-cards { grid-template-columns: 1fr; } }
      `}),n.jsxs("div",{className:"logs-head",children:[n.jsx("h1",{children:"Logs do Sistema"}),n.jsx("p",{children:"Rastreamento de ações, envios, pacotes, usuários, relatórios e alertas."})]}),d&&n.jsx("div",{className:"logs-status",children:d}),n.jsxs("div",{className:"logs-cards",children:[n.jsxs("div",{className:"logs-card",children:[n.jsx("span",{children:"Total"}),n.jsx("strong",{children:E})]}),n.jsxs("div",{className:"logs-card",children:[n.jsx("span",{children:"Envios"}),n.jsx("strong",{children:b})]}),n.jsxs("div",{className:"logs-card",children:[n.jsx("span",{children:"Alertas"}),n.jsx("strong",{children:x})]}),n.jsxs("div",{className:"logs-card",children:[n.jsx("span",{children:"Manuais"}),n.jsx("strong",{children:v})]})]}),n.jsx("div",{className:"logs-box",children:n.jsxs("div",{className:"logs-actions",children:[n.jsx("button",{className:"logs-btn logs-btn-green",onClick:_,children:"Atualizar logs"}),n.jsx("button",{className:"logs-btn",onClick:g,children:"Registrar manual"}),n.jsx("button",{className:"logs-btn",onClick:C,children:"Exportar JSON"}),n.jsx("button",{className:"logs-btn",onClick:z,children:"Limpar logs"})]})}),n.jsxs("div",{style:{display:"grid",gap:10},children:[l.length===0&&n.jsx("div",{className:"logs-box",children:"Nenhum log encontrado."}),l.map(c=>n.jsxs("div",{className:"log-item",children:[n.jsx("div",{children:n.jsx("span",{className:"log-badge",children:c.tipo})}),n.jsx("div",{className:"log-main",children:c.usuario}),n.jsx("div",{className:"log-main",children:c.acao}),n.jsx("div",{className:"log-detail",children:c.detalhe}),n.jsx("div",{children:N(c.data)})]},c.id))]})]})}function zf(){const[l,u]=oe.useState("");function d(){try{const p={};Object.keys(localStorage).forEach(C=>{p[C]=localStorage.getItem(C)});const N=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),_=URL.createObjectURL(N),g=document.createElement("a");g.href=_,g.download="backup_ytalseg_auto.json",g.click(),URL.revokeObjectURL(_),u("Backup gerado com sucesso")}catch{u("Erro ao gerar backup")}}function k(p){const N=p.target.files[0];if(!N)return;const _=new FileReader;_.onload=function(g){try{const C=JSON.parse(g.target.result);Object.keys(C).forEach(z=>{localStorage.setItem(z,C[z])}),u("Backup restaurado com sucesso")}catch{u("Erro ao restaurar backup")}},_.readAsText(N)}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Backup Automático"}),n.jsx("button",{onClick:d,children:"Gerar Backup"}),n.jsx("input",{type:"file",onChange:k}),n.jsx("div",{children:l})]})}function Pf(){const[l,u]=oe.useState(""),[d,k]=oe.useState(""),[p,N]=oe.useState(""),[_,g]=oe.useState(null);oe.useEffect(()=>{try{const b=JSON.parse(localStorage.getItem("ytalseg_api_real_v46")||"{}");u(b.url||""),k(b.token||"")}catch{}},[]);function C(){const b={url:l.trim(),token:d.trim(),atualizadoEm:new Date().toISOString()};localStorage.setItem("ytalseg_api_real_v46",JSON.stringify(b)),N("Configuração da API salva."),g(b)}async function z(){try{if(!l.trim()){N("Informe a URL da API.");return}const b={origem:"YTALSEG",teste:!0,data:new Date().toISOString()};localStorage.setItem("ytalseg_api_real_teste_v46",JSON.stringify(b)),N("Teste preparado. API real será conectada quando o endpoint estiver disponível."),g(b)}catch{N("Erro ao testar integração.")}}function E(){try{const b={};Object.keys(localStorage).forEach(v=>{b[v]=localStorage.getItem(v)});const x={criadoEm:new Date().toISOString(),url:l,temToken:!!d,dados:b};localStorage.setItem("ytalseg_api_payload_v46",JSON.stringify(x)),N("Payload completo preparado para envio à API."),g({criadoEm:x.criadoEm,chaves:Object.keys(b).length})}catch{N("Erro ao preparar payload.")}}return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Integração API Real"}),n.jsx("p",{children:"Base segura para conectar o ERP YTALSEG em Firebase, Supabase ou backend próprio."}),n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16,display:"grid",gap:10,maxWidth:760},children:[n.jsx("label",{style:{fontWeight:900},children:"URL da API"}),n.jsx("input",{value:l,onChange:b=>u(b.target.value),placeholder:"https://sua-api.com",style:{padding:10,border:"1px solid #ccc",borderRadius:8}}),n.jsx("label",{style:{fontWeight:900},children:"Token / chave"}),n.jsx("input",{value:d,onChange:b=>k(b.target.value),placeholder:"opcional",style:{padding:10,border:"1px solid #ccc",borderRadius:8}}),n.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginTop:8},children:[n.jsx("button",{onClick:C,children:"Salvar configuração"}),n.jsx("button",{onClick:z,children:"Testar base"}),n.jsx("button",{onClick:E,children:"Preparar payload"})]})]}),n.jsxs("div",{style:{marginTop:20,background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"Status:"}),n.jsx("div",{children:p||"Aguardando configuração."}),_&&n.jsx("pre",{style:{whiteSpace:"pre-wrap",marginTop:10,maxHeight:220,overflow:"auto"},children:JSON.stringify(_,null,2)})]})]})}function Rf(){const[l,u]=oe.useState([]),[d,k]=oe.useState("");function p(){const g=[];function C(E,b){g.push({nome:E,estado:"OK",detalhe:b})}function z(E,b){g.push({nome:E,estado:"ALERTA",detalhe:b})}try{const E=JSON.parse(localStorage.getItem("ytalseg_users_v33")||"[]");Array.isArray(E)&&E.length>0?C("Usuários",`${E.length} usuário(s) cadastrado(s)`):z("Usuários","Nenhum usuário cadastrado")}catch{z("Usuários","Base de usuários inválida")}try{const E=JSON.parse(localStorage.getItem("ytalseg_auth")||"{}");E.user?C("Sessão",`Logado como ${E.user}`):z("Sessão","Sessão não encontrada")}catch{z("Sessão","Sessão inválida")}try{const E=JSON.parse(localStorage.getItem("ytalseg_logs_v40")||"[]");Array.isArray(E)?C("Logs",`${E.length} registro(s)`):z("Logs","Formato inválido")}catch{z("Logs","Erro lendo logs")}try{const E=JSON.parse(localStorage.getItem("ytalseg_alertas_v37")||"[]");Array.isArray(E)?C("Alertas",`${E.length} alerta(s)`):z("Alertas","Formato inválido")}catch{z("Alertas","Erro lendo alertas")}try{const E=JSON.parse(localStorage.getItem("ytalseg_api_real_v46")||"{}");E.url?C("API Real",`URL configurada: ${E.url}`):z("API Real","URL da API não configurada")}catch{z("API Real","Configuração da API inválida")}try{window.ytalsegAPI?C("Electron API","Bridge ytalsegAPI disponível"):z("Electron API","Rodando sem bridge Electron")}catch{z("Electron API","Erro verificando bridge Electron")}u(g),k(`Diagnóstico concluído: ${g.length} verificações`),localStorage.setItem("ytalseg_diagnostico_v47",JSON.stringify({criadoEm:new Date().toISOString(),testes:g}))}oe.useEffect(()=>{p()},[]);const N=l.filter(g=>g.estado==="OK").length,_=l.filter(g=>g.estado!=="OK").length;return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Diagnóstico do Sistema"}),n.jsx("p",{children:"Verificação rápida de usuários, sessão, logs, alertas, API e Electron."}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:"15px 0"},children:[n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"Total"}),n.jsx("h2",{children:l.length})]}),n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"OK"}),n.jsx("h2",{style:{color:"#00B050"},children:N})]}),n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"Alertas"}),n.jsx("h2",{style:{color:"#b45309"},children:_})]})]}),n.jsx("button",{onClick:p,children:"Executar diagnóstico"}),n.jsx("div",{style:{marginTop:15,fontWeight:900},children:d}),n.jsx("div",{style:{display:"grid",gap:10,marginTop:15},children:l.map((g,C)=>n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:14},children:[n.jsxs("strong",{children:[g.estado==="OK"?"✅":"⚠️"," ",g.nome]}),n.jsx("div",{children:g.detalhe})]},C))})]})}function Af(){const[l,u]=oe.useState({memoria:0,itens:0}),[d,k]=oe.useState("");function p(){try{let N=0,_=0;Object.keys(localStorage).forEach(g=>{const C=localStorage.getItem(g)||"";N+=C.length,_++}),u({memoria:N,itens:_}),k("Análise de performance concluída")}catch{k("Erro na análise")}}return oe.useEffect(()=>{p()},[]),n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Performance do Sistema"}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10},children:[n.jsxs("div",{style:{background:"#fff",padding:15,border:"1px solid #ddd",borderRadius:12},children:[n.jsx("strong",{children:"Uso memória (bytes)"}),n.jsx("h2",{children:l.memoria})]}),n.jsxs("div",{style:{background:"#fff",padding:15,border:"1px solid #ddd",borderRadius:12},children:[n.jsx("strong",{children:"Total itens"}),n.jsx("h2",{children:l.itens})]})]}),n.jsx("button",{onClick:p,style:{marginTop:15},children:"Reanalisar"}),n.jsx("div",{style:{marginTop:10},children:d})]})}function Of(){const[l,u]=oe.useState(""),[d,k]=oe.useState([]),p=["ytalseg_user_v20","ytalseg_auth","ytalseg_users_v33","ytalseg_relatorios_versoes_v11_2","ytalseg_pacotes_cliente_v11_6","ytalseg_envios_v25","ytalseg_logs_v40","ytalseg_alertas_v37","ytalseg_api_real_v46"];function N(){const b=[];try{Object.keys(localStorage).forEach(x=>{const v=localStorage.getItem(x)||"",c=p.includes(x),h=v===""||v==="[]"||v==="{}"||v==="null",m=x.includes("teste")||x.includes("temp")||x.includes("rascunho_old");b.push({chave:x,tamanho:v.length,protegido:c,podeLimpar:!c&&(h||m),motivo:c?"Protegido":h?"Vazio":m?"Temporário":"Manter"})}),k(b),u(`Análise concluída: ${b.length} chave(s) verificadas.`)}catch{u("Erro ao analisar limpeza.")}}function _(){try{const b=d.filter(x=>x.podeLimpar).map(x=>x.chave);b.forEach(x=>localStorage.removeItem(x)),u(`Limpeza concluída: ${b.length} item(ns) removido(s).`),N()}catch{u("Erro ao executar limpeza.")}}function g(){const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),x=URL.createObjectURL(b),v=document.createElement("a");v.href=x,v.download=`ytalseg_limpeza_v49_${Date.now()}.json`,v.click(),URL.revokeObjectURL(x),u("Relatório de limpeza exportado.")}oe.useEffect(()=>{N()},[]);const C=d.filter(b=>b.podeLimpar).length,z=d.filter(b=>b.protegido).length,E=d.reduce((b,x)=>b+Number(x.tamanho||0),0);return n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Limpeza Inteligente"}),n.jsx("p",{children:"Remove apenas itens seguros, vazios ou temporários. Dados importantes ficam protegidos."}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:"15px 0"},children:[n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"Total chaves"}),n.jsx("h2",{children:d.length})]}),n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"Podem limpar"}),n.jsx("h2",{children:C})]}),n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16},children:[n.jsx("strong",{children:"Protegidos"}),n.jsx("h2",{children:z})]})]}),n.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:15},children:[n.jsx("button",{onClick:N,children:"Analisar"}),n.jsx("button",{onClick:_,children:"Limpar seguro"}),n.jsx("button",{onClick:g,children:"Exportar relatório"})]}),n.jsx("div",{style:{fontWeight:900,marginBottom:10},children:l}),n.jsxs("div",{style:{fontSize:12,marginBottom:15},children:["Uso estimado: ",E," bytes"]}),n.jsx("div",{style:{display:"grid",gap:8},children:d.map(b=>n.jsxs("div",{style:{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:12,display:"grid",gridTemplateColumns:"2fr .7fr .8fr 1fr",gap:10,alignItems:"center"},children:[n.jsx("strong",{children:b.chave}),n.jsxs("span",{children:[b.tamanho," bytes"]}),n.jsx("span",{children:b.protegido?"🔒 Protegido":b.podeLimpar?"🧹 Limpar":"✅ Manter"}),n.jsx("span",{children:b.motivo})]},b.chave))})]})}function If(){const[l,u]=oe.useState([]),[d,k]=oe.useState("");function p(){try{const N=[];Object.keys(localStorage).forEach(_=>{const g=localStorage.getItem(_);N.push({chave:_,tamanho:g?g.length:0,atualizadoEm:new Date().toISOString()})}),u(N),localStorage.setItem("ytalseg_auditoria_v50",JSON.stringify(N)),k("Auditoria gerada com sucesso")}catch{k("Erro na auditoria")}}return oe.useEffect(()=>{p()},[]),n.jsxs("div",{style:{padding:20},children:[n.jsx("h1",{children:"Auditoria Avançada"}),n.jsx("button",{onClick:p,children:"Gerar auditoria"}),n.jsx("div",{style:{marginTop:10},children:d}),n.jsx("div",{style:{marginTop:15,display:"grid",gap:8},children:l.map((N,_)=>n.jsxs("div",{style:{background:"#fff",padding:10,border:"1px solid #ddd",borderRadius:8},children:[n.jsx("strong",{children:N.chave}),n.jsxs("div",{children:[N.tamanho," bytes"]})]},_))})]})}sm.createRoot(document.getElementById("root")).render(n.jsx(oe.StrictMode,{children:n.jsx(ff,{})}));
