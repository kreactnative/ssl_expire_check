const sslCertificate = require("get-ssl-certificate");

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
  });
};
