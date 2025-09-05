import Html from "react-pdf-html";
import React from "react";
import {
  Page,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import ReactDOMServer from "react-dom/server";

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
});

// Create Document Component
const PdfPreview = ({ gereeniiZagvar, getFile }) => {
  const html = React.useMemo(() => {
    let data = ReactDOMServer.renderToStaticMarkup(
      <div className="w-full space-y-2 p-5">
        <div className="flex flex-row justify-between">
          <div
            dangerouslySetInnerHTML={{
              __html: gereeniiZagvar?.zuunTolgoi,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: gereeniiZagvar?.baruunTolgoi,
            }}
          />
        </div>
        {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
          return (
            <div
              key={`alkhamiinGereeniiZagvar${index}`}
              className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100"
            >
              <div
                className="sun-editor-editable w-full"
                dangerouslySetInnerHTML={{ __html: mur.zaalt }}
              />
            </div>
          );
        })}
      </div>
    );
    return data;
  }, [gereeniiZagvar]);
  return (
    <PDFViewer className="h-full w-full">
      <Document onRender={getFile}>
        <Page size="A4" style={styles.page}>
          <Html>{html}</Html>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PdfPreview;
