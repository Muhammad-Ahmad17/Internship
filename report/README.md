# Internship Report - LaTeX Edition

Professional LaTeX-based internship report for Backend Engineering Internship at Innovative Saudia (July-August 2025).

## Project Structure

```
report/
├── main.tex                 # Main document file
├── preamble.tex             # LaTeX packages and configuration
├── sections/                # Individual report sections
│   ├── 01_executive_summary.tex
│   ├── 02_introduction.tex
│   ├── 03_organization.tex
│   ├── 04_role_description.tex
│   ├── 05_sdg_analysis.tex
│   └── 06_conclusions.tex
├── appendix/                # Appendices
│   └── code_samples.tex
├── images/                  # Place images here
├── README.md                # This file
└── Makefile                 # Compilation automation
```

## Prerequisites

### Required Software

- **LaTeX Distribution**: Install one of the following:
  - **Ubuntu/Debian**: `sudo apt-get install texlive-full`
  - **macOS**: Install [MacTeX](https://tug.org/mactex/)
  - **Windows**: Install [MiKTeX](https://miktex.org/) or TeX Live

- **Build Tools**: Make (usually pre-installed on Linux/macOS)

### Optional but Recommended

- **LaTeX IDE**: TeXShop, Overleaf, TeXmaker, or VS Code with LaTeX extension
- **PDF Viewer**: For quick preview (Okular, Preview.app, Sumatra PDF)

## Compilation

### Quick Compile (Recommended)

```bash
cd report
make          # Generates PDF
make clean    # Removes temporary files
make view     # Opens PDF in default viewer
```

### Manual Compilation

```bash
cd report
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex    # Run twice for TOC
```

### Using Latexmk (Automatic)

```bash
cd report
latexmk -pdf -pvc main.tex    # Continuous preview mode
```

## Customization

### Update Personal Information

Edit `main.tex` (title page section):

```latex
\begin{tabular}{l l}
    \textbf{Student Name:} & Your Name \\
    \textbf{Student Reg No.:} & Your Registration Number \\
\end{tabular}
```

### Add Images

1. Place images in the `images/` folder
2. Insert in any section using:

```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=0.8\textwidth]{images/your-image.png}
    \caption{Image Caption}
    \label{fig:label}
\end{figure}
```

### Modify Colors and Fonts

Edit `preamble.tex`:

```latex
\definecolor{primaryColor}{RGB}{0, 102, 204}
\definecolor{accentColor}{RGB}{255, 102, 0}
```

## Report Sections

| Section | Content |
|---------|---------|
| **Executive Summary** | Overview and key achievements |
| **Introduction** | Objectives, methodology, scope |
| **Organization Overview** | Company background and structure |
| **Internship Role Description** | Tasks, learning, challenges |
| **UN SDGs Mapping** | Alignment with sustainable development goals |
| **Conclusions & Recommendations** | Learnings and future directions |
| **Appendix** | Code samples and technical documentation |

## Features

✅ Professional academic formatting  
✅ Automatic table of contents generation  
✅ Cross-referencing support  
✅ Code syntax highlighting  
✅ Table and figure management  
✅ Bibliography support (if needed)  
✅ Proper margins and spacing per academic standards  

## Troubleshooting

### PDF doesn't generate
- Ensure all files are in correct locations
- Check for missing `\end{document}`
- Run `make clean` and recompile

### Missing sections in TOC
- Run `pdflatex` twice to update table of contents
- Use `make` which handles this automatically

### Code highlighting not working
- Ensure `listings` package is installed
- Check that language is specified: `[language=JavaScript]`

### Special characters not displaying
- Verify UTF-8 encoding in all .tex files
- Check `\usepackage[utf-8]{inputenc}` in preamble

## Generating Different Formats

### Create Word Document (requires pandoc)

```bash
cd report
pandoc main.pdf -o report.docx
```

### Print Optimized Version

```bash
cd report
pdflatex -interaction=nonstopmode -jobname=main-print main.tex
```

## Best Practices

1. **Regular Builds**: Compile frequently while editing to catch errors early
2. **Backup**: Keep version control of .tex files
3. **Modular Editing**: Edit individual section files, not main.tex for content
4. **Bibliography**: Use BibTeX for reference management if adding citations
5. **Consistency**: Use consistent notation and terminology throughout

## Editing Workflow

1. Edit relevant `.tex` file in `sections/` or `appendix/`
2. Save file
3. Run `make` to compile
4. Review output PDF
5. Iterate until satisfied

## Tips for Enhancement

- Add professional header/footer with institution logo
- Include project screenshots and diagrams
- Create a bibliography for references
- Add index of terms
- Include QR codes linking to project repositories
- Add hyperlinks to GitHub repositories

## Additional Resources

- [Overleaf LaTeX Documentation](https://www.overleaf.com/learn)
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)
- [CTAN Package Repository](https://ctan.org/)
- [TeXStack Exchange](https://tex.stackexchange.com/)

## Support

For LaTeX-specific issues, refer to resources above. For report content modifications, edit the relevant `.tex` file directly.

---

**Report Generated**: February 10, 2026  
**Internship Duration**: July 2025 - August 2025  
**Organization**: Innovative Saudia  
**Author**: Muhammad Ahmad
