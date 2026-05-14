"use client";

import { HeadManager } from "@/shared/components/common/head-manager";
import { useLanguage, getTranslations, useTranslations } from "@/features/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const Page = () => {
  const { locale } = useLanguage();
  const messages = getTranslations(locale);
  const { t } = useTranslations(messages);
  const isRtl = locale === "ar";

  return (
    <>
      <HeadManager
        title={`${t("about.title")} | ${t("common.appName")}`}
        description={t("about.description")}
      />

      <div className={`mx-auto max-w-7xl px-4 py-12 ${isRtl ? "text-right" : "text-left"}`}>
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="from-primary to-primary/60 mb-4 bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent">
            About
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Information about us
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We are dedicated to providing high-quality content and resources that help our community stay informed and grow. Our platform is built with the latest technologies to ensure the best user experience.
              </p>
              <p>
                Through our blog, we share insights, tutorials, and news that matter to our readers. We believe in transparency, quality, and continuous improvement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>In-depth articles and guides on various topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Frequently updated news and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Comprehensive FAQ section for quick answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Easy-to-navigate content organized by categories and tags</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Quality content that adds real value</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>User-friendly design and navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Regular updates and fresh perspectives</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Platform</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Built with Next.js for optimal performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Powered by Payload CMS for content management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Responsive design for all devices</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
