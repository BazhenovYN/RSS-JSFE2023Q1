(()=>{"use strict";function t({tag:e,children:a,style:s,...n}){const i=document.createElement(e);return Object.entries(n).forEach((([t,e])=>{i[t]=e})),a&&Object.values(a).forEach((e=>{"string"==typeof e?i.appendChild(document.createTextNode(e)):e instanceof Node?i.appendChild(e):i.appendChild(t(e))})),s&&Object.assign(i.style,s),i}function e(e){let a="Oops... ";e instanceof Error?a+=e.message:a+="Unknown error occurred";const s=t({tag:"div",className:"snackbar",textContent:a});document.body.appendChild(s),setTimeout((()=>document.body.removeChild(s)),4e3)}const a="http://127.0.0.1:3000",s="/garage",n="/winners",i="#ffffff",r=t=>t.length?`?${t.map((t=>`${t.key}=${t.value}`)).join("&")}`:"",o=async(t,e=[])=>{const s=r(e),n=await fetch(`${a}${t}${s}`),i=await n.json(),o=n.headers.get("X-Total-Count");return{data:i,totalCount:o?Number(o):null}},c=async(t,e)=>(await fetch(`${a}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json(),h=async t=>(await fetch(`${a}${t}`,{method:"DELETE"})).json(),l=async(t,e)=>(await fetch(`${a}${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json(),d=(t,e)=>(async(t,e=[])=>{const s=r(e);return(await fetch(`${a}${t}${s}`,{method:"PATCH"})).json()})("/engine",[{key:"id",value:t},{key:"status",value:e}]);class g{constructor(t,e,a){this.id=t,this.name=e,this.color=a,this.status="stopped",this.raceTime=0,this.finishTime=0,this.totalTime=0}async startEngine(){this.raceTime=await(async t=>{const e=await d(t,"started");return Math.round(e.distance/e.velocity)})(this.id),this.finishTime=0,this.status="started"}async driveEngine(){return new Promise(((t,e)=>{(async t=>d(t,"drive"))(this.id).then((()=>{this.finishTime=Date.now(),t()})).catch((()=>{this.status="broken",e(new Error("Engine was broken down"))}))}))}async stopEngine(){await(async t=>0===(await d(t,"stopped")).velocity)(this.id)&&(this.status="stopped",this.raceTime=0)}async saveResult(t){this.totalTime=(this.finishTime-t)/1e3;const{wins:e,time:a}=await(async t=>{const{data:e}=await o(`${n}/${t}`);return e})(this.id);e?await(async(t,e)=>{const a=await l(`${n}/${t}`,e);return Object.entries(e).every((([t,e])=>e===a[t]))})(this.id,{wins:e+1,time:a&&a<this.totalTime?a:this.totalTime}):await(async t=>{const e=await c(n,t);return Object.entries(t).every((([t,a])=>a===e[t]))})({id:this.id,wins:1,time:this.totalTime})}}const u=async t=>c(s,t),m=["Ford","Audi","BMW","Toyota","Volkswagen","Mersedes","Honda","Nissan","Chevrolet","Subaru","UAZ","ZAZ","Lada","Tesla"],p=["Mustang","A4","A5","X3","X5","Camry","Golf","Polo","CLC","Civic","Rogue","Silverado","Outback","Patriot","Vesta","Priora","Granta","Model Y","Model X","Model S"];class C{constructor(){this.cars=[],this.totalCount=0,this.currentPage=1,this.elementsPerOnePage=7}generateCars(t){this.cars=[],t.forEach((t=>{const e=new g(t.id,t.name,t.color);this.cars.push(e)}))}async getCars(t=1,a=!1){if(!this.cars.length||a)try{const e=await(async t=>{const{data:e,totalCount:a}=await o(s,t);return{data:e,totalCount:a}})([{key:"_page",value:t},{key:"_limit",value:this.elementsPerOnePage}]);this.generateCars(e.data),this.totalCount=e.totalCount?e.totalCount:0,this.currentPage=t}catch(t){e(t)}}async getNextCars(){this.currentPage*this.elementsPerOnePage<this.totalCount&&await this.getCars(this.currentPage+1,!0)}async getPreviousCars(){this.currentPage>1&&await this.getCars(this.currentPage-1,!0)}async createCar(t){try{await u(t),await this.getCars(this.currentPage,!0)}catch(t){e(t)}}async deleteCar(t){try{await(async t=>(await h(`${s}/${t}`),!0))(t),await(async t=>(await h(`${n}/${t}`),!0))(t);const e=this.currentPage>1&&1===this.cars.length?this.currentPage-1:this.currentPage;await this.getCars(e,!0)}catch(t){e(t)}}async updateCar(t,a){try{await(async(t,e)=>{const a=await l(`${s}/${t}`,e);return Object.entries(e).every((([t,e])=>e===a[t]))})(t,a),await this.getCars(this.currentPage,!0)}catch(t){e(t)}}async generateRandomCars(){const t=[];for(let e=0;e<100;e+=1){const e={name:`${m[Math.floor(Math.random()*m.length)]} ${p[Math.floor(Math.random()*p.length)]}`,color:function(){const t=[];for(let e=0;e<6;e+=1)t.push("23456789abcdef"[Math.floor(14*Math.random())]);return`#${t.join("")}`}()};t.push(u(e))}try{await Promise.all(t),await this.getCars(this.currentPage,!0)}catch(t){e(t)}}}class b{constructor(t,e,a){this.id=t,this.wins=e,this.time=a,this.name="<unknown>",this.color=i}setCarProps(t){this.name=t.name,this.color=t.color}}class w{constructor(){this.winners=[],this.options=[],this.totalCount=0,this.currentPage=1,this.elementsPerOnePage=10}updateWinner(t){const e=this.winners.find((e=>e.id===t.id));e&&e.setCarProps(t)}async getCarProps(){const t=this.winners.map((t=>(async t=>{const{data:e}=await o(`${s}/${t}`);return e})(t.id)));(await Promise.allSettled(t)).forEach((t=>{"fulfilled"===t.status&&this.updateWinner(t.value)}))}generateWinners(t){this.winners=[],t.forEach((t=>{const e=new b(t.id,t.wins,t.time);this.winners.push(e)}))}async getWinners(t=null,a=[]){this.currentPage=t||this.currentPage,this.options=a.length?a:this.options;try{const t=await(async t=>{const{data:e,totalCount:a}=await o(n,t);return{data:e,totalCount:a}})([{key:"_page",value:this.currentPage},{key:"_limit",value:this.elementsPerOnePage},...this.options]);this.generateWinners(t.data),this.totalCount=t.totalCount?t.totalCount:0,await this.getCarProps()}catch(t){e(t)}}async getNextWinners(){this.currentPage*this.elementsPerOnePage<this.totalCount&&await this.getWinners(this.currentPage+1)}async getPreviousWinners(){this.currentPage>1&&await this.getWinners(this.currentPage-1)}}class P{getElement(){return this.element}}const v=class extends P{constructor(){super(),this.prevButton=t({tag:"button",textContent:"Prev",className:"btn pagination__prev"}),this.nextButton=t({tag:"button",textContent:"Next",className:"btn pagination__next"}),this.element=t({tag:"div",className:"pagination",children:[this.prevButton,this.nextButton]})}addHandlers(t,e){this.prevButton.addEventListener("click",t),this.nextButton.addEventListener("click",e)}update(t,e,a){1===e?this.prevButton.setAttribute("disabled",""):this.prevButton.removeAttribute("disabled"),a*e>=t?this.nextButton.setAttribute("disabled",""):this.nextButton.removeAttribute("disabled")}};class y extends P{constructor(){super(),this.isPageLoaded=!1,this.pagination=new v}updateTitle(t){this.title.textContent=`${this.pageName} (${t})`}updateContentPageNumber(t){this.contentPageNumber.textContent=`Page #${t}`}clearMainContent(){for(;this.mainContent.firstChild;)this.mainContent.firstChild.remove()}renderPage(t=!1){this.isPageLoaded&&!t||(this.clearMainContent(),this.updateTitle(this.state.totalCount),this.updateContentPageNumber(this.state.currentPage),this.renderMainContent(),this.pagination.update(this.state.totalCount,this.state.currentPage,this.state.elementsPerOnePage),this.isPageLoaded=!0)}addPaginationHandler(t,e){this.pagination.addHandlers(t,e)}}class N extends P{constructor({onSubmit:e,submitButtonAlias:a,isUpdater:s=!1}){super(),this.name=t({tag:"input",type:"text",name:"name",className:"car-editor__name"}),this.name.setAttribute("required",""),this.color=t({tag:"input",type:"color",value:i,name:"color",className:"car-editor__color"}),this.submit=t({tag:"input",type:"submit",value:a||"OK",className:"btn car-editor__submit"}),this.isUpdater=s,this.element=t({tag:"form",className:"car-editor",children:[this.name,this.color,this.submit]}),this.element.onsubmit=t=>{t.preventDefault();const a=new FormData(this.element),s=a.get("name"),n=a.get("color");"function"==typeof e&&e({name:s,color:n}),this.update({}),this.isUpdater&&this.disableAllElements()},this.isUpdater&&this.disableAllElements()}disableAllElements(){this.name.setAttribute("disabled",""),this.color.setAttribute("disabled",""),this.submit.setAttribute("disabled","")}enableAllElements(){this.name.removeAttribute("disabled"),this.color.removeAttribute("disabled"),this.submit.removeAttribute("disabled")}update({carName:t,carColor:e}){this.name.value=t||"",this.color.value=e||i,this.enableAllElements()}}const f=class extends P{constructor({onCreate:e,onUpdate:a,onGenerate:s,onRace:n,onReset:i}){super(),this.creator=new N({onSubmit:e,submitButtonAlias:"Create"}),this.updater=new N({onSubmit:a,submitButtonAlias:"Update",isUpdater:!0}),this.raceButton=t({tag:"button",className:"btn commands__race",textContent:"Race"}),this.resetButton=t({tag:"button",className:"btn commands__reset",textContent:"Reset"}),this.raceButton.addEventListener("click",(()=>{this.raceButton.setAttribute("disabled",""),n()})),this.resetButton.addEventListener("click",(()=>{this.raceButton.removeAttribute("disabled"),i()})),this.element=t({tag:"div",className:"control-panel",children:[this.creator.getElement(),this.updater.getElement(),{tag:"div",className:"commands",children:[this.raceButton,this.resetButton,{tag:"button",className:"btn commands__generate-cars",textContent:"Generate cars",onclick:s}]}]})}initUpdater({carName:t,carColor:e}){this.updater.update({carName:t,carColor:e})}resetPanel(){this.raceButton.removeAttribute("disabled")}},E=(t,a)=>new Promise(((s,n)=>{a.startEngine().then((()=>{((t,e)=>{const a=(t=>(t.parentElement?.clientWidth||0)-t.offsetWidth-t.offsetLeft)(t),s=e.raceTime/1e3*60,n=a/s;let i=0;const r=()=>{"started"===e.status&&(i=i+n<a?i+n:a,t.style.setProperty("transform",`translateX(${i}px)`),i<a&&requestAnimationFrame(r))};r()})(t,a),a.driveEngine().then((()=>{s(a)})).catch((()=>{t.classList.add("broken"),n()}))})).catch((t=>e(t)))})),_=async(t,a)=>{try{await a.stopEngine(),t.style.setProperty("transform","")}catch(t){e(t)}},x=class extends y{constructor(e){super(),this.state=e,this.selectedCarId=null,this.startingCars=[],this.stoppingCars=[],this.startButtons=[],this.stopButtons=[],this.pageName="Garage",this.element=t({tag:"div",className:"page page-garage"}),this.title=t({tag:"div",className:"page__title"}),this.contentPageNumber=t({tag:"div",className:"page__content-page-number"}),this.mainContent=t({tag:"div",className:"page-garage__content"}),this.controlPanel=this.createControlPanel(),this.message=t({tag:"div",className:"message"}),this.element.append(this.controlPanel.getElement(),this.title,this.contentPageNumber,this.mainContent,this.pagination.getElement(),this.message),this.configurePagination()}async startRaceHandler(){if(!this.startingCars.length)return;this.startButtons.forEach((t=>t.setAttribute("disabled",""))),this.stopButtons.forEach((t=>t.setAttribute("disabled","")));const t=Date.now(),e=this.startingCars.map((t=>t()));try{const a=await Promise.any(e);await a.saveResult(t),this.showWinner(a)}catch{this.showNoWinners()}}createControlPanel(){return new f({onCreate:async t=>{await this.state.createCar(t),this.renderPage(!0)},onUpdate:async t=>{this.selectedCarId&&(await this.state.updateCar(this.selectedCarId,t),this.selectedCarId=null,this.renderPage(!0))},onGenerate:async()=>{await this.state.generateRandomCars(),this.renderPage(!0)},onRace:this.startRaceHandler.bind(this),onReset:async()=>{this.stoppingCars.length&&(this.startButtons.forEach((t=>t.removeAttribute("disabled"))),this.stopButtons.forEach((t=>t.setAttribute("disabled",""))),this.message.classList.remove("show"),this.stoppingCars.forEach((t=>t())))}})}configurePagination(){this.addPaginationHandler((async()=>{await this.state.getPreviousCars(),this.renderPage(!0)}),(async()=>{await this.state.getNextCars(),this.renderPage(!0)}))}renderRacingTrack(e){const a=t({tag:"div",className:"car car-icon",style:{backgroundColor:e.color}}),s=t({tag:"button",className:"btn car-control__start"}),n=t({tag:"button",className:"btn car-control__stop"});return s.addEventListener("click",(()=>{s.setAttribute("disabled",""),n.removeAttribute("disabled"),E(a,e).catch((()=>{}))})),n.addEventListener("click",(()=>{s.removeAttribute("disabled"),n.setAttribute("disabled",""),_(a,e)})),n.setAttribute("disabled",""),this.startingCars.push((()=>E(a,e))),this.stoppingCars.push((()=>_(a,e))),this.startButtons.push(s),this.stopButtons.push(n),t({tag:"div",className:"racing-track",children:[{tag:"div",className:"car-control",children:[n,s]},a,{tag:"div",className:"flag"}]})}renderGarageBox(e){const a=t({tag:"div",className:"car-selector",children:[{tag:"button",className:"btn car-selector__select",textContent:"Select",onclick:()=>{this.selectedCarId=e.id,this.controlPanel.initUpdater({carName:e.name,carColor:e.color})}},{tag:"button",className:"btn car-selector__remove",textContent:"Remove",onclick:async()=>{await this.state.deleteCar(e.id),this.renderPage(!0)}},{tag:"div",className:"car-selector__model",textContent:e.name}]}),s=t({tag:"div",className:"garage-box",children:[a,this.renderRacingTrack(e)]});this.mainContent.append(s)}clearMainContent(){super.clearMainContent(),this.startingCars=[],this.startButtons=[],this.stoppingCars=[],this.stopButtons=[],this.controlPanel.resetPanel(),this.message.classList.remove("show")}renderMainContent(){this.state.cars.forEach((t=>this.renderGarageBox(t)))}showWinner(t){this.message.textContent=`${t.name} went first (${t.totalTime} s)`,this.message.classList.add("show")}showNoWinners(){this.message.textContent="Oops... I guess there are no winners",this.message.classList.add("show")}},A="wins",$="time",B=class extends y{constructor(e){super(),this.state=e,this.orderField="",this.orderDirection="",this.setDataOrder=async()=>{this.orderDirection="ASC"===this.orderDirection?"DESC":"ASC",await this.state.getWinners(null,[{key:"_sort",value:this.orderField},{key:"_order",value:this.orderDirection}]),this.renderPage(!0)},this.getTHead=()=>{const e=t({tag:"th",textContent:"Wins",className:"order-button"});e.addEventListener("click",(async()=>{this.orderField=A,await this.setDataOrder()}));const a=t({tag:"th",textContent:"Best time (sec)",className:"order-button"});return a.addEventListener("click",(async()=>{this.orderField=$,await this.setDataOrder()})),this.orderField===A?e.setAttribute("order",this.orderDirection.toLowerCase()):this.orderField===$&&a.setAttribute("order",this.orderDirection.toLowerCase()),t({tag:"thead",children:[{tag:"tr",children:[{tag:"th",textContent:"Number"},{tag:"th",textContent:"Car"},{tag:"th",textContent:"Name"},e,a]}]})},this.pageName="Winners",this.element=t({tag:"div",className:"page page-winners"}),this.title=t({tag:"div",className:"page__title"}),this.contentPageNumber=t({tag:"div",className:"page__content-page-number"}),this.mainContent=t({tag:"div",className:"page-winners__content"}),this.element.append(this.title,this.contentPageNumber,this.mainContent,this.pagination.getElement()),this.addPaginationHandler((async()=>{await this.state.getPreviousWinners(),this.renderPage(!0)}),(async()=>{await this.state.getNextWinners(),this.renderPage(!0)}))}renderTableOfWinners(){const e=this.getTHead(),a=t({tag:"tbody"});let s=(this.state.currentPage-1)*this.state.elementsPerOnePage;this.state.winners.forEach((e=>{const n=t({tag:"tr",children:[{tag:"td",textContent:`${s+=1}`},{tag:"td",children:[{tag:"div",className:"car car-icon",style:{backgroundColor:e.color}}]},{tag:"td",textContent:`${e.name}`},{tag:"td",textContent:`${e.wins}`},{tag:"td",textContent:`${e.time}`}]});a.append(n)}));const n=t({tag:"table",className:"winners-table",children:[e,a]});this.mainContent.append(n)}renderMainContent(){this.renderTableOfWinners()}};(new class{constructor(){this.garageStateManager=new C,this.winnersStateManager=new w,this.garagePage=new x(this.garageStateManager),this.winnersPage=new B(this.winnersStateManager);const e=t({tag:"button",className:"btn nav__item",textContent:"Garage"});e.setAttribute("active","");const a=t({tag:"button",className:"btn nav__item",textContent:"Winners"});e.addEventListener("click",(()=>{a.removeAttribute("active"),e.setAttribute("active",""),this.loadGaragePage()})),a.addEventListener("click",(()=>{e.removeAttribute("active"),a.setAttribute("active",""),this.loadWinnersPage()}));const s=t({tag:"nav",className:"nav",children:[e,a]});this.pages=t({tag:"div",className:"pages"});const n=t({tag:"div",className:"wrapper",children:[s,this.pages]});document.body.append(n)}clearPageContent(){for(;this.pages.firstChild;)this.pages.firstChild.remove()}mountPage(t){this.clearPageContent(),this.pages.append(t.getElement())}async loadGaragePage(){await this.garageStateManager.getCars(),this.mountPage(this.garagePage),this.garagePage.renderPage()}async loadWinnersPage(){await this.winnersStateManager.getWinners(),this.mountPage(this.winnersPage),this.winnersPage.renderPage(!0)}start(){this.loadGaragePage()}}).start()})();