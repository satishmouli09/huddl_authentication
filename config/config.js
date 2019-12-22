const mongoose = require('mongoose');

const dbURI = "mongodb+srv://huddl:Jkm2s1Aq8RgXAeO8@mongodb-jafz3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log('connected to mongodb');
});
