import mongoose from "mongoose";

const chikaSchema = mongoose.Schema({
  username: String,
  tagname: String,
  userImg: String,
  isVerified: Boolean,
  chika: String,
});

export default mongoose.model("Chika", chikaSchema);
