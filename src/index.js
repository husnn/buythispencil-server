import morgan from "morgan";
import * as dynamoose from "dynamoose";

import App from "./App";
import logger from "./utils/logger";
import { httpProtocol, host, port, aws }  from "../config";

dynamoose.aws.sdk.config.update({
    "accessKeyId": aws.accessKeyID,
    "secretAccessKey": aws.secretAccessKey,
    "region": aws.region
});

const app = new App()

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev", { stream: logger.stream }));
}

app.listen(port, () => {
    console.log(`App running at ${httpProtocol}://${host}:${port}`);
});