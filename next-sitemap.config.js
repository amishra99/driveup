/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.driveup.in", // ✅ Your website URL
  generateRobotsTxt: true, // ✅ Automatically create robots.txt
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/404", "/500"],
};
