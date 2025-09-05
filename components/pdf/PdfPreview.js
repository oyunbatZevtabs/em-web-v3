import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    fontFamily: "Roboto",
    padding: "15mm",
    paddingLeft: "25mm",
  },
  text: {
    fontFamily: "Roboto",
    textAlign: "justify",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Create Document Component
const PdfPreview = ({ gereeniiZagvar, getFile }) => (
  <PDFViewer className="h-full w-full">
    <Document onRender={getFile}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.text}>
              {gereeniiZagvar?.baruunTolgoi
                ?.replace(/(<([^>]+)>)/gi, "")
                .replace(new RegExp(`&nbsp;`, "g"), " ")}
            </Text>
          </View>
          <View>
            <Text style={styles.text}>
              {gereeniiZagvar?.baruunTolgoi
                ?.replace(/(<([^>]+)>)/gi, "")
                .replace(new RegExp(`&nbsp;`, "g"), " ")}
            </Text>
          </View>
        </View>
        {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
          return (
            <View key={`alkhamiinGereeniiZagvar${index}`}>
              <Text style={styles.text}>
                {mur?.zaalt
                  ?.replace(/(<([^>]+)>)/gi, "")
                  .replace(new RegExp(`&nbsp;`, "g"), " ")}
              </Text>
            </View>
          );
        })}
      </Page>
    </Document>
  </PDFViewer>
);

export default PdfPreview;
