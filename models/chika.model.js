import mongoose from "mongoose";

const chikaSchema = mongoose.Schema({
  username: String,
  displayname: String,
  tagname: String,
  userImg: String,
  isVerified: Boolean,
  chika: String,
});

export default mongoose.model("Chika", chikaSchema);
