var SALARY=function($,r,e,a){return $((function(){var r,e,a,n,t;r='[name="job_salary"]',a=function(r){var a=$(e,r).val();return!!a&&a.toLowerCase()},n=function(r){return $.inArray(a(r),["per hour","per day","per month","per year"])>-1},t=function(e){var t=$(e).parents("form"),o=$(r,t),i=n(t),s=HELP.removeNonNumeric(o.val()),u="";if(i&&s)switch(a(t)){case"per year":u=s/12;break;case"per month":u=s;break;case"per day":u=20*s;break;case"per hour":u=160*s}$('[name="job_salary_monthly"]',t).val(u)},$(e='[name="job_salary_type"]').on("change",(function(){var e=$(this).parents("form"),a=n(e),o=$(r,e);$(".wrapper-salary-amount",e).toggle(a).find(".suffix").text($(this).find("option:selected").text()),o.attr("required",a),a||(o.val(""),$('[name="job_salary_max"]',e).val("")),t(this)})),$(r).on("focusout",(function(){t(this)})),$(e).each((function(){$(this).trigger("change")}))})),{}}(jQuery,0,this.document);