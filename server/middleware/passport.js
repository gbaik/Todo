'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'default';
const models = require('../../db/models');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

let config;
if (!process.env.GOOGLE_CLIENT_ID) { // if the process vars dont exist, use default.json
  config = require('../../config/passport')['passport'];
} else { // otherwise, grab it from config vars
  config = { 
    'Google': {
      'clientID': process.env.GOOGLE_CLIENT_ID,
      'clientSecret': process.env.GOOGLE_CLIENT_SECRET,
      'callbackURL': process.env.GOOGLE_CALLBACK_URL
    }
  };
}

passport.serializeUser((profile, done) => {
  done(null, profile.id);
});

passport.deserializeUser((id, done) => {
  return models.Profile.where({ id }).fetch()
    .then(profile => {
      if (!profile) {
        throw profile;
      }
      done(null, profile.serialize());
    })
    .error(error => {
      done(error, null);
    })
    .catch(() => {
      done(null, null, { message: 'No user found' });
    });
});

passport.use('google', new GoogleStrategy({
  clientID: config.Google.clientID,
  clientSecret: config.Google.clientSecret,
  callbackURL: config.Google.callbackURL
},
(accessToken, refreshToken, profile, done) => {
  return getOrCreateOAuthProfile(profile, done);
})
);


const getOrCreateOAuthProfile = (oauthProfile, done) => {
  return models.Auth.findOne({ oauth_id: oauthProfile.id })
    .then(oauthAccount => {    
      if (oauthAccount) {
        throw oauthAccount;
      }

      if (!oauthProfile.emails || !oauthProfile.emails.length){
        throw null;
      }

      return models.Profile.findOne({ email: oauthProfile.emails[0].value });
    })
    .then(profile => {
      let profileInfo = {
        first: oauthProfile.name.givenName,
        last: oauthProfile.name.familyName,
        email: oauthProfile.emails[0].value
      };

      if (profile) {
        //update profile with info from oauth
        return models.Profile.findOneAndUpdate({ email: oauthProfile.emails[0].value }, { $set: { first: oauthProfile.name.givenName, last: oauthProfile.name.familyName, email: oauthProfile.emails[0].value } }, { new: true });
      }
      // otherwise create new profile
      return models.Profile.create({first: oauthProfile.name.givenName, last: oauthProfile.name.familyName, email: oauthProfile.emails[0].value});
    })
    // .then(profile => {
    //   return models.Auth.create({
    //     profile_id: profile.get('id'),
    //     oauth_id: oauthProfile.id
    //   })
    // })
    // .error(err => {
    //   done(err, null);
    // })
    // .catch(oauthAccount => {
    //   if (!oauthAccount) {
    //     throw oauthAccount;
    //   }
    //   console.log('oauthAccount', oauthAccount);
    //   return oauthAccount.related('profile');
    // })
    // .then(profile => {
    //   if (profile) {
    //     done(null, profile.serialize());
    //   }
    // })
    .catch(() => {
      // TODO: This is not working because redirect to login uses req.flash('loginMessage')
      // and there is no access to req here
      done(null, null, {
        'message': 'Signing up requires an email address, \
          please be sure there is an email address associated with your Facebook account \
          and grant access when you register.' });
    });
};

module.exports = passport;