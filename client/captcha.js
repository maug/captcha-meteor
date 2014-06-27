window.VisualCaptcha = {};

Template.captcha.selectedWord = function() {
  return Session.get("selectedWord");
};

Template.captcha.images = function() {
  return Session.get("captchaImages");
}

Template.captcha.created = function(){
	var SERVER = window.location.origin;
  var urls = {
    start: SERVER + "/captcha/start/5"
  }
  var imageName = "";
  $.get(urls.start, function(res) {
    var jsonResp = JSON.parse(res);
    var images = [];
    Session.set("selectedWord", jsonResp.imageName);
    jsonResp.values.forEach(function(val, idx) {
      images.push({idx: idx, val: val});
    })
    Session.set("captchaImages", images);
  });
}
Template.captcha.rendered = function(){
  var captchaEl = $( '#sample-captcha' ).visualCaptcha({
          imgPath: '/packages/captcha/images/img/',
          captcha: {
              url: window.location.origin,
              numberOfImages: 5
          }
      } );
      VisualCaptcha.captcha = captchaEl.data( 'captcha' );


      var queryString = window.location.search;
      // Show success/error messages

}

VisualCaptcha.validateCaptcha = function (success, failure) {
  var data = VisualCaptcha.captcha.getCaptchaData();
  Meteor.call("validateCaptcha",data, function(err,result){
    if(!err){
      if (result === 'noCaptcha') {
          failure('Server error (VisualCaptcha was not started)');
      } else if ( result === 'validImage'){
          success()
      } else if ( result ==='failedImage'){
          failure('You\'ve selected WRONG image, please try again');
      } else if ( result === 'validAudio'){
          success();
      } else if ( result === 'failedAudio'){
          failure('Accessibility answer was NOT valid!');
      } else if ( result === 'failedPost'){
          failure('Please select an image');
      }
    }

  });
}
