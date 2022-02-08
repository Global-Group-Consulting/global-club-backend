import {registerAs} from "@nestjs/config";

export default registerAs("http", () => ({
  mainServerUrl: process.env.MAIN_SERVER_URL,
  filesServerUrl: process.env.FILES_SERVER_URL,
  deletePath: "/files",
}))
