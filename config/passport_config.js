const localStrategy = require("passport-local").Strategy;
const User = require("../model/userModel");

const configure_localStrategy = (passport) => {
  const authenticateUser = async (email, password, done) => {
    if (email === "" || password === "")
      return done(null, false, { message: "Empty fields!" });
    const user = await User.findOne({ email });
    if (user === undefined || user == null) {
      console.log("1");
      return done(null, false, { message: "User with this email not exist!" });
    }
    try {
      if (user.password === password) {
        console.log("12");
        return done(null, user);
      }
      console.log("123");
      return done(null, false, { message: "Incorrect password!" });
    } catch (error) {
      console.log("12324");
      return done(e);
    }
  };

  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => { // stores the id in the session for deserialization
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

module.exports = configure_localStrategy;
