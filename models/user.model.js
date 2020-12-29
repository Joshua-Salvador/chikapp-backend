import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  displayname: String,
  username: String,
  tagname: String,
  password: String,
  chikaId: String,
  isVerified: { type: Boolean, default: false },
  userImg: String,
  isAuthenticated: Boolean,
});

export default mongoose.model("User", userSchema);
