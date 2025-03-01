import{E as m,P as g,b as _}from"./index-2LAPr6Kq.js";var A=function(){var s=function(o,e){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(n[t]=r[t])},s(o,e)};return function(o,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");s(o,e);function n(){this.constructor=o}o.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}}(),x=function(s){A(o,s);function o(){return s!==null&&s.apply(this,arguments)||this}return o}(m),f=function(s,o,e,n){function r(t){return t instanceof e?t:new e(function(a){a(t)})}return new(e||(e=Promise))(function(t,a){function u(c){try{i(n.next(c))}catch(d){a(d)}}function l(c){try{i(n.throw(c))}catch(d){a(d)}}function i(c){c.done?t(c.value):r(c.value).then(u,l)}i((n=n.apply(s,o||[])).next())})};class j extends m{constructor(o,e){if(super(),this._network=e,this._publicKey=null,this._popup=null,this._handlerAdded=!1,this._nextRequestId=1,this._autoApprove=!1,this._responsePromises=new Map,this.handleMessage=n=>{var r;if(this._injectedProvider&&n.source===window||n.origin===((r=this._providerUrl)===null||r===void 0?void 0:r.origin)&&n.source===this._popup){if(n.data.method==="connected"){const t=new g(n.data.params.publicKey);(!this._publicKey||!this._publicKey.equals(t))&&(this._publicKey&&!this._publicKey.equals(t)&&this.handleDisconnect(),this._publicKey=t,this._autoApprove=!!n.data.params.autoApprove,this.emit("connect",this._publicKey))}else if(n.data.method==="disconnected")this.handleDisconnect();else if(n.data.result||n.data.error){const t=this._responsePromises.get(n.data.id);if(t){const[a,u]=t;n.data.result?a(n.data.result):u(new Error(n.data.error))}}}},this._beforeUnload=()=>{this.disconnect()},O(o))this._injectedProvider=o;else if(E(o))this._providerUrl=new URL(o),this._providerUrl.hash=new URLSearchParams({origin:window.location.origin,network:this._network}).toString();else throw new Error("provider parameter must be an injected provider or a URL string.")}handleConnect(){var o;return this._handlerAdded||(this._handlerAdded=!0,window.addEventListener("message",this.handleMessage),window.addEventListener("beforeunload",this._beforeUnload)),this._injectedProvider?new Promise(e=>{this.sendRequest("connect",{}),e()}):(window.name="parent",this._popup=window.open((o=this._providerUrl)===null||o===void 0?void 0:o.toString(),"_blank","location,resizable,width=460,height=675"),new Promise(e=>{this.once("connect",e)}))}handleDisconnect(){this._handlerAdded&&(this._handlerAdded=!1,window.removeEventListener("message",this.handleMessage),window.removeEventListener("beforeunload",this._beforeUnload)),this._publicKey&&(this._publicKey=null,this.emit("disconnect")),this._responsePromises.forEach(([,o],e)=>{this._responsePromises.delete(e),o(new Error("Wallet disconnected"))})}sendRequest(o,e){return f(this,void 0,void 0,function*(){if(o!=="connect"&&!this.connected)throw new Error("Wallet not connected");const n=this._nextRequestId;return++this._nextRequestId,new Promise((r,t)=>{var a,u,l,i;this._responsePromises.set(n,[r,t]),this._injectedProvider?this._injectedProvider.postMessage({jsonrpc:"2.0",id:n,method:o,params:Object.assign({network:this._network},e)}):((a=this._popup)===null||a===void 0||a.postMessage({jsonrpc:"2.0",id:n,method:o,params:e},(l=(u=this._providerUrl)===null||u===void 0?void 0:u.origin)!==null&&l!==void 0?l:""),this.autoApprove||(i=this._popup)===null||i===void 0||i.focus())})})}get publicKey(){return this._publicKey}get connected(){return this._publicKey!==null}get autoApprove(){return this._autoApprove}connect(){return f(this,void 0,void 0,function*(){this._popup&&this._popup.close(),yield this.handleConnect()})}disconnect(){return f(this,void 0,void 0,function*(){this._injectedProvider&&(yield this.sendRequest("disconnect",{})),this._popup&&this._popup.close(),this.handleDisconnect()})}sign(o,e){return f(this,void 0,void 0,function*(){if(!(o instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");const n=yield this.sendRequest("sign",{data:o,display:e}),r=_.decode(n.signature),t=new g(n.publicKey);return{signature:r,publicKey:t}})}signTransaction(o){return f(this,void 0,void 0,function*(){const e=yield this.sendRequest("signTransaction",{message:_.encode(o.serializeMessage())}),n=_.decode(e.signature),r=new g(e.publicKey);return o.addSignature(r,n),o})}signAllTransactions(o){return f(this,void 0,void 0,function*(){const e=yield this.sendRequest("signAllTransactions",{messages:o.map(t=>_.encode(t.serializeMessage()))}),n=e.signatures.map(t=>_.decode(t)),r=new g(e.publicKey);return o=o.map((t,a)=>(t.addSignature(r,n[a]),t)),o})}diffieHellman(o){return f(this,void 0,void 0,function*(){if(!(o instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");return yield this.sendRequest("diffieHellman",{publicKey:o})})}}function E(s){return typeof s=="string"}function O(s){return k(s)&&"postMessage"in s&&typeof s.postMessage=="function"}function k(s){return typeof s=="object"&&s!==null}var P=function(){var s=function(o,e){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(n[t]=r[t])},s(o,e)};return function(o,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");s(o,e);function n(){this.constructor=o}o.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}}(),v=function(s,o,e,n){function r(t){return t instanceof e?t:new e(function(a){a(t)})}return new(e||(e=Promise))(function(t,a){function u(c){try{i(n.next(c))}catch(d){a(d)}}function l(c){try{i(n.throw(c))}catch(d){a(d)}}function i(c){c.done?t(c.value):r(c.value).then(u,l)}i((n=n.apply(s,o||[])).next())})},w=function(s,o){var e={label:0,sent:function(){if(t[0]&1)throw t[1];return t[1]},trys:[],ops:[]},n,r,t,a;return a={next:u(0),throw:u(1),return:u(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function u(i){return function(c){return l([i,c])}}function l(i){if(n)throw new TypeError("Generator is already executing.");for(;e;)try{if(n=1,r&&(t=i[0]&2?r.return:i[0]?r.throw||((t=r.return)&&t.call(r),0):r.next)&&!(t=t.call(r,i[1])).done)return t;switch(r=0,t&&(i=[i[0]&2,t.value]),i[0]){case 0:case 1:t=i;break;case 4:return e.label++,{value:i[1],done:!1};case 5:e.label++,r=i[1],i=[0];continue;case 7:i=e.ops.pop(),e.trys.pop();continue;default:if(t=e.trys,!(t=t.length>0&&t[t.length-1])&&(i[0]===6||i[0]===2)){e=0;continue}if(i[0]===3&&(!t||i[1]>t[0]&&i[1]<t[3])){e.label=i[1];break}if(i[0]===6&&e.label<t[1]){e.label=t[1],t=i;break}if(t&&e.label<t[2]){e.label=t[2],e.ops.push(i);break}t[2]&&e.ops.pop(),e.trys.pop();continue}i=o.call(s,e)}catch(c){i=[6,c],r=0}finally{n=t=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},K=function(s){P(o,s);function o(e,n){var r=s.call(this)||this;return r._instance=null,r._handleConnect=function(){r.emit("connect")},r._handleDisconnect=function(){window.clearInterval(r._pollTimer),r.emit("disconnect")},r._provider=e,r._network=n,r}return Object.defineProperty(o.prototype,"publicKey",{get:function(){return this._instance.publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"connected",{get:function(){return this._instance.connected||!1},enumerable:!1,configurable:!0}),o.prototype.connect=function(){return v(this,void 0,void 0,function(){var e=this;return w(this,function(n){switch(n.label){case 0:return this._instance=new j(this._provider,this._network),this._instance.on("connect",this._handleConnect),this._instance.on("disconnect",this._handleDisconnect),this._pollTimer=window.setInterval(function(){var r,t;((t=(r=e._instance)===null||r===void 0?void 0:r._popup)===null||t===void 0?void 0:t.closed)!==!1&&e._handleDisconnect()},200),[4,this._instance.connect()];case 1:return n.sent(),[2]}})})},o.prototype.disconnect=function(){return v(this,void 0,void 0,function(){return w(this,function(e){switch(e.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return this._instance.removeAllListeners("connect"),this._instance.removeAllListeners("disconnect"),[4,this._instance.disconnect()];case 1:return e.sent(),[2]}})})},o.prototype.signTransaction=function(e){return v(this,void 0,void 0,function(){return w(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.signTransaction(e)];case 1:return[2,n.sent()]}})})},o.prototype.signAllTransactions=function(e){return v(this,void 0,void 0,function(){return w(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.signAllTransactions(e)];case 1:return[2,n.sent()]}})})},o.prototype.signMessage=function(e,n){return n===void 0&&(n="hex"),v(this,void 0,void 0,function(){var r;return w(this,function(t){switch(t.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.sign(e,n)];case 1:return r=t.sent().signature,[2,Uint8Array.from(r)]}})})},o}(x),T=function(){var s=function(o,e){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(n[t]=r[t])},s(o,e)};return function(o,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");s(o,e);function n(){this.constructor=o}o.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}}(),y=function(s,o,e,n){function r(t){return t instanceof e?t:new e(function(a){a(t)})}return new(e||(e=Promise))(function(t,a){function u(c){try{i(n.next(c))}catch(d){a(d)}}function l(c){try{i(n.throw(c))}catch(d){a(d)}}function i(c){c.done?t(c.value):r(c.value).then(u,l)}i((n=n.apply(s,o||[])).next())})},b=function(s,o){var e={label:0,sent:function(){if(t[0]&1)throw t[1];return t[1]},trys:[],ops:[]},n,r,t,a;return a={next:u(0),throw:u(1),return:u(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function u(i){return function(c){return l([i,c])}}function l(i){if(n)throw new TypeError("Generator is already executing.");for(;e;)try{if(n=1,r&&(t=i[0]&2?r.return:i[0]?r.throw||((t=r.return)&&t.call(r),0):r.next)&&!(t=t.call(r,i[1])).done)return t;switch(r=0,t&&(i=[i[0]&2,t.value]),i[0]){case 0:case 1:t=i;break;case 4:return e.label++,{value:i[1],done:!1};case 5:e.label++,r=i[1],i=[0];continue;case 7:i=e.ops.pop(),e.trys.pop();continue;default:if(t=e.trys,!(t=t.length>0&&t[t.length-1])&&(i[0]===6||i[0]===2)){e=0;continue}if(i[0]===3&&(!t||i[1]>t[0]&&i[1]<t[3])){e.label=i[1];break}if(i[0]===6&&e.label<t[1]){e.label=t[1],t=i;break}if(t&&e.label<t[2]){e.label=t[2],e.ops.push(i);break}t[2]&&e.ops.pop(),e.trys.pop();continue}i=o.call(s,e)}catch(c){i=[6,c],r=0}finally{n=t=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},S=function(s){T(o,s);function o(e,n){var r=s.call(this)||this;return r._provider=e,r._network=n,r}return Object.defineProperty(o.prototype,"publicKey",{get:function(){return this._provider.publicKey},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"connected",{get:function(){return this._provider.isConnected},enumerable:!1,configurable:!0}),o.prototype.connect=function(){return y(this,void 0,void 0,function(){var e;return b(this,function(n){switch(n.label){case 0:if(n.trys.push([0,2,,3]),this.connected)throw new Error("Wallet already connected");return[4,this._provider.connect()];case 1:return n.sent(),this.emit("connect"),[3,3];case 2:throw e=n.sent(),this.emit("disconnect"),e;case 3:return[2]}})})},o.prototype.disconnect=function(){return y(this,void 0,void 0,function(){return b(this,function(e){switch(e.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._provider.disconnect()];case 1:return e.sent(),this.emit("disconnect"),[2]}})})},o.prototype.signTransaction=function(e){return y(this,void 0,void 0,function(){return b(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._provider.signTransaction(e,this._network)];case 1:return[2,n.sent()]}})})},o.prototype.signAllTransactions=function(e){return y(this,void 0,void 0,function(){return b(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._provider.signAllTransactions(e,this._network)];case 1:return[2,n.sent()]}})})},o.prototype.signMessage=function(e){return y(this,void 0,void 0,function(){var n;return b(this,function(r){switch(r.label){case 0:if(!this.connected)throw new Error("Wallet not connected");if(!(e instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");return[4,this._provider.signMessage(e)];case 1:return n=r.sent().signature,[2,n]}})})},o}(x),I=function(){var s=function(o,e){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(n[t]=r[t])},s(o,e)};return function(o,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");s(o,e);function n(){this.constructor=o}o.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}}(),h=function(s,o,e,n){function r(t){return t instanceof e?t:new e(function(a){a(t)})}return new(e||(e=Promise))(function(t,a){function u(c){try{i(n.next(c))}catch(d){a(d)}}function l(c){try{i(n.throw(c))}catch(d){a(d)}}function i(c){c.done?t(c.value):r(c.value).then(u,l)}i((n=n.apply(s,o||[])).next())})},p=function(s,o){var e={label:0,sent:function(){if(t[0]&1)throw t[1];return t[1]},trys:[],ops:[]},n,r,t,a;return a={next:u(0),throw:u(1),return:u(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function u(i){return function(c){return l([i,c])}}function l(i){if(n)throw new TypeError("Generator is already executing.");for(;e;)try{if(n=1,r&&(t=i[0]&2?r.return:i[0]?r.throw||((t=r.return)&&t.call(r),0):r.next)&&!(t=t.call(r,i[1])).done)return t;switch(r=0,t&&(i=[i[0]&2,t.value]),i[0]){case 0:case 1:t=i;break;case 4:return e.label++,{value:i[1],done:!1};case 5:e.label++,r=i[1],i=[0];continue;case 7:i=e.ops.pop(),e.trys.pop();continue;default:if(t=e.trys,!(t=t.length>0&&t[t.length-1])&&(i[0]===6||i[0]===2)){e=0;continue}if(i[0]===3&&(!t||i[1]>t[0]&&i[1]<t[3])){e.label=i[1];break}if(i[0]===6&&e.label<t[1]){e.label=t[1],t=i;break}if(t&&e.label<t[2]){e.label=t[2],e.ops.push(i);break}t[2]&&e.ops.pop(),e.trys.pop();continue}i=o.call(s,e)}catch(c){i=[6,c],r=0}finally{n=t=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},U=function(s){I(o,s);function o(e){var n=s.call(this)||this;return n._network="mainnet-beta",n._adapterInstance=null,n._connectHandler=null,n._connected=function(){n._connectHandler&&(n._connectHandler.resolve(),n._connectHandler=null),n.emit("connect",n.publicKey)},n._disconnected=function(){n._connectHandler&&(n._connectHandler.reject(),n._connectHandler=null),n._adapterInstance=null,n.emit("disconnect")},e!=null&&e.network&&(n._network=e==null?void 0:e.network),e!=null&&e.provider?n._provider=e==null?void 0:e.provider:window.salmon?n._provider=window.salmon:n._provider="https://app.salmonwallet.io",n}return Object.defineProperty(o.prototype,"publicKey",{get:function(){var e;return((e=this._adapterInstance)===null||e===void 0?void 0:e.publicKey)||null},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"isConnected",{get:function(){var e;return!!(!((e=this._adapterInstance)===null||e===void 0)&&e.connected)},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"connected",{get:function(){return this.isConnected},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"autoApprove",{get:function(){return!1},enumerable:!1,configurable:!0}),o.prototype.connect=function(){return h(this,void 0,void 0,function(){var e=this;return p(this,function(n){switch(n.label){case 0:return this.connected?[2]:(typeof this._provider=="string"?this._adapterInstance=new K(this._provider,this._network):this._adapterInstance=new S(this._provider,this._network),this._adapterInstance.on("connect",this._connected),this._adapterInstance.on("disconnect",this._disconnected),this._adapterInstance.connect(),[4,new Promise(function(r,t){e._connectHandler={resolve:r,reject:t}})]);case 1:return n.sent(),[2]}})})},o.prototype.disconnect=function(){return h(this,void 0,void 0,function(){return p(this,function(e){switch(e.label){case 0:return this._adapterInstance?[4,this._adapterInstance.disconnect()]:[2];case 1:return e.sent(),[2]}})})},o.prototype.signTransaction=function(e){return h(this,void 0,void 0,function(){return p(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signTransaction(e)];case 1:return[2,n.sent()]}})})},o.prototype.signAllTransactions=function(e){return h(this,void 0,void 0,function(){return p(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signAllTransactions(e)];case 1:return[2,n.sent()]}})})},o.prototype.signMessage=function(e,n){return n===void 0&&(n="utf8"),h(this,void 0,void 0,function(){return p(this,function(r){switch(r.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signMessage(e,n)];case 1:return[2,r.sent()]}})})},o.prototype.sign=function(e,n){return n===void 0&&(n="utf8"),h(this,void 0,void 0,function(){return p(this,function(r){switch(r.label){case 0:return[4,this.signMessage(e,n)];case 1:return[2,r.sent()]}})})},o}(m);export{U as default};
