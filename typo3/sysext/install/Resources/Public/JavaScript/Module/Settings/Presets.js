/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
define(["require","exports","jquery","../AbstractInteractableModule","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification","TYPO3/CMS/Core/Ajax/AjaxRequest","../../Router","bootstrap"],(function(e,t,s,a,o,n,r,c){"use strict";class l extends a.AbstractInteractableModule{constructor(){super(...arguments),this.selectorActivateTrigger=".t3js-presets-activate",this.selectorImageExecutable=".t3js-presets-image-executable",this.selectorImageExecutableTrigger=".t3js-presets-image-executable-trigger"}initialize(e){this.currentModal=e,this.getContent(),e.on("click",this.selectorImageExecutableTrigger,e=>{e.preventDefault(),this.getCustomImagePathContent()}),e.on("click",this.selectorActivateTrigger,e=>{e.preventDefault(),this.activate()}),e.find(".t3js-custom-preset").on("input",".t3js-custom-preset",e=>{s("#"+s(e.currentTarget).data("radio")).prop("checked",!0)})}getContent(){const e=this.getModalBody();new r(c.getUrl("presetsGetContent")).get({cache:"no-cache"}).then(async t=>{const s=await t.resolve();!0===s.success&&"undefined"!==s.html&&s.html.length>0?(e.empty().append(s.html),o.setButtons(s.buttons)):n.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},t=>{c.handleAjaxError(t,e)})}getCustomImagePathContent(){const e=this.getModalBody(),t=this.getModuleContent().data("presets-content-token");new r(c.getUrl()).post({install:{token:t,action:"presetsGetContent",values:{Image:{additionalSearchPath:this.findInModal(this.selectorImageExecutable).val()}}}}).then(async t=>{const s=await t.resolve();!0===s.success&&"undefined"!==s.html&&s.html.length>0?e.empty().append(s.html):n.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},t=>{c.handleAjaxError(t,e)})}activate(){this.setModalButtonsState(!1);const e=this.getModalBody(),t=this.getModuleContent().data("presets-activate-token"),a={};s(this.findInModal("form").serializeArray()).each((e,t)=>{a[t.name]=t.value}),a["install[action]"]="presetsActivate",a["install[token]"]=t,new r(c.getUrl()).post(a).then(async e=>{const t=await e.resolve();!0===t.success&&Array.isArray(t.status)?t.status.forEach(e=>{n.showMessage(e.title,e.message,e.severity)}):n.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},t=>{c.handleAjaxError(t,e)}).finally(()=>{this.setModalButtonsState(!0)})}}return new l}));