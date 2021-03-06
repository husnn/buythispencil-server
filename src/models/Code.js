import * as dynamoose from "dynamoose";
import shortid from "shortid";
import emailValidator from "email-validator";

const codeSchema = new dynamoose.Schema({
    "id": {
        "hashKey": true,
        "type": String,
        "required": true,
        "validate": (val) => shortid.isValid(val)
    },
    "emailAddress": {
        "type": String,
        "required": true,
        "validate": (val) => emailValidator.validate(val)
    },
    "useCount": {
        "type": Number,
        "default": 0
    },
    "maxUses": {
        "type": Number,
        "default": 1
    }
}, {
    "timestamps": true
});

const Code = dynamoose.model("codes", codeSchema);

export default Code;