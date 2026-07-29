"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  CATALOG_PRODUCTS_PER_PAGE,
  type CatalogDocumentProps,
  type CatalogProduct,
} from "../types";

/** Palette aligned with Bonvera logo (navy + black + white). */
const navy = "#0c2340";
const navyDeep = "#071628";
const paper = "#f3f5f8";
const ink = "#0a0f18";
const muted = "#5a6573";
const rule = "#d0d5dd";

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    backgroundColor: paper,
    padding: 48,
    justifyContent: "space-between",
  },
  coverTop: {
    alignItems: "flex-start",
  },
  coverBrandBar: {
    height: 6,
    width: 72,
    backgroundColor: navy,
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 200,
    objectFit: "contain",
    marginBottom: 28,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "SourceSans3",
    fontWeight: 700,
    color: navyDeep,
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  coverSubtitle: {
    fontSize: 12,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
    maxWidth: 340,
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
  productPage: {
    backgroundColor: "#ffffff",
    paddingTop: 28,
    paddingHorizontal: 36,
    paddingBottom: 52,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: rule,
  },
  headerLogo: {
    width: 56,
    height: 56,
    objectFit: "contain",
  },
  headerMark: {
    fontSize: 9,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
    letterSpacing: 1.2,
  },
  rows: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    height: 118,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: rule,
  },
  rowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  imageWrap: {
    width: 100,
    height: 100,
    backgroundColor: paper,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: paper,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 8,
    color: muted,
    fontFamily: "SourceSans3",
    fontWeight: 400,
  },
  copy: {
    flex: 1,
    paddingRight: 4,
  },
  productName: {
    fontSize: 13,
    fontFamily: "SourceSans3",
    fontWeight: 700,
    color: navyDeep,
    marginBottom: 4,
    lineHeight: 1.25,
  },
  productSummary: {
    fontSize: 9.5,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: ink,
    lineHeight: 1.45,
  },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: rule,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
  },
  backPage: {
    flex: 1,
    backgroundColor: paper,
    padding: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  backLogo: {
    width: 180,
    height: 180,
    objectFit: "contain",
    marginBottom: 14,
  },
  backLocation: {
    fontSize: 11,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
    marginBottom: 22,
  },
  backRule: {
    width: 56,
    height: 3,
    backgroundColor: navy,
    marginBottom: 22,
  },
  backContact: {
    alignItems: "center",
    marginBottom: 22,
  },
  backLine: {
    fontSize: 11,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: ink,
    marginBottom: 6,
    textAlign: "center",
  },
  backWebsite: {
    fontSize: 12,
    fontFamily: "SourceSans3",
    fontWeight: 700,
    color: navyDeep,
    marginTop: 4,
    textAlign: "center",
  },
  qrWrap: {
    marginTop: 8,
    alignItems: "center",
  },
  qrImage: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  qrLabel: {
    fontSize: 9,
    fontFamily: "SourceSans3",
    fontWeight: 400,
    color: muted,
  },
  backTagline: {
    marginTop: 28,
    fontSize: 11,
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

function chunkProducts(
  products: CatalogProduct[],
  size: number,
): CatalogProduct[][] {
  const pages: CatalogProduct[][] = [];
  for (let i = 0; i < products.length; i += size) {
    pages.push(products.slice(i, i + size));
  }
  return pages;
}

function ProductRow({
  product,
  isLast,
}: {
  product: CatalogProduct;
  isLast: boolean;
}) {
  return (
    <View style={isLast ? [styles.row, styles.rowLast] : styles.row} wrap={false}>
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
      </View>
    </View>
  );
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
  siteLabel,
  back,
}: CatalogDocumentProps) {
  const date = formatDate(locale);
  const productPages = chunkProducts(products, CATALOG_PRODUCTS_PER_PAGE);
  const totalPages = 1 + productPages.length + 1;

  return (
    <Document
      title={title}
      author="Bonvera"
      subject={subtitle}
      creator="Bonvera Studio"
    >
      <Page size="A4" style={styles.cover}>
        <View style={styles.coverTop}>
          <View style={styles.coverBrandBar} />
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
          <Text style={[styles.coverMeta, { marginTop: 8 }]}>
            {pageLabel} 1 / {totalPages}
          </Text>
        </View>
      </Page>

      {productPages.map((pageProducts, pageIndex) => {
        const pageNumber = pageIndex + 2;
        return (
          <Page
            key={`products-${pageIndex}`}
            size="A4"
            style={styles.productPage}
          >
            <View style={styles.productHeader}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
              <Image src={logoUrl} style={styles.headerLogo} />
              <Text style={styles.headerMark}>Bonvera</Text>
            </View>

            <View style={styles.rows}>
              {pageProducts.map((product, rowIndex) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isLast={rowIndex === pageProducts.length - 1}
                />
              ))}
            </View>

            <View style={styles.pageFooter} fixed>
              <Text style={styles.footerText}>{siteLabel}</Text>
              <Text style={styles.footerText}>
                {pageLabel} {pageNumber} / {totalPages}
              </Text>
            </View>
          </Page>
        );
      })}

      <Page size="A4" style={styles.backPage}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
        <Image src={logoUrl} style={styles.backLogo} />
        <Text style={styles.backLocation}>{back.location}</Text>
        <View style={styles.backRule} />
        <View style={styles.backContact}>
          <Text style={styles.backLine}>{back.email}</Text>
          {back.phone ? <Text style={styles.backLine}>{back.phone}</Text> : null}
          <Text style={styles.backWebsite}>{back.website}</Text>
        </View>
        <View style={styles.qrWrap}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
          <Image src={back.qrUrl} style={styles.qrImage} />
          <Text style={styles.qrLabel}>{back.qrLabel}</Text>
        </View>
        <Text style={styles.backTagline}>{back.tagline}</Text>
        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>{siteLabel}</Text>
          <Text style={styles.footerText}>
            {pageLabel} {totalPages} / {totalPages}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
