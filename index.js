const sslCertificate = require("get-ssl-certificate");
const request = require("request");
const moment = require("moment");
const token = "";

const lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("websites.txt")
});

lineReader.on("line", function(line) {
  checkSSL(line);
});

const checkSSL = function(site) {
  sslCertificate
    .get(site)
    .then(function(certificate) {
      console.log("check ssl ", site);
      console.log(certificate.issuer.CN);
      console.log(certificate.valid_to);
      const validDate = moment(
        certificate.valid_to,
        "MMM DD HH:mm:ss YYYY [GMT]"
      );
      console.log(validDate.format("MMM DD HH:mm:ss YYYY [GMT]"));
      const currentDate = moment();
      const diffDate = validDate.diff(currentDate, "days");
      console.log(diffDate);
      if (diffDate <= 10) {
        sendLine(
          "ssl:" +
            site +
            " cn:" +
            certificate.issuer.CN +
            " expire @ " +
            certificate.valid_to +
            "   " +
            diffDate +
            " days"
        );
      }
    })
    .catch(function(e) {
      console.log("check ssl  Error :", site);
      console.log(e);
    });
};

const sendLine = function(message) {
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
        console.log(body);
      }
    }
  );
};
