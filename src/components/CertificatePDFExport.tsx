"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";

interface CertificatePDFExportProps {
  certificate: {
    certificateNumber: string;
    userName: string;
    eventName: string;
    venue?: string;
    issuedDate?: number;
    eventDate?: number;
  };
}

/**
 * CertificatePDFExport — Client-side PDF export for certificates.
 *
 * Uses jspdf + jspdf-autotable (both already installed in package.json).
 * Generates a printable PDF certificate and triggers browser download.
 */
export function CertificatePDFExport({ certificate }: CertificatePDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);

    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default;
      await import("jspdf-autotable");

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Colors
      const primary = [30, 58, 138]; // deep blue
      const accent = [59, 130, 246]; // light blue

      // Border
      doc.setDrawColor(...primary);
      doc.setLineWidth(3);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

      // Inner border
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.rect(25, 25, pageWidth - 50, pageHeight - 50);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(...primary);
      doc.text("CERTIFICATE OF PARTICIPATION", pageWidth / 2, 60, { align: "center" });

      // Divider line
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.line(80, 70, pageWidth - 80, 70);

      // Body text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);

      doc.text("This is to certify that", pageWidth / 2, 95, { align: "center" });

      // Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...primary);
      doc.text(certificate.userName, pageWidth / 2, 115, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text("has successfully participated in", pageWidth / 2, 135, { align: "center" });

      // Event name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(certificate.eventName, pageWidth / 2, 155, { align: "center" });

      // Details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(90, 90, 90);

      const eventDate = certificate.eventDate
        ? new Date(certificate.eventDate).toLocaleDateString("en-IN")
        : "—";
      const issuedDate = certificate.issuedDate
        ? new Date(certificate.issuedDate).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN");

      doc.text(`Date of Event: ${eventDate}`, pageWidth / 2, 180, { align: "center" });
      doc.text(`Venue: ${certificate.venue || "Not specified"}`, pageWidth / 2, 195, { align: "center" });

      // Certificate number
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...primary);
      doc.text(`Certificate Number: ${certificate.certificateNumber}`, pageWidth / 2, 225, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(`Issued on: ${issuedDate}`, pageWidth / 2, 240, { align: "center" });

      // Footer
      doc.setFontSize(9);
      doc.text("Eventure — One app. Every event. Zero hassle.", pageWidth / 2, pageHeight - 30, {
        align: "center",
      });

      // Download
      const fileName = `certificate-${certificate.certificateNumber}.pdf`;
      doc.save(fileName);

      toast.success("Certificate PDF downloaded");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <FileText className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  );
}
