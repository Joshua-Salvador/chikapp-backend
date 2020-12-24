import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  displayname: String,
  username: String,
  tagname: String,
  password: String,
  chikaId: String,
  isVerified: Boolean,
  userImg: String,
  isAuthenticated: Boolean,
});

export default mongoose.model("User", userSchema);
