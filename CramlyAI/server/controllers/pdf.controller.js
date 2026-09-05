import PDFDocument from "pdfkit"

export const pdfDownload = async (req, res) => {
  try {
    const { result } = req.body

    if (!result) {
      return res.status(400).json({ error: "No content provided" })
    }

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="ExamNotesAI.pdf"')

    doc.pipe(res)

    doc.fontSize(20).text("ExamNotes AI", { align: "center" })
    doc.moveDown()

    if (result.importance) {
      doc.fontSize(14).text(`Importance: ${result.importance}`)
      doc.moveDown()
    }

    doc.fontSize(16).text("Sub Topics")
    doc.moveDown(0.5)
    Object.entries(result.subTopics || {}).forEach(([star, topics]) => {
      doc.moveDown(0.5)
      doc.fontSize(13).text(`${star} Topics:`)

      if (Array.isArray(topics)) {
        topics.forEach((topic) => {
          doc.fontSize(12).text(`- ${topic}`)
        })
      }
    })

    doc.moveDown()
    doc.fontSize(16).text("Notes")
    doc.moveDown(0.5)
    doc.fontSize(12).text((result.notes || "").replace(/[#*]/g, ""))

    doc.moveDown()
    doc.fontSize(16).text("Revision Points")
    doc.moveDown(0.5)
    if (Array.isArray(result.revisionPoints)) {
      result.revisionPoints.forEach((point) => {
        doc.fontSize(12).text(`- ${point}`)
      })
    }

    doc.moveDown()
    doc.fontSize(16).text("Important Questions")
    doc.moveDown(0.5)

    doc.fontSize(13).text("Short Questions:")
    if (Array.isArray(result.questions?.short)) {
      result.questions.short.forEach((question) => {
        doc.fontSize(12).text(`- ${question}`)
      })
    }

    doc.moveDown(0.5)
    doc.fontSize(13).text("Long Questions:")
    if (Array.isArray(result.questions?.long)) {
      result.questions.long.forEach((question) => {
        doc.fontSize(12).text(`- ${question}`)
      })
    }

    if (result.questions?.diagram) {
      doc.moveDown(0.5)
      doc.fontSize(13).text("Diagram Question:")
      doc.fontSize(12).text(result.questions.diagram)
    }

    doc.end()
  } catch (error) {
    console.log("PDF download error", error)
    if (!res.headersSent) {
      return res.status(500).json({ message: "PDF download failed" })
    }
    res.end()
  }
}
