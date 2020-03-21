const sslCertificate = require("get-ssl-certificate");
const request = require("request");
const moment = require("moment");

const lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("websites.txt")
});

lineReader.on("line", function(line) {
  checkSSL(line);
});

const checkSSL = function(site) {
  sslCertificate.get(site).then(function(certificate) {
    //console.log(certificate.valid_to);
    const validDate = moment(certificate.valid_to, "MMM DD HH:mm:ss YYYY");
    //console.log(validDate.format("MMM DD HH:mm:ss YYYY"));
    const currentDate = moment();
    const diffDate = validDate.diff(currentDate, "days");
    //console.log(diffDate);
    if (diffDate <= 10) {
      sendLine("aaa", "ssl:"+ site+" expire:"+certificate.valid_to+"   "+diffDate+" days");
    }
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
    (err, _, body) => {
      if (err) {
        console.log(err);
      } else {
        //console.log(body);
      }
    }
  );
};
