

function getCurrentLang(){
  return checkKeyExists(window, "Weglot") ? Weglot.getCurrentLang() : 'en';
}


// Memberstack plan names.
const planNames = {
  "pln_monthly-subscription-lqn04e7": "Monthly subscription",
  "pln_3-credits-jmv04pd": "3 Credits",
  "pln_6-credits-5cx04l8": "6 Credits",
  "pln_12-credits-72z04tc": "12 Credits"
};


// Format money.
function formatCurrency(amount){
  return parseFloat(amount, 10).toFixed(2).toString();
}


// Get $£€ etc symbols.
const getCurrencySymbol = (locale, currency) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();

// Return human-friendly date.
function formatTimestamp(timestamp){
  var date = new Date(timestamp),
      locale = getCurrentLang(),
      options = {
        //weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
  
  if (typeof timestamp == "string"){
    // Convert to a timestamp.
    timestamp = date.getTime();
  }
  if (timestamp.toString().length < 11){
    date.setTime(timestamp * 1000);
  }
  //return date.toDateString();
  return date.toLocaleDateString(locale, options);
}


function getEnvType(){
  return (location.hostname.indexOf('webflow') > -1) ? 'dev' : 'live';
}


function getISOdate(){
  var date = new Date(),
      now = date.setDate(date.getDate());
  return new Date(now).toISOString();
}


// Function to pluralize the time past (eg. "minute/minutes ago", "day/days ago").
const pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;
const timePast = (curr, prev) => {
  const msMin = 60 * 1000, msHr = msMin * 60, msDay = msHr * 24, msWeek = msDay * 7, msMonth = msDay * 30, msYr = msDay * 365;
  let elapsed = curr - prev;

  if (elapsed < msMin) {
    return pluralize(Math.round(elapsed/1000), 'second');
  }
  else if (elapsed < msHr) {
    elapsed = Math.round(elapsed/msMin);
    return pluralize(elapsed, 'minute') 
  }
  else if (elapsed < msDay) {
    elapsed = Math.round(elapsed/msHr);
    return pluralize(elapsed, 'hour')
  }
  else if (elapsed < msMonth) {
    elapsed = Math.round(elapsed/msDay);
    return pluralize(elapsed, 'day') 
  }
  else if (elapsed < msWeek) {
    elapsed = Math.round(elapsed/msWeek);
    return pluralize(elapsed, 'week') 
  }
  else if (elapsed < msYr) {
    elapsed = Math.round(elapsed/msMonth);
    return pluralize(elapsed, 'month') 
  }
  else {
    elapsed = Math.round(elapsed/msYr);
    return pluralize(elapsed, 'year') 
  }
}


// get form values as a key-value Object
function getFormValues(form) {
  var formData = new FormData(form[0]),
      values = Object.fromEntries(formData);
  
  // Re-build multi-select field values.
  $.each(values, function(key, value){
    var element = $(form).find(':input[name="'+key+'"]');
    if (element.is('select[multiple]')){
      values[key] = element.val();
    }
  });

  
  // Metadata:
  // Add Environment details.
  values.env = getEnvType();
  
  // Add subbmitted date/time value.
  values.submitted = getISOdate();
  
  return values;
}


function setCookie(name, value, days){
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name){
  var nameEQ = name + "=",
      ca = document.cookie.split(';');
  for (var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


function deleteCookie(name){
  document.cookie = name+'=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
}


function cleanLowerString(string){
 return $.trim(string.toLowerCase());
}


// Check whether Object key exists
function checkKeyExists(obj, key) {
  return obj && typeof obj === "object" && key in obj;
}


// Check if member has permissions.
function hasPermissions(permissions, member){
  return $.inArray(permissions, member.permissions) > -1;
}


// Show or remove content based on conditions.
function controlHTML(element, display){
  if (display){
    element.removeClass('hide');
  }
  else {
    element.remove();
  }
}


function itemState(state, status){
  switch (state){
    case 'edit':
      // Can the item be edited.
      if ($.inArray(status, ['Rejected', 'Deleted']) > -1) return false;
    case 'review':
      // Can the item be reviwed.
      if ($.inArray(status, ['Draft', 'Rejected', 'Archived', 'Deleted']) > -1) return false;
  }
  return true;
}


function buttonThinking(btn, revert){
  if (!revert){
    btn.attr('disabled', true).addClass('thinking');
    if (btn.get(0).nodeName == 'BUTTON'){
      btn.data('dataValue', btn.text()).text(btn.attr('data-wait'));
    } else {
      btn.data('dataValue', btn.attr('value')).attr('value', btn.attr('data-wait'));
    }
  }
  else {
    // Revert the button back to initial state.
    btn.removeAttr('disabled').removeClass('thinking clicked');
    if (btn.get(0).nodeName == 'BUTTON'){
      btn.text(btn.data('dataValue'));
    } else {
      btn.attr('value', btn.data('dataValue'));
    }
  }
}


function waitFor(key, value, timer, callback){
  var nTimer = setInterval(function(){
    // wait for something to load...
    if (checkKeyExists(key, value)){
      callback();
      clearInterval(nTimer);
    }
  }, timer);
}


function sendAJAX(obj){
  var params = $.extend({
    //url: "",
    method: "POST",
    //data: {},
    timeout: 60000,
    success: false,
    error: false
  }, obj);
  
  $.ajax({
    url: params.url,
    method: params.method,
    data: params.data,
    timeout: params.timeout,
    success: function(data, textStatus){
      console.log(textStatus, data);
      if ($.isFunction(params.success)) params.success(data);
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.log(textStatus, errorThrown);
      if ($.isFunction(params.error)) params.error(data);
    }
  });
}


function handleResponse(data, form){
  if (checkKeyExists(data, "mode")){
    if (data.mode == "alert"){
      alert(data.message);
    }
    if (data.mode == "banner"){
      alert(data.message);//temp
    }
  }
  if (checkKeyExists(data, "enableForm") && !!data.enableForm){
    buttonThinking(form.find('.form-submit'), true);
  }
}


// Alternative for displaying Metadata values via HTML data-attributes.
function replaceTextWithMetadata(metadata){
  $('[data-ms-member-meta]').each(function(){
    var data = $(this).attr('data-ms-member-meta');
    
    if (checkKeyExists(metadata, data)){
      $(this).html(metadata[data]);
    }
  });
}


// get Member's JSON then fire callback function.
function getMemberJSON(callback) {
  window.$memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
    if (!!callback) {
      var output = memberJSON || {};
      callback(output);
    }
  });
}


// update Member's JSON.
function updateMemberJSON(json, callback) {
  window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
    if (!!callback) {
      var output = memberJSON || {};
      callback(output);
    }
  });
}


