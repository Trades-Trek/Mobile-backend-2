import * as aws from "@aws-sdk/client-ses";
let { defaultProvider } = require("@aws-sdk/credential-provider-node");

export const useAwsServices = () => {
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: "us-east-1", // Your region will need to be updated
        credentials: {
            accessKeyId: process.env.AWS_SES_ACCESS_KEY ?? 'LtM61zW6himVLhGwrebHYBUR0Od6IMhp3pIe4Xf6',
            secretAccessKey: process.env.AWS_SES_SECRET_KEY ?? 'AKIAUN5PCHRBH6XW7RN6',
        },
    });
    return {ses}
}