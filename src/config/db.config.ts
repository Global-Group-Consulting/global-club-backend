import {registerAs} from "@nestjs/config";

export default registerAs("database", () => ({
  uri: process.env.DB_CONNECTION_STRING
}))
