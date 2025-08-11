from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
import os

def is_text_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            f.read()
        return True
    except:
        return False

def generate_code_pdf(directory_path, output_path):
    styles = getSampleStyleSheet()
    code_style = ParagraphStyle(
        'Code',
        fontName='Courier',
        fontSize=8,
        leading=10,
    )

    doc = SimpleDocTemplate(
        output_path,
        pagesize=LETTER,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch
    )
    elements = []

    exclude_dirs = {'venv', '.git', '__pycache__'}
    exclude_exts = {'.jpg', '.jpeg', '.png', '.pdf', '.pyc', '.DS_Store'}

    for root, dirs, files in os.walk(directory_path):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in sorted(files):
            ext = os.path.splitext(file)[1].lower()
            if ext in exclude_exts:
                continue

            file_path = os.path.join(root, file)
            if not is_text_file(file_path):
                print(f"Skipping binary file: {file_path}")
                continue

            rel_path = os.path.relpath(file_path, directory_path)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    elements.append(Paragraph(f"<b>{rel_path}</b>", styles['Heading3']))
                    elements.append(Preformatted(content, code_style))
                    elements.append(PageBreak())
            except Exception as e:
                print(f"Skipping {file_path}: {e}")

    doc.build(elements)
    print(f"✅ PDF generated: {output_path}")

# Run this in your script
generate_code_pdf(".", "output.pdf")
