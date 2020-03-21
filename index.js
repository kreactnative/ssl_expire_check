const sslCertificate = require("get-ssl-certificate");
const request = require("request");

const lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("websites.txt")
});

lineReader.on("line", function(line) {
  console.log("Line from file:", line);
  checkSSL(line);
});

const checkSSL = function(site) {
  sslCertificate.get(site).then(function(certificate) {
    console.log(site);
    //console.log(certificate.valid_from);
    console.log(certificate.valid_to);
    sendLine("aaa", "test");
  });
};

const sendLine = function(token, message) {
  request(
    {
      method: "POST",
      uri: "https://notify-api.line.me/api/notify",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        bearer: token
      },
      form: {
        message: message
      }
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
      }
    }
  );
};
