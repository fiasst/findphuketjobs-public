var SALARY=function($,a,e,r){return $((function(){var a,e,r,t;a='input[name="job_salary_amount"]',e='select[name="job-salary-type"]',r=function(a){return $(e,a).val().toLowerCase()},t=function(a){return $.inArray(r(a),["per hour","per day","per month","per year"])>-1},calculateSalary=function(e){var n=$(e).parents("form"),o=$(a,n),u=t(n),c=o.val(),i="";if(u&&c)switch(c<1&&(alert("Salary amount must be a positive number"),o.val("").focus()),r(n)){case"per year":i=c/12;break;case"per month":i=c;break;case"per day":i=20*c;break;case"per hour":i=160*c}$('input[name="job_salary_monthly"]',n).val(i)},$(e).on("change",(function(){var e=$(this).parents("form"),r=t(e),n=$(a,e);$(".wrapper-salary-amount",e).toggle(r).find(".suffix").text($(this).find("option:selected").text()),n.attr("required",(function(a,e){return r})),r||n.val(""),calculateSalary(this)})),$(a).on("focusout",(function(){calculateSalary(this)}))})),{}}(jQuery,0,this.document);