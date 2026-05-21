import type { MetadataRoute } from "next";
import { baseUrl } from "@/shared/lib/config/site";
import { getPosts, getCategories } from "@/features/payload/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/auth/login", "/unauthorized", "/blog"];
  const staticSitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.8,
  }));

  // Add blog posts
  const postsData = await getPosts({ limit: 1000 });
  const postsSitemap =
    postsData.docs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  // Add blog categories
  const categories = await getCategories();
  const categoriesSitemap =
    categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })) || [];

  return [...staticSitemap, ...postsSitemap, ...categoriesSitemap];
}
