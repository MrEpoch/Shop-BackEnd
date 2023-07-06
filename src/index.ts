import app from "./server";
import * as dotenv from "dotenv";
dotenv.config();

app.listen(4527, () => {
  console.log(`Server is running on port 4527`);
});
