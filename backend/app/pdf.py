"""PDF extraction module"""
import os
from typing import Optional
import fitz  # PyMuPDF
from app.models import PDFExtractionResult


class PDFExtractor:
    """Handles PDF text extraction with optional OCR fallback"""

    @staticmethod
    def extract_text(file_path: str) -> PDFExtractionResult:
        """
        Extract text from PDF file.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            PDFExtractionResult with extracted text or error
        """
        if not os.path.exists(file_path):
            return PDFExtractionResult(
                success=False,
                error="File not found",
                text="",
                pages=0,
            )

        try:
            # Try PyMuPDF extraction
            doc = fitz.open(file_path)
            text_pages = []

            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                text_pages.append(text)

            doc.close()

            full_text = "\n\n".join(text_pages)

            # If text is mostly empty, log it but still return
            if not full_text.strip():
                return PDFExtractionResult(
                    success=True,
                    text=full_text,
                    pages=len(doc),
                    source="pdf",
                    error="PDF extracted but appears empty",
                )

            return PDFExtractionResult(
                success=True,
                text=full_text,
                pages=len(doc),
                source="pdf",
            )

        except Exception as e:
            # Log error but attempt graceful handling
            return PDFExtractionResult(
                success=False,
                text="",
                pages=0,
                source="pdf",
                error=f"Extraction failed: {str(e)}",
            )

    @staticmethod
    def validate_pdf(file_path: str) -> bool:
        """Validate if file is a readable PDF"""
        if not file_path.lower().endswith(".pdf"):
            return False

        if not os.path.exists(file_path):
            return False

        try:
            doc = fitz.open(file_path)
            pages = len(doc)
            doc.close()
            return pages > 0
        except Exception:
            return False
