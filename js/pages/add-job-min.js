var ADD_JOB=function($,e,t,o){return $((function(){var t=HELP.getCookie("MSmember");function o(e){console.log("data",e);var t=e.companies||[];if(t.length<1)alert("You need to add your company before you can post a job.");else{var o=$("#job-company"),a=1===t.length;$(".form-job-step-2").addClass("active"),$.each(t,(function(e,t){o.append($("<option>",{value:t["trading-name"],text:t["trading-name"]+" ("+t["registered-name"]+")",selected:a}))}))}}t&&HELP.checkKeyExists(t,"companies")?o(JSON.parse(t)):HELP.waitFor(e,"MSmember",200,(function(){MAIN.thinking(!0,!1),$.ajax({url:"https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",method:"GET",data:{id:e.MSmember.id},timeout:6e4,success:function(e,t){MAIN.thinking(!1),HELP.setCookie("MSmember",JSON.stringify(e)),o(e)},error:function(e,t,o){console.log(t,o),MAIN.thinking(!1)}})})),$("#trigger-add-company").on("click",(function(t){t.preventDefault(),HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Add a new company",href:"#company-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xs:{offsetTop:20,offsetBottom:20,offsetLeft:20,offsetRight:20,maxWidth:900,width:"100%",opacity:.4}}})}))})),$("#job-salary-type").on("change",(function(){var e=$.inArray($(this).val().toLowerCase(),["per hour","per day","per day","per month","per year"])>-1;$("#wrapper-salary-amount").toggle(e).find(".suffix").text($(this).find("option:selected").text()),$("#wrapper-salary-amount").is(":visible")||$("#job-salary").val("")}))})),{}}(jQuery,this,this.document);