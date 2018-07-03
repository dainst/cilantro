import os
import logging

import pdftotext
import PyPDF2


def convert_pdf_to_txt(source_file, output_dir):
    logging.getLogger(__name__).debug(f"Creating txt files from {source_file} "
                                      f"to {output_dir}")
    with open(source_file, "rb") as input_stream:
        pdf = pdftotext.PDF(input_stream)
        index = 0
        # Needed as pdftotext is not a Python list with .index() capability.
        for page in pdf:
            output = open(os.path.join(output_dir, f'{index}.txt'), 'wb')
            output.write(page.encode('utf-8'))
            output.close()
            index = index + 1


def pdf_merge(file_paths, output_path):
    """
    Create a single pdf from multiple ones merged together

    :param generator file_paths: list of paths to the pdf files to be
        merged in order
    :param str output_path: path for the generated pdf file
    """
    if not file_paths:
        raise Exception('No files given to merge.')
    input_streams = []
    pdf_new = PyPDF2.PdfFileWriter()
    try:
        for file in file_paths:

            input_stream = open(file, "rb")
            input_streams.append(input_stream)
            pdf = PyPDF2.PdfFileReader(input_stream)

            for index in range(pdf.getNumPages()):
                pdf_new.addPage(pdf.getPage(index))
        with open(output_path, "wb") as output_stream:
            pdf_new.write(output_stream)
    finally:
        for input_stream in input_streams:
            input_stream.close()


def cut_pdf(parts, source, target):
    """
    Make cuts out of multiple pdf files

    :param list parts: List of Dictionaries with keys 'file' and
        'range'. Lists the different Files that need to be cut.
    :param string source: The working directory where we find the
        different files to be cut
    :param string target: The directory where the created files go
    """
    pdf_new = PyPDF2.PdfFileWriter()
    for nr, part in enumerate(parts):
        input_str = f"{source}/{part['file']}"
        input_stream = open(input_str, "rb")

        pdf = PyPDF2.PdfFileReader(input_stream)
        if pdf.flattenedPages is None:
            pdf.getNumPages()  # make the file page based
        start_end = part['range']
        for index in range(start_end[0] - 1, start_end[1]):
            pdf_new.addPage(pdf.getPage(index))

        output_str = _set_output(part, nr)

        file_name = os.path.join(target, output_str)
        with open(file_name, "wb") as output_stream:
            pdf_new.write(output_stream)


def _set_output(part, nr):
    name = f"{part['file']}.{nr}.pdf"
    output = name.replace('/', '-').replace(' ', '-')

    return output
