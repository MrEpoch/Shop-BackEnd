import app_auth from "./serverAuth";
import * as dotenv from "dotenv";
dotenv.config();

app_auth.listen(4528, () => {
  console.log(`Server is running on port 4528`);
});