// Stop body from being scrollable.
function bodyPreventScroll(scroll, bodyClass){
  $('body').toggleClass(bodyClass || 'no-scroll', scroll);
}


// Create jQuery Select2 widget.
  // Use this instead of .select2() when first initializing a widget.
$.fn.createSelect2 = function(options){
  var ops;
  $.each(this, function(i, element){
    ops = options;
    //console.log(ops);
    //if (ops.placeholder == null){
      ops.placeholder = $(element).attr('placeholder') || "Select...";
    //}
    if (ops.placeholder){
      // For the placeholder to appear, you must have a blank <option> as the first option in your Select.
      $(element).prepend('<option value=""></option>').val('');
    }
    
    // Store options in .data() incase we need to destroy and rebuild the select2 widget.
      // This happens when the language is changed.
    $(element).select2(ops).data('select2-options', ops);
  });
};


// Case-insensitive selector ":icontains()".
jQuery.expr[':'].icontains = function(el, i, m, array){
  return (el.textContent || el.innerText || "").toLowerCase().indexOf((m[3] || "").toLowerCase()) >= 0;
};
// Form element has value/is selected or is checked, selector ":selectedInput".
jQuery.expr[':'].selectedInput = function(el, i, m){
  return el.type == "checkbox" || el.type == "radio" ? el.checked : el.value != "";
};





