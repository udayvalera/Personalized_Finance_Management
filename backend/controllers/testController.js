function getIp(req) {
  let ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  // Convert IPv6 loopback to IPv4
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }
  return ip;
}

const test = {
  async test(req, res) {
    // console.log(req);
    // console.log(`User IP: ${req.ip}`);
    const userIp = getIp(req);

    // Log the user's IP address
    console.log("User IP Address:", userIp);
    res.json({ message: "Hello World" });
  },
};

module.exports = test;
