.PHONY: all clean view help build

# LaTeX compiler
LATEX = pdflatex
LATEX_FLAGS = -interaction=nonstopmode -file-line-error

# Target PDF
TARGET = main

help:
	@echo "Internship Report - LaTeX Compilation"
	@echo "====================================="
	@echo ""
	@echo "Available targets:"
	@echo "  make          - Compile to PDF (recommended)"
	@echo "  make build    - Same as 'make' (verbose)"
	@echo "  make view     - Compile and open PDF viewer"
	@echo "  make clean    - Remove temporary files"
	@echo "  make distclean- Remove all generated files including PDF"
	@echo "  make help     - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make           # Generate PDF"
	@echo "  make clean     # Clean build artifacts"
	@echo "  make view      # Open in PDF viewer"

all: build

build: $(TARGET).pdf
	@echo "✓ PDF generated: $(TARGET).pdf"

# Compile main PDF (run twice for TOC)
$(TARGET).pdf: preamble.tex main.tex sections/*.tex appendix/*.tex
	@echo "Compiling LaTeX document..."
	@$(LATEX) $(LATEX_FLAGS) $(TARGET).tex > /dev/null
	@echo "Second pass (updating references)..."
	@$(LATEX) $(LATEX_FLAGS) $(TARGET).tex > /dev/null
	@echo "✓ Compilation complete"

view: build
	@if command -v xdg-open > /dev/null; then \
		xdg-open $(TARGET).pdf; \
	elif command -v open > /dev/null; then \
		open $(TARGET).pdf; \
	else \
		echo "Please open $(TARGET).pdf manually"; \
	fi

clean:
	@echo "Cleaning temporary files..."
	@rm -f *.aux *.log *.out *.toc *.fls *.fdb_latexmk *.synctex.gz
	@rm -f sections/*.aux appendix/*.aux
	@echo "✓ Temporary files removed"

distclean: clean
	@echo "Removing all generated files..."
	@rm -f $(TARGET).pdf
	@echo "✓ All files cleaned"

check:
	@if command -v pdflatex > /dev/null; then \
		echo "✓ pdflatex found"; \
	else \
		echo "✗ pdflatex not found - install texlive"; \
	fi

# Silent build for CI/CD
ci-build:
	@$(LATEX) $(LATEX_FLAGS) $(TARGET).tex >/dev/null 2>&1
	@$(LATEX) $(LATEX_FLAGS) $(TARGET).tex >/dev/null 2>&1
	@if [ -f $(TARGET).pdf ]; then echo "Build successful"; exit 0; else echo "Build failed"; exit 1; fi
