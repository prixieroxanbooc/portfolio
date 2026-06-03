/* =====================================================================
   NovaBank — shared jsPDF brand helper (fictional demo bank)
   Used by the portfolio demos to produce branded PDF documents.
   NOTE: jsPDF standard fonts are Latin-1 only — never print the ₱ glyph
   (it garbles). Use NovaBrand.php() which prefixes "PHP".
   ===================================================================== */
window.NovaBrand = (function () {
  const C = {
    blue:     [0, 71, 171],    // Trust Blue  #0047AB
    navy:     [10, 31, 68],    // Deep Navy   #0A1F44
    teal:     [0, 184, 169],   // Teal        #00B8A9
    sky:      [77, 168, 255],  // Sky Blue    #4DA8FF
    lightGray:[245, 247, 250], // #F5F7FA
    medGray:  [214, 220, 229], // #D6DCE5
    darkGray: [74, 85, 104],   // #4A5568
    white:    [255, 255, 255],
    zebra:    [250, 251, 253],
    subtle:   [180, 200, 230],
  };

  function php(n) {
    return 'PHP ' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // geometric "N" mark inside a rounded square
  function logoMark(doc, x, y, s, fill, letter) {
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.roundedRect(x, y, s, s, s * 0.22, s * 0.22, 'F');
    doc.setTextColor(letter[0], letter[1], letter[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(s * 0.62);
    doc.text('N', x + s / 2, y + s * 0.72, { align: 'center' });
  }

  // navy header band with wordmark + document title; returns starting y
  function header(doc, opts) {
    opts = opts || {};
    const W = doc.internal.pageSize.getWidth();
    const h = 80;
    doc.setFillColor(C.navy[0], C.navy[1], C.navy[2]);
    doc.rect(0, 0, W, h, 'F');
    doc.setFillColor(C.teal[0], C.teal[1], C.teal[2]);
    doc.rect(0, h, W, 3, 'F'); // accent stripe
    logoMark(doc, 40, 21, 38, C.white, C.navy);
    doc.setTextColor(C.white[0], C.white[1], C.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('NovaBank', 90, 41);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(C.subtle[0], C.subtle[1], C.subtle[2]);
    doc.text('Banking Built Around You', 90, 56);
    if (opts.title) {
      doc.setTextColor(C.white[0], C.white[1], C.white[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(opts.title, W - 40, 46, { align: 'right' });
    }
    return h + 30;
  }

  function footer(doc, note) {
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    doc.setDrawColor(C.medGray[0], C.medGray[1], C.medGray[2]);
    doc.line(40, H - 54, W - 40, H - 54);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(C.darkGray[0], C.darkGray[1], C.darkGray[2]);
    doc.text('NovaBank  ·  Banking Built Around You', 40, H - 38);
    doc.text(note || 'Fictional demo brand — sample data only. Not a real financial document.', 40, H - 26);
  }

  return { C, php, logoMark, header, footer };
})();
