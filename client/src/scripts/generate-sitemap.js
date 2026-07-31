import { SitemapStream, streamToPromise } from "sitemap";
import fs from "fs";
import { routes } from "../src/routes/routes.js";

const hostname = "https://www.dorneeatelier.com";

const sitemap = new SitemapStream({
  hostname,
});

routes.forEach((route) => {
  sitemap.write({
    url: route.path,
    changefreq: route.changefreq,
    priority: route.priority,
    lastmod: new Date(),
  });
});

sitemap.end();

streamToPromise(sitemap)
  .then((data) => {
    fs.writeFileSync("./public/sitemap.xml", data.toString());
    console.log("✅ sitemap.xml generated");
  })
  .catch(console.error);
