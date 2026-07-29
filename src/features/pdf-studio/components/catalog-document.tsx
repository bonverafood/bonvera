"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { CatalogDocumentProps } from "../types";

const olive = "#3d5a3c";
const oliveDark = "#2a3f29";
const cream = "#f7f4ef";
const ink = "#1c1a17";
const muted = "#6b6560";
const rule = "#ddd6cb";

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    backgroundColor: cream,
    padding: 48,
    justifyContent: "space-between",
  },
  coverTop: {
    alignItems: "flex-start",
  },
  logo: {
    width: 140,
    height: 48,
    objectFit: "contain",
    marginBottom: 36,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "SourceSans3",
    fontWeight: 700,
    color: oliveDark,
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  coverSubtitle: {
    fontSize: 12,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
    maxWidth: 320,
    lineHeight: 1.5,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: rule,
    paddingTop: 16,
  },
  coverMeta: {
    fontSize: 10,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
  },
  brandBar: {
    height: 6,
    backgroundColor: olive,
    marginBottom: 28,
  },
  productPage: {
    backgroundColor: "#ffffff",
    padding: 40,
    paddingBottom: 56,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: rule,
  },
  headerLogo: {
    width: 88,
    height: 30,
    objectFit: "contain",
  },
  headerMark: {
    fontSize: 9,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
    letterSpacing: 1.2,
  },
  productBody: {
    flexDirection: "row",
    gap: 24,
    flexGrow: 1,
  },
  imageWrap: {
    width: 220,
    height: 260,
    backgroundColor: cream,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: cream,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: muted,
    fontFamily: "SourceSans3",
    fontWeight: 400,
  },
  copy: {
    flex: 1,
    paddingTop: 8,
  },
  productName: {
    fontSize: 20,
    fontFamily: "SourceSans3",
    fontWeight: 700,
    color: oliveDark,
    marginBottom: 10,
    lineHeight: 1.25,
  },
  productSummary: {
    fontSize: 11,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: ink,
    lineHeight: 1.55,
    marginBottom: 14,
  },
  productBodyText: {
    fontSize: 9.5,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
    lineHeight: 1.55,
  },
  pageFooter: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: rule,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
  },
});

function formatDate(locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function CatalogDocument({
  products,
  locale,
  logoUrl,
  title,
  subtitle,
  generatedLabel,
  pageLabel,
  productCountLabel,
}: CatalogDocumentProps) {
  const date = formatDate(locale);

  return (
    <Document
      title={title}
      author="Bonvera"
      subject={subtitle}
      creator="Bonvera Studio"
    >
      <Page size="A4" style={styles.cover}>
        <View style={styles.coverTop}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
          <Image src={logoUrl} style={styles.logo} />
          <Text style={styles.coverTitle}>{title}</Text>
          <Text style={styles.coverSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.coverFooter}>
          <Text style={styles.coverMeta}>
            {generatedLabel}: {date}
          </Text>
          <Text style={[styles.coverMeta, { marginTop: 4 }]}>
            Bonvera · {productCountLabel}
          </Text>
        </View>
      </Page>

      {products.map((product, index) => (
        <Page key={product.id} size="A4" style={styles.productPage}>
          <View style={styles.brandBar} />
          <View style={styles.productHeader}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
            <Image src={logoUrl} style={styles.headerLogo} />
            <Text style={styles.headerMark}>Bonvera</Text>
          </View>

          <View style={styles.productBody}>
            <View style={styles.imageWrap}>
              {product.imageUrl ? (
                // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image
                <Image src={product.imageUrl} style={styles.productImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Bonvera</Text>
                </View>
              )}
            </View>
            <View style={styles.copy}>
              <Text style={styles.productName}>{product.name}</Text>
              {product.summary ? (
                <Text style={styles.productSummary}>{product.summary}</Text>
              ) : null}
              {product.body ? (
                <Text style={styles.productBodyText}>
                  {product.body.slice(0, 900)}
                  {product.body.length > 900 ? "…" : ""}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.pageFooter} fixed>
            <Text style={styles.footerText}>bonvera.fr</Text>
            <Text style={styles.footerText}>
              {pageLabel} {index + 1} / {products.length}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
